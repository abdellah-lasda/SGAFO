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
}
