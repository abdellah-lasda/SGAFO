<?php

namespace App\Http\Controllers\Modules\Animateur;

use App\Http\Controllers\Controller;
use App\Models\PlanFormation;
use App\Models\PlanRessource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PlanRessourceController extends Controller
{
    /**
     * Check if the authenticated user is an animator for this plan.
     */
    private function checkAssignment(PlanFormation $plan)
    {
        $user = Auth::user();
        $isAssigned = $plan->seances()->whereHas('themes', function ($query) use ($user) {
            $query->where('seance_themes.formateur_id', $user->id);
        })->exists();

        if (!$isAssigned) {
            abort(403, "Vous n'êtes pas assigné à cette formation.");
        }
    }

    public function store(Request $request, PlanFormation $plan)
    {
        $this->checkAssignment($plan);

        $request->validate([
            'titre' => 'required|string|max:255',
            'type'  => 'required|in:file,link',
            'file'  => 'nullable|required_if:type,file|file|max:5120', // 5MB max
            'url'   => 'nullable|required_if:type,link|url',
        ]);

        $data = [
            'plan_formation_id' => $plan->id,
            'titre' => $request->titre,
            'type' => $request->type,
        ];

        if ($request->type === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('formations/ressources', 'public');
            
            $data['path'] = $path;
            $data['extension'] = $file->getClientOriginalExtension();
            $data['size'] = $file->getSize();
        } else {
            $data['path'] = $request->url;
        }

        PlanRessource::create($data);

        return back()->with('success', 'Ressource globale ajoutée avec succès.');
    }

    public function update(Request $request, PlanRessource $ressource)
    {
        $this->checkAssignment($ressource->plan);

        $request->validate([
            'titre' => 'required|string|max:255',
            'url'   => 'nullable|url|required_if:type,link',
        ]);

        $ressource->update(['titre' => $request->titre]);

        if ($ressource->type === 'link') {
            $ressource->update(['path' => $request->url]);
        }

        return back()->with('success', 'Ressource globale mise à jour.');
    }

    public function destroy(PlanRessource $ressource)
    {
        $this->checkAssignment($ressource->plan);

        if ($ressource->type === 'file') {
            Storage::disk('public')->delete($ressource->path);
        }

        $ressource->delete();

        return back()->with('success', 'Ressource globale supprimée.');
    }
}
