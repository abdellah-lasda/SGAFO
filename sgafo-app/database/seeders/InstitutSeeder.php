<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Institut;
use App\Models\Region;

class InstitutSeeder extends Seeder
{
    public function run(): void
    {
        $regions = Region::all();
        
        $instituts = [
            'Casablanca-Settat' => [
                ['nom' => 'ISGI Casablanca', 'code' => 'ISGI-CASA', 'adresse' => 'Route El Jadida', 'ville' => 'Casablanca'],
                ['nom' => 'ISTA NTIC Sidi Maârouf', 'code' => 'NTIC-SM', 'adresse' => 'Sidi Maârouf', 'ville' => 'Casablanca'],
                ['nom' => 'CMC Nouaceur', 'code' => 'CMC-CASA', 'adresse' => 'Nouaceur', 'ville' => 'Casablanca'],
                ['nom' => 'ISTA Mohammedia', 'code' => 'ISTA-MOH', 'adresse' => 'Mohammedia', 'ville' => 'Mohammedia'],
            ],
            'Rabat-Salé-Kénitra' => [
                ['nom' => 'ISTA Hay Riad', 'code' => 'ISTA-HR', 'adresse' => 'Hay Riad', 'ville' => 'Rabat'],
                ['nom' => 'CMC Tamesna', 'code' => 'CMC-RABAT', 'adresse' => 'Tamesna', 'ville' => 'Rabat'],
                ['nom' => 'ISTA Kénitra', 'code' => 'ISTA-KEN', 'adresse' => 'Kénitra', 'ville' => 'Kénitra'],
            ],
            'Marrakech-Safi' => [
                ['nom' => 'ISTA NTIC Marrakech', 'code' => 'NTIC-MAR', 'adresse' => 'Guéliz', 'ville' => 'Marrakech'],
                ['nom' => 'ISTA Bab Doukkala', 'code' => 'ISTA-BD', 'adresse' => 'Bab Doukkala', 'ville' => 'Marrakech'],
            ],
            'Tanger-Tétouan-Al Hoceïma' => [
                ['nom' => 'ISTA Tanger', 'code' => 'ISTA-TAN', 'adresse' => 'Tanger', 'ville' => 'Tanger'],
                ['nom' => 'ISTA Tétouan', 'code' => 'ISTA-TET', 'adresse' => 'Tétouan', 'ville' => 'Tétouan'],
            ],
            'Souss-Massa' => [
                ['nom' => 'ISTA Agadir', 'code' => 'ISTA-AGA', 'adresse' => 'Agadir', 'ville' => 'Agadir'],
                ['nom' => 'CMC Agadir', 'code' => 'CMC-AGA', 'adresse' => 'Agadir', 'ville' => 'Agadir'],
            ],
        ];

        foreach ($instituts as $regionNom => $list) {
            $region = $regions->where('nom', $regionNom)->first();
            if ($region) {
                foreach ($list as $data) {
                    Institut::create(array_merge($data, ['region_id' => $region->id]));
                }
            }
        }
    }
}
