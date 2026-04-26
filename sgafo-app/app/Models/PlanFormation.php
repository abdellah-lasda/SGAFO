<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanFormation extends Model
{
    use HasFactory;

    protected $table = 'plans_formation';

    protected $fillable = [
        'entite_id',
        'titre',
        'statut',
        'motif_rejet',
        'cree_par',
        'valide_par',
        'date_soumission',
        'date_validation',
        'site_formation_id',
        'date_debut',
        'date_fin',
        'plateforme',
        'lien_visio',
    ];

    protected function casts(): array
    {
        return [
            'date_soumission' => 'datetime',
            'date_validation' => 'datetime',
            'date_debut' => 'date:Y-m-d',
            'date_fin' => 'date:Y-m-d',
        ];
    }

    // ─── Relations ───────────────────────────────────────────

    public function entite()
    {
        return $this->belongsTo(EntiteFormation::class, 'entite_id');
    }

    public function createur()
    {
        return $this->belongsTo(User::class, 'cree_par');
    }

    public function validateur()
    {
        return $this->belongsTo(User::class, 'valide_par');
    }

    public function themes()
    {
        return $this->hasMany(PlanTheme::class, 'plan_id')->orderBy('ordre');
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'plan_participants', 'plan_id', 'participant_id')
                    ->withPivot('added_by', 'added_at');
    }

    public function siteFormation()
    {
        return $this->belongsTo(SiteFormation::class, 'site_formation_id');
    }

    public function hebergements()
    {
        return $this->hasMany(PlanHebergement::class, 'plan_id');
    }

    public function validationLogs()
    {
        return $this->hasMany(PlanValidationLog::class, 'plan_id')->orderBy('created_at', 'desc');
    }

    public function seances()
    {
        return $this->hasMany(Seance::class, 'plan_id')->orderBy('date')->orderBy('debut');
    }

    public function ressources()
    {
        return $this->hasMany(PlanRessource::class, 'plan_formation_id');
    }

    // ─── Helpers ────────────────────────────────────────────

    /**
     * Le plan est-il modifiable ? (brouillon ou rejeté uniquement)
     */
    public function isEditable(): bool
    {
        return in_array($this->statut, ['brouillon', 'rejeté']);
    }

    /**
     * Le plan peut-il être soumis ? (par un CDC uniquement, statut brouillon/rejeté)
     */
    public function isSubmittable(): bool
    {
        return in_array($this->statut, ['brouillon', 'rejeté']);
    }

    /**
     * Le plan peut-il être validé techniquement ?
     * (Uniquement après confirmation et avec planning)
     */
    public function canBeValidated(): bool
    {
        return $this->statut === 'confirmé' && $this->seances()->count() > 0;
    }

    /**
     * Le plan peut-il être confirmé administrativement ?
     */
    public function canBeConfirmed(): bool
    {
        return $this->statut === 'soumis' || ($this->statut === 'brouillon' && auth()->user()->hasRole('RF'));
    }

    /**
     * Vérifie si le planning est géré.
     */
    public function hasPlanning(): bool
    {
        return $this->seances()->count() > 0;
    }

    /**
     * Le plan peut-il être annulé ?
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->statut, ['confirmé', 'validé']);
    }

    /**
     * Récupérer tous les IDs uniques des animateurs affectés à ce plan.
     */
    public function getAnimateurIds(): array
    {
        return $this->themes()
                    ->with('animateurs')
                    ->get()
                    ->pluck('animateurs')
                    ->flatten()
                    ->pluck('id')
                    ->unique()
                    ->values()
                    ->toArray();
    }
}
