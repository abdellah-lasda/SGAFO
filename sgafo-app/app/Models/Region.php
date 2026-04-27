<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = ['code', 'nom'];

    /**
     * Get the institutes in this region.
     */
    public function instituts()
    {
        return $this->hasMany(Institut::class);
    }
}
