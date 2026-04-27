<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class QcmRequiredNotification extends Notification
{
    use Queueable;

    protected $qcm;

    public function __construct($qcm)
    {
        $this->qcm = $qcm;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'qcm_required',
            'title' => 'Test de connaissances',
            'message' => "Le QCM pour la séance \"" . $this->qcm->seance->plan->titre . "\" est disponible. Vous pouvez maintenant évaluer vos acquis.",
            'seance_id' => $this->qcm->seance_id,
            'qcm_id' => $this->qcm->id,
            'action_url' => route('participant.qcm.passage', $this->qcm->id),
            'color' => 'amber'
        ];
    }
}
