<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Seance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

class SendSessionNotifications extends Command
{
    protected $signature = 'sgafo:notify-sessions';
    protected $description = 'Envoie les rappels de séance (H-1) et les notifications de déblocage QCM';

    public function handle()
    {
        $now = Carbon::now();

        // 1. Rappel de Séance (H-1)
        // On cherche les séances qui commencent dans environ 60 minutes (fenêtre de 5 min pour être sûr de ne pas les rater)
        $reminderWindowStart = $now->copy()->addMinutes(55);
        $reminderWindowEnd = $now->copy()->addMinutes(65);

        $sessionsToRemind = Seance::where('date', $now->toDateString())
            ->whereBetween('debut', [
                $reminderWindowStart->toTimeString(),
                $reminderWindowEnd->toTimeString()
            ])
            ->with('plan.participants')
            ->get();

        foreach ($sessionsToRemind as $seance) {
            $participants = $seance->plan->participants;
            if ($participants->count() > 0) {
                Notification::send($participants, new \App\Notifications\SessionReminderNotification($seance));
                $this->info("Rappel envoyé pour la séance {$seance->id}");
            }
        }

        // 2. QCM Débloqué (Dès que l'heure arrive)
        // On cherche les séances qui commencent maintenant
        $unlockWindowStart = $now->copy()->subMinutes(5);
        $unlockWindowEnd = $now->copy()->addMinutes(5);

        $sessionsStarting = Seance::where('date', $now->toDateString())
            ->whereBetween('debut', [
                $unlockWindowStart->toTimeString(),
                $unlockWindowEnd->toTimeString()
            ])
            ->with(['plan.participants', 'qcms' => function($q) {
                $q->where('est_publie', true);
            }])
            ->get();

        foreach ($sessionsStarting as $seance) {
            $participants = $seance->plan->participants;
            foreach ($seance->qcms as $qcm) {
                if ($participants->count() > 0) {
                    Notification::send($participants, new \App\Notifications\QcmAvailableNotification($qcm, $seance));
                    $this->info("Notification QCM '{$qcm->titre}' débloqué envoyée.");
                }
            }
        }

        return Command::SUCCESS;
    }
}
