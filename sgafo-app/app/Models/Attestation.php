<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Attestation extends Model
{
    protected $fillable = [
        'plan_id',
        'user_id',
        'type',
        'file_path',
        'download_token',
        'downloaded_at',
    ];

    protected $casts = [
        'downloaded_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Attestation $attestation) {
            if (empty($attestation->download_token)) {
                $attestation->download_token = (string) Str::uuid();
            }
        });
    }

    public function plan()
    {
        return $this->belongsTo(PlanFormation::class, 'plan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getDownloadUrlAttribute(): string
    {
        return route('attestations.download', $this->download_token);
    }
}
