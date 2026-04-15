<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Institut;
use App\Models\Region;
use App\Models\SiteFormation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogistiqueController extends Controller
{
    /**
     * Display a listing of hotels and formation sites.
     */
    public function index()
    {
        return Inertia::render('Modules/Logistique/Index', [
            'hotels' => Hotel::with('region')->orderBy('created_at', 'desc')->get(),
            'sites' => SiteFormation::with('region')->orderBy('nom')->get(),
            'instituts' => Institut::with('region')->orderBy('nom')->get(),
            'regions' => Region::orderBy('nom')->get(),
        ]);
    }

    /**
     * Store a newly created hotel in storage.
     */
    public function storeHotel(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'region_id' => 'required|exists:regions,id',
            'prix_nuitee' => 'required|numeric|min:0',
        ]);

        Hotel::create($validated);

        return redirect()->back()->with('success', 'Hôtel ajouté avec succès.');
    }

    /**
     * Update the specified hotel in storage.
     */
    public function updateHotel(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'region_id' => 'required|exists:regions,id',
            'prix_nuitee' => 'required|numeric|min:0',
        ]);

        $hotel->update($validated);

        return redirect()->back()->with('success', 'Hôtel mis à jour avec succès.');
    }

    /**
     * Toggle the status of the hotel.
     */
    public function archiveHotel(Hotel $hotel)
    {
        $newStatut = $hotel->statut === 'actif' ? 'archivé' : 'actif';
        $hotel->update(['statut' => $newStatut]);

        return redirect()->back()->with('success', "Statut de l'hôtel mis à jour.");
    }

    /**
     * Update the training site (Institut) information.
     */
    public function updateInstitut(Request $request, Institut $institut)
    {
        $validated = $request->validate([
            'adresse' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
        ]);

        $institut->update($validated);

        return redirect()->back()->with('success', 'Informations du site mises à jour.');
    }

    /**
     * Store a newly created formation site.
     */
    public function storeSite(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'capacite' => 'required|integer|min:0',
            'region_id' => 'required|exists:regions,id',
        ]);

        SiteFormation::create($validated);

        return redirect()->back()->with('success', 'Site de formation ajouté avec succès.');
    }

    /**
     * Update the specified formation site.
     */
    public function updateSite(Request $request, SiteFormation $site)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'capacite' => 'required|integer|min:0',
            'region_id' => 'required|exists:regions,id',
        ]);

        $site->update($validated);

        return redirect()->back()->with('success', 'Site de formation mis à jour avec succès.');
    }

    /**
     * Toggle the status of the formation site.
     */
    public function archiveSite(SiteFormation $site)
    {
        $newStatut = $site->statut === 'actif' ? 'archivé' : 'actif';
        $site->update(['statut' => $newStatut]);

        return redirect()->back()->with('success', "Statut du site mis à jour.");
    }
}
