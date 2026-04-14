<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regions = [
            ['code' => 'CS',   'nom' => 'Casablanca-Settat'],
            ['code' => 'RK',   'nom' => 'Rabat-Kénitra'],
            ['code' => 'FM',   'nom' => 'Fès-Meknès'],
            ['code' => 'TT',   'nom' => 'Tanger-Tétouan-Al Hoceïma'],
            ['code' => 'MS',   'nom' => 'Marrakech-Safi'],
            ['code' => 'OK',   'nom' => 'Oriental'],
            ['code' => 'SM',   'nom' => 'Souss-Massa'],
            ['code' => 'BMK',  'nom' => 'Béni Mellal-Khénifra'],
            ['code' => 'DA',   'nom' => 'Drâa-Tafilalet'],
            ['code' => 'GS',   'nom' => 'Guelmim-Oued Noun'],
            ['code' => 'LS',   'nom' => 'Laâyoune-Sakia El Hamra'],
            ['code' => 'DO',   'nom' => 'Dakhla-Oued Ed-Dahab'],
        ];

        foreach ($regions as $region) {
            \App\Models\Region::firstOrCreate(['code' => $region['code']], $region);
        }
    }
}
