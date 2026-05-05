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

        return Inertia::render('Modules/Dr/Dashboard', [
            'regionNames' => $regionNames,
            'stats' => $stats,
            'recentSeances' => $recentSeances,
            'plansByStatus' => $plansByStatus,
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
