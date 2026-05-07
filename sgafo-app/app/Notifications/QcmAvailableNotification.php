<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Qcm;
use App\Models\Seance;

class QcmAvailableNotification extends Notification
{
    use Queueable;

    protected $qcm;
    protected $seance;

    public function __construct(Qcm $qcm, Seance $seance)
    {
        $this->qcm = $qcm;
        $this->seance = $seance;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'qcm_unlocked',
            'title' => '📝 QCM Débloqué',
            'message' => "L'évaluation \"{$this->qcm->titre}\" est maintenant disponible pour votre séance.",
            'qcm_id' => $this->qcm->id,
            'seance_id' => $this->seance->id,
            'action_url' => route('participant.dashboard'), // Ou lien direct vers le QCM
        ];
    }
}
