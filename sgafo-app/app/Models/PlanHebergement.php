<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanHebergement extends Model
{
    protected $fillable = [
        'plan_id',
        'user_id',
        'hotel_id',
        'nombre_nuits',
        'cout_total',
    ];

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
