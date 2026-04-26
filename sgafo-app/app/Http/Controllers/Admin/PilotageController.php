<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EntiteFormation;
use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\Qcm;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PilotageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pilotage/Index', [
            'stats' => [
                'entites' => [
                    'total' => EntiteFormation::count(),
                    'recent' => EntiteFormation::with(['secteur', 'createur'])->latest()->take(5)->get(),
                ],
                'plans' => [
                    'total' => PlanFormation::count(),
                    'by_status' => [
                        'brouillon' => PlanFormation::where('statut', 'brouillon')->count(),
                        'soumis' => PlanFormation::where('statut', 'soumis')->count(),
                        'validé' => PlanFormation::where('statut', 'validé')->count(),
                        'confirmé' => PlanFormation::where('statut', 'confirmé')->count(),
                        'rejeté' => PlanFormation::where('statut', 'rejeté')->count(),
                        'archivé' => PlanFormation::where('statut', 'archivé')->count(),
                    ],
                    'recent' => PlanFormation::with(['entite', 'siteFormation'])->latest()->take(5)->get(),
                ],
                'sessions' => [
                    'total' => Seance::count(),
                    'recent' => Seance::with(['plan', 'site'])->latest()->take(5)->get(),
                ],
                'qcms' => [
                    'total' => Qcm::count(),
                    'published' => Qcm::where('est_publie', true)->count(),
                    'recent' => Qcm::with(['seance.plan'])->latest()->take(5)->get(),
                ],
            ]
        ]);
    }
}
