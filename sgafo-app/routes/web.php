<?php

use App\Http\Controllers\Modules\Animateur\AnimateurDashboardController;
use App\Http\Controllers\Modules\Animateur\SeancePedagogiqueController;
use App\Http\Controllers\Modules\Animateur\QcmAnimateurController;
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
    $user = auth()->user();
    $plansPendingCount = 0;
    
    if ($user->hasRole('RF')) {
        $secteurIds = $user->secteurs()->pluck('secteurs.id')->toArray();
        $plansPendingCount = \App\Models\PlanFormation::where('statut', 'soumis')
            ->whereHas('entite', function ($q) use ($secteurIds) {
                $q->whereIn('secteur_id', $secteurIds);
            })->count();
    }

    return Inertia::render('Dashboard', [
        'stats' => [
            'formations_count' => EntiteFormation::count(),
            'secteurs_count' => Secteur::count(),
            'sites_count' => SiteFormation::count(),
            'formateurs_count' => User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count(),
            'plans_pending_count' => $plansPendingCount,
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
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\PlanValidationController;

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



// Catalogue National (Accessible sans le préfixe 'modules')
Route::middleware(['auth'])->group(function () {
    Route::get('catalogue-national', [\App\Http\Controllers\CatalogueController::class, 'index'])->name('modules.catalogue.index');
    Route::get('catalogue-national/{plan}', [\App\Http\Controllers\CatalogueController::class, 'show'])->name('modules.catalogue.show');
});

Route::middleware(['auth'])->prefix('modules')->name('modules.')->group(function () {
    Route::resource('entites', EntiteFormationController::class);
    Route::get('entites/{entite}/export-pdf', [EntiteFormationController::class, 'exportPdf'])->name('entites.export-pdf');
    
    // Plans de formation (Stepper + Workflow)
    Route::resource('plans', PlanFormationController::class);
    Route::get('plans/{plan}/export-pdf', [PlanFormationController::class, 'exportPdf'])->name('plans.export-pdf');
    Route::post('plans/{plan}/submit', [PlanFormationController::class, 'submit'])->name('plans.submit');
    Route::post('plans/{plan}/validate', [PlanFormationController::class, 'validatePlan'])->name('plans.validate');
    Route::post('plans/{plan}/reject', [PlanFormationController::class, 'reject'])->name('plans.reject');
    Route::post('plans/{plan}/confirm', [PlanFormationController::class, 'confirm'])->name('plans.confirm');
    Route::post('plans/{plan}/cloturer', [PlanFormationController::class, 'cloturerPlanning'])->name('plans.cloturer');
    Route::post('plans/{plan}/reouvrir', [PlanFormationController::class, 'reouvrirPlanning'])->name('plans.reouvrir');

    // Centre de Validation & Planification (RF)
    Route::prefix('validations')->name('validations.')->group(function () {
        Route::get('/', [PlanValidationController::class, 'index'])->name('index');
        Route::get('plans/{plan}', [PlanValidationController::class, 'show'])->name('show');
        Route::get('plans/{plan}/planning', [SeanceController::class, 'index'])->name('planning.index');
        Route::post('plans/{plan}/seances', [SeanceController::class, 'store'])->name('planning.store');
        Route::post('plans/{plan}/planning/cloturer', [SeanceController::class, 'cloturer'])->name('planning.cloturer');
        Route::post('plans/{plan}/planning/reouvrir', [SeanceController::class, 'reouvrir'])->name('planning.reouvrir');
    });
    
    Route::resource('seances', SeanceController::class)->only(['destroy']);
    
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

    // Notifications
    Route::post('notifications/{id}/mark-as-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('notifications/mark-all-as-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
});

// Espace Animateur (Accessible sans le préfixe 'modules')
Route::middleware(['auth', 'role:FORMATEUR'])->prefix('animateur')->name('modules.animateur.')->group(function () {
    Route::get('/dashboard', [AnimateurDashboardController::class, 'index'])->name('dashboard');
    Route::get('/formations', [AnimateurDashboardController::class, 'formations'])->name('formations');
    Route::get('/formations/{plan}', [AnimateurDashboardController::class, 'showFormation'])->name('formations.show');

    // Préparation de Séance (TinyMCE & Documents)
    Route::get('/seances/{seance}/preparation', [SeancePedagogiqueController::class, 'edit'])->name('seances.preparation');
    Route::post('/seances/{seance}/description', [SeancePedagogiqueController::class, 'updateDescription'])->name('seances.update-description');
    Route::post('/seances/{seance}/ressources', [SeancePedagogiqueController::class, 'addResource'])->name('seances.add-resource');
    Route::delete('/ressources/{ressource}', [SeancePedagogiqueController::class, 'deleteResource'])->name('ressources.delete');

    // QCM (Animateur)
    Route::post('/seances/{seance}/qcms', [QcmAnimateurController::class, 'store'])->name('qcms.store');
    Route::get('/qcms/{qcm}/edit', [QcmAnimateurController::class, 'edit'])->name('qcms.edit');
    Route::put('/qcms/{qcm}', [QcmAnimateurController::class, 'update'])->name('qcms.update');
    Route::delete('/qcms/{qcm}', [QcmAnimateurController::class, 'destroy'])->name('qcms.destroy');
    Route::post('/qcms/{qcm}/structure', [QcmAnimateurController::class, 'saveStructure'])->name('qcms.structure.save');

    Route::get('/seances/{seance}/appel', [AnimateurDashboardController::class, 'attendance'])->name('seances.attendance');
    Route::post('/seances/{seance}/appel', [AnimateurDashboardController::class, 'submitAttendance'])->name('seances.submit-attendance');
    Route::get('/seances/{seance}/print-sheet', [AnimateurDashboardController::class, 'printSheet'])->name('seances.print-sheet');
    Route::get('/seances/{seance}/rapport-absences', [AnimateurDashboardController::class, 'exportAbsences'])->name('seances.export-absences');
});

require __DIR__.'/auth.php';
