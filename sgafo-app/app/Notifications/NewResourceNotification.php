<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Seance;

class NewResourceNotification extends Notification
{
    use Queueable;

    protected $seance;
    protected $resourceTitle;

    public function __construct(Seance $seance, string $resourceTitle)
    {
        $this->seance = $seance;
        $this->resourceTitle = $resourceTitle;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'new_resource',
            'title' => '📁 Nouveau support disponible',
            'message' => "Un nouveau document \"{$this->resourceTitle}\" a été ajouté à votre séance.",
            'seance_id' => $this->seance->id,
            'plan_id' => $this->seance->plan_id,
            'action_url' => route('participant.dashboard'),
        ];
    }
}
