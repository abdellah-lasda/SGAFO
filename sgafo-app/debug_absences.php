<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simuler l'utilisateur DR Ahmed Mansouri (ID 29 selon le log précédent?)
// Dans le log précédent c'était dr.casa@ofppt.ma (ID ?)
$dr = App\Models\User::where('email', 'dr.casa@ofppt.ma')->first();
auth()->login($dr);

$regionIds = \DB::table('region_user')->where('user_id', $dr->id)->pluck('region_id')->toArray();
echo "DR Regions: " . implode(', ', $regionIds) . "\n";

$presences = App\Models\Presence::where('statut', 'absent_non_justifié')->get();
echo "Total unjustified absences in DB: " . $presences->count() . "\n";

foreach($presences as $p) {
    $participant = $p->participant;
    $pRegionIds = $participant->instituts->pluck('region_id')->toArray();
    echo "Absence ID: {$p->id} | Participant: {$participant->nom} | Regions: " . implode(', ', $pRegionIds) . "\n";
}

// Tester la requête de filtrage
$filtered = App\Models\Presence::where('statut', 'absent_non_justifié')->get();
echo "Filtered unjustified absences for DR: " . $filtered->count() . "\n";
