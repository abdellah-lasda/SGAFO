<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cdc;
use App\Models\Metier;
use App\Models\Secteur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class DomaineController extends Controller
{
    public function index()
    {
        $cdcs = Cdc::orderBy('nom')->get();
        // Load secteurs with their CDC
        $secteurs = Secteur::with('cdc')->orderBy('nom')->get();
        // Load metiers with their secteur and CDC
        $metiers = Metier::with('secteur.cdc')->orderBy('nom')->get();

        return Inertia::render('Admin/Domaines/Index', [
            'cdcs' => $cdcs,
            'secteurs' => $secteurs,
            'metiers' => $metiers,
        ]);
    }

    // --- CDC Management ---
    public function storeCdc(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:cdcs,code',
            'description' => 'nullable|string',
        ]);

        Cdc::create($validated);
        return redirect()->back()->with('success', 'CDC (Domaine) créé avec succès.');
    }

    public function updateCdc(Request $request, Cdc $cdc)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:cdcs,code,' . $cdc->id,
            'description' => 'nullable|string',
        ]);

        $cdc->update($validated);
        return redirect()->back()->with('success', 'CDC mis à jour avec succès.');
    }

    public function destroyCdc(Cdc $cdc)
    {
        try {
            $cdc->delete();
            return redirect()->back()->with('success', 'CDC supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Impossible de supprimer ce CDC (enregistrements liés existants).');
        }
    }

    // --- Secteur Management ---
    public function storeSecteur(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:secteurs,code',
            'cdc_id' => 'required|exists:cdcs,id',
        ]);

        Secteur::create($validated);
        return redirect()->back()->with('success', 'Secteur créé avec succès.');
    }

    public function updateSecteur(Request $request, Secteur $secteur)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:secteurs,code,' . $secteur->id,
            'cdc_id' => 'required|exists:cdcs,id',
        ]);

        $secteur->update($validated);
        return redirect()->back()->with('success', 'Secteur mis à jour avec succès.');
    }

    public function destroySecteur(Secteur $secteur)
    {
        try {
            $secteur->delete();
            return redirect()->back()->with('success', 'Secteur supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Impossible de supprimer ce Secteur (enregistrements liés existants).');
        }
    }

    // --- Metier Management ---
    public function storeMetier(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'nullable|string|max:20|unique:metiers,code',
            'secteur_id' => 'required|exists:secteurs,id',
        ]);

        Metier::create($validated);
        return redirect()->back()->with('success', 'Métier créé avec succès.');
    }

    public function updateMetier(Request $request, Metier $metier)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'nullable|string|max:20|unique:metiers,code,' . $metier->id,
            'secteur_id' => 'required|exists:secteurs,id',
        ]);

        $metier->update($validated);
        return redirect()->back()->with('success', 'Métier mis à jour avec succès.');
    }

    public function destroyMetier(Metier $metier)
    {
        try {
            $metier->delete();
            return redirect()->back()->with('success', 'Métier supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Impossible de supprimer ce Métier.');
        }
    }
}
