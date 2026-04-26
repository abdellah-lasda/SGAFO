<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\SiteFormation;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogistiqueController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $sites = SiteFormation::with('region')
            ->when($search, function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('ville', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10, ['*'], 'sites_page')
            ->withQueryString();

        $hotels = Hotel::with('region')
            ->when($search, function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('ville', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10, ['*'], 'hotels_page')
            ->withQueryString();

        return Inertia::render('Admin/Logistique/Index', [
            'sites' => $sites,
            'hotels' => $hotels,
            'regions' => Region::all(),
            'filters' => $request->only(['search']),
        ]);
    }

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
        return redirect()->back()->with('success', 'Site ajouté avec succès.');
    }

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
        return redirect()->back()->with('success', 'Site mis à jour.');
    }

    public function destroySite(SiteFormation $site)
    {
        $site->delete();
        return redirect()->back()->with('success', 'Site supprimé.');
    }

    public function storeHotel(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'prix_nuitee' => 'required|numeric|min:0',
            'region_id' => 'required|exists:regions,id',
        ]);

        Hotel::create($validated);
        return redirect()->back()->with('success', 'Hôtel ajouté.');
    }

    public function destroyHotel(Hotel $hotel)
    {
        $hotel->delete();
        return redirect()->back()->with('success', 'Hôtel supprimé.');
    }
}
