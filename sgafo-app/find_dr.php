<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::whereHas('roles', fn($q) => $q->where('code', 'DR'))->with('regions')->first();

if ($user) {
    echo "User found: " . $user->email . "\n";
    echo "Regions: " . $user->regions->pluck('nom')->join(', ') . "\n";
} else {
    echo "No DR user found.\n";
}
