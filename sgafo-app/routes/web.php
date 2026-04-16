<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\EntiteFormation;
use App\Models\Secteur;
use App\Models\SiteFormation;
use App\Models\User;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [
            'formations_count' => EntiteFormation::count(),
            'secteurs_count' => Secteur::count(),
            'sites_count' => SiteFormation::count(),
            'formateurs_count' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count(),
        ],
        'latestFormations' => EntiteFormation::with(['secteur', 'createur'])->latest()->take(3)->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\InstitutController as AdminInstitutController;
use App\Http\Controllers\Admin\DomaineController as AdminDomaineController;
use App\Http\Controllers\EntiteFormationController;
use App\Http\Controllers\LogistiqueController;
use App\Http\Controllers\PlanFormationController;

Route::middleware(['auth', 'role.admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', AdminUserController::class)->except(['create', 'show', 'edit']);
    Route::resource('instituts', AdminInstitutController::class)->except(['create', 'show', 'edit']);
    
    // Spécialités: CDCs, Secteurs, Métiers
    Route::get('domaines', [AdminDomaineController::class, 'index'])->name('domaines.index');
    Route::post('domaines/cdcs', [AdminDomaineController::class, 'storeCdc'])->name('cdcs.store');
    Route::put('domaines/cdcs/{cdc}', [AdminDomaineController::class, 'updateCdc'])->name('cdcs.update');
    Route::delete('domaines/cdcs/{cdc}', [AdminDomaineController::class, 'destroyCdc'])->name('cdcs.destroy');
    
    Route::post('domaines/secteurs', [AdminDomaineController::class, 'storeSecteur'])->name('secteurs.store');
    Route::put('domaines/secteurs/{secteur}', [AdminDomaineController::class, 'updateSecteur'])->name('secteurs.update');
    Route::delete('domaines/secteurs/{secteur}', [AdminDomaineController::class, 'destroySecteur'])->name('secteurs.destroy');
    
    Route::post('domaines/metiers', [AdminDomaineController::class, 'storeMetier'])->name('metiers.store');
    Route::put('domaines/metiers/{metier}', [AdminDomaineController::class, 'updateMetier'])->name('metiers.update');
    Route::delete('domaines/metiers/{metier}', [AdminDomaineController::class, 'destroyMetier'])->name('metiers.destroy');
});



Route::middleware(['auth'])->prefix('modules')->name('modules.')->group(function () {
    Route::resource('entites', EntiteFormationController::class);
    
    // Plans de formation (Stepper + Workflow)
    Route::resource('plans', PlanFormationController::class);
    Route::post('plans/{plan}/submit', [PlanFormationController::class, 'submit'])->name('plans.submit');
    Route::post('plans/{plan}/validate', [PlanFormationController::class, 'validatePlan'])->name('plans.validate');
    Route::post('plans/{plan}/reject', [PlanFormationController::class, 'reject'])->name('plans.reject');
    Route::post('plans/{plan}/confirm', [PlanFormationController::class, 'confirm'])->name('plans.confirm');
    
    // Logistique (Sites & Hotels)
    Route::prefix('logistique')->name('logistique.')->group(function () {
        Route::get('/', [LogistiqueController::class, 'index'])->name('index');
        Route::post('/hotels', [LogistiqueController::class, 'storeHotel'])->name('hotels.store');
        Route::put('/hotels/{hotel}', [LogistiqueController::class, 'updateHotel'])->name('hotels.update');
        Route::patch('/hotels/{hotel}/archive', [LogistiqueController::class, 'archiveHotel'])->name('hotels.archive');
        
        // Sites de formation
        Route::post('/sites', [LogistiqueController::class, 'storeSite'])->name('sites.store');
        Route::put('/sites/{site}', [LogistiqueController::class, 'updateSite'])->name('sites.update');
        Route::patch('/sites/{site}/archive', [LogistiqueController::class, 'archiveSite'])->name('sites.archive');

        Route::put('/instituts/{institut}', [LogistiqueController::class, 'updateInstitut'])->name('instituts.update');
    });
});

require __DIR__.'/auth.php';
