<?php

namespace App\Http\Controllers\Modules\Dr;

use App\Http\Controllers\Controller;
use App\Models\PlanFormation;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class DrDocumentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $regionIds = $user->regions->pluck('id');

        // On cherche les plans où il y a au moins un formateur de la région du DR
        $plans = PlanFormation::with(['entite', 'siteFormation'])
            ->whereHas('seances.seanceThemes.formateur.instituts', function($q) use ($regionIds) {
                $q->whereIn('region_id', $regionIds);
            })
            ->whereIn('statut', ['confirmé', 'validé', 'terminé'])
            ->get();

        return Inertia::render('Modules/Dr/Documents/Index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Export du Plan Régional Complet (Point 5)
     */
    public function exportRegionalPlan()
    {
        $user = Auth::user();
        $regions = $user->regions;
        $regionNames = $regions->pluck('nom')->join(', ');

        // Récupérer tous les plans de la région (filtrage automatique par scope)
        $plans = PlanFormation::with(['entite', 'siteFormation', 'seances.site'])
            ->orderBy('date_debut', 'asc')
            ->get();

        $data = [
            'regions' => $regionNames,
            'plans' => $plans,
            'date' => now()->format('d/m/Y'),
            'user' => $user->prenom . ' ' . $user->nom
        ];

        $pdf = Pdf::loadView('pdf.regional_plan_report', $data);
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('Rapport_Regional_Formation_' . str_replace(' ', '_', $regionNames) . '.pdf');
    }

    /**
     * Simulation de téléchargement de convocation (Point 2 - Focus Formateurs de la région)
     */
    public function downloadConvocation(PlanFormation $plan)
    {
        $user = Auth::user();
        $regionIds = $user->regions->pluck('id');

        // On récupère les formateurs de ce plan qui appartiennent à la région du DR
        $formateurs = \App\Models\User::whereHas('instituts', function($q) use ($regionIds) {
                $q->whereIn('region_id', $regionIds);
            })
            ->whereHas('seanceThemes.seance', function($q) use ($plan) {
                $q->where('plan_id', $plan->id);
            })
            ->with('instituts')
            ->get();

        // On génère une convocation "groupée" ou individuelle pour ces formateurs
        $data = [
            'plan' => $plan,
            'formateurs' => $formateurs,
            'region_dr' => $user->regions->pluck('nom')->join(', '),
        ];

        $pdf = Pdf::loadView('pdf.convocation_formateur_regional', $data);
        return $pdf->download('Convocations_Formateurs_Plan_' . $plan->id . '.pdf');
    }
}
