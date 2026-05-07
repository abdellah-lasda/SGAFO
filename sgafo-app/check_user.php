<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = App\Models\User::where('nom', 'like', '%Kabbaj%')->orWhere('prenom', 'like', '%Youssef%')->with('instituts')->first();

if ($u) {
    echo "User: {$u->nom} {$u->prenom} (ID: {$u->id})\n";
    foreach($u->instituts as $i) {
        echo " - Institut: {$i->nom} (Region ID: {$i->region_id})\n";
    }
} else {
    echo "User not found\n";
}
