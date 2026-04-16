<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institut;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutController extends Controller
{
    public function index()
    {
        $instituts = Institut::with('region')->orderBy('nom')->get();
        $regions = Region::orderBy('nom')->get();

        return Inertia::render('Admin/Instituts/Index', [
            'instituts' => $instituts,
            'regions' => $regions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:200',
            'code' => 'nullable|string|max:50|unique:instituts,code',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'region_id' => 'nullable|exists:regions,id',
        ]);

        Institut::create($validated);

        return redirect()->back()->with('success', 'Établissement créé avec succès.');
    }

    public function update(Request $request, Institut $institut)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:200',
            'code' => 'nullable|string|max:50|unique:instituts,code,' . $institut->id,
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'region_id' => 'nullable|exists:regions,id',
        ]);

        $institut->update($validated);

        return redirect()->back()->with('success', 'Établissement mis à jour avec succès.');
    }

    public function destroy(Institut $institut)
    {
        try {
            $institut->delete();
            return redirect()->back()->with('success', 'Établissement supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Impossible de supprimer cet établissement car il est lié à d\'autres enregistrements.');
        }
    }
}
