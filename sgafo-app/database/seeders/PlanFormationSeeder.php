<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\EntiteFormation;
use App\Models\SiteFormation;
use App\Models\Hotel;
use App\Models\PlanFormation;
use App\Models\Seance;
use Carbon\Carbon;

class PlanFormationSeeder extends Seeder
{
    public function run(): void
    {
        // On récupère les utilisateurs créés par AdminSeeder
        $cdcs = User::whereHas('roles', fn($q) => $q->where('code', 'CDC'))->get();
        $rfs = User::whereHas('roles', fn($q) => $q->where('code', 'RF'))->get();
        $formateurs = User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->get();
        $sites = SiteFormation::all();
        $hotels = Hotel::all();

        if ($cdcs->isEmpty() || $rfs->isEmpty() || $formateurs->count() < 5 || $sites->isEmpty()) return;

        $cdcDigital = $cdcs->where('email', 'youssef.cdc@ofppt.ma')->first() ?? $cdcs->first();
        $rfDigital = $rfs->where('email', 'hassan.rf@ofppt.ma')->first() ?? $rfs->first();

        // 1. Plan Validé (Formation Laravel)
        $entiteWeb = EntiteFormation::where('titre', 'like', '%Laravel%')->first();
        if ($entiteWeb) {
            $siteCasa = $sites->where('ville', 'Casablanca')->first();
            
            $plan1 = PlanFormation::create([
                'titre' => 'Session Février - Laravel & React pour les formateurs Casa',
                'entite_id' => $entiteWeb->id,
                'statut' => 'validé',
                'cree_par' => $cdcDigital->id,
                'valide_par' => $rfDigital->id,
                'date_soumission' => Carbon::now()->subDays(20),
                'date_validation' => Carbon::now()->subDays(15),
                'date_debut' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'date_fin' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'site_formation_id' => $siteCasa->id,
            ]);

            // Thèmes et Animateurs
            $animateur = $formateurs->where('is_externe', false)->first();
            foreach ($entiteWeb->themes as $index => $theme) {
                $pt = $plan1->themes()->create([
                    'nom' => $theme->titre,
                    'duree_heures' => $theme->duree_heures,
                    'objectifs' => $theme->objectifs,
                    'ordre' => $index + 1,
                ]);
                $pt->animateurs()->attach($animateur->id);
            }

            // Participants
            $participants = $formateurs->where('id', '!=', $animateur->id)->take(8);
            foreach ($participants as $p) {
                $plan1->participants()->attach($p->id, ['added_by' => $cdcDigital->id, 'added_at' => now()]);
            }

            // Hébergement
            $hotelCasa = $hotels->where('ville', 'Casablanca')->first();
            if ($hotelCasa && $participants->count() > 0) {
                $plan1->hebergements()->create([
                    'user_id' => $participants->first()->id,
                    'hotel_id' => $hotelCasa->id,
                    'nombre_nuits' => 2,
                    'cout_total' => $hotelCasa->prix_nuitee * 2,
                ]);
            }

            // Séances
            $seance1 = Seance::create([
                'plan_id' => $plan1->id,
                'date' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'debut' => '09:00:00',
                'fin' => '16:00:00',
                'site_id' => $siteCasa->id,
                'statut' => 'terminée',
            ]);
            $seance1->themes()->attach($plan1->themes()->first()->id, ['heures_planifiees' => 7]);
            
            $seance2 = Seance::create([
                'plan_id' => $plan1->id,
                'date' => Carbon::now()->addDays(1)->format('Y-m-d'),
                'debut' => '09:00:00',
                'fin' => '16:00:00',
                'site_id' => $siteCasa->id,
                'statut' => 'planifiée',
            ]);
            $seance2->themes()->attach($plan1->themes()->skip(1)->first()->id, ['heures_planifiees' => 7]);
        }

        // 2. Plan Soumis (Soft Skills)
        $entiteSoft = EntiteFormation::where('titre', 'like', '%Leadership%')->first();
        if ($entiteSoft) {
            $siteRabat = $sites->where('ville', 'Rabat')->first() ?? $sites->first();
            
            $plan2 = PlanFormation::create([
                'titre' => 'Leadership et Management - Région Rabat',
                'entite_id' => $entiteSoft->id,
                'statut' => 'soumis',
                'cree_par' => $cdcDigital->id, // Ou un autre CDC
                'date_soumission' => Carbon::now()->subDays(1),
                'date_debut' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'date_fin' => Carbon::now()->addDays(12)->format('Y-m-d'),
                'site_formation_id' => $siteRabat->id,
            ]);

            foreach ($entiteSoft->themes as $index => $theme) {
                $plan2->themes()->create([
                    'nom' => $theme->titre,
                    'duree_heures' => $theme->duree_heures,
                    'objectifs' => $theme->objectifs,
                    'ordre' => $index + 1,
                ]);
            }

            // Participants
            $participants2 = $formateurs->shuffle()->take(5);
            foreach ($participants2 as $p) {
                $plan2->participants()->attach($p->id, ['added_by' => $cdcDigital->id, 'added_at' => now()]);
            }
        }
        
        // 3. Plan Brouillon (IA Générative)
        $entiteIA = EntiteFormation::where('titre', 'like', '%Intelligence Artificielle%')->first();
        if ($entiteIA) {
            $plan3 = PlanFormation::create([
                'titre' => 'Intégration de l\'IA dans l\'enseignement - Cohorte 1',
                'entite_id' => $entiteIA->id,
                'statut' => 'brouillon',
                'cree_par' => $cdcDigital->id,
                'date_debut' => Carbon::now()->addDays(30)->format('Y-m-d'),
                'date_fin' => Carbon::now()->addDays(32)->format('Y-m-d'),
                'plateforme' => 'Microsoft Teams',
                'lien_visio' => 'https://teams.microsoft.com/l/meetup-join/...',
            ]);

            foreach ($entiteIA->themes as $index => $theme) {
                $plan3->themes()->create([
                    'nom' => $theme->titre,
                    'duree_heures' => $theme->duree_heures,
                    'objectifs' => $theme->objectifs,
                    'ordre' => $index + 1,
                ]);
            }
        }
    }
}
