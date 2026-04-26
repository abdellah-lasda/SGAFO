<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cdc;
use App\Models\Metier;
use App\Models\Secteur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DomaineController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $cdcs = Cdc::orderBy('nom')->get();
        
        // On pagine les secteurs qui regroupent les métiers
        $secteurs = Secteur::with(['cdc', 'metiers'])
            ->when($search, function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('nom')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Domaines/Index', [
            'cdcs' => $cdcs,
            'secteurs' => $secteurs,
            'filters' => $request->only(['search']),
        ]);
    }

    public function storeCdc(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:cdcs,code',
            'description' => 'nullable|string',
        ]);

        Cdc::create($validated);
        return redirect()->back()->with('success', 'Domaine (CDC) créé.');
    }

    public function updateCdc(Request $request, Cdc $cdc)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:cdcs,code,' . $cdc->id,
            'description' => 'nullable|string',
        ]);

        $cdc->update($validated);
        return redirect()->back()->with('success', 'Domaine mis à jour.');
    }

    public function destroyCdc(Cdc $cdc)
    {
        try {
            $cdc->delete();
            return redirect()->back()->with('success', 'Domaine supprimé.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Impossible de supprimer ce Domaine (données liées).');
        }
    }

    public function storeSecteur(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:secteurs,code',
            'cdc_id' => 'required|exists:cdcs,id',
        ]);

        Secteur::create($validated);
        return redirect()->back()->with('success', 'Secteur créé.');
    }

    public function updateSecteur(Request $request, Secteur $secteur)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'required|string|max:20|unique:secteurs,code,' . $secteur->id,
            'cdc_id' => 'required|exists:cdcs,id',
        ]);

        $secteur->update($validated);
        return redirect()->back()->with('success', 'Secteur mis à jour.');
    }

    public function destroySecteur(Secteur $secteur)
    {
        try {
            $secteur->delete();
            return redirect()->back()->with('success', 'Secteur supprimé.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Impossible de supprimer ce Secteur.');
        }
    }

    public function storeMetier(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'code' => 'nullable|string|max:20|unique:metiers,code',
            'secteur_id' => 'required|exists:secteurs,id',
        ]);

        Metier::create($validated);
        return redirect()->back()->with('success', 'Métier créé.');
    }

    public function destroyMetier(Metier $metier)
    {
        $metier->delete();
        return redirect()->back()->with('success', 'Métier supprimé.');
    }
}
