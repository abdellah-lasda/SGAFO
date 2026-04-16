<?php

namespace App\Http\Controllers;

use App\Models\PlanFormation;
use App\Models\PlanTheme;
use App\Models\EntiteFormation;
use App\Models\Secteur;
use App\Models\SiteFormation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Log;

class PlanFormationController extends Controller
{
    /**
     * Liste des plans de formation avec filtrage par statut.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = PlanFormation::with(['entite.secteur', 'createur', 'validateur', 'themes']);
        

        // Filtre par statut
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return Inertia::render('Modules/Plans/Index', [
            'plans' => $query->latest()->get(),
            'filtreStatut' => $request->statut,
        ]);
    }

    /**
     * Page du stepper de création (vide).
     */
    public function create()
    {
        $entites = EntiteFormation::with(['secteur', 'themes', 'createur'])
                            ->where('statut', 'actif')->where('cree_par_id', auth()->id())
                            ->latest()
                            ->get();

        return Inertia::render('Modules/Plans/Create', [
            'entites' => $entites,
            'secteurs' => Secteur::all(),
            'sites' => SiteFormation::where('statut', 'actif')->get(),
            'formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
                                ->where('statut', 'actif')
                                ->with(['instituts.region', 'regions'])
                                ->get(),
        ]);
    }

    /**
     * Sauvegarde initiale du plan en brouillon (Étape 1 → données de base).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'entite_id' => 'required|exists:entite_formations,id',
            'titre' => 'required|string|max:200',
            'themes' => 'required|array|min:1',
            'themes.*.nom' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
            'themes.*.ordre' => 'required|integer|min:1',
            'themes.*.animateur_ids' => 'nullable|array',
            'themes.*.animateur_ids.*' => 'exists:users,id',
            'participant_ids' => 'nullable|array',
            'participant_ids.*' => 'exists:users,id',
            'site_formation_id' => 'nullable|exists:sites_formation,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $plan = PlanFormation::create([
                'entite_id' => $validated['entite_id'],
                'titre' => $validated['titre'],
                'statut' => 'brouillon',
                'cree_par' => auth()->id(),
                'site_formation_id' => $validated['site_formation_id'] ?? null,
            ]);

            // Créer les thèmes et leurs animateurs
            foreach ($validated['themes'] as $themeData) {
                $theme = $plan->themes()->create([
                    'nom' => $themeData['nom'],
                    'duree_heures' => $themeData['duree_heures'],
                    'objectifs' => $themeData['objectifs'] ?? null,
                    'ordre' => $themeData['ordre'],
                ]);

                if (!empty($themeData['animateur_ids'])) {
                    $theme->animateurs()->sync($themeData['animateur_ids']);
                }
            }

            // Ajouter les participants
            if (!empty($validated['participant_ids'])) {
                $participantData = [];
                foreach ($validated['participant_ids'] as $pid) {
                    $participantData[$pid] = [
                        'added_by' => auth()->id(),
                        'added_at' => now(),
                    ];
                }
                $plan->participants()->sync($participantData);
            }

            return redirect()->route('modules.plans.show', $plan)
                           ->with('success', 'Plan créé en brouillon.');
        });
    }

    /**
     * Reprendre le stepper d'un plan existant (brouillon ou rejeté).
     */
    public function edit(PlanFormation $plan)
    {
        $plan->load([
            'entite.secteur',
            'entite.themes',
            'themes.animateurs',
            'participants',
            'siteFormation',
            'createur',
        ]);

        return Inertia::render('Modules/Plans/Create', [
            'plan' => $plan,
            'entites' => EntiteFormation::with(['secteur', 'themes', 'createur'])
                            ->where('statut', 'actif')
                            ->latest()
                            ->get(),
            'secteurs' => Secteur::all(),
            'sites' => SiteFormation::where('statut', 'actif')->get(),
            'formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
                                ->where('statut', 'actif')
                                ->with(['instituts.region', 'regions'])
                                ->get(),
        ]);
    }

    /**
     * Mise à jour complète du plan (thèmes, animateurs, participants, site).
     */
    public function update(Request $request, PlanFormation $plan)
    {
        if (!$plan->isEditable()) {
            return redirect()->back()->with('error', 'Ce plan ne peut plus être modifié.');
        }

        $validated = $request->validate([
            'titre' => 'required|string|max:200',
            'themes' => 'required|array|min:1',
            'themes.*.nom' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
            'themes.*.ordre' => 'required|integer|min:1',
            'themes.*.animateur_ids' => 'nullable|array',
            'themes.*.animateur_ids.*' => 'exists:users,id',
            'participant_ids' => 'nullable|array',
            'participant_ids.*' => 'exists:users,id',
            'site_formation_id' => 'nullable|exists:sites_formation,id',
        ]);

        return DB::transaction(function () use ($validated, $plan) {
            $plan->update([
                'titre' => $validated['titre'],
                'site_formation_id' => $validated['site_formation_id'] ?? null,
            ]);

            // Re-sync themes
            $plan->themes()->delete();
            foreach ($validated['themes'] as $themeData) {
                $theme = $plan->themes()->create([
                    'nom' => $themeData['nom'],
                    'duree_heures' => $themeData['duree_heures'],
                    'objectifs' => $themeData['objectifs'] ?? null,
                    'ordre' => $themeData['ordre'],
                ]);

                if (!empty($themeData['animateur_ids'])) {
                    $theme->animateurs()->sync($themeData['animateur_ids']);
                }
            }

            // Re-sync participants
            $participantData = [];
            foreach (($validated['participant_ids'] ?? []) as $pid) {
                $participantData[$pid] = [
                    'added_by' => auth()->id(),
                    'added_at' => now(),
                ];
            }
            $plan->participants()->sync($participantData);

            return redirect()->back()->with('success', 'Plan mis à jour.');
        });
    }

    /**
     * Vue détaillée d'un plan.
     */
    public function show(PlanFormation $plan)
    {
        $plan->load([
            'entite.secteur',
            'themes.animateurs',
            'participants.instituts',
            'siteFormation',
            'createur',
            'validateur',
        ]);

        return Inertia::render('Modules/Plans/Show', [
            'plan' => $plan,
        ]);
    }

    /**
     * CDC soumet le plan au RF pour validation (RG01).
     */
    public function submit(PlanFormation $plan)
    {
        if (!$plan->isSubmittable()) {
            return redirect()->back()->with('error', 'Ce plan ne peut pas être soumis.');
        }

        $plan->update([
            'statut' => 'soumis',
            'date_soumission' => now(),
            'motif_rejet' => null, // Nettoyer le motif en cas de re-soumission
        ]);

        return redirect()->route('modules.plans.show', $plan)
                       ->with('success', 'Plan soumis au Responsable Formation.');
    }

    /**
     * RF valide un plan soumis par un CDC → statut confirmé.
     */
    public function validatePlan(PlanFormation $plan)
    {
        if (!$plan->canBeValidated()) {
            return redirect()->back()->with('error', 'Ce plan ne peut pas être validé.');
        }

        $plan->update([
            'statut' => 'confirmé',
            'valide_par' => auth()->id(),
            'date_validation' => now(),
        ]);

        return redirect()->route('modules.plans.show', $plan)
                       ->with('success', 'Plan validé et confirmé.');
    }

    /**
     * RF rejette un plan soumis par un CDC avec motif obligatoire (RG03).
     */
    public function reject(Request $request, PlanFormation $plan)
    {
        if (!$plan->canBeValidated()) {
            return redirect()->back()->with('error', 'Ce plan ne peut pas être rejeté.');
        }

        $validated = $request->validate([
            'motif_rejet' => 'required|string|min:10',
        ]);

        $plan->update([
            'statut' => 'rejeté',
            'motif_rejet' => $validated['motif_rejet'],
            'valide_par' => auth()->id(),
            'date_validation' => now(),
        ]);

        return redirect()->route('modules.plans.index')
                       ->with('success', 'Plan rejeté. Le CDC a été notifié.');
    }

    /**
     * RF confirme directement son propre plan (RG02 — pas de validation externe).
     */
    public function confirm(PlanFormation $plan)
    {
        if ($plan->cree_par !== auth()->id()) {
            return redirect()->back()->with('error', 'Vous ne pouvez confirmer que vos propres plans.');
        }

        if (!in_array($plan->statut, ['brouillon'])) {
            return redirect()->back()->with('error', 'Ce plan ne peut pas être confirmé.');
        }

        $plan->update([
            'statut' => 'confirmé',
            'valide_par' => auth()->id(),
            'date_validation' => now(),
        ]);

        return redirect()->route('modules.plans.show', $plan)
                       ->with('success', 'Plan confirmé.');
    }

    /**
     * Archiver un plan (soft delete logique).
     */
    public function destroy(PlanFormation $plan)
    {
        $plan->update(['statut' => 'archivé']);
        return redirect()->route('modules.plans.index')
                       ->with('success', 'Plan archivé.');
    }
}
