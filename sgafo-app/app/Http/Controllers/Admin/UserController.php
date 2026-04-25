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
    public function index()
    {
        // On récupère les utilisateurs avec leur rôles
        $users = User::with('roles', 'regions', 'instituts', 'secteurs', 'cdcs')->orderBy('id', 'desc')->get();
        $roles = Role::all();
        $regions = Region::all();
        $instituts = Institut::all();
        $secteurs = Secteur::all();
        $cdcs = Cdc::all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'regions' => $regions,
            'instituts' => $instituts,
            'secteurs' => $secteurs,
            'cdcs' => $cdcs,
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

        // Attach roles
        if (!empty($validated['roles'])) {
            $user->roles()->attach($validated['roles'], ['assigned_at' => now(), 'assigned_by' => auth()->id()]);
        }

        // Attach regions if applicable (DR)
        if (!empty($validated['regions'])) {
            $user->regions()->attach($validated['regions']);
        }

        // Attach CDCs if applicable (Responsable CDC)
        if (!empty($validated['cdcs'])) {
            $user->cdcs()->attach($validated['cdcs']);
        }

        // Attach secteurs if applicable (Formateur)
        if (!empty($validated['secteurs'])) {
            $user->secteurs()->attach($validated['secteurs']);
        }

        // Attach instituts if applicable
        if (!empty($validated['instituts']) && !($validated['is_externe'] ?? false)) {
            $user->instituts()->attach($validated['instituts']);
        }

        return redirect()->back()->with('message', 'Utilisateur créé avec succès.');
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

        // Sync relationships
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

        return redirect()->back()->with('message', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('message', 'Utilisateur supprimé.');
    }
}
