<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SeanceTheme extends Pivot
{
    protected $table = 'seance_themes';

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }
}
