<?php

namespace App\Http\Controllers\Modules\Participant;

use App\Http\Controllers\Controller;
use App\Models\Qcm;
use App\Models\QcmTentative;
use App\Models\QcmReponse;
use App\Models\QcmOption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class QcmController extends Controller
{
    public function show(Qcm $qcm)
    {
        // Vérifier que la séance a commencé
        $seance = $qcm->seance;
        $now = Carbon::now();
        $seanceStart = Carbon::parse($seance->date->format('Y-m-d') . ' ' . $seance->debut);

        if ($now->lessThan($seanceStart)) {
            return redirect()->back()->with('error', "Ce QCM ne sera accessible qu'à partir de " . $seance->debut);
        }

        // Load QCM with questions and options
        $qcm->load(['questions.options']);

        return Inertia::render('Modules/Participant/Qcm/Passage', [
            'qcm' => $qcm,
        ]);
    }

    public function submit(Request $request, Qcm $qcm)
    {
        $request->validate([
            'reponses' => 'required|array',
            'duree_secondes' => 'required|integer',
        ]);

        $qcm->load('questions.options');
        $user = Auth::user();
        $totalPoints = 0;
        $scoreObtenu = 0;

        // Create the tentative
        $tentative = QcmTentative::create([
            'user_id' => $user->id,
            'qcm_id' => $qcm->id,
            'commence_le' => Carbon::now()->subSeconds($request->duree_secondes),
            'termine_le' => Carbon::now(),
            'duree_secondes' => $request->duree_secondes,
        ]);

        foreach ($qcm->questions as $question) {
            $totalPoints += $question->points;
            $reponseUser = $request->reponses[$question->id] ?? [];
            
            // Check if correct
            $correctOptions = $question->options->where('est_correcte', true)->pluck('id')->toArray();
            
            $estCorrecte = false;
            if ($question->type === 'unique') {
                $estCorrecte = count($reponseUser) === 1 && in_array($reponseUser[0], $correctOptions);
            } else {
                // For multiple, must match exactly
                sort($reponseUser);
                sort($correctOptions);
                $estCorrecte = $reponseUser === $correctOptions;
            }

            $pointsGagnes = $estCorrecte ? $question->points : 0;
            $scoreObtenu += $pointsGagnes;

            QcmReponse::create([
                'tentative_id' => $tentative->id,
                'question_id' => $question->id,
                'options_selectionnees' => $reponseUser,
                'est_correcte' => $estCorrecte,
                'points_obtenus' => $pointsGagnes,
            ]);
        }

        $tentative->update([
            'score' => $scoreObtenu,
            'total_points' => $totalPoints,
        ]);

        return redirect()->route('participant.qcm.resultat', $tentative->id);
    }

    public function resultat(QcmTentative $tentative)
    {
        $tentative->load(['qcm', 'reponses.question.options']);

        return Inertia::render('Modules/Participant/Qcm/Resultat', [
            'tentative' => $tentative,
        ]);
    }
}
