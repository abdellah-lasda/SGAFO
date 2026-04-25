<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QcmQuestion extends Model
{
    protected $fillable = [
        'qcm_id',
        'texte',
        'type',
        'points',
        'ordre',
    ];

    public function qcm()
    {
        return $this->belongsTo(Qcm::class);
    }

    public function options()
    {
        return $this->hasMany(QcmOption::class, 'question_id');
    }
}
