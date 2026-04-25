<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanRessource extends Model
{
    protected $fillable = [
        'plan_formation_id',
        'titre',
        'type',
        'path',
        'extension',
        'size',
    ];

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_formation_id');
    }
}
