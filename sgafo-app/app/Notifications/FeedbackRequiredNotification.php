<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FeedbackRequiredNotification extends Notification
{
    use Queueable;

    protected $seance;

    public function __construct($seance)
    {
        $this->seance = $seance;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'feedback_required',
            'title' => 'Évaluation disponible',
            'message' => "La séance sur \"" . $this->seance->plan->titre . "\" est terminée. Votre avis nous intéresse !",
            'seance_id' => $this->seance->id,
            'action_url' => route('participant.feedback.show', $this->seance->id),
            'color' => 'blue'
        ];
    }
}
