<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Qcm extends Model
{
    protected $fillable = [
        'seance_id',
        'titre',
        'description',
        'duree_minutes',
        'est_publie',
    ];

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }

    public function questions()
    {
        return $this->hasMany(QcmQuestion::class)->orderBy('ordre');
    }
}
