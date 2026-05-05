<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'statut',
        'is_externe',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_externe' => 'boolean',
        ];
    }

    public function regions()
    {
        return $this->belongsToMany(Region::class);
    }

    public function instituts()
    {
        return $this->belongsToMany(Institut::class);
    }

    public function secteurs()
    {
        return $this->belongsToMany(Secteur::class, 'secteur_user');
    }

    public function cdcs()
    {
        return $this->belongsToMany(Cdc::class, 'cdc_user');
    }

    /**
     * Helper to check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('ADMIN');
    }

    /**
     * Plans créés par cet utilisateur.
     */
    public function plansCreated()
    {
        return $this->hasMany(PlanFormation::class, 'cree_par');
    }

    /**
     * Plans validés par cet utilisateur (RF).
     */
    public function plansValidated()
    {
        return $this->hasMany(PlanFormation::class, 'valide_par');
    }

    /**
     * Plans auxquels cet utilisateur participe.
     */
    public function plans()
    {
        return $this->belongsToMany(PlanFormation::class, 'plan_participants', 'participant_id', 'plan_id');
    }

    /**
     * Séances animées par cet utilisateur (Formateur).
     */
    public function seances()
    {
        return $this->belongsToMany(Seance::class, 'seance_themes', 'formateur_id', 'seance_id');
    }
}
