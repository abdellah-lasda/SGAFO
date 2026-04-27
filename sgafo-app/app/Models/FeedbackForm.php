<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackForm extends Model
{
    protected $fillable = [
        'seance_id',
        'titre',
        'description',
        'is_active',
        'created_by',
    ];

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }

    public function questions()
    {
        return $this->hasMany(FeedbackQuestion::class)->orderBy('ordre');
    }

    public function submissions()
    {
        return $this->hasMany(FeedbackSubmission::class);
    }
}
