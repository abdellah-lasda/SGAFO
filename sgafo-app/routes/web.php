<?php

use App\Http\Controllers\Modules\Admin\FeedbackAdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EntiteFormationController;
use App\Http\Controllers\PlanFormationController;
use App\Http\Controllers\PlanValidationController;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\LogistiqueController;
use App\Http\Controllers\Modules\Animateur\AnimateurDashboardController;
use App\Http\Controllers\Modules\Animateur\SeancePedagogiqueController;
use App\Http\Controllers\Modules\Animateur\QcmAnimateurController;
use App\Http\Controllers\Modules\Animateur\PlanRessourceController;
use App\Http\Controllers\Admin\DomaineController as AdminDomaineController;
use App\Http\Controllers\Admin\PilotageController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\InstitutController;
use App\Http\Controllers\Admin\LogistiqueController as AdminLogistiqueController;
use App\Models\User;
use App\Models\PlanFormation;
use App\Models\Secteur;
use App\Models\PlanTheme;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // 1. Statistiques Institutionnelles
    $stats = [
        'formateurs' => User::whereHas('roles', function($q) { $q->where('code', 'FORMATEUR'); })->count(),
        'plans' => PlanFormation::where('statut', 'validé')->count(),
        'secteurs' => Secteur::count(),
        'totalHeures' => PlanTheme::whereHas('plan', function($q) { $q->where('statut', 'validé'); })->sum('duree_heures'),
    ];

    // 2. Plans pour le carousel (Les 5 derniers plans validés avec détails enrichis)
    $latestPlans = PlanFormation::with(['entite.secteur', 'createur', 'themes.animateurs'])
        ->withCount(['participants'])
        ->where('statut', 'validé')
        ->latest('date_validation')
        ->limit(5)
        ->get()
        ->map(function(PlanFormation $plan) {
            // Calcul manuel des animateurs uniques
            $plan->animateurs_count = count($plan->getAnimateurIds());
            return $plan;
        });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => false,
        'stats' => $stats,
        'latestPlans' => $latestPlans,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Documentation & Support (Public Access)
Route::get('/documentation', function () {
    return Inertia::render('Support/Documentation');
})->name('documentation');

Route::get('/documentation/download', [App\Http\Controllers\Support\PdfGuideController::class, 'download'])->name('documentation.download');

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * ADMINISTRATION (Accès réservé ADMIN)
 */
Route::middleware(['auth', 'role:ADMIN'])->prefix('admin')->name('admin.')->group(function () {
    
    // Pilotage & Supervision
    Route::get('pilotage', [PilotageController::class, 'index'])->name('pilotage.index');
    Route::get('pilotage/plans/{plan}', [PilotageController::class, 'showPlan'])->name('pilotage.plans.show');
    Route::get('pilotage/entites/{entite}', [PilotageController::class, 'showEntite'])->name('pilotage.entites.show');
    Route::patch('pilotage/plans/{plan}/archive', [PilotageController::class, 'archivePlan'])->name('pilotage.plans.archive');
    Route::delete('pilotage/plans/{plan}', [PilotageController::class, 'destroyPlan'])->name('pilotage.plans.destroy');
    Route::delete('pilotage/entites/{entite}', [PilotageController::class, 'destroyEntite'])->name('pilotage.entites.destroy');
    Route::delete('pilotage/sessions/{seance}', [PilotageController::class, 'destroySession'])->name('pilotage.sessions.destroy');

    // Modules Dédiés
    Route::resource('users', UserController::class);
    Route::resource('instituts', InstitutController::class);
    
    // Spécialités (Domaines/Secteurs/Métiers)
    Route::get('domaines', [AdminDomaineController::class, 'index'])->name('domaines.index');
    Route::post('domaines/cdcs', [AdminDomaineController::class, 'storeCdc'])->name('domaines.cdcs.store');
    Route::patch('domaines/cdcs/{cdc}', [AdminDomaineController::class, 'updateCdc'])->name('domaines.cdcs.update');
    Route::delete('domaines/cdcs/{cdc}', [AdminDomaineController::class, 'destroyCdc'])->name('domaines.cdcs.destroy');
    Route::post('domaines/secteurs', [AdminDomaineController::class, 'storeSecteur'])->name('domaines.secteurs.store');
    Route::patch('domaines/secteurs/{secteur}', [AdminDomaineController::class, 'updateSecteur'])->name('domaines.secteurs.update');
    Route::delete('domaines/secteurs/{secteur}', [AdminDomaineController::class, 'destroySecteur'])->name('domaines.secteurs.destroy');
    Route::post('domaines/metiers', [AdminDomaineController::class, 'storeMetier'])->name('domaines.metiers.store');
    Route::patch('domaines/metiers/{metier}', [AdminDomaineController::class, 'updateMetier'])->name('domaines.metiers.update');
    Route::delete('domaines/metiers/{metier}', [AdminDomaineController::class, 'destroyMetier'])->name('domaines.metiers.destroy');

    // Logistique Admin
    Route::get('logistique', [AdminLogistiqueController::class, 'index'])->name('logistique.index');
    Route::post('logistique/sites', [AdminLogistiqueController::class, 'storeSite'])->name('logistique.sites.store');
    Route::patch('logistique/sites/{site}', [AdminLogistiqueController::class, 'updateSite'])->name('logistique.sites.update');
    Route::delete('logistique/sites/{site}', [AdminLogistiqueController::class, 'destroySite'])->name('logistique.sites.destroy');
    Route::post('logistique/hotels', [AdminLogistiqueController::class, 'storeHotel'])->name('logistique.hotels.store');
    Route::patch('logistique/hotels/{hotel}', [AdminLogistiqueController::class, 'updateHotel'])->name('logistique.hotels.update');
    Route::delete('logistique/hotels/{hotel}', [AdminLogistiqueController::class, 'destroyHotel'])->name('logistique.hotels.destroy');
});

// Catalogue National
Route::middleware(['auth'])->group(function () {
    Route::get('catalogue-national', [\App\Http\Controllers\CatalogueController::class, 'index'])->name('modules.catalogue.index');
    Route::get('catalogue-national/{plan}', [\App\Http\Controllers\CatalogueController::class, 'show'])->name('modules.catalogue.show');
    
    // Notifications (Accessibles à tous les rôles)
    Route::post('notifications/{id}/mark-as-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('modules.notifications.mark-as-read');
    Route::post('notifications/mark-all-as-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('modules.notifications.mark-all-as-read');
});

Route::middleware(['auth', 'role:RF,CDC'])->prefix('modules')->name('modules.')->group(function () {
    Route::resource('entites', EntiteFormationController::class);
    Route::get('entites/{entite}/export-pdf', [EntiteFormationController::class, 'exportPdf'])->name('entites.export-pdf');
});

Route::middleware(['auth', 'role:RF,CDC'])->prefix('modules')->name('modules.')->group(function () {
    Route::post('plans/availability/check', [PlanFormationController::class, 'checkAvailability'])->name('plans.availability.check');
    Route::resource('plans', PlanFormationController::class);
    Route::get('plans/{plan}/export-pdf', [PlanFormationController::class, 'exportPdf'])->name('plans.export-pdf');
    Route::post('plans/{plan}/submit', [PlanFormationController::class, 'submit'])->name('plans.submit');
    Route::post('plans/{plan}/validate', [PlanFormationController::class, 'validatePlan'])->name('plans.validate');
    Route::post('plans/{plan}/reject', [PlanFormationController::class, 'reject'])->name('plans.reject');
    Route::post('plans/{plan}/confirm', [PlanFormationController::class, 'confirm'])->name('plans.confirm');
    Route::post('plans/{plan}/cancel', [PlanFormationController::class, 'cancel'])->name('plans.cancel');
    Route::prefix('validations')->name('validations.')->group(function () {
        Route::get('/', [PlanValidationController::class, 'index'])->name('index');
        Route::get('plans/{plan}', [PlanValidationController::class, 'show'])->name('show');
        Route::get('plans/{plan}/planning', [SeanceController::class, 'index'])->name('planning.index');
        Route::post('plans/{plan}/seances', [SeanceController::class, 'store'])->name('planning.store');
        Route::post('plans/{plan}/cloturer', [PlanFormationController::class, 'cloturerPlanning'])->name('planning.cloturer');
        Route::post('plans/{plan}/reouvrir', [PlanFormationController::class, 'reouvrirPlanning'])->name('planning.reouvrir');
    });
    
    Route::resource('seances', SeanceController::class)->only(['destroy']);
    
    // Logistique (Utilisée par les coordinateurs pour consultation)
    Route::get('logistique', [LogistiqueController::class, 'index'])->name('logistique.index');

    // Feedback Management (RF/CDC)
    Route::get('feedback/dashboard', [FeedbackAdminController::class, 'dashboard'])->name('feedback.dashboard');
    Route::get('feedback/builder/{seance}', [FeedbackAdminController::class, 'builder'])->name('feedback.builder');
    Route::post('feedback/save/{seance}', [FeedbackAdminController::class, 'save'])->name('feedback.save');
    Route::post('feedback/quick-store/{seance}', [FeedbackAdminController::class, 'quickStore'])->name('feedback.quick-store');
    Route::get('feedback/results/{seance}', [FeedbackAdminController::class, 'results'])->name('feedback.results');
    Route::patch('feedback/submissions/{submission}/publish', [FeedbackAdminController::class, 'togglePublish'])->name('feedback.submissions.toggle-publish');
});

// Espace Animateur
Route::middleware(['auth', 'role:FORMATEUR'])->prefix('animateur')->name('modules.animateur.')->group(function () {
    Route::get('/dashboard', [AnimateurDashboardController::class, 'index'])->name('dashboard');
    Route::get('/formations', [AnimateurDashboardController::class, 'formations'])->name('formations');
    Route::get('/formations/{plan}', [AnimateurDashboardController::class, 'showFormation'])->name('formations.show');
    
    // Plan Resources (Animateur)
    Route::post('/formations/{plan}/ressources', [PlanRessourceController::class, 'store'])->name('formations.ressources.store');
    Route::put('/formations/ressources/{ressource}', [PlanRessourceController::class, 'update'])->name('formations.ressources.update');
    Route::delete('/formations/ressources/{ressource}', [PlanRessourceController::class, 'destroy'])->name('formations.ressources.destroy');

    // Seances (Préparation & Ressources)
    Route::get('/seances/{seance}/preparation', [SeancePedagogiqueController::class, 'edit'])->name('seances.preparation');
    Route::patch('/seances/{seance}/description', [SeancePedagogiqueController::class, 'updateDescription'])->name('seances.update-description');
    Route::post('/seances/{seance}/ressources', [SeancePedagogiqueController::class, 'addResource'])->name('seances.ressources.store');
    Route::put('/seances/ressources/{ressource}', [SeancePedagogiqueController::class, 'updateResource'])->name('seances.ressources.update');
    Route::delete('/seances/ressources/{ressource}', [SeancePedagogiqueController::class, 'deleteResource'])->name('seances.ressources.destroy');

    // Attendance (Appel & Rapports)
    Route::get('/seances/{seance}/attendance', [AnimateurDashboardController::class, 'attendance'])->name('seances.attendance');
    Route::post('/seances/{seance}/attendance', [AnimateurDashboardController::class, 'submitAttendance'])->name('seances.attendance.submit');
    Route::get('/seances/{seance}/print-sheet', [AnimateurDashboardController::class, 'printSheet'])->name('seances.print-sheet');
    Route::get('/seances/{seance}/export-absences', [AnimateurDashboardController::class, 'exportAbsences'])->name('seances.export-absences');
});

// Espace Participant
Route::middleware(['auth', 'role:FORMATEUR'])->prefix('participant')->name('participant.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Modules\Participant\ParticipantDashboardController::class, 'index'])->name('dashboard');
    Route::get('/formations', [App\Http\Controllers\Modules\Participant\SeanceController::class, 'formations'])->name('formations');
    Route::get('/formation/{plan}', [App\Http\Controllers\Modules\Participant\SeanceController::class, 'planShow'])->name('plan.show');
    Route::get('/seance/{seance}', [App\Http\Controllers\Modules\Participant\SeanceController::class, 'show'])->name('seance.show');
    Route::get('/qcm/{qcm}', [App\Http\Controllers\Modules\Participant\QcmController::class, 'show'])->name('qcm.passage');
    Route::post('/qcm/{qcm}/submit', [App\Http\Controllers\Modules\Participant\QcmController::class, 'submit'])->name('qcm.submit');
    
    // Feedback Participant
    Route::get('/feedback/{seance}', [App\Http\Controllers\Modules\Participant\FeedbackParticipantController::class, 'show'])->name('feedback.show');
    Route::post('/feedback/{seance}/submit', [App\Http\Controllers\Modules\Participant\FeedbackParticipantController::class, 'submit'])->name('feedback.submit');
});

require __DIR__.'/auth.php';
