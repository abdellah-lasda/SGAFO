<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Qcm;

class PerfectScoreNotification extends Notification
{
    use Queueable;

    protected $qcm;

    public function __construct(Qcm $qcm)
    {
        $this->qcm = $qcm;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'perfect_score',
            'title' => '🎊 Félicitations !',
            'message' => "Bravo ! Vous avez obtenu un score parfait (100%) au QCM \"{$this->qcm->titre}\". Continuez ainsi !",
            'qcm_id' => $this->qcm->id,
            'action_url' => route('participant.dashboard'),
        ];
    }
}
