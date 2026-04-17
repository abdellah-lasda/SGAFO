<?php

namespace App\Http\Controllers;

use App\Models\PlanFormation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PlanValidationController extends Controller
{
    /**
     * Affiche l'inbox de validation pour le Responsable de Formation.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Vérification de sécurité de base (normalement gérée par middleware/policy)
        if (!$user->hasRole('RF')) {
            abort(403, 'Accès réservé aux Responsables de Formation.');
        }

        $secteurIds = $user->secteurs()->pluck('secteurs.id')->toArray();
        $statut = $request->input('statut', 'soumis'); // Par défaut on montre ce qui est à traiter

        $query = PlanFormation::with(['entite.secteur', 'createur', 'themes'])
            ->whereHas('entite', function ($q) use ($secteurIds) {
                $q->whereIn('secteur_id', $secteurIds);
            });

        if ($statut === 'soumis') {
            $query->where('statut', 'soumis');
        } elseif ($statut === 'planning') {
            $query->whereIn('statut', ['validé', 'confirmé']);
        } elseif ($statut === 'historique') {
            $query->whereIn('statut', ['validé', 'rejeté', 'confirmé']);
        }

        $plans = $query->latest('date_soumission')->get();

        // Calcul des stats pour le dashboard RF
        $stats = [
            'pending_count' => PlanFormation::where('statut', 'soumis')
                ->whereHas('entite', function ($q) use ($secteurIds) {
                    $q->whereIn('secteur_id', $secteurIds);
                })->count(),
            'validated_this_month' => PlanFormation::where('statut', 'validé')
                ->whereMonth('date_validation', now()->month)
                ->whereHas('entite', function ($q) use ($secteurIds) {
                    $q->whereIn('secteur_id', $secteurIds);
                })->count(),
            'my_secteurs' => $user->secteurs->pluck('nom')->join(', '),
        ];

        return Inertia::render('Modules/Validations/Index', [
            'plans' => $plans,
            'stats' => $stats,
            'filters' => [
                'statut' => $statut
            ]
        ]);
    }
}
