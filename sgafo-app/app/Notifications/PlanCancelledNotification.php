<?php

namespace App\Notifications;

use App\Models\PlanFormation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PlanCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $plan;
    protected $motif;

    /**
     * Create a new notification instance.
     */
    public function __construct(PlanFormation $plan, string $motif)
    {
        $this->plan = $plan;
        $this->motif = $motif;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): array|MailMessage
    {
        return (new MailMessage)
                    ->subject('Annulation de formation : ' . $this->plan->titre)
                    ->greeting('Bonjour ' . $notifiable->prenom . ',')
                    ->line('Nous vous informons que le plan de formation "' . $this->plan->titre . '" a été annulé.')
                    ->line('Motif de l\'annulation :')
                    ->line('"' . $this->motif . '"')
                    ->action('Voir les détails', url('/modules/plans/' . $this->plan->id))
                    ->line('Merci de votre compréhension.');
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
            'titre' => $this->plan->titre,
            'motif' => $this->motif,
            'message' => 'La formation "' . $this->plan->titre . '" a été annulée.',
            'type' => 'annulation',
        ];
    }
}
