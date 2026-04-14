<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cdc extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'nom'];

    /**
     * Get the sectors managed by this CDC.
     */
    public function secteurs()
    {
        return $this->hasMany(Secteur::class);
    }

    /**
     * Get the users (directors) assigned to this CDC.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'cdc_user');
    }
}
