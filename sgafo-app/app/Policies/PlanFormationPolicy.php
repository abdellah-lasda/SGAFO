<?php

namespace App\Policies;

use App\Models\PlanFormation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PlanFormationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PlanFormation $planFormation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PlanFormation $planFormation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PlanFormation $planFormation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PlanFormation $planFormation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PlanFormation $planFormation): bool
    {
        return false;
    }

    /**
     * Determine whether the user can validate the plan.
     */
    public function validate(User $user, PlanFormation $planFormation): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->hasRole('RF')) {
            $planSecteurId = $planFormation->entite->secteur_id ?? null;
            if ($planSecteurId && $user->secteurs()->where('secteurs.id', $planSecteurId)->exists()) {
                return true;
            }
        }

        return false;
    }
}
