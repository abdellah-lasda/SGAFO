<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewFeedbackNotification extends Notification
{
    use Queueable;

    protected $submission;

    public function __construct($submission)
    {
        $this->submission = $submission;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'feedback_received',
            'title' => 'Nouveau feedback reçu',
            'message' => "Un participant a évalué la séance du " . \Carbon\Carbon::parse($this->submission->seance->date)->format('d/m/Y'),
            'plan_title' => $this->submission->plan->titre,
            'participant_name' => $this->submission->participant->nom . ' ' . $this->submission->participant->prenom,
            'seance_id' => $this->submission->seance_id,
            'action_url' => route('modules.feedback.results', $this->submission->seance_id),
            'color' => 'emerald'
        ];
    }
}
