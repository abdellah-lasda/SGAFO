<?php 
namespace App\Http\Controllers\Modules\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\PlanFormation;
use App\Models\FeedbackForm;
use App\Models\FeedbackQuestion;
use App\Models\FeedbackSubmission;
use App\Notifications\NewFeedbackNotification;
use App\Notifications\FeedbackRequiredNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FeedbackAdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $planId = $request->input('plan_id');

        $plans = PlanFormation::whereIn('statut', ['validé', 'terminée'])
            ->select('id', 'titre')
            ->get();

        $query = FeedbackSubmission::with(['participant', 'seance', 'plan', 'responses.question']);

        if ($planId) {
            $query->where('plan_id', $planId);
        }

        $submissions = $query->latest()->paginate(15);

        // Stats globales
        $avgRating = \DB::table('feedback_responses')
            ->whereNotNull('rating')
            ->avg('rating');

        $stats = [
            'total_submissions' => FeedbackSubmission::count(),
            'published_count' => FeedbackSubmission::where('est_affiche_sur_plan', true)->count(),
            'avg_rating' => round($avgRating, 1) ?: 0,
        ];

        $feedbackStats = DB::table('feedback_questions')
            ->join('feedback_responses', 'feedback_questions.id', '=', 'feedback_responses.question_id')
            ->select('feedback_questions.categorie', DB::raw('AVG(feedback_responses.rating) as average'))
            ->groupBy('feedback_questions.categorie')
            ->get();


        return Inertia::render('Modules/Admin/Feedback/FeedbackDashboard', [
            'submissions' => $submissions,
            'plans' => $plans,
            'filters' => $request->only(['plan_id']),
            'stats' => $stats,
            'feedbackStats' => $feedbackStats,
        ]);

    }

    public function builder(Seance $seance)
    {
        $seance->load(['plan.entite', 'feedbackForm.questions']);
        
        return Inertia::render('Modules/Admin/Feedback/FeedbackBuilder', [
            'seance' => $seance,
            'feedbackForm' => $seance->feedbackForm,
        ]);
    }

    public function save(Request $request, Seance $seance)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.type' => 'required|in:rating,text',
            'questions.*.categorie' => 'nullable|string',
            'questions.*.ordre' => 'required|integer',
        ]);


        DB::beginTransaction();
        try {
            $form = FeedbackForm::updateOrCreate(
                ['seance_id' => $seance->id],
                [
                    'titre' => $request->titre,
                    'description' => $request->description,
                    'created_by' => Auth::id(),
                    'is_active' => true,
                ]
            );

            $questionIdsToKeep = [];
            foreach ($request->questions as $qData) {
                $question = $form->questions()->updateOrCreate(
                    ['id' => $qData['id'] ?? null],
                    [
                        'question_text' => $qData['question_text'],
                        'type' => $qData['type'],
                        'categorie' => $qData['categorie'] ?? null,
                        'ordre' => $qData['ordre'],
                    ]

                );
                $questionIdsToKeep[] = $question->id;
            }

            $form->questions()->whereNotIn('id', $questionIdsToKeep)->delete();

            DB::commit();
            return back()->with('success', 'Questionnaire de feedback sauvegardé.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur lors de la sauvegarde : ' . $e->getMessage()]);
        }
    }

    public function results(Seance $seance)
    {
        $seance->load(['plan.entite', 'feedbackForm.questions.responses', 'feedbackForm.submissions.participant']);
        
        // Calculer les moyennes pour les questions de type 'rating'
        $stats = $seance->feedbackForm ? $seance->feedbackForm->questions->map(function ($question) {
            if ($question->type === 'rating') {
                $question->average = $question->responses->avg('rating');
                $question->count = $question->responses->count();
            }
            return $question;
        }) : collect();

        return Inertia::render('Modules/Admin/Feedback/FeedbackResults', [
            'seance' => $seance,
            'stats' => $stats,
        ]);
    }

    public function togglePublish(FeedbackSubmission $submission)
    {
        $submission->update([
            'est_affiche_sur_plan' => !$submission->est_affiche_sur_plan
        ]);

        return back()->with('success', $submission->est_affiche_sur_plan ? 'Commentaire publié sur le plan.' : 'Commentaire retiré du plan.');
    }

    public function quickStore(Seance $seance)
    {
        DB::beginTransaction();
        try {
            $form = FeedbackForm::updateOrCreate(
                ['seance_id' => $seance->id],
                [
                    'plan_id' => $seance->plan_id,
                    'titre' => "Évaluation : " . $seance->plan->titre,
                    'description' => "Merci de prendre quelques minutes pour évaluer cette séance.",
                    'created_by' => Auth::id(),
                    'is_active' => true,
                ]
            );

            $form->questions()->delete();
            
            $defaultQuestions = [
                ['question_text' => 'Qualité de l\'animation', 'type' => 'rating', 'categorie' => 'Animation', 'ordre' => 1],
                ['question_text' => 'Qualité des supports et documents', 'type' => 'rating', 'categorie' => 'Supports', 'ordre' => 2],
                ['question_text' => 'Organisation et logistique', 'type' => 'rating', 'categorie' => 'Logistique', 'ordre' => 3],
                ['question_text' => 'Contenu et pertinence', 'type' => 'rating', 'categorie' => 'Contenu', 'ordre' => 4],
                ['question_text' => 'Commentaires libres', 'type' => 'text', 'categorie' => 'Commentaires', 'ordre' => 5],
            ];


            foreach ($defaultQuestions as $q) {
                $form->questions()->create($q);
            }

            DB::commit();

            return back()->with('success', 'Évaluation standard activée pour cette séance.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur : ' . $e->getMessage()]);
        }
    }
}
