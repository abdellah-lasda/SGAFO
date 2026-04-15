<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ville',
        'adresse',
        'telephone',
        'region_id',
        'prix_nuitee',
        'statut',
    ];

    /**
     * Get the region that the hotel belongs to.
     */
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
}
