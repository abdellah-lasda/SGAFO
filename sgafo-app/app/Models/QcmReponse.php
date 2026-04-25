<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QcmReponse extends Model
{
    protected $fillable = [
        'tentative_id',
        'question_id',
        'options_selectionnees',
        'est_correcte',
        'points_obtenus',
    ];

    protected $casts = [
        'options_selectionnees' => 'array',
        'est_correcte' => 'boolean',
    ];

    public function tentative()
    {
        return $this->belongsTo(QcmTentative::class, 'tentative_id');
    }

    public function question()
    {
        return $this->belongsTo(QcmQuestion::class, 'question_id');
    }
}
