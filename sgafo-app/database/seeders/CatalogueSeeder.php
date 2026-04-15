<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CatalogueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::where('email', 'admin@ofppt.ma')->first();
        if (!$admin) return;

        // 1. Formation Technique (Digital)
        $secteurWeb = \App\Models\Secteur::where('nom', 'Développement Web')->first();
        if ($secteurWeb) {
            $react = \App\Models\EntiteFormation::create([
                'titre' => 'Mastering React & Inertia.js',
                'type' => 'technique',
                'mode' => 'présentiel',
                'secteur_id' => $secteurWeb->id,
                'description' => 'Maîtrisez le développement d\'applications SPA avec Laravel et React.',
                'objectifs' => 'Savoir construire des interfaces réactives et connectées à un backend Laravel.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $react->themes()->createMany([
                ['titre' => 'Fondamentaux de React', 'duree_heures' => 7, 'objectifs' => 'Components, Props et State'],
                ['titre' => 'Navigation avec Inertia', 'duree_heures' => 7, 'objectifs' => 'Routes, Links et Shared Data'],
                ['titre' => 'Gestion des formulaires complexes', 'duree_heures' => 14, 'objectifs' => 'Validation et feedback utilisateur'],
            ]);
        }

        // 2. Formation Pédagogique
        $secteurPedago = \App\Models\Secteur::where('nom', 'Pédagogie Active')->first();
        if ($secteurPedago) {
            $pedago = \App\Models\EntiteFormation::create([
                'titre' => 'Techniques d\'animation hybride',
                'type' => 'pedagogique',
                'mode' => 'hybride',
                'secteur_id' => $secteurPedago->id,
                'description' => 'Apprendre à gérer une classe en présentiel et à distance simultanément.',
                'objectifs' => 'Utiliser les outils de visioconférence tout en maintenant l\'engagement en salle.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $pedago->themes()->createMany([
                ['titre' => 'Outils collaboratifs (Miro, Padlet)', 'duree_heures' => 4, 'objectifs' => 'Interactivité en ligne'],
                ['titre' => 'Gestion de la double audience', 'duree_heures' => 4, 'objectifs' => 'Inclusion des participants à distance'],
            ]);
        }

        // 3. Formation Transversale (Soft Skills)
        $secteurSoft = \App\Models\Secteur::where('nom', 'Soft Skills')->first();
        if ($secteurSoft) {
            $comm = \App\Models\EntiteFormation::create([
                'titre' => 'Communication Non-Violente (CNV)',
                'type' => 'transversale',
                'mode' => 'distance',
                'secteur_id' => $secteurSoft->id,
                'description' => 'Améliorer les relations professionnelles au sein des établissements.',
                'objectifs' => 'Savoir exprimer ses besoins sans créer de conflit.',
                'statut' => 'actif',
                'cree_par_id' => $admin->id,
            ]);

            $comm->themes()->createMany([
                ['titre' => 'Les 4 piliers de la CNV', 'duree_heures' => 6, 'objectifs' => 'Observation, Sentiment, Besoin, Demande'],
            ]);
        }
    }
}
