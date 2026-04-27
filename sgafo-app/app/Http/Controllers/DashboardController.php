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
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Global Filters
        $annee = $request->input('annee');
        $regionId = $request->input('region_id');
        $ville = $request->input('ville');
        $secteurId = $request->input('secteur_id');

        // Base Query for filtered plans
        $plansQuery = PlanFormation::query()
            ->when($annee, fn($q) => $q->whereYear('date_debut', $annee))
            ->when($secteurId, fn($q) => $q->whereHas('entite', fn($sq) => $sq->where('secteur_id', $secteurId)))
            ->when($regionId, fn($q) => $q->whereHas('participants.instituts.region', fn($sq) => $sq->where('id', $regionId)))
            ->when($ville, fn($q) => $q->whereHas('participants.instituts', fn($sq) => $sq->where('ville', $ville)));

        // Statistics
        $stats = [
            'formations_count' => EntiteFormation::when($secteurId, fn($q) => $q->where('secteur_id', $secteurId))->count(),
            'secteurs_count' => Secteur::count(),
            'sites_count' => SiteFormation::count(),
            'formateurs_count' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count(),
            'plans_pending_count' => PlanFormation::where('statut', 'soumis')->count(), 
            'plans' => [
                'total' => (clone $plansQuery)->count(),
                'by_status' => [
                    'brouillon' => (clone $plansQuery)->where('statut', 'brouillon')->count(),
                    'soumis' => (clone $plansQuery)->where('statut', 'soumis')->count(),
                    'validé' => (clone $plansQuery)->where('statut', 'validé')->count(),
                    'confirmé' => (clone $plansQuery)->where('statut', 'confirmé')->count(),
                    'rejeté' => (clone $plansQuery)->where('statut', 'rejeté')->count(),
                    'annulé' => (clone $plansQuery)->where('statut', 'annulé')->count(),
                ]
            ],
            'plans_per_sector' => Secteur::withCount(['entites as plans_count' => function($q) use ($plansQuery) {
                    $q->whereHas('plans', function($sq) use ($plansQuery) {
                        $sq->whereIn('id', (clone $plansQuery)->select('id'));
                    });
                }])
                ->orderByDesc('plans_count')
                ->get(['id', 'nom', 'plans_count']),

            'plans_per_region' => Region::all()->map(function($region) use ($plansQuery) {
                return [
                    'id' => $region->id,
                    'nom' => $region->nom,
                    'plans_count' => (clone $plansQuery)->whereHas('participants.instituts', function($q) use ($region) {
                        $q->where('region_id', $region->id);
                    })->count()
                ];
            })->sortByDesc('plans_count')->values(),

            'top_sites' => SiteFormation::withCount(['plans' => function($q) use ($plansQuery) {
                    $q->whereIn('id', (clone $plansQuery)->select('id'));
                }])
                ->orderByDesc('plans_count')
                ->take(5)
                ->get(['id', 'nom', 'plans_count']),

            'plans_evolution' => $this->getPlansEvolution(),
            
            'attendance_rate' => $this->calculateAttendanceRate($annee, $regionId, $ville, $secteurId),

            // Admin Specific Alerts
            'admin_alerts' => $user->isAdmin() ? [
                'users_sans_role' => User::doesntHave('roles')->count(),
                'users_suspendus' => User::where('statut', 'suspendu')->count(),
                'sites_inactifs' => SiteFormation::where('statut', 'inactif')->count(),
            ] : null,
            // RF Specific Alerts
            'rf_alerts' => $user->hasRole('RF') ? [
                'pending_confirmation' => PlanFormation::where('statut', 'soumis')->count(),
                'pending_validation' => PlanFormation::where('statut', 'confirmé')->count(),
            ] : null,
            // CDC Specific Alerts
            'cdc_alerts' => $user->hasRole('CDC') ? [
                'my_drafts' => PlanFormation::where('cree_par', $user->id)->where('statut', 'brouillon')->count(),
                'my_rejected' => PlanFormation::where('cree_par', $user->id)->where('statut', 'rejeté')->count(),
            ] : null,

            // System & Resource Stats
            'users_by_role' => [
                'formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count(),
                'rf' => User::whereHas('roles', fn($q) => $q->where('code', 'RF'))->count(),
                'cdc' => User::whereHas('roles', fn($q) => $q->where('code', 'CDC'))->count(),
                'admin' => User::whereHas('roles', fn($q) => $q->where('code', 'ADMIN'))->count(),
            ],
            
            'instituts_per_region' => Region::withCount('instituts')
                ->orderByDesc('instituts_count')
                ->get(['id', 'nom', 'instituts_count']),

            'content_counts' => [
                'metiers' => \App\Models\Metier::count(),
                'secteurs' => Secteur::count(),
                'qcm' => \App\Models\Qcm::count(),
                'seances' => Seance::count(),
                'formations' => EntiteFormation::count(),
            ],

            'top_formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
                ->withCount(['seances as sessions_count'])
                ->orderByDesc('sessions_count')
                ->take(5)
                ->get(['id', 'nom', 'prenom', 'sessions_count']),

            'upcoming_seances' => Seance::with(['plan.entite', 'site'])
                ->where('date', '>=', now()->toDateString())
                ->orderBy('date')
                ->orderBy('debut')
                ->take(5)
                ->get(),

            'site_occupancy' => $this->getSiteOccupancy(),
        ];

        $latestFormations = EntiteFormation::with(['secteur', 'createur'])
            ->when($secteurId, fn($q) => $q->where('secteur_id', $secteurId))
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'latestFormations' => $latestFormations,
            'filters' => $request->only(['annee', 'region_id', 'ville', 'secteur_id']),
            'filterOptions' => [
                'regions' => Region::orderBy('nom')->get(['id', 'nom']),
                'secteurs' => Secteur::orderBy('nom')->get(['id', 'nom']),
                'villes' => Institut::whereNotNull('ville')->distinct()->orderBy('ville')->pluck('ville'),
                'annees' => PlanFormation::selectRaw('EXTRACT(YEAR FROM date_debut) as year')
                            ->whereNotNull('date_debut')
                            ->distinct()
                            ->orderByDesc('year')
                            ->pluck('year'),
            ]
        ]);
    }

    private function calculateAttendanceRate($annee, $regionId, $ville, $secteurId)
    {
        $query = \App\Models\Presence::query()
            ->whereHas('seance', function($q) use ($annee, $regionId, $ville, $secteurId) {
                $q->when($annee, fn($sq) => $sq->whereYear('date', $annee))
                  ->when($regionId, fn($sq) => $sq->whereHas('plan.participants.instituts.region', fn($ssq) => $ssq->where('id', $regionId)))
                  ->when($ville, fn($sq) => $sq->whereHas('plan.participants.instituts', fn($ssq) => $ssq->where('ville', $ville)))
                  ->when($secteurId, fn($sq) => $sq->whereHas('plan.entite', fn($ssq) => $ssq->where('secteur_id', $secteurId)));
            });

        $total = (clone $query)->count();
        if ($total === 0) return 0;

        $present = (clone $query)->whereIn('statut', ['présent', 'retard'])->count();
        
        return round(($present / $total) * 100, 1);
    }

    private function getPlansEvolution()
    {
        $evolution = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = PlanFormation::whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->count();
            $evolution[] = [
                'label' => $month->translatedFormat('M Y'),
                'count' => $count
            ];
        }
        return $evolution;
    }
}
