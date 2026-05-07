<?php

namespace App\Http\Controllers\Modules\Animateur;

use App\Http\Controllers\Controller;
use App\Models\PlanFormation;
use App\Models\Presence;
use App\Models\Seance;
use App\Models\User;
use App\Notifications\AbsenceSeuilAtteint;
use App\Notifications\FeedbackRequiredNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

/** Nombre d'absences NJ dans un plan déclenchant l'alerte RF/CDC */
const ABSENCE_SEUIL = 2;

class AnimateurDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Récupérer les séances assignées à cet animateur
        $seances = Seance::whereHas('themes', function($q) use ($user) {
            $q->where('seance_themes.formateur_id', $user->id);
        })
        ->with(['plan.entite', 'site', 'themes' => function($q) use ($user) {
            $q->where('seance_themes.formateur_id', $user->id);
        }])
        ->orderBy('date', 'desc')
        ->get();

        // Calcul des stats
        $stats = [
            'total_hours' => $seances->where('statut', 'terminée')->sum(function($s) {
                return $s->themes->sum('pivot.heures_planifiees');
            }),
            'upcoming_count' => $seances->whereIn('statut', ['planifiée', 'confirmée'])->where('date', '>=', now()->toDateString())->count(),
            'pending_attendance' => $seances->where('statut', 'en_cours')->count(),
        ];

        // Identifier la prochaine séance (la plus proche dans le futur)
        $nextSession = $seances->whereIn('statut', ['planifiée', 'confirmée'])
            ->where('date', '>=', now()->toDateString())
            ->sortBy('date')
            ->first();

        return Inertia::render('Modules/Animateur/Dashboard', [
            'seances' => $seances,
            'stats' => $stats,
            'nextSession' => $nextSession,
        ]);
    }

    public function formations()
    {
        $user = Auth::user();

        // Récupérer les Plans de formation où l'animateur intervient
        $plans = PlanFormation::whereHas('seances.themes', function ($query) use ($user) {
            $query->where('seance_themes.formateur_id', $user->id);
        })
        ->with(['entite', 'seances' => function ($query) use ($user) {
            $query->whereHas('themes', function ($q) use ($user) {
                $q->where('seance_themes.formateur_id', $user->id);
            })->with('site', 'themes');
        }])
        ->get();

        // Récupérer toutes les séances de l'animateur (pour le calendrier)
        $allSeances = Seance::whereHas('themes', function ($query) use ($user) {
            $query->where('seance_themes.formateur_id', $user->id);
        })
        ->with(['plan.entite', 'site', 'themes'])
        ->orderBy('date', 'asc')
        ->get();

        // Statistiques
        $totalHours = 0;
        $completedHours = 0;
        foreach ($allSeances as $seance) {
            $duration = 4;
            $totalHours += $duration;
            if ($seance->statut === 'terminée') {
                $completedHours += $duration;
            }
        }

        return Inertia::render('Modules/Animateur/Formations', [
            'plans' => $plans,
            'allSeances' => $allSeances,
            'stats' => [
                'total_plans' => $plans->count(),
                'total_hours' => $totalHours,
                'completed_hours' => $completedHours,
                'completion_rate' => $totalHours > 0 ? round(($completedHours / $totalHours) * 100) : 0,
            ]
        ]);
    }

    public function showFormation(PlanFormation $plan)
    {
        $user = Auth::user();

        // Vérifier que l'animateur est rattaché à au moins un thème de ce plan
        $isAssigned = $plan->seances()->whereHas('themes', function ($query) use ($user) {
            $query->where('seance_themes.formateur_id', $user->id);
        })->exists();

        if (!$isAssigned) {
            abort(403, "Vous n'êtes pas assigné à ce plan de formation.");
        }

        // Charger les données nécessaires
        $plan->load([
            'entite', 
            'themes', 
            'seances' => function($q) use ($user) {
                $q->whereHas('themes', function($t) use ($user) {
                    $t->where('seance_themes.formateur_id', $user->id);
                })->with('site', 'themes')->withCount('presences');
            },
            'participants',
            'ressources'
        ]);

        return Inertia::render('Modules/Animateur/FormationDetails', [
            'plan' => $plan,
        ]);
    }

    public function attendance(Seance $seance)
    {
        $user = Auth::user();

        // 1. Vérification assignation
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) {
            abort(403, "Vous n'êtes pas assigné à cette séance.");
        }

        // 2. Vérification Temporelle (+/- 24h)
        $sessionDate = \Carbon\Carbon::parse($seance->date);
        $now = now();
        $isTooEarly = $now->lt($sessionDate->startOfDay()); // Trop tôt (avant le jour J)
        $isTooLate = $now->gt($sessionDate->addDay()->endOfDay()); // Trop tard (> 24h après le jour J)

        if ($isTooEarly) {
            return back()->with('error', "L'appel ne sera disponible que le " . $sessionDate->format('d/m/Y') . ".");
        }

        // 3. Vérification Clôture
        $isClosed = $seance->statut === 'terminée';

        // Charger le plan et ses participants
        $seance->load(['plan.entite', 'plan.participants.instituts', 'site', 'presences']);

        return Inertia::render('Modules/Animateur/AttendanceSheet', [
            'seance' => $seance,
            'participants' => $seance->plan->participants,
            'isClosed' => $isClosed,
            'isTooLate' => $isTooLate
        ]);
    }

    /**
     * Réouvrir une séance clôturée pour correction (Exceptionnel)
     */
    public function reopenAttendance(Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        
        if (!$isAssigned) abort(403);

        // Autoriser la réouverture seulement si la séance a moins de 48h
        $sessionDate = \Carbon\Carbon::parse($seance->date);
        if (now()->gt($sessionDate->addDays(2)->endOfDay())) {
            return back()->with('error', "Délai de correction expiré (max 48h). Veuillez contacter un administrateur.");
        }

        $seance->update(['statut' => 'en_cours']);

        return back()->with('success', "La séance a été réouverte. Vous pouvez maintenant modifier l'appel.");
    }

    public function submitAttendance(Request $request, Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) {
            abort(403);
        }

        // Sécurité : Empêcher la modification si la séance est déjà clôturée
        if ($seance->statut === 'terminée') {
            return back()->with('error', "Cette séance est clôturée. Déverrouillez-la pour faire des modifications.");
        }

        $validated = $request->validate([
            'presences' => 'required|array',
            'presences.*.participant_id' => 'required|exists:users,id',
            'presences.*.statut' => 'required|in:présent,absent,retard',
            'presences.*.est_justifie' => 'nullable|boolean',
            'presences.*.motif' => 'nullable|string',
            'is_closing' => 'nullable|boolean', // Si true, on clôture la séance
        ]);

        foreach ($validated['presences'] as $pData) {
            \App\Models\Presence::updateOrCreate(
                [
                    'seance_id' => $seance->id,
                    'participant_id' => $pData['participant_id'],
                ],
                [
                    'statut' => $pData['statut'],
                    'est_justifie' => $pData['est_justifie'] ?? false,
                    'motif' => $pData['motif'] ?? null,
                    'animateur_id' => $user->id,
                ]
            );
        }

        if ($request->input('is_closing')) {
            $seance->update(['statut' => 'terminée']);

            // ── Notifications Récapitulatives pour les Administrateurs ──────────
            $presencesSession = $seance->presences()->where('statut', 'absent')->where('est_justifie', false)->get();
            $absentsCount = $presencesSession->count();

            if ($absentsCount > 0) {
                $summaryNotif = new \App\Notifications\AttendanceSummaryNotification($seance, $absentsCount, $user);
                if ($seance->plan->createur) $seance->plan->createur->notify($summaryNotif);
                if ($seance->plan->validateur) $seance->plan->validateur->notify($summaryNotif);

                // Alertes seuil (individuelles mais envoyées une seule fois à la clôture)
                foreach ($presencesSession as $p) {
                    $nbAbsencesNJ = Presence::whereHas('seance', fn($q) => $q->where('plan_id', $seance->plan_id))
                        ->where('participant_id', $p->participant_id)
                        ->where('statut', 'absent')
                        ->where('est_justifie', false)
                        ->count();

                    if ($nbAbsencesNJ === ABSENCE_SEUIL) {
                        $participant = User::find($p->participant_id);
                        $seancePlan = $seance->plan->load(['createur', 'validateur']);
                        $seuilNotif = new \App\Notifications\AbsenceSeuilAtteint($seancePlan, $participant, $nbAbsencesNJ);
                        if ($seancePlan->createur) $seancePlan->createur->notify($seuilNotif);
                        if ($seancePlan->validateur) $seancePlan->validateur->notify($seuilNotif);
                    }
                }
            }

            // Si un feedback est actif pour cette séance, notifier les participants PRÉSENTS
            $seance->load(['feedbackForm', 'qcms' => function($q) {
                $q->where('est_publie', true);
            }]);
            
            $presents = collect();
            if ($seance->feedbackForm || $seance->qcms->count() > 0) {
                $presents = $seance->presences()->whereIn('statut', ['présent', 'retard'])->with('participant')->get()->pluck('participant');
            }

            if ($presents->count() > 0) {
                if ($seance->feedbackForm) {
                    Notification::send($presents, new FeedbackRequiredNotification($seance));
                }

                if ($seance->qcms->count() > 0) {
                    // Notifier pour le premier QCM publié trouvé
                    $qcm = $seance->qcms->first();
                    Notification::send($presents, new \App\Notifications\QcmRequiredNotification($qcm));
                }
            }

            return redirect()->route('modules.animateur.dashboard')
                ->with('success', 'Séance clôturée. Les administrateurs et participants ont été notifiés.');
        }

        return back()->with('success', 'Présences mises à jour.');
    }
    public function printSheet(Seance $seance)
    {
        $this->checkReportAccess($seance);

        $seance->load(['plan.entite', 'plan.participants.instituts', 'site', 'themes']);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.feuille_presence_manuelle', [
            'seance' => $seance,
            'participants' => $seance->plan->participants,
            'animateur' => Auth::user()
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream('Feuille_Presence_Manuelle_' . $seance->id . '.pdf');
    }

    public function exportAbsences(Seance $seance)
    {
        if ($seance->statut !== 'terminée') {
            abort(403, "Le rapport d'absences n'est disponible que pour les séances terminées.");
        }

        $this->checkReportAccess($seance);

        $seance->load(['plan.entite', 'plan.participants.instituts', 'site', 'themes', 'presences' => function($q) {
            $q->where('statut', '!=', 'présent');
        }]);

        // Calcul des stats flash
        $totalParticipants = $seance->plan->participants->count();
        $absentsCount = $seance->presences->count();
        $unjustifiedCount = $seance->presences->where('est_justifie', false)->count();
        $absenceRate = $totalParticipants > 0 ? round(($absentsCount / $totalParticipants) * 100, 1) : 0;

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rapport_absences', [
            'seance' => $seance,
            'animateur' => Auth::user(),
            'stats' => [
                'total' => $totalParticipants,
                'absents' => $absentsCount,
                'unjustified' => $unjustifiedCount,
                'rate' => $absenceRate
            ]
        ]);

        return $pdf->stream('Rapport_Absences_Seance_' . $seance->id . '.pdf');
    }

    /**
     * Vérifie si l'utilisateur a le droit d'accéder aux rapports d'une séance.
     */
    private function checkReportAccess(Seance $seance)
    {
        $user = Auth::user();
        
        // 1. L'animateur assigné a toujours accès
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if ($isAssigned) return;

        // 2. Administrateur Global
        if ($user->hasRole('ADMIN')) return;

        // 3. CDC : Uniquement ses propres plans
        if ($user->hasRole('CDC') && $seance->plan->cree_par === $user->id) return;

        // 4. RF : Uniquement les plans de son secteur
        if ($user->hasRole('RF')) {
            $planSecteurId = $seance->plan->entite->secteur_id ?? null;
            if ($planSecteurId && $user->secteurs()->where('secteurs.id', $planSecteurId)->exists()) {
                return;
            }
        }

        // Sinon, accès interdit
        abort(403, "Vous n'êtes pas autorisé à accéder à ce rapport.");
    }
}
