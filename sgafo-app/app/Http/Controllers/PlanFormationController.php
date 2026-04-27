<?php

namespace App\Http\Controllers;

use App\Models\PlanFormation;
use App\Models\PlanTheme;
use App\Models\EntiteFormation;
use App\Models\Secteur;
use App\Models\SiteFormation;
use App\Models\User;
use App\Models\Hotel;
use App\Models\PlanHebergement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Notifications\PlanFormationSoumis;
use App\Notifications\PlanFormationDecision;
use App\Notifications\PlanCancelledNotification;
use Illuminate\Support\Facades\Notification;
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
        $query->where('cree_par', $user->id);
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
            'hotels' => Hotel::with('region')->where('statut', 'actif')->get(),
            'formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
                                ->where('statut', 'actif')
                                ->with(['instituts.region', 'regions', 'secteurs'])
                                ->get(),
        ]);
    }

    /**
     * Sauvegarde initiale du plan en brouillon (Étape 1 → données de base).
     */
    public function store(Request $request)
    {
        $messages = [
            'titre.required' => 'Le titre du plan est obligatoire.',
            'date_debut.required' => 'La date de début est obligatoire pour planifier les séances.',
            'date_debut.after_or_equal' => 'La date de début doit être aujourd\'hui ou dans le futur.',
            'date_fin.after_or_equal' => 'La date de fin doit être ultérieure ou égale à la date de début.',
            'themes.required' => 'Vous devez configurer au moins un thème.',
            'themes.*.animateur_ids.required' => 'Chaque thème doit avoir au moins un formateur affecté.',
            'themes.*.animateur_ids.min' => 'Chaque thème doit avoir au moins un formateur affecté.',
            'site_formation_id.required_without' => 'Veuillez sélectionner un site de formation ou spécifier une plateforme distancielle.',
        ];

        $validated = $request->validate([
            'entite_id' => 'required|exists:entite_formations,id',
            'titre' => 'required|string|max:200',
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'themes' => 'required|array|min:1',
            'themes.*.nom' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
            'themes.*.ordre' => 'required|integer|min:1',
            'themes.*.animateur_ids' => 'required|array|min:1',
            'themes.*.animateur_ids.*' => 'exists:users,id',
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'exists:users,id',
            'site_formation_id' => 'nullable|required_without:plateforme|exists:sites_formation,id',
            'plateforme' => 'nullable|string|max:100',
            'lien_visio' => 'nullable|string|max:500',
            'hebergements' => 'nullable|array',
            'hebergements.*.user_id' => 'required|exists:users,id',
            'hebergements.*.hotel_id' => 'required|exists:hotels,id',
            'hebergements.*.nombre_nuits' => 'required|integer|min:1',
            'hebergements.*.cout_total' => 'required|numeric|min:0',
        ], $messages);

        $dateDebut = $validated['date_debut'] ?? null;
        $dateFin = $validated['date_fin'] ?? null;

        if ($dateDebut && $dateFin) {
            // 1. Formateurs
            $formateurIds = [];
            if (!empty($validated['themes'])) {
                foreach ($validated['themes'] as $theme) {
                    if (!empty($theme['animateur_ids'])) {
                        $formateurIds = array_merge($formateurIds, $theme['animateur_ids']);
                    }
                }
            }
            $formateurIds = array_unique($formateurIds);
            
            if (!empty($formateurIds)) {
                $busyFormateurId = \App\Models\SeanceTheme::whereIn('formateur_id', $formateurIds)
                    ->whereHas('seance', function($sq) use ($dateDebut, $dateFin) {
                        $sq->whereBetween('date', [$dateDebut, $dateFin]);
                    })->value('formateur_id');

                if ($busyFormateurId) {
                    $f = User::find($busyFormateurId);
                    return redirect()->back()->with('error', "Impossible d'enregistrer le plan : Le formateur {$f->nom} {$f->prenom} a déjà des engagements sur la période du {$dateDebut} au {$dateFin}.")->withInput();
                }
            }

            // 2. Participants
            $participantIds = $validated['participant_ids'] ?? [];
            if (!empty($participantIds)) {
                $busyParticipantId = User::whereIn('id', $participantIds)
                    ->whereHas('plans', function($q) use ($dateDebut, $dateFin) {
                        $q->whereHas('seances', function($sq) use ($dateDebut, $dateFin) {
                            $sq->whereBetween('date', [$dateDebut, $dateFin]);
                        });
                    })->value('id');

                if ($busyParticipantId) {
                    $p = User::find($busyParticipantId);
                    return redirect()->back()->with('error', "Impossible d'enregistrer le plan : Le participant {$p->nom} {$p->prenom} a déjà des séances prévues sur la période du {$dateDebut} au {$dateFin}.")->withInput();
                }
            }
        }

        return DB::transaction(function () use ($validated) {
            $plan = PlanFormation::create([
                'entite_id' => $validated['entite_id'],
                'titre' => $validated['titre'],
                'date_debut' => $validated['date_debut'] ?? null,
                'date_fin' => $validated['date_fin'] ?? null,
                'statut' => 'brouillon',
                'cree_par' => auth()->id(),
                'site_formation_id' => $validated['site_formation_id'] ?? null,
                'plateforme' => $validated['plateforme'] ?? null,
                'lien_visio' => $validated['lien_visio'] ?? null,
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

            // Ajouter les hébergements
            if (!empty($validated['hebergements'])) {
                foreach ($validated['hebergements'] as $heb) {
                    $plan->hebergements()->create($heb);
                }
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
            'hebergements.hotel',
            'siteFormation',
            'createur',
        ]);

        return Inertia::render('Modules/Plans/Create', [
            'plan' => $plan,
            'entites' => EntiteFormation::with(['secteur', 'themes', 'createur'])
                            ->where('statut', 'actif')->where('cree_par_id', auth()->id())
                            ->latest()
                            ->get(),
            'secteurs' => Secteur::all(),
            'sites' => SiteFormation::where('statut', 'actif')->get(),
            'hotels' => Hotel::with('region')->where('statut', 'actif')->get(),
            'formateurs' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
                                ->where('statut', 'actif')
                                ->with(['instituts.region', 'regions', 'secteurs'])
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

        $messages = [
            'titre.required' => 'Le titre du plan est obligatoire.',
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_fin.after_or_equal' => 'La date de fin doit être égale ou postérieure à la date de début.',
            'themes.required' => 'Vous devez configurer au moins un thème.',
            'themes.*.animateur_ids.required' => 'Chaque thème doit avoir au moins un formateur affecté.',
            'themes.*.animateur_ids.min' => 'Chaque thème doit avoir au moins un formateur affecté.',
            'participant_ids.required' => 'Vous devez ajouter au moins un participant.',
            'site_formation_id.required_without' => 'Veuillez sélectionner un site de formation ou spécifier une plateforme distancielle.',
        ];

        $validated = $request->validate([
            'titre' => 'required|string|max:200',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'themes' => 'required|array|min:1',
            'themes.*.nom' => 'required|string|max:200',
            'themes.*.duree_heures' => 'required|numeric|min:0.5',
            'themes.*.objectifs' => 'nullable|string',
            'themes.*.ordre' => 'required|integer|min:1',
            'themes.*.animateur_ids' => 'required|array|min:1',
            'themes.*.animateur_ids.*' => 'exists:users,id',
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'exists:users,id',
            'site_formation_id' => 'nullable|required_without:plateforme|exists:sites_formation,id',
            'plateforme' => 'nullable|string|max:100',
            'lien_visio' => 'nullable|string|max:500',
            'hebergements' => 'nullable|array',
            'hebergements.*.user_id' => 'required|exists:users,id',
            'hebergements.*.hotel_id' => 'required|exists:hotels,id',
            'hebergements.*.nombre_nuits' => 'required|integer|min:1',
            'hebergements.*.cout_total' => 'required|numeric|min:0',
        ], $messages);

        $dateDebut = $validated['date_debut'] ?? null;
        $dateFin = $validated['date_fin'] ?? null;
        $planId = $plan->id;

        if ($dateDebut && $dateFin) {
            // 1. Formateurs
            $formateurIds = [];
            if (!empty($validated['themes'])) {
                foreach ($validated['themes'] as $theme) {
                    if (!empty($theme['animateur_ids'])) {
                        $formateurIds = array_merge($formateurIds, $theme['animateur_ids']);
                    }
                }
            }
            $formateurIds = array_unique($formateurIds);
            
            if (!empty($formateurIds)) {
                $busyFormateurId = \App\Models\SeanceTheme::whereIn('formateur_id', $formateurIds)
                    ->whereHas('seance', function($sq) use ($dateDebut, $dateFin, $planId) {
                        $sq->whereBetween('date', [$dateDebut, $dateFin])
                           ->where('plan_id', '!=', $planId);
                    })->value('formateur_id');

                if ($busyFormateurId) {
                    $f = User::find($busyFormateurId);
                    return redirect()->back()->with('error', "Impossible de mettre à jour le plan : Le formateur {$f->nom} {$f->prenom} a déjà des engagements sur la période du {$dateDebut} au {$dateFin}.")->withInput();
                }
            }

            // 2. Participants
            $participantIds = $validated['participant_ids'] ?? [];
            if (!empty($participantIds)) {
                $busyParticipantId = User::whereIn('id', $participantIds)
                    ->whereHas('plans', function($q) use ($dateDebut, $dateFin, $planId) {
                        $q->where('plans_formation.id', '!=', $planId)
                          ->whereHas('seances', function($sq) use ($dateDebut, $dateFin) {
                              $sq->whereBetween('date', [$dateDebut, $dateFin]);
                          });
                    })->value('id');

                if ($busyParticipantId) {
                    $p = User::find($busyParticipantId);
                    return redirect()->back()->with('error', "Impossible de mettre à jour le plan : Le participant {$p->nom} {$p->prenom} a déjà des séances prévues sur la période du {$dateDebut} au {$dateFin}.")->withInput();
                }
            }
        }

        return DB::transaction(function () use ($validated, $plan) {
            $plan->update([
                'titre' => $validated['titre'],
                'date_debut' => $validated['date_debut'] ?? null,
                'date_fin' => $validated['date_fin'] ?? null,
                'site_formation_id' => $validated['site_formation_id'] ?? null,
                'plateforme' => $validated['plateforme'] ?? null,
                'lien_visio' => $validated['lien_visio'] ?? null,
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

            // Re-sync hebergements
            $plan->hebergements()->delete();
            if (!empty($validated['hebergements'])) {
                foreach ($validated['hebergements'] as $heb) {
                    $plan->hebergements()->create($heb);
                }
            }

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
            'hebergements.hotel',
            'siteFormation',
            'createur',
            'validateur',
            'seances',
        ]);

        return Inertia::render('Modules/Plans/Show', [
            'plan' => $plan->load('validationLogs.user'),
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

        // Validation de complétude avant soumission
        $errors = [];
        if (!$plan->date_debut || !$plan->date_fin) {
            $errors[] = "Les dates de début et de fin sont obligatoires.";
        }
        if ($plan->themes()->count() === 0) {
            $errors[] = "Le plan doit contenir au moins un thème.";
        }
        if ($plan->participants()->count() === 0) {
            $errors[] = "Le plan doit contenir au moins un participant.";
        }
        
        foreach ($plan->themes as $theme) {
            if ($theme->animateurs()->count() === 0) {
                $errors[] = "Le thème '{$theme->nom}' n'a aucun formateur affecté.";
            }
        }

        if (!$plan->site_formation_id && !$plan->plateforme) {
            $errors[] = "Veuillez spécifier un site de formation ou une plateforme (Teams, Zoom, etc.).";
        }

        if (!empty($errors)) {
            return redirect()->back()->with('error', 'Plan incomplet : ' . implode(' ', $errors));
        }

        $plan->update([
            'statut' => 'soumis',
            'date_soumission' => now(),
            'motif_rejet' => null, // Nettoyer le motif en cas de re-soumission
        ]);

        $plan->validationLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'soumis',
            'commentaire' => 'Le plan a été soumis pour validation.',
        ]);

        // Notifier les RF du secteur
        $secteurId = $plan->entite->secteur_id;
        $rfs = User::whereHas('roles', fn($q) => $q->where('code', 'RF'))
            ->whereHas('secteurs', fn($q) => $q->where('secteurs.id', $secteurId))
            ->get();

        Notification::send($rfs, new PlanFormationSoumis($plan));

        return redirect()->route('modules.plans.show', $plan)
                       ->with('success', 'Plan soumis au Responsable Formation.');
    }

    /**
     * RF valide un plan soumis par un CDC → statut confirmé.
     */
    public function validatePlan(PlanFormation $plan)
    {
        \Illuminate\Support\Facades\Gate::authorize('validate', $plan);

        if (!$plan->canBeValidated()) {
            return redirect()->back()->with('error', 'Le plan doit avoir au moins une séance planifiée pour être validé.');
        }

        $plan->update([
            'statut' => 'validé',
            'valide_par' => auth()->id(),
            'date_validation' => now(),
        ]);

        $plan->validationLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'validé',
            'commentaire' => 'Validation technique finale : planning complet et prêt pour exécution.',
        ]);

        // Notifier le créateur
        $plan->createur->notify(new PlanFormationDecision($plan, 'validé'));

        return redirect()->route('modules.plans.show', $plan)
                       ->with('success', 'Plan validé techniquement et publié au catalogue.');
    }

    /**
     * RF rejette un plan soumis par un CDC avec motif obligatoire (RG03).
     */
    public function reject(Request $request, PlanFormation $plan)
    {
        \Illuminate\Support\Facades\Gate::authorize('validate', $plan);

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

        $plan->validationLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'rejeté',
            'commentaire' => $validated['motif_rejet'],
        ]);

        // Notifier le créateur
        $plan->createur->notify(new PlanFormationDecision($plan, 'rejeté', $validated['motif_rejet']));

        return redirect()->route('modules.plans.index')
                       ->with('success', 'Plan rejeté. Le CDC a été notifié.');
    }

    /**
     * RF confirme directement son propre plan (RG02 — pas de validation externe).
     */
    public function confirm(PlanFormation $plan)
    {
        $user = auth()->user();
        
        if (!$plan->canBeConfirmed()) {
            return redirect()->back()->with('error', 'Ce plan ne peut pas être confirmé en l\'état.');
        }

        $plan->update([
            'statut' => 'confirmé',
            'valide_par' => $user->id,
            'date_validation' => now(),
        ]);

        $plan->validationLogs()->create([
            'user_id' => $user->id,
            'action' => 'confirmé',
            'commentaire' => 'Confirmation administrative du plan. Prêt pour la planification.',
        ]);

        return redirect()->route('modules.plans.show', $plan)
                       ->with('success', 'Plan confirmé administrativement. Vous pouvez maintenant gérer le planning.');
    }

    /**
     * Archiver un plan (soft delete logique).
     */
    /**
     * Clôture définitive du planning pour passer à l'exécution.
     */
    public function cloturerPlanning(PlanFormation $plan)
    {
        // On pourrait ajouter des validations ici (ex: 100% des heures planifiées)
        $plan->update(['statut' => 'validé']);

        $plan->validationLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'clôturé',
            'commentaire' => 'Le planning a été clôturé définitivement.',
        ]);

        return redirect()->back()->with('success', 'Planning clôturé. La formation est prête pour l\'exécution.');
    }

    /**
     * Réouverture du planning en cas d'imprévu.
     */
    public function reouvrirPlanning(PlanFormation $plan)
    {
        $plan->update(['statut' => 'confirmé']);

        $plan->validationLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'réouvert',
            'commentaire' => 'Le planning a été réouvert pour modifications.',
        ]);

        return redirect()->back()->with('success', 'Planning réouvert pour modifications.');
    }

    /**
     * Générer le rapport PDF du plan de formation.
     */
    public function exportPdf(PlanFormation $plan)
    {
        $plan->load([
            'entite.secteur',
            'themes.animateurs.instituts',
            'participants.instituts',
            'hebergements.hotel',
            'hebergements.user',
            'siteFormation',
            'createur',
            'validateur',
        ]);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.plan_formation', compact('plan'));
        $pdf->setPaper('a4', 'portrait');

        $filename = 'Plan_Formation_' . $plan->id . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Supprimer un plan de formation et toutes ses données associées.
     */
    public function destroy(PlanFormation $plan)
    {
        \Illuminate\Support\Facades\Gate::authorize('delete', $plan);

        DB::transaction(function () use ($plan) {
            // Nettoyage manuel si non-cascade en DB
            $plan->seances()->delete();
            $plan->themes()->delete();
            $plan->participants()->detach();
            $plan->hebergements()->delete();
            $plan->validationLogs()->delete();
            $plan->ressources()->delete();
            
            $plan->delete();
        });

        return redirect()->route('modules.plans.index')
                       ->with('success', 'Le plan de formation a été supprimé définitivement.');
    }

    /**
     * Annuler une formation officiellement.
     */
    public function cancel(PlanFormation $plan, Request $request)
    {
        if (!auth()->user()->hasRole('RF')) abort(403);

        if (!$plan->canBeCancelled()) {
            return redirect()->back()->with('error', 'Ce plan ne peut pas être annulé.');
        }

        $request->validate([
            'motif_annulation' => 'required|string|min:10',
        ]);

        $motif = $request->motif_annulation;

        DB::transaction(function () use ($plan, $motif) {
            $plan->update([
                'statut' => 'annulé',
                'motif_rejet' => $motif, // On réutilise ce champ ou un nouveau si besoin
            ]);

            $plan->validationLogs()->create([
                'user_id' => auth()->id(),
                'action' => 'annulé',
                'commentaire' => 'Annulation de la formation : ' . $motif,
            ]);
        });

        // NOTIFICATIONS
        $notifiables = collect();
        
        // 1. Créateur
        $notifiables->push($plan->createur);
        
        // 2. Animateurs
        $animateurIds = $plan->getAnimateurIds();
        $animateurs = User::whereIn('id', $animateurIds)->get();
        $notifiables = $notifiables->merge($animateurs);
        
        // 3. Participants
        $notifiables = $notifiables->merge($plan->participants);

        // Envoyer à tout le monde (sauf l'annulateur lui-même si présent dans la liste)
        $notifiables = $notifiables->unique('id')->reject(fn($u) => $u->id === auth()->id());
        
        Notification::send($notifiables, new PlanCancelledNotification($plan, $motif));

        return redirect()->back()->with('success', 'La formation a été annulée et les équipes ont été informées.');
    }

    /**
     * Check user availability for the frontend planning stepper.
     */
    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'plan_id' => 'nullable|integer',
        ]);

        $userIds = $validated['user_ids'];
        $startDate = $validated['start_date'];
        $endDate = $validated['end_date'];
        $planId = $validated['plan_id'] ?? null;

        $conflicts = [];

        $seancesQuery = \App\Models\Seance::with(['plan.participants', 'themes'])
            ->whereBetween('date', [$startDate, $endDate]);

        if ($planId) {
            $seancesQuery->where('plan_id', '!=', $planId);
        }

        $seances = $seancesQuery->get();

        foreach ($seances as $seance) {
            // Check Animators
            foreach ($seance->themes as $theme) {
                if ($theme->formateur_id && in_array($theme->formateur_id, $userIds)) {
                    $conflicts[$theme->formateur_id][] = [
                        'date' => $seance->date,
                        'plan_titre' => $seance->plan ? $seance->plan->titre : 'Autre formation',
                    ];
                }
            }

            // Check Participants
            if ($seance->plan) {
                $participantIds = $seance->plan->participants->pluck('id')->toArray();
                $overlapping = array_intersect($participantIds, $userIds);
                foreach ($overlapping as $pId) {
                    $conflicts[$pId][] = [
                        'date' => $seance->date,
                        'plan_titre' => $seance->plan->titre,
                    ];
                }
            }
        }

        return response()->json(['conflicts' => $conflicts]);
    }
}
