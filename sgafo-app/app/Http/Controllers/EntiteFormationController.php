<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\EntiteFormation;
use App\Models\Secteur;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EntiteFormationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $query = EntiteFormation::with(['secteur', 'createur', 'themes']);

        // Logique de filtrage (À affiner selon les rôles)
        // Les CDC ne voient que les formations de leurs secteurs ? 
        // Pour l'instant on affiche tout le catalogue national
        
        return Inertia::render('Modules/Entites/Index', [
            'entites' => $query->latest()->get(),
            'secteurs' => Secteur::all(),
            'auth' => [
                'user' => $user,
                'roles' => $user->roles->pluck('code'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:200',
            'type' => 'required|in:technique,pedagogique,manageriale,transversale',
            'mode' => 'required|in:présentiel,distance,hybride',
            'secteur_id' => 'required|exists:secteurs,id',
            'description' => 'nullable|string',
            'objectifs' => 'required|string',
            'themes' => 'required|array|min:1',
            'themes.*.titre' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
        ]);

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
        $validated = $request->validate([
            'titre' => 'required|string|max:200',
            'type' => 'required|in:technique,pedagogique,manageriale,transversale',
            'mode' => 'required|in:présentiel,distance,hybride',
            'secteur_id' => 'required|exists:secteurs,id',
            'description' => 'nullable|string',
            'objectifs' => 'required|string',
            'themes' => 'required|array|min:1',
            'themes.*.id' => 'nullable|exists:entite_themes,id',
            'themes.*.titre' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $entite) {
            $entite->update($validated);

            // Sync Themes
            $entite->themes()->delete();
            foreach ($validated['themes'] as $themeData) {
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
}
