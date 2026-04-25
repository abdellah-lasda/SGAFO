<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanRessource extends Model
{
    protected $fillable = [
        'plan_formation_id',
        'titre',
        'type',
        'path',
        'extension',
        'size',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        if ($this->type === 'link') {
            return $this->path;
        }
        
        return \Illuminate\Support\Facades\Storage::url($this->path);
    }

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_formation_id');
    }
}
