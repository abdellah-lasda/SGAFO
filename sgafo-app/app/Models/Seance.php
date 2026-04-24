<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seance extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'site_id',
        'date',
        'debut',
        'fin',
        'statut',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_id');
    }

    public function site()
    {
        return $this->belongsTo(SiteFormation::class, 'site_id');
    }

    public function themes()
    {
        return $this->belongsToMany(PlanTheme::class, 'seance_themes', 'seance_id', 'plan_theme_id')
                    ->withPivot(['heures_planifiees', 'formateur_id'])
                    ->withTimestamps();
    }

    public function presences()
    {
        return $this->hasMany(Presence::class);
    }

    public function ressources()
    {
        return $this->hasMany(SeanceRessource::class);
    }
}
