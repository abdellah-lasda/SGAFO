<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlanFormation;
use App\Models\QcmTentative;
use App\Models\FeedbackSubmission;
use App\Models\FeedbackResponse;
use App\Models\Secteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Get global analytics for the Admin dashboard.
     */
    public function index()
    {
        // 1. QCM Performance (Global)
        $qcmStats = [
            'average_score' => round(QcmTentative::avg(DB::raw('score * 100 / total_points')), 1),
            'total_tentatives' => QcmTentative::count(),
            'pass_rate' => round(
                (QcmTentative::count() > 0) ? (QcmTentative::whereRaw('score >= total_points / 2')->count() / QcmTentative::count()) * 100 : 0, 
                1
            ),
        ];

        // 2. Feedback Satisfaction (Radar Data)
        $feedbackCategories = DB::table('feedback_questions')
            ->join('feedback_responses', 'feedback_questions.id', '=', 'feedback_responses.question_id')
            ->whereNotNull('feedback_responses.rating')
            ->select(DB::raw("COALESCE(feedback_questions.categorie, 'Autre') as categorie"), DB::raw('AVG(feedback_responses.rating) as average'))
            ->groupBy('feedback_questions.categorie')
            ->get();

        // 3. Secteur Performance (Comparison)
        $secteurStats = Secteur::withCount(['plans' => function($q) {
            $q->where('plans_formation.statut', 'validé');
        }])->get()->map(function($secteur) {
            $planIds = $secteur->plans->pluck('id');
            
            return [
                'name' => $secteur->nom,
                'plans_count' => $secteur->plans_count,
                'avg_qcm' => round(
                    QcmTentative::whereHas('qcm.seance', function($q) use ($planIds) {
                        $q->whereIn('plan_id', $planIds);
                    })->avg(DB::raw('score * 100 / total_points')) ?? 0, 
                    1
                ),
                'avg_feedback' => round(
                    FeedbackSubmission::whereIn('plan_id', $planIds)
                        ->join('feedback_responses', 'feedback_submissions.id', '=', 'feedback_responses.feedback_submission_id')
                        ->avg('feedback_responses.rating') ?? 0,
                    1
                )
            ];
        });

        return Inertia::render('Admin/Pilotage/Analytics', [
            'qcmStats' => $qcmStats,
            'feedbackStats' => $feedbackCategories,
            'secteurStats' => $secteurStats,
        ]);
    }

    /**
     * Get detailed analytics for a specific plan.
     */
    public function planAnalytics(PlanFormation $plan)
    {
        $plan->load(['entite.secteur', 'themes']);

        // 1. QCM Performance per Theme
        $themePerformance = $plan->themes->map(function($theme) use ($plan) {
            return [
                'theme' => $theme->nom,
                'avg_score' => round(
                    QcmTentative::whereHas('qcm.seance', function($q) use ($plan) {
                        $q->where('plan_id', $plan->id);
                    })->avg(DB::raw('score * 100 / total_points')) ?? 0,
                    1
                )
            ];
        });

        // 2. Feedback Categories for this plan
        $feedbackStats = DB::table('feedback_submissions')
            ->where('plan_id', $plan->id)
            ->join('feedback_responses', 'feedback_submissions.id', '=', 'feedback_responses.feedback_submission_id')
            ->join('feedback_questions', 'feedback_responses.question_id', '=', 'feedback_questions.id')
            ->whereNotNull('feedback_responses.rating')
            ->select(DB::raw("COALESCE(feedback_questions.categorie, 'Autre') as categorie"), DB::raw('AVG(feedback_responses.rating) as average'))
            ->groupBy('feedback_questions.categorie')
            ->get();

        return response()->json([
            'themePerformance' => $themePerformance,
            'feedbackStats' => $feedbackStats,
        ]);
    }
}
