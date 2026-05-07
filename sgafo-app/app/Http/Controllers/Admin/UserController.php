<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Region;
use App\Models\Cdc;
use App\Models\Secteur;
use App\Models\Institut;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $isExterne = $request->input('is_externe');
        $regionId = $request->input('region_id');
        $secteurId = $request->input('secteur_id');
        $institutId = $request->input('institut_id');

        // Récupération paginée avec filtrage
        $users = User::with('roles', 'regions', 'instituts', 'secteurs', 'cdcs')
            ->when($search, function($q) use ($search) {
                $q->where(function($sq) use ($search) {
                    $sq->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role, function($q) use ($role) {
                $q->whereHas('roles', function($rq) use ($role) {
                    $rq->where('code', $role);
                });
            })
            ->when($isExterne !== null, function($q) use ($isExterne) {
                $q->where('is_externe', $isExterne === '1' || $isExterne === 'true');
            })
            ->when($regionId, function($q) use ($regionId) {
                $q->where(function($subQ) use ($regionId) {
                    $subQ->whereHas('regions', function($rq) use ($regionId) {
                        $rq->where('regions.id', $regionId);
                    })->orWhereHas('instituts', function($iq) use ($regionId) {
                        $iq->where('region_id', $regionId);
                    });
                });
            })
            ->when($secteurId, function($q) use ($secteurId) {
                $q->whereHas('secteurs', function($sq) use ($secteurId) {
                    $sq->where('secteurs.id', $secteurId);
                });
            })
            ->when($institutId, function($q) use ($institutId) {
                $q->whereHas('instituts', function($iq) use ($institutId) {
                    $iq->where('instituts.id', $institutId);
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $roles = Role::all();
        $regions = Region::all();
        $instituts = Institut::all();
        $secteurs = Secteur::all();
        $cdcs = Cdc::all();

        // Statistiques pour les badges
        $roleCounts = [
            'RF' => User::role('RF')->count(),
            'CDC' => User::role('CDC')->count(),
            'FORMATEUR' => User::role('FORMATEUR')->count(),
            'DR' => User::role('DR')->count(),
            'ADMIN' => User::role('ADMIN')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'regions' => $regions,
            'instituts' => $instituts,
            'secteurs' => $secteurs,
            'cdcs' => $cdcs,
            'roleCounts' => $roleCounts,
            'filters' => $request->only(['search', 'role', 'is_externe', 'region_id', 'secteur_id', 'institut_id']),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'statut' => $validated['statut'],
            'is_externe' => $validated['is_externe'] ?? false,
        ]);

        if (!empty($validated['roles'])) {
            $user->roles()->attach($validated['roles'], ['assigned_at' => now(), 'assigned_by' => auth()->id()]);
        }

        if (!empty($validated['regions'])) {
            $user->regions()->attach($validated['regions']);
        }

        if (!empty($validated['cdcs'])) {
            $user->cdcs()->attach($validated['cdcs']);
        }

        if (!empty($validated['secteurs'])) {
            $user->secteurs()->attach($validated['secteurs']);
        }

        if (!empty($validated['instituts']) && !($validated['is_externe'] ?? false)) {
            $user->instituts()->attach($validated['instituts']);
        }

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $user->nom = $validated['nom'];
        $user->prenom = $validated['prenom'];
        $user->email = $validated['email'];
        $user->statut = $validated['statut'];
        $user->is_externe = $validated['is_externe'] ?? false;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        if (!empty($validated['roles'])) {
            $user->roles()->syncWithPivotValues($validated['roles'], ['assigned_at' => now(), 'assigned_by' => auth()->id()]);
        }
        
        $user->regions()->sync($validated['regions'] ?? []);
        $user->cdcs()->sync($validated['cdcs'] ?? []);
        $user->secteurs()->sync($validated['secteurs'] ?? []);
        
        if ($user->is_externe) {
            $user->instituts()->sync([]); 
        } else {
            $user->instituts()->sync($validated['instituts'] ?? []);
        }

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Impossible de supprimer votre propre compte.');
        }
        $user->delete();
        return redirect()->back()->with('success', 'Utilisateur supprimé.');
    }

    /**
     * Affiche le dossier consolidé d'un utilisateur.
     */
    public function dossier(User $user)
    {
        $user->load(['roles', 'regions', 'instituts', 'secteurs', 'cdcs']);

        // 1. Stats Participant (Pour tous les formateurs participants)
        $plansParticipant = $user->plans()
            ->with(['entite.secteur'])
            ->get();
            
        $presences = $user->presences()->get();
        $qcmAttempts = $user->qcmAttempts()->get();

        $attendanceRate = $presences->count() > 0 
            ? round(($presences->where('statut', 'présent')->count() / $presences->count()) * 100) 
            : 0;

        $avgQcm = $qcmAttempts->count() > 0 
            ? round($qcmAttempts->avg(fn($a) => $a->total_points > 0 ? ($a->score / $a->total_points) * 100 : 0)) 
            : 0;

        // 2. Stats Animateur (Pour les formateurs animateurs)
        $seancesAnimated = $user->seances()
            ->with(['plan.entite', 'site'])
            ->withPivot('heures_planifiees')
            ->get();
            
        $hoursTaught = $seancesAnimated->sum('pivot.heures_planifiees');
        $avgSatisfaction = 4.8; 

        // 3. Stats Gestionnaire (Pour CDC / RF / ADMIN)
        $plansCreated = $user->plansCreated()->with('entite.secteur')->get();
        $plansValidated = $user->plansValidated()->with('entite.secteur')->get();

        return Inertia::render('Admin/Users/Dossier', [
            'userProfile' => $user,
            'stats' => [
                'participant' => [
                    'plans_count' => $plansParticipant->count(),
                    'attendance_rate' => $attendanceRate,
                    'avg_qcm' => $avgQcm,
                    'plans' => $plansParticipant,
                ],
                'animateur' => [
                    'seances_count' => $seancesAnimated->count(),
                    'hours_taught' => $hoursTaught,
                    'avg_satisfaction' => $avgSatisfaction,
                    'seances' => $seancesAnimated,
                ],
                'gestionnaire' => [
                    'created_count' => $plansCreated->count(),
                    'validated_count' => $plansValidated->count(),
                    'plans_created' => $plansCreated,
                    'plans_validated' => $plansValidated,
                ]
            ]
        ]);
    }
}
