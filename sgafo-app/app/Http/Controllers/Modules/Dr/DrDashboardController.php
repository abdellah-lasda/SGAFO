<?php

namespace App\Http\Controllers\Modules\Dr;

use App\Http\Controllers\Controller;
use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\User;
use App\Models\Presence;
use App\Models\FeedbackSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DrDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $regions = $user->regions;
        $regionNames = $regions->pluck('nom')->join(', ');

        // Statistiques globales (déjà filtrées par le HasRegionalScope)
        $stats = [
            'total_plans' => PlanFormation::count(),
            'total_formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count(),
            'total_seances' => Seance::count(),
            'plans_confirmes' => PlanFormation::where('statut', 'confirmé')->count(),
        ];

        // Dernières séances dans la région
        $recentSeances = Seance::with(['plan.entite', 'site'])
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Répartition des plans par statut
        $plansByStatus = PlanFormation::selectRaw('statut, count(*) as total')
            ->groupBy('statut')
            ->get();

        // [NOUVEAU] Comparatif par Institut (Point 3)
        // On récupère les instituts de la région
        $institutsStats = \App\Models\Institut::whereIn('region_id', $regions->pluck('id'))
            ->withCount(['formateurs', 'users'])
            ->get()
            ->map(function($inst) {
                return [
                    'nom' => $inst->nom,
                    'formateurs_count' => $inst->formateurs_count,
                    // On simule un taux de complétion pour la démo
                    'plans_count' => PlanFormation::whereHas('siteFormation', function($q) use ($inst) {
                        $q->where('ville', $inst->ville);
                    })->count()
                ];
            });

        return Inertia::render('Modules/Dr/Dashboard', [
            'regionNames' => $regionNames,
            'stats' => $stats,
            'recentSeances' => $recentSeances,
            'plansByStatus' => $plansByStatus,
            'institutsStats' => $institutsStats,
        ]);
    }

    public function plans()
    {
        $plans = PlanFormation::with(['entite', 'siteFormation', 'createur'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Modules/Dr/Plans/Index', [
            'plans' => $plans,
        ]);
    }
}
