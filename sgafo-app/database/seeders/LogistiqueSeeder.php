<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteFormation;
use App\Models\Hotel;
use App\Models\Region;

class LogistiqueSeeder extends Seeder
{
    public function run(): void
    {
        $regions = Region::all();
        
        $regionCasa = $regions->where('nom', 'Casablanca-Settat')->first();
        $regionRabat = $regions->where('nom', 'Rabat-Salé-Kénitra')->first();
        $regionMarrakech = $regions->where('nom', 'Marrakech-Safi')->first();
        $regionTanger = $regions->where('nom', 'Tanger-Tétouan-Al Hoceïma')->first();
        $regionAgadir = $regions->where('nom', 'Souss-Massa')->first();

        // --- SITES DE FORMATION ---
        
        // Casablanca
        if ($regionCasa) {
            $sitesCasa = [
                ['nom' => 'Siège de l\'OFPPT', 'adresse' => 'Intersection Route de Nouasseur et Route de Bouskoura', 'capacite' => 250],
                ['nom' => 'CMC Nouaceur (Cité des Métiers)', 'adresse' => 'Nouaceur', 'capacite' => 400],
                ['nom' => 'ISGI Casablanca', 'adresse' => 'Route El Jadida', 'capacite' => 120],
                ['nom' => 'ISTA NTIC Sidi Maârouf', 'adresse' => 'Sidi Maârouf', 'capacite' => 150],
            ];
            foreach ($sitesCasa as $s) {
                SiteFormation::create(array_merge($s, ['ville' => 'Casablanca', 'region_id' => $regionCasa->id, 'statut' => 'actif']));
            }
        }

        // Rabat
        if ($regionRabat) {
            $sitesRabat = [
                ['nom' => 'ISTA Hay Riad', 'adresse' => 'Avenue Annakhil, Hay Riad', 'capacite' => 150],
                ['nom' => 'CMC Tamesna', 'adresse' => 'Tamesna', 'capacite' => 300],
            ];
            foreach ($sitesRabat as $s) {
                SiteFormation::create(array_merge($s, ['ville' => 'Rabat', 'region_id' => $regionRabat->id, 'statut' => 'actif']));
            }
        }

        // Marrakech
        if ($regionMarrakech) {
            $sitesMar = [
                ['nom' => 'Centre de Formation Multisectoriel', 'adresse' => 'Sidi Youssef Ben Ali', 'capacite' => 100],
                ['nom' => 'ISTA NTIC Marrakech', 'adresse' => 'Guéliz', 'capacite' => 120],
            ];
            foreach ($sitesMar as $s) {
                SiteFormation::create(array_merge($s, ['ville' => 'Marrakech', 'region_id' => $regionMarrakech->id, 'statut' => 'actif']));
            }
        }

        // Tanger
        if ($regionTanger) {
            SiteFormation::create(['nom' => 'ISTA Tanger', 'ville' => 'Tanger', 'adresse' => 'Tanger', 'capacite' => 150, 'region_id' => $regionTanger->id, 'statut' => 'actif']);
        }

        // Agadir
        if ($regionAgadir) {
            SiteFormation::create(['nom' => 'CMC Agadir', 'ville' => 'Agadir', 'adresse' => 'Agadir', 'capacite' => 350, 'region_id' => $regionAgadir->id, 'statut' => 'actif']);
        }


        // --- HÔTELS CONVENTIONNÉS ---
        
        if ($regionCasa) {
            Hotel::create(['nom' => 'Ibis Casablanca City Center', 'ville' => 'Casablanca', 'adresse' => 'Angle Zaid Ou Hmad', 'prix_nuitee' => 450.00, 'region_id' => $regionCasa->id, 'statut' => 'actif']);
            Hotel::create(['nom' => 'Novotel Casablanca', 'ville' => 'Casablanca', 'adresse' => 'Angle Rue Zaid Ouhmad', 'prix_nuitee' => 750.00, 'region_id' => $regionCasa->id, 'statut' => 'actif']);
            Hotel::create(['nom' => 'Kenzi Tower Hotel', 'ville' => 'Casablanca', 'adresse' => 'Bd Zerktouni', 'prix_nuitee' => 1200.00, 'region_id' => $regionCasa->id, 'statut' => 'actif']);
        }

        if ($regionRabat) {
            Hotel::create(['nom' => 'Ibis Rabat Agdal', 'ville' => 'Rabat', 'adresse' => 'Place de la Gare Agdal', 'prix_nuitee' => 500.00, 'region_id' => $regionRabat->id, 'statut' => 'actif']);
            Hotel::create(['nom' => 'Sofitel Rabat Jardin des Roses', 'ville' => 'Rabat', 'adresse' => 'Souissi', 'prix_nuitee' => 1500.00, 'region_id' => $regionRabat->id, 'statut' => 'actif']);
        }

        if ($regionMarrakech) {
            Hotel::create(['nom' => 'Mövenpick Hotel Mansour Eddahbi', 'ville' => 'Marrakech', 'adresse' => 'Boulevard Mohamed VI', 'prix_nuitee' => 850.00, 'region_id' => $regionMarrakech->id, 'statut' => 'actif']);
            Hotel::create(['nom' => 'Ibis Marrakech Centre Gare', 'ville' => 'Marrakech', 'adresse' => 'Avenue Hassan II', 'prix_nuitee' => 400.00, 'region_id' => $regionMarrakech->id, 'statut' => 'actif']);
        }

        if ($regionTanger) {
            Hotel::create(['nom' => 'Hilton Tanger City Center', 'ville' => 'Tanger', 'adresse' => 'Place du Maghreb Arabe', 'prix_nuitee' => 950.00, 'region_id' => $regionTanger->id, 'statut' => 'actif']);
            Hotel::create(['nom' => 'Ibis Tanger City Center', 'ville' => 'Tanger', 'adresse' => 'Place du Maghreb Arabe', 'prix_nuitee' => 450.00, 'region_id' => $regionTanger->id, 'statut' => 'actif']);
        }

        if ($regionAgadir) {
            Hotel::create(['nom' => 'Royal Atlas Agadir', 'ville' => 'Agadir', 'adresse' => 'Boulevard 20 Aout', 'prix_nuitee' => 1100.00, 'region_id' => $regionAgadir->id, 'statut' => 'actif']);
            Hotel::create(['nom' => 'Ibis Agadir', 'ville' => 'Agadir', 'adresse' => 'Avenue des FAR', 'prix_nuitee' => 400.00, 'region_id' => $regionAgadir->id, 'statut' => 'actif']);
        }
    }
}
