<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\EntiteFormation;
use App\Models\Secteur;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class EntiteFormationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $query = EntiteFormation::with(['secteur', 'createur', 'themes'])
            ->where('cree_par_id', $user->id); // Isolation locale

        return Inertia::render('Modules/Entites/Index', [
            'entites' => $query->latest()->get(),
            'secteurs' => Secteur::all(),
        ]);
    }

    public function store(Request $request)
    {
        $messages = [
            'titre.required' => 'L\'intitulé de la formation est obligatoire.',
            'titre.unique' => 'Une formation avec cet intitulé existe déjà dans le référentiel.',
            'type.required' => 'Le type de formation est obligatoire.',
            'mode.required' => 'Le mode d\'apprentissage est obligatoire.',
            'secteur_id.required' => 'Veuillez sélectionner un secteur.',
            'description.min' => 'La description doit faire au moins 30 caractères.',
            'objectifs.required' => 'Les objectifs de la formation sont obligatoires.',
            'objectifs.min' => 'Les objectifs doivent faire au moins 30 caractères.',
            'themes.required' => 'Vous devez ajouter au moins un thème/module.',
            'themes.min' => 'Vous devez ajouter au moins un thème/module.',
            'themes.*.titre.required' => 'L\'intitulé du thème est obligatoire.',
            'themes.*.duree_heures.required' => 'La durée est obligatoire.',
            'themes.*.duree_heures.numeric' => 'La durée doit être un nombre.',
            'themes.*.duree_heures.min' => 'La durée minimum est de 30 minutes (0.5).',
        ];

        $validated = $request->validate([
            'titre' => 'required|string|max:200|unique:entite_formations,titre',
            'type' => 'required|in:technique,pedagogique,manageriale,transversale',
            'mode' => 'required|in:présentiel,distance,hybride',
            'secteur_id' => 'required|exists:secteurs,id',
            'description' => 'nullable|string|min:30',
            'objectifs' => 'required|string|min:30',
            'themes' => 'required|array|min:1',
            'themes.*.titre' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
        ], $messages);

        return DB::transaction(function () use ($validated) {
            $entite = EntiteFormation::create([
                'titre' => $validated['titre'],
                'type' => $validated['type'],
                'mode' => $validated['mode'],
                'secteur_id' => $validated['secteur_id'],
                'description' => $validated['description'],
                'objectifs' => $validated['objectifs'],
                'cree_par_id' => auth()->id(),
            ]);

            foreach ($validated['themes'] as $themeData) {
                $entite->themes()->create($themeData);
            }

            return redirect()->back()->with('success', 'Entité de formation créée avec succès.');
        });
    }

    public function update(Request $request, EntiteFormation $entite)
    {
        $messages = [
            'titre.required' => 'L\'intitulé de la formation est obligatoire.',
            'titre.unique' => 'Une formation avec cet intitulé existe déjà dans le référentiel.',
            'type.required' => 'Le type de formation est obligatoire.',
            'mode.required' => 'Le mode d\'apprentissage est obligatoire.',
            'secteur_id.required' => 'Veuillez sélectionner un secteur.',
            'description.min' => 'La description doit faire au moins 30 caractères.',
            'objectifs.required' => 'Les objectifs de la formation sont obligatoires.',
            'objectifs.min' => 'Les objectifs doivent faire au moins 30 caractères.',
            'themes.required' => 'Vous devez ajouter au moins un thème/module.',
            'themes.min' => 'Vous devez ajouter au moins un thème/module.',
            'themes.*.titre.required' => 'L\'intitulé du thème est obligatoire.',
            'themes.*.duree_heures.required' => 'La durée est obligatoire.',
            'themes.*.duree_heures.numeric' => 'La durée doit être un nombre.',
            'themes.*.duree_heures.min' => 'La durée minimum est de 30 minutes (0.5).',
        ];

        $validated = $request->validate([
            'titre' => 'required|string|max:200|unique:entite_formations,titre,' . $entite->id,
            'type' => 'required|in:technique,pedagogique,manageriale,transversale',
            'mode' => 'required|in:présentiel,distance,hybride',
            'secteur_id' => 'required|exists:secteurs,id',
            'description' => 'nullable|string|min:30',
            'objectifs' => 'required|string|min:30',
            'themes' => 'required|array|min:1',
            'themes.*.id' => 'nullable|exists:entite_themes,id',
            'themes.*.titre' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
        ], $messages);

        return DB::transaction(function () use ($validated, $entite) {
            $entite->update($validated);

            // Sync Themes
            $entite->themes()->delete();
            foreach ($validated['themes'] as $themeData) {
                unset($themeData['id']); // On recrée tout pour simplifier la synchro
                $entite->themes()->create($themeData);
            }

            return redirect()->back()->with('success', 'Entité mise à jour avec succès.');
        });
    }

    public function show(EntiteFormation $entite)
    {
        return Inertia::render('Modules/Entites/Show', [
            'entite' => $entite->load(['themes', 'secteur', 'createur']),
        ]);
    }

    public function destroy(EntiteFormation $entite)
    {
        $entite->update(['statut' => 'archivé']);
        return redirect()->back()->with('success', 'Entité archivée.');
    }

    public function exportPdf(EntiteFormation $entite)
    {
        $entite->load(['themes', 'secteur']);
        
        $pdf = Pdf::loadView('pdf.entite', compact('entite'));
        
        $filename = 'Fiche_Descriptive_' . str_replace(' ', '_', $entite->titre) . '.pdf';
        
        return $pdf->download($filename);
    }
}
