<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SeanceTheme extends Model
{
    use HasFactory;

    protected $fillable = [
        'seance_id',
        'plan_theme_id',
        'heures_planifiees',
    ];

    public function seance()
    {
        return $this->belongsTo(Seance::class, 'seance_id');
    }

    public function theme()
    {
        return $this->belongsTo(PlanTheme::class, 'plan_theme_id');
    }
}
