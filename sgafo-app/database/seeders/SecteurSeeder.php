<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SecteurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Création des CDCs
        $cdcs = [
            'Digital & NTIC' => ['Développement Web', 'Infrastructure & Cloud', 'Intelligence Artificielle'],
            'Tertiaire & Services' => ['Gestion & Comptabilité', 'Commerce', 'Ressources Humaines'],
            'Textile & Cuir' => ['Habillement Haute Couture', 'Design Textile', 'Maroquinerie'],
            'Ingénierie Pédagogique' => ['Pédagogie Active', 'Soft Skills', 'Management de formation'],
        ];

        $cdcPrefixes = [
            'Digital & NTIC' => 'DIG',
            'Tertiaire & Services' => 'TER',
            'Textile & Cuir' => 'TEX',
            'Ingénierie Pédagogique' => 'PED',
        ];

        foreach ($cdcs as $cdcName => $secteurs) {
            $cdc = \App\Models\Cdc::create([
                'nom' => $cdcName,
                'code' => $cdcPrefixes[$cdcName],
                'description' => "Centre spécialisé en $cdcName"
            ]);

            foreach ($secteurs as $index => $secteurName) {
                \App\Models\Secteur::create([
                    'nom' => $secteurName,
                    'code' => $cdc->code . '-' . ($index + 1),
                    'cdc_id' => $cdc->id
                ]);
            }
        }
    }
}
