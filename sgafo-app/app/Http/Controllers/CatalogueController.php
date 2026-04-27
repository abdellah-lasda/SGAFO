<?php

namespace App\Http\Controllers;

use App\Models\PlanFormation;
use App\Models\Secteur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogueController extends Controller
{
    /**
     * Affiche le Catalogue National (Plans validés par le RF).
     */
    public function index(Request $request)
    {
        $query = PlanFormation::with(['entite.secteur', 'createur', 'siteFormation', 'themes'])
            ->where('statut', 'validé'); // Uniquement les plans officiels et publics

        // Filtre par secteur
        if ($request->filled('secteur')) {
            $query->whereHas('entite', function($q) use ($request) {
                $q->where('secteur_id', $request->secteur);
            });
        }

        // Filtre par recherche
        if ($request->filled('search')) {
            $query->where('titre', 'like', '%' . $request->search . '%')
                  ->orWhereHas('entite', function($q) use ($request) {
                      $q->where('titre', 'like', '%' . $request->search . '%');
                  });
        }

        return Inertia::render('Modules/Catalogue/Index', [
            'plans' => $query->latest('date_validation')->get(),
            'secteurs' => Secteur::all(),
            'filters' => $request->only(['search', 'secteur'])
        ]);
    }

    /**
     * Affiche les détails d'un plan du catalogue.
     */
    public function show(PlanFormation $plan)
    {
        if ($plan->statut !== 'validé') {
            abort(404);
        }

        $plan->load([
            'entite.secteur',
            'themes.animateurs.instituts',
            'participants.instituts',
            'siteFormation',
            'createur',
            'validateur',
            'hebergements.hotel',
            'hebergements.user',
            'seances.themes',
            'seances.site',
            'feedbackSubmissions' => function($q) {
                $q->where('est_affiche_sur_plan', true)->with('participant');
            }
        ]);

        return Inertia::render('Modules/Catalogue/Show', [
            'plan' => $plan
        ]);
    }
}
