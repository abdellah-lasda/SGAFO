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

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        if ($this->type === 'link') {
            return $this->path;
        }
        
        return \Illuminate\Support\Facades\Storage::url($this->path);
    }

    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }
}
