<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttestationTemplate extends Model
{
    protected $fillable = [
        'plan_id',
        'type',
        'html_content',
        'css_content',
        'created_by',
    ];

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
