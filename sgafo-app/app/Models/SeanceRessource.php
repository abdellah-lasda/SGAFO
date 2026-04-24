<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeanceRessource extends Model
{
    protected $fillable = [
        'seance_id',
        'titre',
        'type',
        'path',
        'extension',
        'size',
    ];

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }
}
