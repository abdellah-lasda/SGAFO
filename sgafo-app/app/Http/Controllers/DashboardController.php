<?php

namespace App\Http\Controllers;

use App\Models\EntiteFormation;
use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\Secteur;
use App\Models\SiteFormation;
use App\Models\User;
use App\Models\Region;
use App\Models\Institut;
use App\Models\Presence;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Global Filters
        $filters = [
            'annee' => $request->input('annee'),
            'region_id' => $request->input('region_id'),
            'ville' => $request->input('ville'),
            'secteur_id' => $request->input('secteur_id'),
        ];

        // RF Scope Restriction
        if (!$user->isAdmin() && $user->hasRole('RF')) {
            $assignedRegionIds = $user->regions()->pluck('regions.id')->toArray();
            if (!empty($assignedRegionIds)) {
                if (!$filters['region_id'] || !in_array($filters['region_id'], $assignedRegionIds)) {
                    $filters['scope_region_ids'] = $assignedRegionIds;
                }
            }
        }

        // CDC Scope Restriction
        if (!$user->isAdmin() && $user->hasRole('CDC')) {
            $assignedInstitutIds = $user->instituts()->pluck('instituts.id')->toArray();
            if (!empty($assignedInstitutIds)) {
                $filters['scope_institut_ids'] = $assignedInstitutIds;
            }
        }

        // Base Query for filtered plans
        $plansQuery = $this->getFilteredPlansQuery($filters);

        // Build Statistics Object
        $stats = [
            'formations_count' => EntiteFormation::when($filters['secteur_id'], fn($q) => $q->where('secteur_id', $filters['secteur_id']))->count(),
            'secteurs_count' => Secteur::count(),
            'sites_count' => SiteFormation::when(isset($filters['scope_region_ids']), fn($q) => $q->whereIn('region_id', $filters['scope_region_ids']))
                ->when($filters['region_id'], fn($q) => $q->where('region_id', $filters['region_id']))
                ->count(),
            'formateurs_count' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
                ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereHas('regions', fn($sq) => $sq->whereIn('regions.id', $filters['scope_region_ids'])))
                ->count(),
            'plans_pending_count' => (clone $plansQuery)->where('statut', 'soumis')->count(), 
            
            'plans' => $this->getPlansStats($plansQuery),
            'plans_per_sector' => $this->getPlansPerSector($plansQuery),
            'plans_per_region' => $this->getPlansPerRegion($plansQuery, $filters),
            'top_sites' => $this->getTopSites($plansQuery),
            'plans_evolution' => $this->getPlansEvolution($filters),
            'attendance_rate' => $this->calculateAttendanceRate($filters),

            'admin_alerts' => $user->isAdmin() ? $this->getAdminAlerts() : null,
            'rf_alerts' => $user->hasRole('RF') ? $this->getRfAlerts($filters) : null,
            'cdc_alerts' => $user->hasRole('CDC') ? $this->getCdcAlerts($user) : null,

            'users_by_role' => $user->isAdmin() ? $this->getUsersByRole($filters) : null,
            'instituts_per_region' => $this->getInstitutsPerRegion($filters),
            'content_counts' => $user->isAdmin() ? $this->getContentCounts() : null,
            'top_formateurs' => $this->getTopFormateurs($filters),
            'upcoming_seances' => $this->getUpcomingSeances($filters),
            'site_occupancy' => $this->getSiteOccupancy($filters),

            // QCM Stats
            'qcm_stats' => $this->getQcmStats($filters),

            // Personal RF Activity
            'my_latest_created' => $user->hasRole('RF') || $user->hasRole('CDC') 
                ? PlanFormation::where('cree_par', $user->id)->latest()->take(3)->with('entite')->get() 
                : null,
            'my_latest_validated' => $user->hasRole('RF') 
                ? PlanFormation::where('valide_par', $user->id)->latest()->take(3)->with('entite')->get() 
                : null,

            // Formateur Specific (Animator + Participant)
            'formateur_data' => $user->hasRole('FORMATEUR') ? [
                'upcoming_animated' => Seance::whereHas('seanceThemes', fn($q) => $q->where('formateur_id', $user->id))
                    ->where('date', '>=', now()->toDateString())
                    ->with(['plan.entite', 'site'])
                    ->orderBy('date')->orderBy('debut')->take(3)->get(),
                'upcoming_participated' => PlanFormation::whereHas('participants', fn($q) => $q->where('users.id', $user->id))
                    ->where('date_debut', '>=', now()->toDateString())
                    ->with('entite')
                    ->orderBy('date_debut')->take(3)->get(),
                'pedagogical_stats' => [
                    'sessions_count' => Seance::whereHas('seanceThemes', fn($q) => $q->where('formateur_id', $user->id))->count(),
                    'student_attendance' => $this->calculateStudentAttendanceForFormateur($user),
                    'my_average_score' => \App\Models\QcmTentative::where('user_id', $user->id)->avg('score') ?? 0,
                ]
            ] : null,
        ];

        $latestFormations = EntiteFormation::with(['secteur', 'createur'])
            ->when($filters['secteur_id'], fn($q) => $q->where('secteur_id', $filters['secteur_id']))
            ->latest()
            ->take(4) // Changed to 4 to match the UI grid better
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'latestFormations' => $latestFormations,
            'filters' => $filters,
            'filterOptions' => $this->getFilterOptions()
        ]);
    }

    private function getFilteredPlansQuery(array $filters)
    {
        $user = auth()->user();
        return PlanFormation::query()
            ->when($filters['annee'], fn($q) => $q->whereYear('date_debut', $filters['annee']))
            ->when($filters['secteur_id'], fn($q) => $q->whereHas('entite', fn($sq) => $sq->where('secteur_id', $filters['secteur_id'])))
            // Scope Restriction: CDC/RF should see plans they manage OR plans where their participants are involved
            ->when(isset($filters['scope_region_ids']) || isset($filters['scope_institut_ids']), function($q) use ($filters, $user) {
                $q->where(function($sq) use ($filters, $user) {
                    $sq->where('cree_par', $user->id)
                      ->orWhereHas('participants.instituts.region', function($ssq) use ($filters) {
                          if (isset($filters['scope_region_ids'])) $ssq->whereIn('regions.id', $filters['scope_region_ids']);
                      })
                      ->when(isset($filters['scope_institut_ids']), fn($ssq) => $ssq->orWhereHas('participants.instituts', fn($sssq) => $sssq->whereIn('instituts.id', $filters['scope_institut_ids'])));
                });
            })
            ->when($filters['region_id'], fn($q) => $q->whereHas('participants.instituts.region', fn($sq) => $sq->where('id', $filters['region_id'])))
            ->when($filters['ville'], fn($q) => $q->whereHas('participants.instituts', fn($sq) => $sq->where('ville', $filters['ville'])));
    }

    private function getPlansStats($query)
    {
        return [
            'total' => (clone $query)->count(),
            'by_status' => [
                'brouillon' => (clone $query)->where('statut', 'brouillon')->count(),
                'soumis' => (clone $query)->where('statut', 'soumis')->count(),
                'validé' => (clone $query)->where('statut', 'validé')->count(),
                'confirmé' => (clone $query)->where('statut', 'confirmé')->count(),
                'rejeté' => (clone $query)->where('statut', 'rejeté')->count(),
                'annulé' => (clone $query)->where('statut', 'annulé')->count(),
            ]
        ];
    }

    private function getPlansPerSector($query)
    {
        return Secteur::withCount(['entites as plans_count' => function($q) use ($query) {
                $q->whereHas('plans', function($sq) use ($query) {
                    $sq->whereIn('id', (clone $query)->select('id'));
                });
            }])
            ->orderByDesc('plans_count')
            ->get(['id', 'nom', 'plans_count']);
    }

    private function getPlansPerRegion($query, array $filters)
    {
        return Region::when(isset($filters['scope_region_ids']), fn($q) => $q->whereIn('id', $filters['scope_region_ids']))
            ->get()
            ->map(function($region) use ($query) {
                return [
                    'id' => $region->id,
                    'nom' => $region->nom,
                    'plans_count' => (clone $query)->whereHas('participants.instituts', function($q) use ($region) {
                        $q->where('region_id', $region->id);
                    })->count()
                ];
            })->sortByDesc('plans_count')->values();
    }

    private function getTopSites($query)
    {
        return SiteFormation::withCount(['plans' => function($q) use ($query) {
                $q->whereIn('id', (clone $query)->select('id'));
            }])
            ->orderByDesc('plans_count')
            ->take(5)
            ->get(['id', 'nom', 'plans_count']);
    }

    private function calculateAttendanceRate(array $filters)
    {
        $query = Presence::query()
            ->whereHas('seance', function($q) use ($filters) {
                $q->when($filters['annee'], fn($sq) => $sq->whereYear('date', $filters['annee']))
                  ->when(isset($filters['scope_region_ids']), fn($sq) => $sq->whereHas('plan.participants.instituts.region', fn($ssq) => $ssq->whereIn('id', $filters['scope_region_ids'])))
                  ->when(isset($filters['scope_institut_ids']), fn($sq) => $sq->whereHas('plan.participants.instituts', fn($ssq) => $ssq->whereIn('instituts.id', $filters['scope_institut_ids'])))
                  ->when($filters['region_id'], fn($sq) => $sq->whereHas('plan.participants.instituts.region', fn($ssq) => $ssq->where('id', $filters['region_id'])))
                  ->when($filters['ville'], fn($sq) => $sq->whereHas('plan.participants.instituts', fn($ssq) => $ssq->where('ville', $filters['ville'])))
                  ->when($filters['secteur_id'], fn($sq) => $sq->whereHas('plan.entite', fn($ssq) => $ssq->where('secteur_id', $filters['secteur_id'])));
            });

        $total = (clone $query)->count();
        if ($total === 0) return 0;

        $present = (clone $query)->whereIn('statut', ['présent', 'retard'])->count();
        return round(($present / $total) * 100, 1);
    }

    private function getAdminAlerts()
    {
        return [
            'users_sans_role' => User::doesntHave('roles')->count(),
            'users_suspendus' => User::where('statut', 'suspendu')->count(),
            'sites_inactifs' => SiteFormation::where('statut', 'inactif')->count(),
        ];
    }

    private function getRfAlerts(array $filters)
    {
        return [
            'pending_confirmation' => PlanFormation::where('statut', 'soumis')
                ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereHas('participants.instituts.region', fn($sq) => $sq->whereIn('id', $filters['scope_region_ids'])))
                ->count(),
            'pending_validation' => PlanFormation::where('statut', 'confirmé')
                ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereHas('participants.instituts.region', fn($sq) => $sq->whereIn('id', $filters['scope_region_ids'])))
                ->count(),
        ];
    }

    private function getCdcAlerts($user)
    {
        return [
            'my_drafts' => PlanFormation::where('cree_par', $user->id)->where('statut', 'brouillon')->count(),
            'my_rejected' => PlanFormation::where('cree_par', $user->id)->where('statut', 'rejeté')->count(),
        ];
    }

    private function getUsersByRole(array $filters)
    {
        $scopeCallback = function($q) use ($filters) {
            // Priority 1: Mandatory Scope (RF/CDC)
            $q->when(isset($filters['scope_region_ids']), fn($sq) => $sq->whereHas('regions', fn($ssq) => $ssq->whereIn('regions.id', $filters['scope_region_ids'])))
              ->when(isset($filters['scope_institut_ids']), fn($sq) => $sq->whereHas('instituts', fn($ssq) => $ssq->whereIn('instituts.id', $filters['scope_institut_ids'])));
            
            // Priority 2: Active Filters (Dropdowns)
            $q->when($filters['region_id'], fn($sq) => $sq->whereHas('regions', fn($ssq) => $ssq->where('regions.id', $filters['region_id'])))
              ->when($filters['ville'], fn($sq) => $sq->whereHas('instituts', fn($ssq) => $ssq->where('instituts.ville', $filters['ville'])))
              ->when($filters['secteur_id'], fn($sq) => $sq->whereHas('secteurs', fn($ssq) => $ssq->where('secteurs.id', $filters['secteur_id'])));
        };

        return [
            'Formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->where($scopeCallback)->count(),
            'RF' => User::whereHas('roles', fn($q) => $q->where('code', 'RF'))->where($scopeCallback)->count(),
            'CDC' => User::whereHas('roles', fn($q) => $q->where('code', 'CDC'))->where($scopeCallback)->count(),
            'Admin' => User::whereHas('roles', fn($q) => $q->where('code', 'ADMIN'))->where($scopeCallback)->count(),
        ];
    }

    private function getInstitutsPerRegion(array $filters)
    {
        return Region::withCount('instituts')
            ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereIn('id', $filters['scope_region_ids']))
            ->orderByDesc('instituts_count')
            ->get(['id', 'nom', 'instituts_count']);
    }

    private function getContentCounts()
    {
        return [
            'metiers' => \App\Models\Metier::count(),
            'secteurs' => Secteur::count(),
            'qcm' => \App\Models\Qcm::count(),
            'seances' => Seance::count(),
            'formations' => EntiteFormation::count(),
        ];
    }

    private function getTopFormateurs(array $filters)
    {
        return User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
            ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereHas('regions', fn($sq) => $sq->whereIn('regions.id', $filters['scope_region_ids'])))
            ->when(isset($filters['scope_institut_ids']), fn($q) => $q->whereHas('instituts', fn($sq) => $sq->whereIn('instituts.id', $filters['scope_institut_ids'])))
            ->withCount(['seances as sessions_count'])
            ->orderByDesc('sessions_count')
            ->take(5)
            ->get(['id', 'nom', 'prenom', 'sessions_count']);
    }

    private function getUpcomingSeances(array $filters)
    {
        return Seance::with(['plan.entite', 'site'])
            ->where('date', '>=', now()->toDateString())
            ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereHas('plan.participants.instituts.region', fn($sq) => $sq->whereIn('id', $filters['scope_region_ids'])))
            ->when(isset($filters['scope_institut_ids']), fn($q) => $q->whereHas('plan.participants.instituts', fn($sq) => $sq->whereIn('instituts.id', $filters['scope_institut_ids'])))
            ->orderBy('date')
            ->orderBy('debut')
            ->take(6)
            ->get();
    }

    private function getSiteOccupancy(array $filters)
    {
        $sites = SiteFormation::where('capacite', '>', 0)
            ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereIn('region_id', $filters['scope_region_ids']))
            ->when(isset($filters['scope_institut_ids']), fn($q) => $q->whereIn('region_id', Region::whereHas('instituts', fn($sq) => $sq->whereIn('id', $filters['scope_institut_ids']))->pluck('id')))
            ->take(10)
            ->get();
        $occupancy = [];
        foreach ($sites as $site) {
            $plansIds = PlanFormation::where('site_formation_id', $site->id)->pluck('id');
            $participantCount = DB::table('plan_participants')->whereIn('plan_id', $plansIds)->count();
            $rate = $site->capacite > 0 ? round(($participantCount / $site->capacite) * 100, 1) : 0;
            $occupancy[] = ['nom' => $site->nom, 'rate' => min($rate, 100)];
        }
        return collect($occupancy)->sortByDesc('rate')->take(5)->values();
    }

    private function getPlansEvolution(array $filters = [])
    {
        $evolution = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $evolution[] = [
                'label' => $month->translatedFormat('M Y'),
                'count' => PlanFormation::whereMonth('created_at', $month->month)
                    ->whereYear('created_at', $month->year)
                    ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereHas('participants.instituts.region', fn($sq) => $sq->whereIn('id', $filters['scope_region_ids'])))
                    ->when(isset($filters['scope_institut_ids']), fn($q) => $q->whereHas('participants.instituts', fn($sq) => $sq->whereIn('instituts.id', $filters['scope_institut_ids'])))
                    ->count()
            ];
        }
        return $evolution;
    }

    private function getQcmStats(array $filters)
    {
        $qcmQuery = \App\Models\Qcm::query()
            ->when(isset($filters['scope_region_ids']), fn($q) => $q->whereHas('seance.plan.participants.instituts.region', fn($sq) => $sq->whereIn('id', $filters['scope_region_ids'])))
            ->when(isset($filters['scope_institut_ids']), fn($q) => $q->whereHas('seance.plan.participants.instituts', fn($sq) => $sq->whereIn('instituts.id', $filters['scope_institut_ids'])));

        $totalQcm = (clone $qcmQuery)->count();
        if ($totalQcm === 0) return ['count' => 0, 'rate' => 0];

        $qcms = (clone $qcmQuery)->with(['seance.plan.participants'])->get();
        
        $totalRate = 0;
        foreach ($qcms as $qcm) {
            $participantsCount = $qcm->seance->plan->participants->count();
            if ($participantsCount > 0) {
                $tentativesCount = \App\Models\QcmTentative::where('qcm_id', $qcm->id)->distinct('user_id')->count();
                $totalRate += ($tentativesCount / $participantsCount) * 100;
            }
        }

        return [
            'count' => $totalQcm,
            'rate' => round($totalRate / $totalQcm, 1)
        ];
    }

    private function calculateStudentAttendanceForFormateur($user)
    {
        $seanceIds = Seance::whereHas('seanceThemes', fn($q) => $q->where('formateur_id', $user->id))->pluck('id');
        if ($seanceIds->isEmpty()) return 0;

        $query = Presence::whereIn('seance_id', $seanceIds);
        $total = (clone $query)->count();
        if ($total === 0) return 0;

        $present = (clone $query)->whereIn('statut', ['présent', 'retard'])->count();
        return round(($present / $total) * 100, 1);
    }

    private function getFilterOptions()
    {
        return [
            'regions' => Region::orderBy('nom')->get(['id', 'nom']),
            'secteurs' => Secteur::orderBy('nom')->get(['id', 'nom']),
            'villes' => Institut::whereNotNull('ville')->distinct()->orderBy('ville')->pluck('ville'),
            'annees' => PlanFormation::selectRaw('EXTRACT(YEAR FROM date_debut) as year')
                        ->whereNotNull('date_debut')
                        ->distinct()
                        ->orderByDesc('year')
                        ->pluck('year'),
        ];
    }
}
