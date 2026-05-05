import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface GlobalStats {
    total_absences: number;
    unjustified: number;
    taux_moyen: number;
    participants_a_risque: number;
}

interface ParticipantRisque {
    participant_id: number;
    nom_complet: string;
    taux: number;
    absences: number;
    total_seances: number;
    est_a_risque: boolean;
}

interface ParPlan {
    plan_id: number;
    titre: string;
    statut: string;
    entite: string | null;
    total_seances: number;
    seances_avec_appel: number;
    total_participants: number;
    total_presences_saisies: number;
    absences: number;
    unjustified: number;
    taux_absenteisme: number;
    participants_risque: ParticipantRisque[];
}

interface PlanOption { id: number; titre: string; }

interface ParticipantARisque {
    participant_id: number;
    nom: string;
    prenom: string;
    nom_complet: string;
    total_absences: number;
    est_a_risque: boolean;
    plans: {
        plan_id: number;
        plan_titre: string;
        entite: string;
        absences: number;
        total_seances: number;
        taux: number;
        est_a_risque: boolean;
    }[];
}

interface Props {
    globalStats: GlobalStats;
    parPlan: ParPlan[];
    participantsARisque: ParticipantARisque[];
    plans: PlanOption[];
    seuil: number;
    filters: { plan_id: number | null; from: string | null; to: string | null };
    auth: { user: any };
}

function TauxBadge({ taux }: { taux: number }) {
    const color = taux >= 30 ? 'bg-red-500/20 text-red-400 border-red-500/30'
        : taux >= 15 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${color}`}>
            {taux}%
        </span>
    );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div className={`rounded-2xl border p-5 flex flex-col gap-1 ${color}`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
            <p className="text-3xl font-black">{value}</p>
            {sub && <p className="text-xs opacity-60">{sub}</p>}
        </div>
    );
}

function ProgressBar({ value }: { value: number }) {
    const bg = value >= 30 ? 'bg-red-500' : value >= 15 ? 'bg-amber-500' : 'bg-emerald-500';
    return (
        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
            <div className={`h-1.5 rounded-full transition-all ${bg}`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
    );
}

export default function AbsenceDashboard({ globalStats, parPlan, participantsARisque, plans, seuil, filters, auth }: Props) {
    const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
    const [localFilters, setLocalFilters] = useState({
        plan_id: filters.plan_id?.toString() ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });

    const applyFilters = () => {
        router.get(route('modules.absences.dashboard'), {
            plan_id: localFilters.plan_id || undefined,
            from: localFilters.from || undefined,
            to: localFilters.to || undefined,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setLocalFilters({ plan_id: '', from: '', to: '' });
        router.get(route('modules.absences.dashboard'));
    };

    const inputClass = "bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 w-full";

    return (
        <AuthenticatedLayout >
            <Head title="Tableau de bord — Absences" />

            <div className="min-h-screen bg-[#0a0f1e] text-white px-6 py-8 space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">Tableau de bord — Absences</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Suivi des présences, taux d'absentéisme et alertes participants
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2">
                        <span className="text-amber-400 text-sm font-bold">⚠️ Seuil alerte :</span>
                        <span className="text-white font-black text-lg">{seuil}</span>
                        <span className="text-amber-400 text-sm">absences NJ / plan</span>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Filtres</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-semibold">Plan de formation</label>
                            <select
                                value={localFilters.plan_id}
                                onChange={e => setLocalFilters(f => ({ ...f, plan_id: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="">Tous les plans</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.titre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-semibold">Date début</label>
                            <input type="date" value={localFilters.from}
                                onChange={e => setLocalFilters(f => ({ ...f, from: e.target.value }))}
                                className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-semibold">Date fin</label>
                            <input type="date" value={localFilters.to}
                                onChange={e => setLocalFilters(f => ({ ...f, to: e.target.value }))}
                                className={inputClass} />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={applyFilters}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                                Appliquer
                            </button>
                            <button onClick={resetFilters}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Total absences"
                        value={globalStats.total_absences}
                        sub="toutes séances confondues"
                        color="bg-slate-900 border-slate-800 text-white"
                    />
                    <StatCard
                        label="Non justifiées"
                        value={globalStats.unjustified}
                        sub="sans motif fourni"
                        color="bg-red-950/40 border-red-800/40 text-red-300"
                    />
                    <StatCard
                        label="Taux moyen"
                        value={`${globalStats.taux_moyen}%`}
                        sub="absences / présences saisies"
                        color={globalStats.taux_moyen >= 20
                            ? "bg-amber-950/40 border-amber-800/40 text-amber-300"
                            : "bg-emerald-950/40 border-emerald-800/40 text-emerald-300"}
                    />
                    <StatCard
                        label="⚠️ À risque"
                        value={globalStats.participants_a_risque}
                        sub={`≥ ${seuil} absences NJ dans un plan`}
                        color={globalStats.participants_a_risque > 0
                            ? "bg-amber-950/40 border-amber-500/30 text-amber-300"
                            : "bg-slate-900 border-slate-800 text-slate-400"}
                    />
                </div>

                {/* Absences par plan */}
                <div className="space-y-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                        Absences par plan ({parPlan.length})
                    </h2>

                    {parPlan.length === 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
                            Aucune donnée d'absence disponible pour ces filtres.
                        </div>
                    )}

                    {parPlan.map(plan => (
                        <div key={plan.plan_id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            {/* Ligne plan */}
                            <button
                                onClick={() => setExpandedPlan(expandedPlan === plan.plan_id ? null : plan.plan_id)}
                                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition-all text-left"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-white truncate">{plan.titre}</span>
                                        {plan.participants_risque.length > 0 && (
                                            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                                                ⚠️ {plan.participants_risque.length} à risque
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">{plan.entite ?? '—'}</p>
                                </div>

                                <div className="flex items-center gap-6 text-sm flex-shrink-0">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Absences</p>
                                        <p className="font-bold text-white">{plan.absences}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Non just.</p>
                                        <p className="font-bold text-red-400">{plan.unjustified}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500">Séances saisies</p>
                                        <p className="font-bold text-slate-300">{plan.seances_avec_appel}/{plan.total_seances}</p>
                                    </div>
                                    <div className="text-center min-w-[80px]">
                                        <p className="text-xs text-slate-500 mb-1">Taux</p>
                                        <TauxBadge taux={plan.taux_absenteisme} />
                                        <ProgressBar value={plan.taux_absenteisme} />
                                    </div>
                                    <span className="text-slate-600 text-lg">{expandedPlan === plan.plan_id ? '▲' : '▼'}</span>
                                </div>
                            </button>

                            {/* Détail participants */}
                            {expandedPlan === plan.plan_id && (
                                <div className="border-t border-slate-800 px-6 py-4">
                                    {plan.participants_risque.length === 0 ? (
                                        <p className="text-slate-500 text-sm text-center py-4">
                                            ✅ Aucun participant n'a atteint le seuil dans ce plan.
                                        </p>
                                    ) : (
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
                                                Participants ayant atteint le seuil
                                            </p>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-xs text-slate-500 border-b border-slate-800">
                                                            <th className="text-left pb-2 font-semibold">Participant</th>
                                                            <th className="text-center pb-2 font-semibold">Absences NJ</th>
                                                            <th className="text-center pb-2 font-semibold">Taux</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800">
                                                        {plan.participants_risque.map(p => (
                                                            <tr key={p.participant_id} className="hover:bg-slate-800/40">
                                                                <td className="py-2.5 font-medium text-white">{p.nom_complet}</td>
                                                                <td className="py-2.5 text-center">
                                                                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-xs font-bold">
                                                                        {p.absences}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2.5 text-center">
                                                                    <TauxBadge taux={p.taux} />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Participants à risque global */}
                {participantsARisque.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                            Tous les participants à risque (≥ {seuil} absences NJ)
                        </h2>
                        <div className="bg-slate-900 border border-amber-500/20 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-slate-800">
                                        <tr className="text-xs text-slate-500">
                                            <th className="text-left px-6 py-3 font-semibold">Participant</th>
                                            <th className="text-left px-4 py-3 font-semibold">Plan</th>
                                            <th className="text-center px-4 py-3 font-semibold">Absences NJ</th>
                                            <th className="text-center px-4 py-3 font-semibold">Séances</th>
                                            <th className="text-center px-4 py-3 font-semibold">Taux</th>
                                            <th className="text-center px-4 py-3 font-semibold">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {participantsARisque.flatMap(p =>
                                            p.plans.map((pl, i) => (
                                                <tr key={`${p.participant_id}-${pl.plan_id}`}
                                                    className={`hover:bg-slate-800/40 ${pl.est_a_risque ? 'bg-amber-950/10' : ''}`}>
                                                    <td className="px-6 py-3 font-semibold text-white">
                                                        {i === 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                                                                    {p.prenom?.[0]}{p.nom?.[0]}
                                                                </div>
                                                                {p.nom_complet}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-600 pl-10">↳</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-300 max-w-[200px] truncate">{pl.plan_titre}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                                                            pl.est_a_risque
                                                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                                : 'bg-slate-700 text-slate-400 border-slate-600'
                                                        }`}>{pl.absences}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-slate-400">{pl.total_seances}</td>
                                                    <td className="px-4 py-3 text-center"><TauxBadge taux={pl.taux} /></td>
                                                    <td className="px-4 py-3 text-center">
                                                        {pl.est_a_risque
                                                            ? <span className="text-amber-400 font-bold text-xs">⚠️ Alerte</span>
                                                            : <span className="text-emerald-400 text-xs">✓ OK</span>}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {participantsARisque.length === 0 && parPlan.length > 0 && (
                    <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-8 text-center">
                        <p className="text-emerald-400 font-bold text-lg">✅ Aucun participant à risque</p>
                        <p className="text-emerald-600 text-sm mt-1">
                            Tous les participants ont moins de {seuil} absences non justifiées dans leurs plans.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
