<?php

namespace App\Http\Controllers\Modules\Participant;

use App\Http\Controllers\Controller;
use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\QcmTentative;
use App\Models\Presence;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ParticipantDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Récupérer les plans auxquels le participant est inscrit (validés ou terminés)
        $planIds = $user->plans()
            ->whereIn('plans_formation.statut', ['validé', 'terminée'])
            ->pluck('plans_formation.id')
            ->toArray();

        // 2. Récupérer toutes les séances de ces plans
        $seances = Seance::whereIn('plan_id', $planIds)
            ->with(['plan.entite', 'site', 'seanceThemes.theme', 'seanceThemes.formateur'])
            ->orderBy('date', 'asc')
            ->get();

        // 3. Calculer les statistiques
        $totalSessions = $seances->where('statut', 'terminée')->count();
        $presences = Presence::where('participant_id', $user->id)
            ->whereIn('seance_id', $seances->pluck('id'))
            ->get();
        
        $attendedCount = $presences->where('statut', 'présent')->count();
        $attendanceRate = $totalSessions > 0 ? round(($attendedCount / $totalSessions) * 100) : 0;

        // Stats QCM
        $attempts = QcmTentative::where('user_id', $user->id)->get();
        $avgScore = $attempts->count() > 0 ? round($attempts->avg(function($a) {
            return ($a->score / $a->total_points) * 100;
        })) : 0;

        $stats = [
            'sessions_count' => $totalSessions,
            'attendance_rate' => $attendanceRate,
            'avg_qcm_score' => $avgScore,
            'upcoming_count' => $seances->whereIn('statut', ['planifiée', 'confirmée'])
                ->where('date', '>=', now()->toDateString())
                ->count(),
        ];

        // 4. Identifier la prochaine séance
        $nextSession = $seances->whereIn('statut', ['planifiée', 'confirmée'])
            ->where('date', '>=', now()->toDateString())
            ->sortBy('date')
            ->first();

        // 5. Récupérer les QCMs disponibles dans les séances à venir ou passées
        $availableQcms = \App\Models\Qcm::whereIn('seance_id', $seances->pluck('id'))
            ->where('est_publie', true)
            ->with('seance.plan')
            ->get()
            ->map(function($qcm) use ($user) {
                $latestTentative = QcmTentative::where('user_id', $user->id)
                    ->where('qcm_id', $qcm->id)
                    ->latest()
                    ->first();
                
                $qcm->deja_fait = !is_null($latestTentative);
                $qcm->derniere_tentative_id = $latestTentative ? $latestTentative->id : null;
                $qcm->derniere_score = $latestTentative ? $latestTentative->score : null;
                $qcm->total_points = $latestTentative ? $latestTentative->total_points : null;
                return $qcm;
            });

        // 6. Récupérer les feedbacks soumis par l'utilisateur
        $myFeedbacks = \App\Models\FeedbackSubmission::where('participant_id', $user->id)
            ->with(['seance.plan', 'responses.question'])
            ->latest()
            ->get();

        return Inertia::render('Modules/Participant/Dashboard', [
            'seances' => $seances,
            'stats' => $stats,
            'nextSession' => $nextSession,
            'qcms' => $availableQcms,
            'myFeedbacks' => $myFeedbacks,
        ]);
    }
}
