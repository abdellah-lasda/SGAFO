<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AvailabilityController extends Controller
{
    public function checkUsers(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'plan_id' => 'nullable|integer', // To exclude current plan if editing
        ]);

        $userIds = $request->user_ids;
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $currentPlanId = $request->plan_id;

        // 1. Conflicts for PARTICIPANTS (users in plan_participants table)
        $participantConflicts = DB::table('plan_participants')
            ->join('plans_formation', 'plan_participants.plan_id', '=', 'plans_formation.id')
            ->join('seances', 'plans_formation.id', '=', 'seances.plan_id')
            ->whereIn('plan_participants.user_id', $userIds)
            ->whereBetween('seances.date', [$startDate, $endDate])
            ->when($currentPlanId, function ($query) use ($currentPlanId) {
                return $query->where('plans_formation.id', '!=', $currentPlanId);
            })
            ->select(
                'plan_participants.user_id',
                'seances.date',
                'plans_formation.titre as plan_titre',
                'seances.id as seance_id'
            )
            ->get();

        // 2. Conflicts for ANIMATORS (users in seance_themes table)
        $animatorConflicts = DB::table('seance_themes')
            ->join('seances', 'seance_themes.seance_id', '=', 'seances.id')
            ->join('plans_formation', 'seances.plan_id', '=', 'plans_formation.id')
            ->whereIn('seance_themes.formateur_id', $userIds)
            ->whereBetween('seances.date', [$startDate, $endDate])
            ->when($currentPlanId, function ($query) use ($currentPlanId) {
                return $query->where('plans_formation.id', '!=', $currentPlanId);
            })
            ->select(
                'seance_themes.formateur_id as user_id',
                'seances.date',
                'plans_formation.titre as plan_titre',
                'seances.id as seance_id'
            )
            ->get();

        // Combine conflicts
        $allConflicts = $participantConflicts->concat($animatorConflicts)
            ->groupBy('user_id')
            ->map(function ($conflicts) {
                return $conflicts->map(function ($c) {
                    return [
                        'date' => $c->date,
                        'plan_titre' => $c->plan_titre,
                        'seance_id' => $c->seance_id,
                    ];
                });
            });

        return response()->json([
            'conflicts' => $allConflicts
        ]);
    }
}
