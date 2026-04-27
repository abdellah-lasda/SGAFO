<?php 
namespace App\Http\Controllers\Modules\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\FeedbackForm;
use App\Models\FeedbackQuestion;
use App\Models\FeedbackSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FeedbackAdminController extends Controller
{
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
}
