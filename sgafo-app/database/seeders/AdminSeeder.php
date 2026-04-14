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
    }
}
