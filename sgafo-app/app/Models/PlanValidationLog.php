<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanValidationLog extends Model
{
    protected $fillable = [
        'plan_id',
        'user_id',
        'action',
        'commentaire',
    ];

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
