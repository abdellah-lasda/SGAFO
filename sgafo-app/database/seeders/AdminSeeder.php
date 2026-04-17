<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('code', 'ADMIN')->first();

        if ($adminRole) {
            $admin = \App\Models\User::firstOrCreate(
                ['email' => 'admin@ofppt.ma'],
                [
                    'nom' => 'Admin',
                    'prenom' => 'Système',
                    'password' => bcrypt('password123'),
                    'statut' => 'actif',
                ]
            );

            // Attacher le rôle admin si pas déjà fait
            if (!$admin->roles()->where('role_id', $adminRole->id)->exists()) {
                $admin->roles()->attach($adminRole->id);
            }
        }

        // Création d'un Responsable de Formation (RF) de test
        $rfRole = \App\Models\Role::where('code', 'RF')->first();
        if ($rfRole) {
            $rfUser = \App\Models\User::firstOrCreate(
                ['email' => 'rf@ofppt.ma'],
                [
                    'nom' => 'Responsable',
                    'prenom' => 'Formation NTIC',
                    'password' => bcrypt('password123'),
                    'statut' => 'actif',
                ]
            );

            if (!$rfUser->roles()->where('role_id', $rfRole->id)->exists()) {
                $rfUser->roles()->attach($rfRole->id);
            }

            // Associer ce RF à un secteur (le premier disponible, idéalement "NTIC")
            $secteur = \App\Models\Secteur::firstOrCreate(
                ['code' => 'NTIC'],
                ['nom' => 'Nouvelles Technologies']
            );

            if (!$rfUser->secteurs()->where('secteur_id', $secteur->id)->exists()) {
                $rfUser->secteurs()->attach($secteur->id);
            }
        }
    }
}
