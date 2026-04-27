<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackQuestion extends Model
{
    protected $fillable = [
        'feedback_form_id',
        'question_text',
        'type',
        'ordre',
    ];

    public function form()
    {
        return $this->belongsTo(FeedbackForm::class, 'feedback_form_id');
    }

    public function responses()
    {
        return $this->hasMany(FeedbackResponse::class, 'question_id');
    }
}
