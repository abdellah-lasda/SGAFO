<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

trait HasRegionalScope
{
    /**
     * Boot the trait.
     */
    protected static function bootHasRegionalScope()
    {
        static::addGlobalScope('regional', function (Builder $builder) {
            // 1. POSER LE VERROU IMMÉDIATEMENT (Avant tout appel à Auth ou User)
            if (app()->has('sgafo.is_filtering') || app()->runningInConsole()) {
                return;
            }

            try {
                app()->instance('sgafo.is_filtering', true);

                // 2. Maintenant on peut vérifier l'utilisateur sans risque de boucle
                if (!Auth::check()) {
                    return;
                }

                $user = Auth::user();

                // 3. Filtrer uniquement pour les DR
                if (!$user->hasRole('DR')) {
                    return;
                }

                // Récupérer les IDs de région (Cache statique local à la requête)
                static $regionIds = null;
                if ($regionIds === null) {
                    $regionIds = DB::table('region_user')
                        ->where('user_id', $user->id)
                        ->pluck('region_id')
                        ->toArray();
                }

                if (empty($regionIds)) {
                    $builder->whereRaw('1 = 0');
                    return;
                }

                $model = $builder->getModel();
                $table = $model->getTable();

                // Logique de filtrage
                if (\Schema::hasColumn($table, 'region_id')) {
                    $builder->whereIn($table . '.region_id', $regionIds);
                } elseif ($table === 'plans_formation') {
                    // Logique "Humaine et Géographique" (Point crucial demandé)
                    $builder->where(function ($q) use ($regionIds) {
                        // 1. Le lieu de formation est dans la région
                        $q->whereHas('siteFormation', function ($sq) use ($regionIds) {
                            $sq->whereIn('region_id', $regionIds);
                        })
                        // 2. OU au moins un participant est de la région
                        ->orWhereHas('participants.instituts', function ($sq) use ($regionIds) {
                            $sq->whereIn('region_id', $regionIds);
                        })
                        // 3. OU au moins un animateur (formateur) est de la région
                        ->orWhereHas('seances.seanceThemes.formateur.instituts', function ($sq) use ($regionIds) {
                            $sq->whereIn('region_id', $regionIds);
                        });
                    });
                } elseif ($table === 'seances') {
                    $builder->whereHas('plan', function ($q) use ($regionIds) {
                         // On réutilise la logique du plan pour les séances
                         $q->whereHas('siteFormation', function($sq) use ($regionIds) { $sq->whereIn('region_id', $regionIds); });
                    });
                } elseif ($table === 'feedback_submissions') {
                    $builder->whereHas('participant.instituts', function($sq) use ($regionIds) {
                        $sq->whereIn('region_id', $regionIds);
                    });
                } elseif ($table === 'presences') {
                    $builder->whereHas('participant.instituts', function($sq) use ($regionIds) {
                        $sq->whereIn('region_id', $regionIds);
                    });
                } elseif ($table === 'qcms') {
                    $builder->whereHas('seance.plan.participants.instituts', function($sq) use ($regionIds) {
                        $sq->whereIn('region_id', $regionIds);
                    });
                }
            } finally {
                // Toujours libérer le verrou
                app()->forgetInstance('sgafo.is_filtering');
            }
        });
    }
}
