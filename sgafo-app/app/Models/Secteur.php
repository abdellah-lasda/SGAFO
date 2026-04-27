<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Secteur extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'nom', 'cdc_id'];

    /**
     * Get the CDC that manages this sector.
     */
    public function cdc()
    {
        return $this->belongsTo(Cdc::class);
    }

    /**
     * Get the users assigned to this sector.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'secteur_user');
    }

    /**
     * Get the metiers (specialities) assigned to this sector.
     */
    public function metiers()
    {
        return $this->hasMany(Metier::class);
    }

    /**
     * Get the training entities assigned to this sector.
     */
    public function entites()
    {
        return $this->hasMany(EntiteFormation::class);
    }
}
