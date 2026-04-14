<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Region;
use App\Models\Institut;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        // On récupère les utilisateurs avec leur rôles
        $users = User::with('roles', 'regions', 'instituts')->orderBy('id', 'desc')->get();
        $roles = Role::all();
        $regions = Region::all();
        $instituts = Institut::all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'regions' => $regions,
            'instituts' => $instituts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:8',
            'statut' => 'required|in:actif,inactif,suspendu',
            'is_externe' => 'boolean',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
            'regions' => 'nullable|array', // pour DR ou CDC
            'instituts' => 'nullable|array', // pour formateur interne
        ]);

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

        // Attach regions if applicable
        if (!empty($validated['regions'])) {
            $user->regions()->attach($validated['regions']);
        }

        // Attach instituts if applicable
        if (!empty($validated['instituts']) && !($validated['is_externe'] ?? false)) {
            $user->instituts()->attach($validated['instituts']);
        }

        return redirect()->back()->with('message', 'Utilisateur créé avec succès.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'statut' => 'required|in:actif,inactif,suspendu',
            'is_externe' => 'boolean',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
            'regions' => 'nullable|array',
            'instituts' => 'nullable|array',
        ]);

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
        
        if ($user->is_externe) {
            $user->instituts()->sync([]); // Formateur externe n'a pas d'institut
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
