<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QcmOption extends Model
{
    protected $fillable = [
        'question_id',
        'texte',
        'est_correcte',
    ];

    protected $casts = [
        'est_correcte' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(QcmQuestion::class, 'question_id');
    }
}
