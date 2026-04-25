<?php

namespace App\Http\Controllers\Modules\Animateur;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\SeanceRessource;
use Illuminate\Http\Request;
use App\Http\Requests\Modules\Animateur\StoreRessourceRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SeancePedagogiqueController extends Controller
{
    public function edit(Seance $seance)
    {
        $user = Auth::user();

        // Vérifier l'assignation
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();

        if (!$isAssigned) {
            abort(403, "Vous n'êtes pas assigné à cette séance.");
        }

        $seance->refresh(); // Forcer la lecture de la DB
        $seance->load(['plan.entite', 'site', 'themes', 'ressources', 'qcms']);

        return Inertia::render('Modules/Animateur/SeancePreparation', [
            'seance' => $seance
        ]);
    }

    public function updateDescription(Request $request, Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) abort(403);

        \Log::info("Mise à jour description séance {$seance->id}", $request->all());

        $request->validate([
            'description' => 'nullable|string'
        ]);

        $seance->update([
            'description' => $request->description
        ]);

        return back()->with('success', 'Description mise à jour.');
    }

    public function addResource(StoreRessourceRequest $request, Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) abort(403);

        \Log::info("Ajout ressource séance {$seance->id}", $request->all());

        $validated = $request->validated();

        $data = [
            'seance_id' => $seance->id,
            'titre' => $request->titre,
            'type' => $request->type,
        ];

        if ($request->type === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('seances/ressources', 'public');
            
            $data['path'] = $path;
            $data['extension'] = $file->getClientOriginalExtension();
            $data['size'] = $file->getSize();
        } else {
            $data['path'] = $request->url;
        }

        SeanceRessource::create($data);

        return back()->with('success', 'Ressource ajoutée.');
    }

    public function updateResource(Request $request, SeanceRessource $ressource)
    {
        $user = Auth::user();
        $isAssigned = $ressource->seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) abort(403);

        $request->validate([
            'titre' => 'required|string|max:255',
            'url'   => 'nullable|url|required_if:type,link',
        ]);

        $ressource->update(['titre' => $request->titre]);

        // Si c'est un lien, on met à jour le path
        if ($ressource->type === 'link') {
            $ressource->update(['path' => $request->url]);
        }

        return back()->with('success', 'Ressource mise à jour.');
    }

    public function deleteResource(SeanceRessource $ressource)
    {
        $user = Auth::user();
        // Vérifier que l'animateur est bien celui de la séance parente
        $isAssigned = $ressource->seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) abort(403);

        if ($ressource->type === 'file') {
            Storage::disk('public')->delete($ressource->path);
        }

        $ressource->delete();

        return back()->with('success', 'Ressource supprimée.');
    }
}
