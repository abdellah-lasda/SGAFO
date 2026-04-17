<?php

namespace App\Http\Controllers;

use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\SiteFormation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SeanceController extends Controller
{
    /**
     * Affiche l'interface de planification pour un plan spécifique.
     */
    public function index(PlanFormation $plan)
    {
        // On ne planifie que les plans validés/confirmés ou déjà en cours de planning
        if (!in_array($plan->statut, ['validé', 'confirmé', 'en_cours', 'clôturé'])) {
            return redirect()->route('modules.plans.show', $plan->id)
                ->with('error', 'Le plan doit être validé avant d\'être planifié.');
        }

        $plan->load(['themes.animateurs', 'siteFormation', 'createur', 'participants']);
        
        $seances = Seance::where('plan_id', $plan->id)
            ->with(['themes', 'site'])
            ->orderBy('date')
            ->orderBy('debut')
            ->get();

        // Calcul de la progression pour chaque thème
        $themesStats = $plan->themes->map(function ($theme) use ($seances) {
            $heuresPlanifiees = $seances->flatMap->themes
                ->where('id', $theme->id)
                ->sum('pivot.heures_planifiees');
            
            return [
                'id' => $theme->id,
                'nom' => $theme->nom,
                'duree_totale' => $theme->duree_heures,
                'heures_planifiees' => $heuresPlanifiees,
                'reste' => max(0, $theme->duree_heures - $heuresPlanifiees),
                'animateurs' => $theme->animateurs,
            ];
        });

        return Inertia::render('Modules/Sessions/Index', [
            'plan' => $plan,
            'seances' => $seances,
            'themesStats' => $themesStats,
            'sites' => SiteFormation::all(),
        ]);
    }

    /**
     * Enregistre une ou plusieurs séances (récurrence).
     */
    public function store(Request $request, PlanFormation $plan)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'debut' => 'required',
            'fin' => 'required',
            'site_id' => 'required|exists:sites_formation,id',
            'recurrence_end' => 'nullable|date|after_or_equal:date',
            'themes' => 'required|array|min:1',
            'themes.*.plan_theme_id' => 'required|exists:plan_themes,id',
            'themes.*.formateur_id' => 'required|exists:users,id',
            'themes.*.heures_planifiees' => 'required|numeric|min:0.5',
        ]);

        return DB::transaction(function () use ($validated, $plan) {
            $startDate = Carbon::parse($validated['date']);
            $endDate = $validated['recurrence_end'] ? Carbon::parse($validated['recurrence_end']) : $startDate;
            
            $createdCount = 0;
            $currentDate = $startDate->copy();

            while ($currentDate->lte($endDate)) {
                // On saute les week-ends (Samedi et Dimanche)
                if (!$currentDate->isWeekend()) {
                    $seance = Seance::create([
                        'plan_id' => $plan->id,
                        'site_id' => $validated['site_id'],
                        'date' => $currentDate->format('Y-m-d'),
                        'debut' => $validated['debut'],
                        'fin' => $validated['fin'],
                        'statut' => 'planifiée',
                    ]);

                    foreach ($validated['themes'] as $themeData) {
                        $seance->themes()->attach($themeData['plan_theme_id'], [
                            'heures_planifiees' => $themeData['heures_planifiees'],
                            'formateur_id' => $themeData['formateur_id'],
                        ]);
                    }
                    $createdCount++;
                }
                $currentDate->addDay();
            }

            // Mise à jour automatique du statut du plan si c'est la première séance
            if ($plan->statut === 'validé' || $plan->statut === 'confirmé') {
                $plan->update(['statut' => 'en_cours']);
            }

            $message = $createdCount > 1 
                ? "{$createdCount} séances ajoutées avec succès (hors week-ends)."
                : "Séance ajoutée au planning.";

            return redirect()->back()->with('success', $message);
        });
    }

    /**
     * Supprime une séance.
     */
    public function destroy(Seance $seance)
    {
        $seance->delete();
        return redirect()->back()->with('success', 'Séance supprimée du planning.');
    }
}
