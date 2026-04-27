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

        // Base Query for filtered plans
        $plansQuery = $this->getFilteredPlansQuery($filters);

        // Build Statistics Object
        $stats = [
            'formations_count' => EntiteFormation::when($filters['secteur_id'], fn($q) => $q->where('secteur_id', $filters['secteur_id']))->count(),
            'secteurs_count' => Secteur::count(),
            'sites_count' => SiteFormation::count(),
            'formateurs_count' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count(),
            'plans_pending_count' => PlanFormation::where('statut', 'soumis')->count(), 
            
            'plans' => $this->getPlansStats($plansQuery),
            'plans_per_sector' => $this->getPlansPerSector($plansQuery),
            'plans_per_region' => $this->getPlansPerRegion($plansQuery),
            'top_sites' => $this->getTopSites($plansQuery),
            'plans_evolution' => $this->getPlansEvolution(),
            'attendance_rate' => $this->calculateAttendanceRate($filters),

            'admin_alerts' => $user->isAdmin() ? $this->getAdminAlerts() : null,
            'rf_alerts' => $user->hasRole('RF') ? $this->getRfAlerts() : null,
            'cdc_alerts' => $user->hasRole('CDC') ? $this->getCdcAlerts($user) : null,

            'users_by_role' => $this->getUsersByRole(),
            'instituts_per_region' => $this->getInstitutsPerRegion(),
            'content_counts' => $this->getContentCounts(),
            'top_formateurs' => $this->getTopFormateurs(),
            'upcoming_seances' => $this->getUpcomingSeances(),
            'site_occupancy' => $this->getSiteOccupancy(),
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
        return PlanFormation::query()
            ->when($filters['annee'], fn($q) => $q->whereYear('date_debut', $filters['annee']))
            ->when($filters['secteur_id'], fn($q) => $q->whereHas('entite', fn($sq) => $sq->where('secteur_id', $filters['secteur_id'])))
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

    private function getPlansPerRegion($query)
    {
        return Region::all()->map(function($region) use ($query) {
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

    private function getRfAlerts()
    {
        return [
            'pending_confirmation' => PlanFormation::where('statut', 'soumis')->count(),
            'pending_validation' => PlanFormation::where('statut', 'confirmé')->count(),
        ];
    }

    private function getCdcAlerts($user)
    {
        return [
            'my_drafts' => PlanFormation::where('cree_par', $user->id)->where('statut', 'brouillon')->count(),
            'my_rejected' => PlanFormation::where('cree_par', $user->id)->where('statut', 'rejeté')->count(),
        ];
    }

    private function getUsersByRole()
    {
        return [
            'formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count(),
            'rf' => User::whereHas('roles', fn($q) => $q->where('code', 'RF'))->count(),
            'cdc' => User::whereHas('roles', fn($q) => $q->where('code', 'CDC'))->count(),
            'admin' => User::whereHas('roles', fn($q) => $q->where('code', 'ADMIN'))->count(),
        ];
    }

    private function getInstitutsPerRegion()
    {
        return Region::withCount('instituts')
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

    private function getTopFormateurs()
    {
        return User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
            ->withCount(['seances as sessions_count'])
            ->orderByDesc('sessions_count')
            ->take(5)
            ->get(['id', 'nom', 'prenom', 'sessions_count']);
    }

    private function getUpcomingSeances()
    {
        return Seance::with(['plan.entite', 'site'])
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('debut')
            ->take(6)
            ->get();
    }

    private function getSiteOccupancy()
    {
        $sites = SiteFormation::where('capacite', '>', 0)->take(10)->get();
        $occupancy = [];
        foreach ($sites as $site) {
            $plansIds = PlanFormation::where('site_formation_id', $site->id)->pluck('id');
            $participantCount = DB::table('plan_participants')->whereIn('plan_id', $plansIds)->count();
            $rate = $site->capacite > 0 ? round(($participantCount / $site->capacite) * 100, 1) : 0;
            $occupancy[] = ['nom' => $site->nom, 'rate' => min($rate, 100)];
        }
        return collect($occupancy)->sortByDesc('rate')->take(5)->values();
    }

    private function getPlansEvolution()
    {
        $evolution = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $evolution[] = [
                'label' => $month->translatedFormat('M Y'),
                'count' => PlanFormation::whereMonth('created_at', $month->month)->whereYear('created_at', $month->year)->count()
            ];
        }
        return $evolution;
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
