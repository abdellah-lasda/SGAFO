<?php

namespace App\Http\Controllers\Modules\Animateur;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

    public function attendance(Seance $seance)
    {
        $user = Auth::user();

        // Vérifier que cet animateur est bien assigné à cette séance
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) {
            abort(403, "Vous n'êtes pas assigné à cette séance.");
        }

        // Charger le plan et ses participants
        $seance->load(['plan.entite', 'plan.participants.instituts', 'site', 'presences']);

        return Inertia::render('Modules/Animateur/AttendanceSheet', [
            'seance' => $seance,
            'participants' => $seance->plan->participants,
        ]);
    }

    public function submitAttendance(Request $request, Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) {
            abort(403);
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
            $presence = \App\Models\Presence::updateOrCreate(
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

            // Gérer les notifications pour les absences non justifiées
            if ($presence->statut === 'absent' && !$presence->est_justifie) {
                $participant = \App\Models\User::find($pData['participant_id']);
                $notification = new \App\Notifications\ParticipantAbsent($seance, $participant, $user);
                
                // Notifier le créateur du plan (CDC)
                if ($seance->plan->createur) {
                    $seance->plan->createur->notify($notification);
                }
                
                // Notifier le validateur du plan (RF)
                if ($seance->plan->validateur) {
                    $seance->plan->validateur->notify($notification);
                }
            }
        }

        if ($request->input('is_closing')) {
            $seance->update(['statut' => 'terminée']);
            return redirect()->route('modules.animateur.dashboard')
                ->with('success', 'Séance clôturée et présences enregistrées.');
        }

        return back()->with('success', 'Présences mises à jour.');
    }
    public function printSheet(Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) {
            abort(403);
        }

        $seance->load(['plan.entite', 'plan.participants.instituts', 'site', 'themes']);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.feuille_presence_manuelle', [
            'seance' => $seance,
            'participants' => $seance->plan->participants,
            'animateur' => $user
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream('Feuille_Presence_Manuelle_' . $seance->id . '.pdf');
    }
    public function exportAbsences(Seance $seance)
    {
        $user = Auth::user();
        $isAssigned = $seance->themes()->where('seance_themes.formateur_id', $user->id)->exists();
        if (!$isAssigned) {
            abort(403);
        }

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
            'animateur' => $user,
            'stats' => [
                'total' => $totalParticipants,
                'absents' => $absentsCount,
                'unjustified' => $unjustifiedCount,
                'rate' => $absenceRate
            ]
        ]);

        return $pdf->stream('Rapport_Absences_Seance_' . $seance->id . '.pdf');
    }
}
