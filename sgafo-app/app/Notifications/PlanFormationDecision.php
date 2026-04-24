<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PlanFormationDecision extends Notification
{
    use Queueable;

    protected $plan;
    protected $decision; // 'valide' or 'rejete'
    protected $commentaire;

    /**
     * Create a new notification instance.
     */
    public function __construct($plan, $decision, $commentaire = null)
    {
        $this->plan = $plan;
        $this->decision = $decision;
        $this->commentaire = $commentaire;
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
        $statusLabel = $this->decision === 'validé' ? 'validé' : 'rejeté';
        
        return [
            'plan_id' => $this->plan->id,
            'plan_titre' => $this->plan->titre,
            'message' => "Votre plan de formation \"{$this->plan->titre}\" a été {$statusLabel}.",
            'type' => $this->decision === 'validé' ? 'success' : 'danger',
            'decision' => $this->decision,
            'commentaire' => $this->commentaire,
            'action_url' => route('modules.plans.show', $this->plan->id),
        ];
    }
}
