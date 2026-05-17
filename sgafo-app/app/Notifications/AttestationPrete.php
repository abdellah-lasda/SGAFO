<?php

namespace App\Notifications;

use App\Models\Attestation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AttestationPrete extends Notification
{
    use Queueable;

    public function __construct(public Attestation $attestation) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $type = $this->attestation->type === 'participant'
            ? 'Participation'
            : 'Animation';

        return [
            'title' => 'Attestation disponible',
            'message' => "Votre attestation de {$type} pour la formation \"{$this->attestation->plan->titre}\" est prête.",
            'type' => 'success',
            'action_url' => route('attestations.download', $this->attestation->download_token),
            'plan_id' => $this->attestation->plan_id,
            'plan_titre' => $this->attestation->plan->titre,
            'color' => 'emerald',
        ];
    }
}
