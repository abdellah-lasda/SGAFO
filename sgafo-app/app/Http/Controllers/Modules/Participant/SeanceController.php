<?php

namespace App\Http\Controllers\Modules\Participant;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\PlanFormation;
use App\Models\QcmTentative;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SeanceController extends Controller
{
    public function formations()
    {
        $user = Auth::user();

        // 1. Récupérer les plans auxquels le participant est inscrit
        $plans = $user->plans()
            ->whereIn('plans_formation.statut', ['validé', 'terminée'])
            ->with(['entite', 'seances.seanceThemes.theme', 'seances.site'])
            ->get();

        $planIds = $plans->pluck('id')->toArray();

        // 2. Récupérer toutes les séances de ces plans
        $allSeances = Seance::whereIn('plan_id', $planIds)
            ->with(['plan.entite', 'site', 'seanceThemes.theme', 'seanceThemes.formateur'])
            ->orderBy('date', 'asc')
            ->get();

        // 3. Calculer les statistiques
        $totalPlans = $plans->count();
        $totalHours = $allSeances->sum(function($s) {
            // Approximation ou somme réelle si disponible
            return 4; // Par défaut 4h par séance si non spécifié
        });

        $completedSeances = $allSeances->where('statut', 'terminée');
        $completedHours = $completedSeances->count() * 4;

        $stats = [
            'total_plans' => $totalPlans,
            'total_hours' => $totalHours,
            'completed_hours' => $completedHours,
            'completion_rate' => $totalHours > 0 ? round(($completedHours / $totalHours) * 100) : 0,
        ];

        return Inertia::render('Modules/Participant/Formations', [
            'plans' => $plans,
            'allSeances' => $allSeances,
            'stats' => $stats,
        ]);
    }

    public function show(Seance $seance)
    {
        $user = Auth::user();

        // Vérifier que le participant est bien inscrit à ce plan
        $isParticipant = $user->plans()->where('plans_formation.id', $seance->plan_id)->exists();

        if (!$isParticipant) {
            abort(403, "Vous n'êtes pas inscrit à cette formation.");
        }

        // Charger les relations nécessaires
        $seance->load([
            'plan.entite',
            'site',
            'seanceThemes.theme',
            'seanceThemes.formateur',
            'ressources',
            'qcms' => function($q) {
                $q->where('est_publie', true);
            }
        ]);

        // Vérifier l'accessibilité des QCMs
        // Un QCM est passable si la séance a commencé (date et heure de début)
        $now = Carbon::now();
        $dateStr = $seance->date instanceof Carbon ? $seance->date->format('Y-m-d') : Carbon::parse($seance->date)->format('Y-m-d');
        $seanceStart = Carbon::parse($dateStr . ' ' . $seance->debut);
        
        $canPassQcm = $now->greaterThanOrEqualTo($seanceStart);

        // Vérifier si les QCMs ont déjà été faits
        $qcms = $seance->qcms->map(function($qcm) use ($user) {
            $qcm->deja_fait = QcmTentative::where('user_id', $user->id)
                ->where('qcm_id', $qcm->id)
                ->exists();
            
            if ($qcm->deja_fait) {
                $qcm->derniere_tentative = QcmTentative::where('user_id', $user->id)
                    ->where('qcm_id', $qcm->id)
                    ->latest()
                    ->first();
            }
            
            return $qcm;
        });

        return Inertia::render('Modules/Participant/SeanceShow', [
            'seance' => $seance,
            'canPassQcm' => $canPassQcm,
            'qcms' => $qcms,
        ]);
    }
    public function planShow(PlanFormation $plan)
    {
        $user = Auth::user();

        // Vérifier si le participant est bien inscrit à ce plan et qu'il est accessible
        $isEnrolled = $plan->participants()->where('users.id', $user->id)->exists();
        $allowedStatuses = ['validé', 'terminée'];
        
        if (!$isEnrolled || !in_array($plan->statut, $allowedStatuses)) {
            abort(403, "Vous n'avez pas accès à cette formation.");
        }

        $plan->load([
            'entite.secteur', 
            'themes',
            'seances' => function($q) {
                $q->with(['site', 'seanceThemes.theme', 'seanceThemes.formateur'])->orderBy('date', 'asc');
            }
        ]);

        // Calculer les stats du plan pour ce participant
        $totalSeances = $plan->seances->count();
        $completedSeances = $plan->seances->where('statut', 'terminée')->count();
        $progress = $totalSeances > 0 ? round(($completedSeances / $totalSeances) * 100) : 0;

        return Inertia::render('Modules/Participant/PlanShow', [
            'plan' => $plan,
            'stats' => [
                'total_seances' => $totalSeances,
                'completed_seances' => $completedSeances,
                'progress' => $progress,
            ]
        ]);
    }
}
