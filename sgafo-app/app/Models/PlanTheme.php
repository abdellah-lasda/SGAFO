<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanTheme extends Model
{
    protected $table = 'plan_themes';

    protected $fillable = [
        'plan_id',
        'nom',
        'duree_heures',
        'objectifs',
        'ordre',
    ];

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_id');
    }

    /**
     * Les animateurs affectés à ce thème (co-animation possible).
     */
    public function animateurs()
    {
        return $this->belongsToMany(User::class, 'plan_theme_animateurs', 'theme_id', 'animateur_id');
    }

    
}
