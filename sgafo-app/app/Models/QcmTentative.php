<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QcmTentative extends Model
{
    protected $fillable = [
        'user_id',
        'qcm_id',
        'score',
        'total_points',
        'commence_le',
        'termine_le',
        'duree_secondes',
    ];

    protected $casts = [
        'commence_le' => 'datetime',
        'termine_le' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function qcm()
    {
        return $this->belongsTo(Qcm::class);
    }

    public function reponses()
    {
        return $this->hasMany(QcmReponse::class, 'tentative_id');
    }
}
