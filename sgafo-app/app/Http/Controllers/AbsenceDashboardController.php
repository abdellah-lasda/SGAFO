<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AbsenceDashboardController extends Controller
{
    /** Seuil d'absences non justifiées considéré comme "à risque" */
    const SEUIL_RISQUE = 2;

    public function index(Request $request)
    {
        $planId = $request->query('plan_id');
        $from   = $request->query('from');
        $to     = $request->query('to');

        // ── 1. Liste des plans ayant au moins une séance avec présences saisies ──
        $plans = PlanFormation::whereHas('seances.presences')
            ->with('entite')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'titre', 'statut', 'entite_id', 'date_debut', 'date_fin']);

        // ── 2. Requête de base sur les présences ──────────────────────────────
        $presencesQuery = Presence::query()
            ->join('seances', 'presences.seance_id', '=', 'seances.id')
            ->join('plans_formation', 'seances.plan_id', '=', 'plans_formation.id');

        if ($planId) {
            $presencesQuery->where('seances.plan_id', $planId);
        }
        if ($from) {
            $presencesQuery->where('seances.date', '>=', $from);
        }
        if ($to) {
            $presencesQuery->where('seances.date', '<=', $to);
        }

        // ── 3. Stats globales ─────────────────────────────────────────────────
        $allPresences    = (clone $presencesQuery)->count();
        $totalAbsences   = (clone $presencesQuery)->where('presences.statut', 'absent')->count();
        $unjustified     = (clone $presencesQuery)->where('presences.statut', 'absent')->where('presences.est_justifie', false)->count();
        $tauxMoyen       = $allPresences > 0 ? round(($totalAbsences / $allPresences) * 100, 1) : 0;

        // ── 4. Absences par plan ──────────────────────────────────────────────
        $parPlan = $this->buildParPlan($planId, $from, $to);

        // ── 5. Participants à risque ──────────────────────────────────────────
        $participantsARisque = $this->buildParticipantsARisque($planId, $from, $to);

        // ── 6. Nombre de participants à risque (pour KPI) ────────────────────
        $nbARisque = $participantsARisque->filter(
            fn($p) => collect($p['plans'])->contains(fn($pl) => $pl['est_a_risque'])
        )->count();

        return Inertia::render('Modules/Absences/Dashboard', [
            'globalStats' => [
                'total_absences'       => $totalAbsences,
                'unjustified'          => $unjustified,
                'taux_moyen'           => $tauxMoyen,
                'participants_a_risque'=> $nbARisque,
            ],
            'parPlan'             => $parPlan,
            'participantsARisque' => $participantsARisque,
            'plans'               => $plans,
            'seuil'               => self::SEUIL_RISQUE,
            'filters' => [
                'plan_id' => $planId ? (int)$planId : null,
                'from'    => $from,
                'to'      => $to,
            ],
        ]);
    }

    // ── Helpers privés ────────────────────────────────────────────────────────

    private function buildParPlan(?string $planId, ?string $from, ?string $to): \Illuminate\Support\Collection
    {
        $plansQuery = PlanFormation::whereHas('seances.presences')->with('entite');

        if ($planId) {
            $plansQuery->where('id', $planId);
        }

        return $plansQuery->get()->map(function (PlanFormation $plan) use ($from, $to) {
            // Séances du plan (filtrées par date si besoin)
            $seancesQuery = $plan->seances();
            if ($from) $seancesQuery->where('date', '>=', $from);
            if ($to)   $seancesQuery->where('date', '<=', $to);
            $seances = $seancesQuery->with('presences')->get();

            $totalSeances         = $seances->count();
            $seancesAvecPresences = $seances->filter(fn($s) => $s->presences->count() > 0)->count();
            $totalParticipants    = $plan->participants()->count();

            // Toutes les présences saisies pour ce plan (dans ces séances)
            $presences         = $seances->flatMap(fn($s) => $s->presences);
            $totalSaisies      = $presences->count();
            $absences          = $presences->where('statut', 'absent');
            $totalAbsences     = $absences->count();
            $unjustified       = $absences->where('est_justifie', false)->count();
            $tauxAbsenteisme   = $totalSaisies > 0
                ? round(($totalAbsences / $totalSaisies) * 100, 1)
                : 0;

            // Participants à risque dans ce plan
            $participantAbsences = $presences
                ->where('statut', 'absent')
                ->where('est_justifie', false)
                ->groupBy('participant_id')
                ->map(fn($items, $id) => [
                    'participant_id' => $id,
                    'nb_absences'    => $items->count(),
                ])
                ->filter(fn($p) => $p['nb_absences'] >= self::SEUIL_RISQUE)
                ->values();

            // Enrichir avec les noms
            $participantIds = $participantAbsences->pluck('participant_id');
            $users = User::whereIn('id', $participantIds)->get()->keyBy('id');

            $participantsRisque = $participantAbsences->map(fn($p) => [
                ...$p,
                'nom_complet' => optional($users->get($p['participant_id']))->prenom
                    . ' ' . optional($users->get($p['participant_id']))->nom,
            ]);

            return [
                'plan_id'              => $plan->id,
                'titre'                => $plan->titre,
                'statut'               => $plan->statut,
                'entite'               => $plan->entite?->nom,
                'total_seances'        => $totalSeances,
                'seances_avec_appel'   => $seancesAvecPresences,
                'total_participants'   => $totalParticipants,
                'total_presences_saisies' => $totalSaisies,
                'absences'             => $totalAbsences,
                'unjustified'          => $unjustified,
                'taux_absenteisme'     => $tauxAbsenteisme,
                'participants_risque'  => $participantsRisque,
            ];
        })->sortByDesc('taux_absenteisme')->values();
    }

    private function buildParticipantsARisque(?string $planId, ?string $from, ?string $to): \Illuminate\Support\Collection
    {
        // Sous-requête : participants ayant au moins 1 absence dans les plans filtrés
        $presencesBase = DB::table('presences')
            ->join('seances', 'presences.seance_id', '=', 'seances.id')
            ->where('presences.statut', 'absent')
            ->where('presences.est_justifie', false);

        if ($planId) $presencesBase->where('seances.plan_id', $planId);
        if ($from)   $presencesBase->where('seances.date', '>=', $from);
        if ($to)     $presencesBase->where('seances.date', '<=', $to);

        // Grouper par participant + plan
        $grouped = (clone $presencesBase)
            ->select('presences.participant_id', 'seances.plan_id', DB::raw('COUNT(*) as nb_absences'))
            ->groupBy('presences.participant_id', 'seances.plan_id')
            ->get();

        if ($grouped->isEmpty()) {
            return collect();
        }

        // Charger les users et plans concernés
        $participantIds = $grouped->pluck('participant_id')->unique();
        $planIds        = $grouped->pluck('plan_id')->unique();

        $users = User::whereIn('id', $participantIds)->get()->keyBy('id');
        $plansMap = PlanFormation::whereIn('id', $planIds)->with('entite')->get()->keyBy('id');

        // Compter le total de séances par plan (pour calculer le taux)
        $totalSeancesParPlan = Seance::whereIn('plan_id', $planIds)
            ->select('plan_id', DB::raw('COUNT(*) as total'))
            ->groupBy('plan_id')
            ->pluck('total', 'plan_id');

        // Grouper par participant
        return $grouped
            ->groupBy('participant_id')
            ->map(function ($rows, $participantId) use ($users, $plansMap, $totalSeancesParPlan) {
                $user = $users->get($participantId);
                $plansList = $rows->map(function ($row) use ($plansMap, $totalSeancesParPlan) {
                    $plan        = $plansMap->get($row->plan_id);
                    $totalSeances = $totalSeancesParPlan->get($row->plan_id, 1);
                    $taux        = round(($row->nb_absences / $totalSeances) * 100, 1);
                    return [
                        'plan_id'      => $row->plan_id,
                        'plan_titre'   => $plan?->titre ?? '—',
                        'entite'       => $plan?->entite?->nom ?? '—',
                        'absences'     => $row->nb_absences,
                        'total_seances'=> $totalSeances,
                        'taux'         => $taux,
                        'est_a_risque' => $row->nb_absences >= self::SEUIL_RISQUE,
                    ];
                })->sortByDesc('absences')->values();

                return [
                    'participant_id' => $participantId,
                    'nom'            => $user?->nom ?? '—',
                    'prenom'         => $user?->prenom ?? '—',
                    'nom_complet'    => ($user?->prenom ?? '') . ' ' . ($user?->nom ?? ''),
                    'plans'          => $plansList,
                    'total_absences' => $plansList->sum('absences'),
                    'est_a_risque'   => $plansList->contains(fn($p) => $p['est_a_risque']),
                ];
            })
            ->sortByDesc('total_absences')
            ->values();
    }
}
