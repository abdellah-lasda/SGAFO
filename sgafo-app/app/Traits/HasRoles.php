<?php

namespace App\Traits;

use App\Models\Role;

trait HasRoles
{
    /**
     * Get the roles assigned to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->withPivot('assigned_at', 'assigned_by');
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $code): bool
    {
        return $this->roles()->where('code', $code)->exists();
    }

    public function isCDC(): bool      { return $this->hasRole('CDC'); }
    public function isRF(): bool       { return $this->hasRole('RF'); }
    public function isDR(): bool       { return $this->hasRole('DR'); }
    public function isFormateur(): bool { return $this->hasRole('FORMATEUR'); }
    public function isAdmin(): bool    { return $this->hasRole('ADMIN'); }

    /**
     * Get primary role for display
     */
    public function primaryRole(): ?string
    {
        return $this->roles()->first()?->code;
    }

    /**
     * Scope for filtering by role code
     */
    public function scopeRole($query, string $code)
    {
        return $query->whereHas('roles', function($q) use ($code) {
            $q->where('code', $code);
        });
    }
}
