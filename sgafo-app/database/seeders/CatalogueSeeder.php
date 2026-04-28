<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CatalogueSeeder extends Seeder
{
    public function run(): void
    {
        $admin = \App\Models\User::where('email', 'admin@ofppt.ma')->first();
        if (!$admin) return;

        // 1. Digital — Laravel & React
        $secteurWeb = \App\Models\Secteur::where('nom', 'Développement Digital')->first();
        if ($secteurWeb) {
            $react = \App\Models\EntiteFormation::create([
                'titre' => 'Ingénierie Web Avancée avec Laravel 11 et React',
                'type' => 'technique',
                'mode' => 'hybride',
                'secteur_id' => $secteurWeb->id,
                'description' => 'Formation intensive pour maîtriser le développement d\'applications modernes avec Laravel et React (Inertia.js).',
                'objectifs' => 'Maîtriser Laravel 11, React, les APIs sécurisées et le déploiement cloud.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $react->themes()->createMany([
                ['titre' => 'Nouveautés de Laravel 11 et Architecture', 'duree_heures' => 7, 'objectifs' => 'Comprendre la structure allégée de Laravel 11.'],
                ['titre' => 'Intégration React & Inertia.js', 'duree_heures' => 14, 'objectifs' => 'Créer des SPA sans API REST complexe.'],
                ['titre' => 'Sécurité et Tests Automatisés (Pest)', 'duree_heures' => 7, 'objectifs' => 'Sécuriser les endpoints et écrire des tests.'],
            ]);
        }

        // 2. IA & Data
        $secteurIA = \App\Models\Secteur::where('nom', 'Intelligence Artificielle')->first();
        if ($secteurIA) {
            $ia = \App\Models\EntiteFormation::create([
                'titre' => 'L\'Intelligence Artificielle Générative dans l\'Éducation',
                'type' => 'pedagogique',
                'mode' => 'distance',
                'secteur_id' => $secteurIA->id,
                'description' => 'Utiliser ChatGPT, Claude, et Midjourney pour enrichir les supports de cours.',
                'objectifs' => 'Intégrer les outils d\'IA dans la préparation des cours et sensibiliser à l\'éthique.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $ia->themes()->createMany([
                ['titre' => 'Prompt Engineering pour les Formateurs', 'duree_heures' => 4, 'objectifs' => 'Techniques avancées de prompting pédagogique.'],
                ['titre' => 'Création d\'évaluations et QCM automatisés', 'duree_heures' => 4, 'objectifs' => 'Générer des évaluations de niveau varié.'],
                ['titre' => 'Éthique et détection de triche', 'duree_heures' => 2, 'objectifs' => 'Cadre légal et outils de détection.'],
            ]);
        }

        // 3. Industrie — Électromécanique
        $secteurIndus = \App\Models\Secteur::where('nom', 'Électromécanique')->first();
        if ($secteurIndus) {
            $indus = \App\Models\EntiteFormation::create([
                'titre' => 'Maintenance des Systèmes Automatisés Avancés',
                'type' => 'technique',
                'mode' => 'présentiel',
                'secteur_id' => $secteurIndus->id,
                'description' => 'Mise à niveau sur les automates programmables industriels Siemens et Allen-Bradley.',
                'objectifs' => 'Diagnostiquer et réparer un système automatisé complexe.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $indus->themes()->createMany([
                ['titre' => 'Programmation API Siemens TIA Portal', 'duree_heures' => 14, 'objectifs' => 'Maîtriser TIA Portal v18.'],
                ['titre' => 'Diagnostic des pannes électromécaniques', 'duree_heures' => 7, 'objectifs' => 'Méthodologie de dépannage.'],
            ]);
        }

        // 4. THR — Art Culinaire
        $secteurThr = \App\Models\Secteur::where('nom', 'Art Culinaire')->first();
        if ($secteurThr) {
            $thr = \App\Models\EntiteFormation::create([
                'titre' => 'Gastronomie Moléculaire et Nouvelles Tendances',
                'type' => 'technique',
                'mode' => 'présentiel',
                'secteur_id' => $secteurThr->id,
                'description' => 'Introduction aux techniques modernes de la gastronomie pour les formateurs en Art Culinaire.',
                'objectifs' => 'Innover dans la création de plats gastronomiques.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $thr->themes()->createMany([
                ['titre' => 'Techniques de sphérification et gélification', 'duree_heures' => 7, 'objectifs' => 'Maîtriser la texture des aliments.'],
                ['titre' => 'Cuisson sous vide à juste température', 'duree_heures' => 7, 'objectifs' => 'Cuisson de précision.'],
            ]);
        }

        // 5. Soft Skills — Leadership
        $secteurSoft = \App\Models\Secteur::where('nom', 'Soft Skills')->first();
        if ($secteurSoft) {
            $comm = \App\Models\EntiteFormation::create([
                'titre' => 'Leadership et Intelligence Émotionnelle',
                'type' => 'transversale',
                'mode' => 'présentiel',
                'secteur_id' => $secteurSoft->id,
                'description' => 'Développer son leadership naturel et gérer ses émotions en situation de conflit.',
                'objectifs' => 'Développer l\'empathie, gérer le stress, et adopter une posture de leader inspirant.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $comm->themes()->createMany([
                ['titre' => 'Les fondements de l\'Intelligence Émotionnelle', 'duree_heures' => 7, 'objectifs' => 'Conscience de soi et maîtrise de soi.'],
                ['titre' => 'Résolution de conflits', 'duree_heures' => 7, 'objectifs' => 'Techniques de négociation et de médiation.'],
            ]);

            // 6. Business English
            $lang = \App\Models\EntiteFormation::create([
                'titre' => 'Business English for Trainers',
                'type' => 'transversale',
                'mode' => 'hybride',
                'secteur_id' => $secteurSoft->id,
                'description' => 'Améliorer son anglais professionnel pour animer des cours ou utiliser de la documentation anglophone.',
                'objectifs' => 'Atteindre le niveau B2/C1 en anglais technique.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $lang->themes()->createMany([
                ['titre' => 'Technical Vocabulary & Documentation', 'duree_heures' => 7, 'objectifs' => 'Reading and writing technical documents.'],
                ['titre' => 'Presentation Skills in English', 'duree_heures' => 14, 'objectifs' => 'Delivering training sessions in English.'],
            ]);
        }
    }
}
