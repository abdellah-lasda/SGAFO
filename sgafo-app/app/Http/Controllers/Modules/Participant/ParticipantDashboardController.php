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

        // 1. Récupérer les plans auxquels le participant est inscrit (accessibles)
        $planIds = $user->plans()
            ->whereIn('plans_formation.statut', ['validé', 'confirmé', 'terminée'])
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
                $qcm->deja_fait = QcmTentative::where('user_id', $user->id)
                    ->where('qcm_id', $qcm->id)
                    ->exists();
                return $qcm;
            });

        return Inertia::render('Modules/Participant/Dashboard', [
            'seances' => $seances,
            'stats' => $stats,
            'nextSession' => $nextSession,
            'qcms' => $availableQcms,
        ]);
    }
}
