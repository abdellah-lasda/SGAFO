<?php

namespace App\Http\Controllers;

use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\SiteFormation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SeanceController extends Controller
{
    /**
     * Affiche l'interface de planification pour un plan spécifique.
     */
    public function index(PlanFormation $plan)
    {
        $user = auth()->user();
        if (!$user->hasRole('RF')) {
            return redirect()->route('dashboard')->with('error', 'Accès réservé aux Responsables de Formation.');
        }

        // On ne planifie que les plans validés/confirmés
        if (!in_array($plan->statut, ['validé', 'confirmé'])) {
            return redirect()->route('modules.validations.index')
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

        $formateurs = \App\Models\User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
            ->select('id', 'nom', 'prenom')
            ->get();

        return Inertia::render('Modules/Sessions/Index', [
            'plan' => $plan,
            'seances' => $seances,
            'themesStats' => $themesStats,
            'sites' => SiteFormation::all(),
            'formateurs' => $formateurs,
        ]);
    }

    /**
     * Enregistre une nouvelle séance.
     */
    public function store(Request $request, PlanFormation $plan)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'debut' => 'required',
            'fin' => 'required',
            'site_id' => 'nullable|exists:sites_formation,id',
            'themes' => 'required|array|min:1',
            'themes.*.plan_theme_id' => 'required|exists:plan_themes,id',
            'themes.*.heures_planifiees' => 'required|numeric|min:0.5',
            'themes.*.formateur_id' => 'required|exists:users,id',
            // Récurrence
            'recurrence' => 'nullable|array',
            'recurrence.active' => 'boolean',
            'recurrence.type' => 'required_if:recurrence.active,true|in:quotidien,hebdomadaire',
            'recurrence.date_fin' => 'required_if:recurrence.active,true|date|after_or_equal:date',
            'recurrence.skip_saturday' => 'boolean',
            'recurrence.skip_sunday' => 'boolean',
        ]);

        if ($plan->statut === 'confirmé') {
            return redirect()->back()->with('error', 'Le planning est clôturé et ne peut plus être modifié.');
        }

        return DB::transaction(function () use ($validated, $plan) {
            $dates = [$validated['date']];

            if ($validated['recurrence']['active'] ?? false) {
                $currentDate = new \DateTime($validated['date']);
                $endDate = new \DateTime($validated['recurrence']['date_fin']);
                $type = $validated['recurrence']['type'];
                $skipSaturday = $validated['recurrence']['skip_saturday'] ?? false;
                $skipSunday = $validated['recurrence']['skip_sunday'] ?? false;

                while (true) {
                    if ($type === 'quotidien') {
                        $currentDate->modify('+1 day');
                    } else {
                        $currentDate->modify('+1 week');
                    }

                    if ($currentDate > $endDate) break;

                    // Gestion granulaire des weekends
                    $dayOfWeek = (int)$currentDate->format('N'); // 1 (Mon) to 7 (Sun)
                    
                    if ($dayOfWeek === 6 && $skipSaturday) {
                        $currentDate->modify('+1 day'); // Move to Sunday
                        $dayOfWeek = 7;
                    }
                    
                    if ($dayOfWeek === 7 && $skipSunday) {
                        $currentDate->modify('+1 day'); // Move to Monday
                    }

                    if ($currentDate > $endDate) break;
                    
                    $dates[] = $currentDate->format('Y-m-d');
                }
            }

            foreach ($dates as $date) {
                $seance = Seance::create([
                    'plan_id' => $plan->id,
                    'site_id' => $validated['site_id'],
                    'date' => $date,
                    'debut' => $validated['debut'],
                    'fin' => $validated['fin'],
                    'statut' => 'planifiée',
                ]);

                foreach ($validated['themes'] as $themeData) {
                    $seance->themes()->attach($themeData['plan_theme_id'], [
                        'heures_planifiees' => $themeData['heures_planifiees'],
                        'formateur_id' => $themeData['formateur_id']
                    ]);
                }
            }

            return redirect()->route('modules.validations.planning.index', $plan->id)->with('success', count($dates) > 1 
                ? count($dates) . ' séances ajoutées au planning.' 
                : 'Séance ajoutée au planning.');
        });
    }

    /**
     * Supprime une séance.
     */
    public function destroy(Seance $seance)
    {
        if ($seance->plan->statut === 'confirmé') {
            return redirect()->back()->with('error', 'Le planning est clôturé et ne peut plus être modifié.');
        }

        $seance->delete();
        return redirect()->back()->with('success', 'Séance supprimée du planning.');
    }

    /**
     * Clôture le planning (statut confirmé).
     */
    public function cloturer(PlanFormation $plan)
    {
        if (!auth()->user()->hasRole('RF')) abort(403);

        $plan->update(['statut' => 'confirmé']);
        
        $plan->validationLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'clôturé',
            'commentaire' => 'Le planning a été clôturé et verrouillé pour exécution.',
        ]);

        return redirect()->back()->with('success', 'Planning clôturé avec succès.');
    }

    /**
     * Réouvre le planning (statut validé).
     */
    public function reouvrir(PlanFormation $plan)
    {
        if (!auth()->user()->hasRole('RF')) abort(403);

        $plan->update(['statut' => 'validé']);

        $plan->validationLogs()->create([
            'user_id' => auth()->id(),
            'action' => 'réouvert',
            'commentaire' => 'Le planning a été réouvert pour modifications.',
        ]);

        return redirect()->back()->with('success', 'Planning réouvert pour modifications.');
    }
}
