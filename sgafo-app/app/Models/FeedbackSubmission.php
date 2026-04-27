<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackSubmission extends Model
{
    protected $fillable = [
        'feedback_form_id',
        'participant_id',
        'plan_id',
        'seance_id',
        'commentaire_general',
        'est_affiche_sur_plan',
    ];

    public function participant()
    {
        return $this->belongsTo(User::class, 'participant_id');
    }

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_id');
    }

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }

    public function responses()
    {
        return $this->hasMany(FeedbackResponse::class, 'feedback_submission_id');
    }
}
