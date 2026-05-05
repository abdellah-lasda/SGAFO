<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Region;
use Illuminate\Support\Facades\Hash;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$role = Role::where('code', 'DR')->first();

if (!$role) {
    echo "Erreur : Role DR introuvable.\n";
    exit;
}

$users = [
    [
        'email' => 'dr.casa@ofppt.ma',
        'nom' => 'Mansouri',
        'prenom' => 'Ahmed',
        'region_code' => 'CS'
    ],
    [
        'email' => 'dr.rabat@ofppt.ma',
        'nom' => 'Tazi',
        'prenom' => 'Laila',
        'region_code' => 'RK'
    ]
];

foreach ($users as $uData) {
    $user = User::updateOrCreate(
        ['email' => $uData['email']],
        [
            'nom' => $uData['nom'],
            'prenom' => $uData['prenom'],
            'password' => Hash::make('password123'),
            'statut' => 'actif'
        ]
    );

    $user->roles()->syncWithoutDetaching([$role->id]);

    $region = Region::where('code', $uData['region_code'])->first();
    if ($region) {
        $user->regions()->syncWithoutDetaching([$region->id]);
    }

    echo "Utilisateur {$uData['email']} cree/mis a jour.\n";
}
