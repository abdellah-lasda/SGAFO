<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Metier extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'nom', 'secteur_id'];

    public function secteur()
    {
        return $this->belongsTo(Secteur::class);
    }
}
