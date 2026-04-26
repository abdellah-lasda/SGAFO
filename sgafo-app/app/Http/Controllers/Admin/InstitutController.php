<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institut;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $instituts = Institut::with('region')
            ->when($search, function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('ville', 'like', "%{$search}%");
            })
            ->orderBy('nom')
            ->paginate(12)
            ->withQueryString();

        $regions = Region::orderBy('nom')->get();

        return Inertia::render('Admin/Instituts/Index', [
            'instituts' => $instituts,
            'regions' => $regions,
            'filters' => $request->only(['search']),
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
        return redirect()->back()->with('success', 'Établissement créé.');
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
        return redirect()->back()->with('success', 'Établissement mis à jour.');
    }

    public function destroy(Institut $institut)
    {
        try {
            $institut->delete();
            return redirect()->back()->with('success', 'Établissement supprimé.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Impossible de supprimer cet établissement (données liées).');
        }
    }
}
