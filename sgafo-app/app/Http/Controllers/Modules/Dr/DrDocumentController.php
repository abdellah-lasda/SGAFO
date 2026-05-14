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

        // On cherche tous les plans impliquant le personnel de la région du DR (filtre global automatique appliqué)
        $plans = PlanFormation::with(['entite', 'siteFormation'])
            ->whereIn('statut', ['soumis', 'confirmé', 'validé', 'terminé'])
            ->orderBy('date_debut', 'desc')
            ->get();

        return Inertia::render('Modules/Dr/Documents/Index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Export du Plan Régional Augmenté avec KPIs
     */
    public function exportRegionalPlan()
    {
        $user = Auth::user();
        $regions = $user->regions;
        $regionIds = $regions->pluck('id');
        $regionNames = $regions->pluck('nom')->join(', ');

        // 1. Récupération des Plans
        $plans = PlanFormation::with(['entite', 'siteFormation', 'seances.site'])
            ->orderBy('date_debut', 'asc')
            ->get();
        // 2. Calcul des KPIs Globaux
        $presenceStats = \App\Models\Presence::selectRaw("count(*) as total, sum(case when statut in ('présent', 'retard') then 1 else 0 end) as present")
            ->first();
        $attendanceRate = $presenceStats->total > 0 ? round(($presenceStats->present / $presenceStats->total) * 100, 1) : 0;

        $qcmStats = \App\Models\QcmTentative::whereHas('qcm.seance.plan')
            ->selectRaw('avg(score) as average')
            ->first();

        $satisfactionRadar = \App\Models\FeedbackResponse::whereHas('submission.plan')
            ->join('feedback_questions', 'feedback_responses.question_id', '=', 'feedback_questions.id')
            ->where('feedback_questions.type', 'rating')
            ->select('feedback_questions.categorie', \DB::raw('AVG(rating) as average'))
            ->groupBy('feedback_questions.categorie')
            ->get();
        // 3. Statistiques par Institut
        $statsParInstitut = \App\Models\Institut::whereIn('region_id', $regionIds)
            ->get()
            ->map(function($inst) {
                $totalSeances = \App\Models\Seance::where('site_id', $inst->id)->count();
                $presenceRate = \App\Models\Presence::whereHas('seance', fn($q) => $q->where('site_id', $inst->id))
                    ->selectRaw("count(*) as total, sum(case when statut in ('présent', 'retard') then 1 else 0 end) as present")
                    ->first();
                
                return [
                    'nom' => $inst->nom,
                    'seances_count' => $totalSeances,
                    'attendance' => $presenceRate->total > 0 ? round(($presenceRate->present / $presenceRate->total) * 100, 1) : 0
                ];
            });

        // 4. Répartition par Secteur
        $statsParSecteur = PlanFormation::whereHas('siteFormation', fn($q) => $q->whereIn('region_id', $regionIds))
            ->join('entite_formations', 'plans_formation.entite_id', '=', 'entite_formations.id')
            ->join('secteurs', 'entite_formations.secteur_id', '=', 'secteurs.id')
            ->select('secteurs.nom', \DB::raw('count(*) as total'))
            ->groupBy('secteurs.nom')
            ->get();

        $data = [
            'regions' => $regionNames,
            'plans' => $plans,
            'stats' => [
                'attendance_rate' => $attendanceRate,
                'qcm_average' => round($qcmStats->average ?? 0, 1),
                'satisfaction' => $satisfactionRadar,
                'total_formateurs' => \App\Models\User::whereHas('instituts', fn($q) => $q->whereIn('region_id', $regionIds))->count(),
                'par_institut' => $statsParInstitut,
                'par_secteur' => $statsParSecteur
            ],
            'date' => now()->format('d/m/Y'),
            'user' => $user->prenom . ' ' . $user->nom
        ];

        $pdf = Pdf::loadView('pdf.regional_plan_report', $data);
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download('Bilan_Regional_SGAFO_' . str_replace(' ', '_', $regionNames) . '.pdf');
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
            ->where(function($q) use ($plan) {
                $q->whereHas('seances', function($sq) use ($plan) {
                    $sq->where('plan_id', $plan->id);
                })
                ->orWhereHas('planThemes', function($sq) use ($plan) {
                    $sq->where('plan_id', $plan->id);
                })
                ->orWhereHas('plans', function($sq) use ($plan) {
                    $sq->where('plans_formation.id', $plan->id);
                });
            })
            ->with('instituts')
            ->get()
            ->sortBy(function($user) {
                return $user->instituts->first()?->nom ?? 'ZZZ';
            })
            ->map(function($u) use ($plan) {
                // Vérifier s'il est animateur sur au moins un thème ou une séance
                $isAnimator = $u->seances()->where('plan_id', $plan->id)->exists() || 
                             $u->planThemes()->where('plan_id', $plan->id)->exists();
                
                $u->role_dans_plan = $isAnimator ? 'Animateur' : 'Participant';
                return $u;
            });

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
