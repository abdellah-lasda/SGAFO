<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    protected $fillable = [
        'seance_id',
        'participant_id',
        'statut',
        'est_justifie',
        'motif',
        'heure_arrivee',
        'animateur_id',
    ];

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }

    public function participant()
    {
        return $this->belongsTo(User::class, 'participant_id');
    }

    public function animateur()
    {
        return $this->belongsTo(User::class, 'animateur_id');
    }
}
