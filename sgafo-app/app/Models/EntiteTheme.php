<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntiteTheme extends Model
{
    protected $fillable = [
        'entite_id',
        'titre',
        'duree_heures',
        'objectifs',
    ];

    public function entite()
    {
        return $this->belongsTo(EntiteFormation::class, 'entite_id');
    }
}
