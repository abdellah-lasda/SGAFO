<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Seance;

class SessionReminderNotification extends Notification
{
    use Queueable;

    protected $seance;

    public function __construct(Seance $seance)
    {
        $this->seance = $seance;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'session_reminder',
            'title' => '⏰ Rappel de Séance',
            'message' => "Votre séance de formation commence dans 1 heure.",
            'debut' => $this->seance->debut,
            'plan_title' => $this->seance->plan->titre,
            'action_url' => route('participant.dashboard'),
        ];
    }
}
