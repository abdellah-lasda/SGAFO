<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PlanValidatedNotification extends Notification
{
    use Queueable;

    protected $plan;

    public function __construct($plan)
    {
        $this->plan = $plan;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'plan_validated',
            'title' => 'Planning validé',
            'message' => "Le planning pour la formation \"" . $this->plan->titre . "\" a été validé. Vous pouvez consulter vos séances.",
            'plan_id' => $this->plan->id,
            'action_url' => route('modules.catalogue.show', $this->plan->id),
            'color' => 'purple'
        ];
    }
}
