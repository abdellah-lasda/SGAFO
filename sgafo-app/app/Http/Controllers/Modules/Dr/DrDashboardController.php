<?php

namespace App\Http\Controllers\Modules\Dr;

use App\Http\Controllers\Controller;
use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\User;
use App\Models\Presence;
use App\Models\FeedbackSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DrDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $regions = $user->regions;
        $regionIds = $regions->pluck('id');
        $regionNames = $regions->pluck('nom')->join(', ');

        // 1. KPIs Globaux (Filtrés par HasRegionalScope)
        $totalPlans = PlanFormation::count();
        $totalFormateurs = User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))->count();
        
        // Calcul du taux d'assiduité global de la région
        $presenceStats = Presence::selectRaw("count(*) as total, sum(case when statut in ('présent', 'retard') then 1 else 0 end) as present")
            ->first();
        $attendanceRate = $presenceStats->total > 0 ? round(($presenceStats->present / $presenceStats->total) * 100, 1) : 0;

        // Calcul de la performance QCM
        $qcmStats = \App\Models\QcmTentative::whereHas('qcm.seance.plan') // Filtrage régional via relations
            ->selectRaw('count(*) as total, avg(score) as average')
            ->first();

        $plansParStatut = PlanFormation::selectRaw('statut, count(*) as total')->groupBy('statut')->get();

        // 2. Radar de Satisfaction (Feedback)
        $satisfactionRadar = \App\Models\FeedbackResponse::whereHas('submission.plan')
            ->join('feedback_questions', 'feedback_responses.question_id', '=', 'feedback_questions.id')
            ->where('feedback_questions.type', 'rating')
            ->select('feedback_questions.categorie', \DB::raw('AVG(rating) as average'))
            ->groupBy('feedback_questions.categorie')
            ->get();

        // 5. Heatmap des Compétences (Moyenne QCM par Secteur)
        $competenceHeatmap = \App\Models\QcmTentative::whereHas('qcm.seance.plan.entite.secteur')
            ->join('qcms', 'qcm_tentatives.qcm_id', '=', 'qcms.id')
            ->join('seances', 'qcms.seance_id', '=', 'seances.id')
            ->join('plans_formation', 'seances.plan_id', '=', 'plans_formation.id')
            ->join('entite_formations', 'plans_formation.entite_id', '=', 'entite_formations.id')
            ->join('secteurs', 'entite_formations.secteur_id', '=', 'secteurs.id')
            ->select('secteurs.nom', \DB::raw('AVG(score) as average'))
            ->groupBy('secteurs.nom')
            ->orderByDesc('average')
            ->get();

        // 3. Toutes les Absences Non Justifiées (Pour action administrative)
        $topAbsents = Presence::where('statut', 'absent')->where('est_justifie', false)
            ->with('participant.instituts')
            ->select('participant_id', \DB::raw('count(*) as absence_count'))
            ->groupBy('participant_id')
            ->orderByDesc('absence_count')
            ->get()
            ->map(function($abs) {
                return [
                    'id' => $abs->participant->id,
                    'nom' => $abs->participant->nom . ' ' . $abs->participant->prenom,
                    'count' => $abs->absence_count,
                    'institut' => $abs->participant->instituts->first()?->nom ?? 'N/A'
                ];
            });

        // 4. Comparatif par Institut (Dynamisme)
        $institutsStats = \App\Models\Institut::whereIn('region_id', $regionIds)
            ->withCount(['users as formateurs_count' => function($q) {
                $q->whereHas('roles', fn($sq) => $sq->where('code', 'FORMATEUR'));
            }])
            ->get()
            ->map(function($inst) {
                // Nombre de présences enregistrées pour cet institut
                $activity = Presence::whereHas('participant.instituts', fn($q) => $q->where('id', $inst->id))->count();
                return [
                    'nom' => $inst->nom,
                    'formateurs_count' => $inst->formateurs_count,
                    'activity_score' => $activity,
                ];
            })->sortByDesc('activity_score')->values();

        // 5. Activité Récente
        $recentSeances = Seance::with(['plan.entite', 'plan.siteFormation', 'site'])
            ->orderBy('date', 'desc')
            ->limit(6)
            ->get();

        $stats = [
            'total_plans' => $totalPlans,
            'total_formateurs' => $totalFormateurs,
            'attendance_rate' => $attendanceRate,
            'qcm_average' => round($qcmStats->average ?? 0, 1),
            'plans_par_statut' => $plansParStatut
        ];

        return Inertia::render('Modules/Dr/Dashboard', [
            'regionNames' => $regionNames,
            'stats' => $stats,
            'satisfactionRadar' => $satisfactionRadar,
            'competenceHeatmap' => $competenceHeatmap,
            'topAbsents' => $topAbsents,
            'institutsStats' => $institutsStats,
            'recentSeances' => $recentSeances,
        ]);
    }

    public function plans()
    {
        $plans = PlanFormation::with(['entite', 'siteFormation', 'createur'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Modules/Dr/Plans/Index', [
            'plans' => $plans,
        ]);
    }
    public function formateurs(Request $request)
    {
        $user = Auth::user();
        $regionIds = $user->regions->pluck('id');
        $search = $request->input('search');
        
        $formateurs = User::whereHas('roles', fn($q) => $q->where('code', 'FORMATEUR'))
            ->where('is_externe', false) // Uniquement le personnel interne
            ->whereHas('instituts', function($q) use ($regionIds) {
                $q->whereIn('region_id', $regionIds);
            })
            ->with(['instituts'])
            ->when($search, function($q) use ($search) {
                $q->where(function($sq) use ($search) {
                    $sq->where('nom', 'like', "%{$search}%")
                       ->orWhere('prenom', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%")
                       ->orWhereHas('instituts', function($ssq) use ($search) {
                           $ssq->where('nom', 'like', "%{$search}%");
                       });
                });
            })
            ->orderBy('nom')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Modules/Dr/Formateurs/Index', [
            'formateurs' => $formateurs,
            'filters' => $request->only(['search'])
        ]);
    }

    public function formateurShow(User $user)
    {
        $dr = Auth::user();
        $regionIds = $dr->regions->pluck('id');

        // Sécurité : Vérifier que le formateur appartient à la région du DR
        $belongsToRegion = $user->instituts()->whereIn('region_id', $regionIds)->exists();
        if (!$belongsToRegion) {
            abort(403, "Vous n'êtes pas autorisé à consulter le profil de ce formateur.");
        }

        $user->load(['instituts.region', 'roles', 'secteurs']);
        
        // Statistiques de performance
        $stats = [
            'attendance_rate' => $this->calculateUserAttendance($user),
            'qcm_average' => \App\Models\QcmTentative::where('user_id', $user->id)->avg('score') ?? 0,
            'feedback_average' => \App\Models\FeedbackResponse::whereHas('submission', fn($q) => $q->where('participant_id', $user->id))->avg('rating') ?? 0,
        ];

        // Historique des sessions
        $history = \App\Models\Presence::where('participant_id', $user->id)
            ->with(['seance.plan.entite'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('Modules/Dr/Formateurs/Show', [
            'formateur' => $user,
            'stats' => $stats,
            'history' => $history
        ]);
    }

    public function etablissements()
    {
        $user = Auth::user();
        $regionIds = $user->regions->pluck('id');

        $instituts = \App\Models\Institut::whereIn('region_id', $regionIds)
            ->withCount(['users as formateurs_count' => function($q) {
                $q->whereHas('roles', fn($sq) => $sq->where('code', 'FORMATEUR'));
            }])
            ->get();

        return Inertia::render('Modules/Dr/Instituts/Index', [
            'instituts' => $instituts
        ]);
    }

    public function calendrier(Request $request)
    {
        $user = Auth::user();
        $regionIds = $user->regions->pluck('id');
        
        $seances = Seance::with(['plan.entite', 'plan.siteFormation', 'plan.createur', 'site'])
            ->whereHas('plan.siteFormation', function($q) use ($regionIds) {
                $q->whereIn('region_id', $regionIds);
            })
            ->get()
            ->map(function($s) {
                $s->animator = $s->plan->createur;
                return $s;
            });

        return Inertia::render('Modules/Dr/Calendrier/Index', [
            'seances' => $seances
        ]);
    }

    private function calculateUserAttendance(User $user)
    {
        $query = Presence::where('participant_id', $user->id);
        $total = $query->count();
        if ($total === 0) return 0;

        $present = $query->whereIn('statut', ['présent', 'retard'])->count();
        return round(($present / $total) * 100, 1);
    }
}
