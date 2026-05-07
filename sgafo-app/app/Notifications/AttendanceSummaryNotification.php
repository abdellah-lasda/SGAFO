<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AttendanceSummaryNotification extends Notification
{
    use Queueable;

    protected $seance;
    protected $absentsCount;
    protected $animateur;

    public function __construct($seance, $absentsCount, $animateur)
    {
        $this->seance = $seance;
        $this->absentsCount = $absentsCount;
        $this->animateur = $animateur;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'warning',
            'message' => "Feuille de présence clôturée : {$this->absentsCount} absence(s) signalée(s) par {$this->animateur->prenom} {$this->animateur->nom} pour la séance du " . $this->seance->date->format('d/m/Y'),
            'plan_titre' => $this->seance->plan->titre,
            'seance_id' => $this->seance->id,
            'absents_count' => $this->absentsCount,
            'action_url' => route('modules.plans.show', $this->seance->plan_id) . '?tab=suivi',
        ];
    }
}
