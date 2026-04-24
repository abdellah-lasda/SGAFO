<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ParticipantAbsent extends Notification
{
    use Queueable;

    protected $seance;
    protected $participant;
    protected $animateur;

    /**
     * Create a new notification instance.
     */
    public function __construct($seance, $participant, $animateur)
    {
        $this->seance = $seance;
        $this->participant = $participant;
        $this->animateur = $animateur;
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
            'type' => 'danger',
            'message' => "Alerte Absence : {$this->participant->prenom} {$this->participant->nom} est absent à la séance du " . $this->seance->date->format('d/m/Y'),
            'participant_nom' => $this->participant->prenom . ' ' . $this->participant->nom,
            'plan_titre' => $this->seance->plan->titre,
            'seance_id' => $this->seance->id,
            'animateur_nom' => $this->animateur->prenom . ' ' . $this->animateur->nom,
            'action_url' => route('modules.plans.show', $this->seance->plan_id), // Vers le plan pour voir l'historique
        ];
    }
}
