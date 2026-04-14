<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['code' => 'CDC',       'libelle' => 'Responsable CDC'],
            ['code' => 'RF',        'libelle' => 'Responsable de Formation'],
            ['code' => 'DR',        'libelle' => 'Responsable Direction Régionale'],
            ['code' => 'FORMATEUR', 'libelle' => 'Formateur'],
            ['code' => 'ADMIN',     'libelle' => 'Administrateur Système'],
        ];

        foreach ($roles as $role) {
            \App\Models\Role::firstOrCreate(['code' => $role['code']], $role);
        }
    }
}
