<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EntiteFormation;
use App\Models\PlanFormation;
use App\Models\Seance;
use App\Models\Qcm;
use App\Models\User;
use App\Models\SiteFormation;
use App\Models\Hotel;
use App\Models\Institut;
use App\Models\Secteur;
use App\Models\Metier;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PilotageController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->input('tab', 'dashboard');
        $search = $request->input('search');
        
        $stats = [
            'entites' => ['total' => EntiteFormation::count()],
            'plans' => [
                'total' => PlanFormation::count(),
                'by_status' => [
                    'brouillon' => PlanFormation::where('statut', 'brouillon')->count(),
                    'soumis' => PlanFormation::where('statut', 'soumis')->count(),
                    'validé' => PlanFormation::where('statut', 'validé')->count(),
                    'confirmé' => PlanFormation::where('statut', 'confirmé')->count(),
                    'rejeté' => PlanFormation::where('statut', 'rejeté')->count(),
                    'annulé' => PlanFormation::where('statut', 'annulé')->count(),
                ]
            ],
            'sessions' => ['total' => Seance::count()],
            'qcms' => ['total' => Qcm::count()],
            'users' => ['total' => User::count()],
        ];

        $data = [
            'stats' => $stats,
            'currentTab' => $tab,
            'filters' => $request->only(['search']),
        ];

        // Chargement des données selon l'onglet avec filtrage
        switch ($tab) {
            case 'entites':
                $data['entites'] = EntiteFormation::with(['secteur', 'createur'])
                    ->when($search, fn($q) => $q->where('titre', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                break;
            case 'plans':
                $data['plans'] = PlanFormation::with(['entite', 'createur', 'siteFormation'])
                    ->when($search, fn($q) => $q->where('titre', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                break;
            case 'sessions':
                $data['sessions'] = Seance::with(['plan.entite', 'site'])
                    ->when($search, fn($q) => $q->whereHas('plan.entite', fn($sq) => $sq->where('titre', 'like', "%{$search}%")))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                break;
            case 'logistique':
                $data['sites'] = SiteFormation::when($search, fn($q) => $q->where('nom', 'like', "%{$search}%")->orWhere('ville', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                $data['hotels'] = Hotel::when($search, fn($q) => $q->where('nom', 'like', "%{$search}%")->orWhere('ville', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                break;
            case 'users':
                $data['users'] = User::with('roles')
                    ->when($search, fn($q) => $q->where('nom', 'like', "%{$search}%")->orWhere('prenom', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                break;
            case 'instituts':
                $data['instituts'] = Institut::with('region')
                    ->when($search, fn($q) => $q->where('nom', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                break;
            case 'specialites':
                $data['secteurs'] = Secteur::with('metiers')
                    ->when($search, fn($q) => $q->where('nom', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                break;
            default:
                $data['recent_plans'] = PlanFormation::with(['entite', 'createur'])->latest()->take(5)->get();
                break;
        }

        return Inertia::render('Admin/Pilotage/Index', $data);
    }

    public function showPlan(PlanFormation $plan)
    {
        $plan->load(['entite.secteur', 'themes.animateurs', 'participants', 'siteFormation', 'createur', 'validationLogs.user']);
        return Inertia::render('Admin/Pilotage/ShowPlan', ['plan' => $plan]);
    }

    public function showEntite(EntiteFormation $entite)
    {
        $entite->load(['secteur', 'createur', 'themes']);
        return Inertia::render('Admin/Pilotage/ShowEntite', ['entite' => $entite]);
    }

    public function destroyPlan(PlanFormation $plan)
    {
        DB::transaction(function () use ($plan) {
            $plan->seances()->delete();
            $plan->themes()->delete();
            $plan->participants()->detach();
            $plan->delete();
        });
        return redirect()->back()->with('success', 'Plan supprimé définitivement.');
    }

    public function archivePlan(PlanFormation $plan)
    {
        $plan->update(['statut' => 'archivé']);
        return redirect()->back()->with('success', 'Plan déplacé vers les archives.');
    }

    public function destroyEntite(EntiteFormation $entite)
    {
        if ($entite->plans()->exists()) {
            return redirect()->back()->with('error', 'Impossible de supprimer une formation utilisée.');
        }
        $entite->delete();
        return redirect()->back()->with('success', 'Formation supprimée.');
    }

    public function destroySession(Seance $seance)
    {
        $seance->delete();
        return redirect()->back()->with('success', 'Séance supprimée.');
    }

    public function destroyUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }
        $user->delete();
        return redirect()->back()->with('success', 'Utilisateur supprimé.');
    }

    public function destroySite(SiteFormation $site)
    {
        $site->delete();
        return redirect()->back()->with('success', 'Site supprimé.');
    }

    public function destroyInstitut(Institut $institut)
    {
        $institut->delete();
        return redirect()->back()->with('success', 'Établissement supprimé.');
    }
}
