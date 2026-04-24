<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PlanFormationSoumis extends Notification
{
    use Queueable;

    protected $plan;

    /**
     * Create a new notification instance.
     */
    public function __construct($plan)
    {
        $this->plan = $plan;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'plan_id' => $this->plan->id,
            'plan_titre' => $this->plan->titre,
            'entite_nom' => $this->plan->entite->titre,
            'createur_nom' => $this->plan->createur->prenom . ' ' . $this->plan->createur->nom,
            'message' => 'Un nouveau plan de formation a été soumis pour validation.',
            'type' => 'soumission',
            'action_url' => route('modules.validations.show', $this->plan->id),
        ];
    }
}
