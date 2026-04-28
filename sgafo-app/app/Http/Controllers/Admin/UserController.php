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
            'filters' => $request->only(['search', 'role']),
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
}
