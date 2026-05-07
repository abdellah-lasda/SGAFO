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
        $query = Seance::whereHas('feedbackForm')
            ->with(['plan.entite', 'feedbackForm.submissions', 'site'])
            ->withCount(['presences' => function($q) {
                $q->whereIn('statut', ['présent', 'retard']);
            }]);

        if ($request->filled('plan_id')) {
            $query->where('plan_id', $request->plan_id);
        }

        $seances = $query->orderBy('date', 'desc')->paginate(10);

        // Transformer les séances pour inclure les stats calculées
        $seances->getCollection()->transform(function ($seance) {
            $submissionsCount = $seance->feedbackForm->submissions->count();
            $presentsCount = $seance->presences_count;
            
            // Calculer la moyenne de la séance (toutes questions rating confondues)
            $seance->avg_rating = \DB::table('feedback_responses')
                ->join('feedback_submissions', 'feedback_responses.feedback_submission_id', '=', 'feedback_submissions.id')
                ->where('feedback_submissions.feedback_form_id', $seance->feedbackForm->id)
                ->avg('rating');

            $seance->participation_rate = $presentsCount > 0 ? round(($submissionsCount / $presentsCount) * 100) : 0;
            $seance->submissions_count = $submissionsCount;
            
            return $seance;
        });

        // Stats globales pour les widgets
        $globalStats = [
            'total_submissions' => FeedbackSubmission::count(),
            'avg_rating' => round(\DB::table('feedback_responses')->avg('rating'), 1),
            'testimonial_count' => FeedbackSubmission::where('is_testimonial', true)->count(),
        ];

        // Stats par catégorie pour le radar chart
        $feedbackStats = \DB::table('feedback_questions')
            ->join('feedback_responses', 'feedback_questions.id', '=', 'feedback_responses.question_id')
            ->select('categorie', \DB::raw('AVG(rating) as average'))
            ->where('type', 'rating')
            ->groupBy('categorie')
            ->get();

        $plans = PlanFormation::has('seances.feedbackForm')->get(['id', 'titre']);

        return Inertia::render('Modules/Admin/Feedback/FeedbackDashboard', [
            'seances' => $seances,
            'plans' => $plans,
            'filters' => $request->only(['plan_id']),
            'stats' => $globalStats,
            'feedbackStats' => $feedbackStats
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

            // Notifier les participants uniquement si la séance est terminée et qu'ils étaient présents
            if ($seance->statut === 'terminée') {
                $presents = $seance->presences()
                    ->whereIn('statut', ['présent', 'retard'])
                    ->with('participant')
                    ->get()
                    ->pluck('participant');

                if ($presents->count() > 0) {
                    \Illuminate\Support\Facades\Notification::send($presents, new FeedbackRequiredNotification($seance));
                }
            }

            DB::commit();
            return back()->with('success', 'Questionnaire de feedback sauvegardé' . ($seance->statut === 'terminée' ? ' et participants notifiés.' : '.'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur lors de la sauvegarde : ' . $e->getMessage()]);
        }
    }

    public function results(Seance $seance)
    {
        $seance->load(['plan.entite', 'feedbackForm.questions.responses']);
        
        $form = $seance->feedbackForm;
        $submissions = $form ? $form->submissions()->with('participant')->get() : collect();
        $submissionCount = $submissions->count();

        // Calculer les moyennes pour les questions de type 'rating'
        $stats = $form ? $form->questions->map(function ($question) {
            if ($question->type === 'rating') {
                $question->average = $question->responses->avg('rating');
                $question->count = $question->responses->count();
            }
            return $question;
        }) : collect();

        return Inertia::render('Modules/Admin/Feedback/FeedbackResults', [
            'seance' => $seance,
            'stats' => $stats,
            'submissions' => $submissions,
            'submissionCount' => $submissionCount,
        ]);
    }

    public function togglePublish(FeedbackSubmission $submission)
    {
        $submission->update([
            'est_affiche_sur_plan' => !$submission->est_affiche_sur_plan
        ]);

        return back()->with('success', $submission->est_affiche_sur_plan ? 'Commentaire publié sur le plan.' : 'Commentaire retiré du plan.');
    }

    public function promoteTestimonial(FeedbackSubmission $submission)
    {
        $newState = !$submission->is_testimonial;

        $submission->update([
            'is_testimonial'  => $newState,
            'moderated_by'    => $newState ? Auth::id() : null,
            // Automatically publish it on the plan too
            'est_affiche_sur_plan' => $newState ? true : $submission->est_affiche_sur_plan,
        ]);

        $message = $newState
            ? '⭐ Témoignage validé et affiché sur le catalogue.'
            : 'Témoignage retiré du catalogue.';

        return back()->with('success', $message);
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

            // Notifier les participants uniquement si la séance est terminée et qu'ils étaient présents
            if ($seance->statut === 'terminée') {
                $presents = $seance->presences()
                    ->whereIn('statut', ['présent', 'retard'])
                    ->with('participant')
                    ->get()
                    ->pluck('participant');

                if ($presents->count() > 0) {
                    \Illuminate\Support\Facades\Notification::send($presents, new FeedbackRequiredNotification($seance));
                }
            }

            DB::commit();

            return back()->with('success', 'Évaluation standard activée' . ($seance->statut === 'terminée' ? ' et participants notifiés.' : '.'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur : ' . $e->getMessage()]);
        }
    }
}
