<?php
namespace App\Http\Controllers\Modules\Participant;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\FeedbackForm;
use App\Models\FeedbackSubmission;
use App\Models\FeedbackResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FeedbackParticipantController extends Controller
{
    public function show(Seance $seance)
    {
        $seance->load(['plan.entite', 'feedbackForm.questions']);
        
        $user = Auth::user();
        
        // Vérifier si le participant est bien assigné au plan
        $isParticipant = $seance->plan->participants()->where('participant_id', $user->id)->exists();
        if (!$isParticipant) abort(403, "Vous ne participez pas à cette formation.");

        // Vérifier si une soumission existe déjà
        if ($seance->feedbackForm) {
            $hasSubmitted = FeedbackSubmission::where('feedback_form_id', $seance->feedbackForm->id)
                ->where('participant_id', $user->id)
                ->exists();
            
            if ($hasSubmitted) {
                return redirect()->route('participant.seance.show', $seance->id)->with('error', 'Vous avez déjà évalué cette séance.');
            }
        } else {
            return redirect()->route('participant.seance.show', $seance->id)->with('error', 'Aucun questionnaire disponible.');
        }

        return Inertia::render('Modules/Participant/Feedback/FeedbackForm', [
            'seance' => $seance,
            'feedbackForm' => $seance->feedbackForm,
        ]);
    }

    public function submit(Request $request, Seance $seance)
    {
        $form = $seance->feedbackForm;
        if (!$form) abort(404);

        $user = Auth::user();

        $request->validate([
            'responses' => 'required|array',
            'responses.*.question_id' => 'required|exists:feedback_questions,id',
            'responses.*.rating' => 'nullable|integer|min:1|max:5',
            'responses.*.answer_text' => 'nullable|string',
            'commentaire_general' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $submission = FeedbackSubmission::create([
                'feedback_form_id' => $form->id,
                'participant_id' => $user->id,
                'plan_id' => $seance->plan_id,
                'seance_id' => $seance->id,
                'commentaire_general' => $request->commentaire_general,
                'est_affiche_sur_plan' => false,
            ]);

            foreach ($request->responses as $respData) {
                FeedbackResponse::create([
                    'feedback_submission_id' => $submission->id,
                    'question_id' => $respData['question_id'],
                    'rating' => $respData['rating'] ?? null,
                    'answer_text' => $respData['answer_text'] ?? null,
                ]);
            }

            DB::commit();
            return redirect()->route('participant.seance.show', $seance->id)->with('success', 'Merci pour votre évaluation !');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur lors de la soumission : ' . $e->getMessage()]);
        }
    }
}
