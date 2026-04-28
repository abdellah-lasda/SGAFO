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
        $rfRole = \App\Models\Role::where('code', 'RF')->first();
        $cdcRole = \App\Models\Role::where('code', 'CDC')->first();
        $formateurRole = \App\Models\Role::where('code', 'FORMATEUR')->first();

        // 1. Admin System
        if ($adminRole) {
            $admin = \App\Models\User::firstOrCreate(
                ['email' => 'admin@ofppt.ma'],
                [
                    'nom' => 'El Fassi',
                    'prenom' => 'Mohammed',
                    'password' => bcrypt('password123'),
                    'statut' => 'actif',
                ]
            );
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        // 2. Responsables de Formation (RF)
        $secteurDigital = \App\Models\Secteur::where('nom', 'Développement Digital (Full Stack)')->first();
        $secteurGestion = \App\Models\Secteur::where('nom', 'Gestion des Entreprises')->first();
        $secteurIndustrie = \App\Models\Secteur::where('nom', 'Électromécanique des Systèmes Automatisés')->first();

        if ($rfRole) {
            $rf1 = \App\Models\User::firstOrCreate(
                ['email' => 'hassan.rf@ofppt.ma'],
                ['nom' => 'Benali', 'prenom' => 'Hassan', 'password' => bcrypt('password123'), 'statut' => 'actif']
            );
            $rf1->roles()->syncWithoutDetaching([$rfRole->id]);
            if ($secteurDigital) $rf1->secteurs()->syncWithoutDetaching([$secteurDigital->id]);

            $rf2 = \App\Models\User::firstOrCreate(
                ['email' => 'salma.rf@ofppt.ma'],
                ['nom' => 'Chraibi', 'prenom' => 'Salma', 'password' => bcrypt('password123'), 'statut' => 'actif']
            );
            $rf2->roles()->syncWithoutDetaching([$rfRole->id]);
            if ($secteurGestion) $rf2->secteurs()->syncWithoutDetaching([$secteurGestion->id]);

            $rf3 = \App\Models\User::firstOrCreate(
                ['email' => 'khalid.rf@ofppt.ma'],
                ['nom' => 'Bennouna', 'prenom' => 'Khalid', 'password' => bcrypt('password123'), 'statut' => 'actif']
            );
            $rf3->roles()->syncWithoutDetaching([$rfRole->id]);
            if ($secteurIndustrie) $rf3->secteurs()->syncWithoutDetaching([$secteurIndustrie->id]);
        }

        // 3. Coordinateurs CDC
        if ($cdcRole) {
            $cdc1 = \App\Models\User::firstOrCreate(
                ['email' => 'youssef.cdc@ofppt.ma'],
                ['nom' => 'Ammor', 'prenom' => 'Youssef', 'password' => bcrypt('password123'), 'statut' => 'actif']
            );
            $cdc1->roles()->syncWithoutDetaching([$cdcRole->id]);

            $cdc2 = \App\Models\User::firstOrCreate(
                ['email' => 'kenza.cdc@ofppt.ma'],
                ['nom' => 'Mernissi', 'prenom' => 'Kenza', 'password' => bcrypt('password123'), 'statut' => 'actif']
            );
            $cdc2->roles()->syncWithoutDetaching([$cdcRole->id]);
            
            $cdc3 = \App\Models\User::firstOrCreate(
                ['email' => 'rachid.cdc@ofppt.ma'],
                ['nom' => 'Filali', 'prenom' => 'Rachid', 'password' => bcrypt('password123'), 'statut' => 'actif']
            );
            $cdc3->roles()->syncWithoutDetaching([$cdcRole->id]);
        }

        // 4. Formateurs & Animateurs (Participants)
        if ($formateurRole) {
            $formateurs = [
                // Digital
                ['email' => 'k.tazi@ofppt.ma', 'nom' => 'Tazi', 'prenom' => 'Karim', 'is_externe' => false],
                ['email' => 'l.boujibar@ofppt.ma', 'nom' => 'Boujibar', 'prenom' => 'Leila', 'is_externe' => false],
                ['email' => 'o.mansouri@ofppt.ma', 'nom' => 'Mansouri', 'prenom' => 'Omar', 'is_externe' => false],
                ['email' => 'm.bennani@ofppt.ma', 'nom' => 'Bennani', 'prenom' => 'Mehdi', 'is_externe' => false],
                ['email' => 's.lahlou@ofppt.ma', 'nom' => 'Lahlou', 'prenom' => 'Samira', 'is_externe' => false],
                // Gestion
                ['email' => 'a.idrissi@ofppt.ma', 'nom' => 'Idrissi', 'prenom' => 'Anass', 'is_externe' => false],
                ['email' => 'f.alaoui@ofppt.ma', 'nom' => 'Alaoui', 'prenom' => 'Fatima', 'is_externe' => false],
                ['email' => 'y.kabbaj@ofppt.ma', 'nom' => 'Kabbaj', 'prenom' => 'Youssef', 'is_externe' => false],
                ['email' => 'n.guessous@ofppt.ma', 'nom' => 'Guessous', 'prenom' => 'Nadia', 'is_externe' => false],
                // Industrie
                ['email' => 'r.bennis@ofppt.ma', 'nom' => 'Bennis', 'prenom' => 'Rachid', 'is_externe' => false],
                ['email' => 'i.chraibi@ofppt.ma', 'nom' => 'Chraibi', 'prenom' => 'Imane', 'is_externe' => false],
                ['email' => 't.elamrani@ofppt.ma', 'nom' => 'El Amrani', 'prenom' => 'Tarik', 'is_externe' => false],
                // THR
                ['email' => 'h.zniber@ofppt.ma', 'nom' => 'Zniber', 'prenom' => 'Hind', 'is_externe' => false],
                ['email' => 'm.bakkali@ofppt.ma', 'nom' => 'Bakkali', 'prenom' => 'Mourad', 'is_externe' => false],
                // BTP
                ['email' => 'a.sebti@ofppt.ma', 'nom' => 'Sebti', 'prenom' => 'Amine', 'is_externe' => false],
                ['email' => 's.belghiti@ofppt.ma', 'nom' => 'Belghiti', 'prenom' => 'Sanaa', 'is_externe' => false],
                // Externes
                ['email' => 'expert.ia@tech.com', 'nom' => 'Dubois', 'prenom' => 'Laurent', 'is_externe' => true],
                ['email' => 'coach.softskills@consulting.ma', 'nom' => 'Benjelloun', 'prenom' => 'Nizar', 'is_externe' => true],
                ['email' => 'expert.agile@scrum.org', 'nom' => 'Martin', 'prenom' => 'Sophie', 'is_externe' => true],
                ['email' => 'consultant.finance@audit.ma', 'nom' => 'Filali', 'prenom' => 'Reda', 'is_externe' => true],
            ];

            foreach ($formateurs as $fData) {
                $f = \App\Models\User::firstOrCreate(
                    ['email' => $fData['email']],
                    ['nom' => $fData['nom'], 'prenom' => $fData['prenom'], 'is_externe' => $fData['is_externe'], 'password' => bcrypt('password123'), 'statut' => 'actif']
                );
                $f->roles()->syncWithoutDetaching([$formateurRole->id]);

                // Assigner 1 ou 2 secteurs aléatoires
                $secteurs = \App\Models\Secteur::inRandomOrder()->limit(rand(1, 2))->get();
                foreach ($secteurs as $secteur) {
                    $f->secteurs()->syncWithoutDetaching([$secteur->id]);
                }
            }
        }
    }
}
