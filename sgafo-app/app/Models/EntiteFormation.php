<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntiteFormation extends Model
{
    protected $fillable = [
        'titre',
        'type',
        'mode',
        'secteur_id',
        'description',
        'objectifs',
        'statut',
        'cree_par_id',
    ];

    public function themes()
    {
        return $this->hasMany(EntiteTheme::class, 'entite_id');
    }

    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'cree_par_id');
    }
}
