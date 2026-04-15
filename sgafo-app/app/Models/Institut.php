<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institut extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'code', 'region_id', 'adresse', 'ville'];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function formateurs()
    {
        return $this->belongsToMany(User::class);
    }
}
