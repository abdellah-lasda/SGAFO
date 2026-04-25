<?php

namespace App\Http\Controllers\Modules\Animateur;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\Qcm;
use App\Models\QcmQuestion;
use App\Models\QcmOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Modules\Animateur\StoreQcmStructureRequest;

class QcmAnimateurController extends Controller
{
    /**
     * Vérifie que le formateur connecté est bien assigné à la séance.
     */
    private function checkAssignment(Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) abort(403, "Vous n'êtes pas assigné à cette séance.");
    }

    /**
     * Store a newly created QCM in storage.
     */
    public function store(Request $request, Seance $seance)
    {
        $this->checkAssignment($seance);

        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duree_minutes' => 'nullable|integer|min:1',
        ]);

        $qcm = Qcm::create([
            'seance_id' => $seance->id,
            'titre' => $request->titre,
            'description' => $request->description,
            'duree_minutes' => $request->duree_minutes,
            'est_publie' => false,
        ]);

        // Redirige vers l'interface d'édition du QCM
        return redirect()->route('modules.animateur.qcms.edit', $qcm->id)->with('success', 'QCM créé. Vous pouvez maintenant ajouter des questions.');
    }

    /**
     * Show the form for editing the specified QCM.
     */
    public function edit(Qcm $qcm)
    {
        $seance = $qcm->seance;
        $this->checkAssignment($seance);

        $seance->load('plan.entite');
        $qcm->load(['questions.options']);

        return Inertia::render('Modules/Animateur/QcmBuilder', [
            'seance' => $seance,
            'qcm' => $qcm,
        ]);
    }

    /**
     * Update the specified QCM metadata in storage.
     */
    public function update(Request $request, Qcm $qcm)
    {
        $this->checkAssignment($qcm->seance);

        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duree_minutes' => 'nullable|integer|min:1',
            'est_publie' => 'boolean',
        ]);

        $qcm->update($request->only('titre', 'description', 'duree_minutes', 'est_publie'));

        return back()->with('success', 'Paramètres du QCM mis à jour.');
    }

    /**
     * Remove the specified QCM from storage.
     */
    public function destroy(Qcm $qcm)
    {
        $this->checkAssignment($qcm->seance);
        $qcm->delete();

        return redirect()->route('modules.animateur.seances.preparation', $qcm->seance_id)->with('success', 'QCM supprimé.');
    }

    /**
     * API: Save the full QCM structure (questions and options)
     */
    public function saveStructure(StoreQcmStructureRequest $request, Qcm $qcm)
    {
        $this->checkAssignment($qcm->seance);

        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $questionIdsToKeep = [];

            foreach ($request->questions as $qData) {
                // Update or create question
                $question = $qcm->questions()->updateOrCreate(
                    ['id' => $qData['id'] ?? null],
                    [
                        'texte' => $qData['texte'],
                        'type' => $qData['type'],
                        'points' => $qData['points'],
                        'ordre' => $qData['ordre'],
                    ]
                );
                
                $questionIdsToKeep[] = $question->id;
                $optionIdsToKeep = [];

                foreach ($qData['options'] as $oData) {
                    // Update or create option
                    $option = $question->options()->updateOrCreate(
                        ['id' => $oData['id'] ?? null],
                        [
                            'texte' => $oData['texte'],
                            'est_correcte' => $oData['est_correcte'],
                        ]
                    );
                    $optionIdsToKeep[] = $option->id;
                }

                // Delete removed options
                $question->options()->whereNotIn('id', $optionIdsToKeep)->delete();
            }

            // Delete removed questions
            $qcm->questions()->whereNotIn('id', $questionIdsToKeep)->delete();

            DB::commit();
            return back()->with('success', 'Questions sauvegardées avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur lors de la sauvegarde : ' . $e->getMessage()]);
        }
    }
}
