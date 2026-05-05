<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\PlanFormation;
use App\Models\User;

class AbsenceSeuilAtteint extends Notification
{
    use Queueable;

    public function __construct(
        protected PlanFormation $plan,
        protected User $participant,
        protected int $nbAbsences
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'            => 'warning',
            'message'         => "⚠️ Alerte seuil : {$this->participant->prenom} {$this->participant->nom} a atteint {$this->nbAbsences} absences non justifiées dans \"{$this->plan->titre}\".",
            'participant_id'  => $this->participant->id,
            'participant_nom' => $this->participant->prenom . ' ' . $this->participant->nom,
            'plan_id'         => $this->plan->id,
            'plan_titre'      => $this->plan->titre,
            'nb_absences'     => $this->nbAbsences,
            'action_url'      => route('modules.absences.dashboard', ['plan_id' => $this->plan->id]),
        ];
    }
}
