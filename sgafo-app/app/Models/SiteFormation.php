<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteFormation extends Model
{
    use HasFactory;

    protected $table = 'sites_formation';

    protected $fillable = [
        'nom',
        'adresse',
        'ville',
        'capacite',
        'region_id',
        'statut',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }
}
