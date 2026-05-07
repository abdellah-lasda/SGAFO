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
        <AuthenticatedLayout>
            <Head title="Tableau de bord — Absences" />

            <div className="min-h-screen bg-slate-50 px-8 py-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analyse de l'Absentéisme</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">
                            Suivi des présences, taux d'absentéisme et alertes participants
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-amber-200 rounded-2xl px-6 py-3 shadow-sm">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seuil d'alerte</p>
                            <p className="text-lg font-black text-slate-900 leading-tight">{seuil} <span className="text-xs text-slate-400">absences NJ</span></p>
                        </div>
                    </div>
                </div>

                {/* Filtres - Style Premium */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        </div>
                        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Filtres de recherche</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan de formation</label>
                            <select
                                value={localFilters.plan_id}
                                onChange={e => setLocalFilters(f => ({ ...f, plan_id: e.target.value }))}
                                className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 py-3"
                            >
                                <option value="">Tous les plans</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.titre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Du</label>
                            <input type="date" value={localFilters.from}
                                onChange={e => setLocalFilters(f => ({ ...f, from: e.target.value }))}
                                className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 py-3" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Au</label>
                            <input type="date" value={localFilters.to}
                                onChange={e => setLocalFilters(f => ({ ...f, to: e.target.value }))}
                                className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 py-3" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={applyFilters}
                                className="flex-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                                Filtrer
                            </button>
                            <button onClick={resetFilters}
                                className="px-5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-slate-200 transition-all">
                                RAZ
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                            <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Absences</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{globalStats.total_absences}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 italic">Toutes séances confondues</p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-red-200 transition-colors">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Non Justifiées</p>
                        <p className="text-3xl font-black text-red-600 mt-1">{globalStats.unjustified}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 italic">Sans motif fourni</p>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-emerald-200 transition-colors">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux Moyen</p>
                        <p className={`text-3xl font-black mt-1 ${globalStats.taux_moyen >= 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {globalStats.taux_moyen}%
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 italic">Absences / Présences saisies</p>
                    </div>

                    <div className={`p-6 rounded-[2rem] border shadow-sm transition-all ${globalStats.participants_a_risque > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${globalStats.participants_a_risque > 0 ? 'bg-white' : 'bg-slate-50'}`}>
                            <svg className={`w-6 h-6 ${globalStats.participants_a_risque > 0 ? 'text-amber-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">À Risque (Alerte)</p>
                        <p className={`text-3xl font-black mt-1 ${globalStats.participants_a_risque > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{globalStats.participants_a_risque}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 italic">≥ {seuil} absences NJ / plan</p>
                    </div>
                </div>

                {/* Absences par plan */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                            Répartition par Plan de Formation ({parPlan.length})
                        </h2>
                    </div>

                    {parPlan.length === 0 && (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            </div>
                            <p className="text-slate-400 font-bold italic">Aucune donnée disponible pour ces filtres.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {parPlan.map(plan => (
                            <div key={plan.plan_id} className="bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                <button
                                    onClick={() => setExpandedPlan(expandedPlan === plan.plan_id ? null : plan.plan_id)}
                                    className="w-full px-8 py-6 flex flex-col md:flex-row md:items-center gap-6 text-left"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">{plan.entite || 'Formation'}</span>
                                            {plan.participants_risque.length > 0 && (
                                                <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-tight">
                                                    ⚠️ {plan.participants_risque.length} À Risque
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{plan.titre}</h3>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8 md:gap-12">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absences</p>
                                            <p className="text-sm font-black text-slate-900">{plan.absences} <span className="text-[10px] text-slate-400">({plan.unjustified} NJ)</span></p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression</p>
                                            <p className="text-sm font-black text-slate-900">{plan.seances_avec_appel} / {plan.total_seances} <span className="text-[10px] text-slate-400">séances</span></p>
                                        </div>
                                        <div className="min-w-[120px] space-y-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux</p>
                                                <span className={`text-[10px] font-black ${plan.taux_absenteisme >= 20 ? 'text-red-600' : 'text-emerald-600'}`}>{plan.taux_absenteisme}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full transition-all ${plan.taux_absenteisme >= 20 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(plan.taux_absenteisme, 100)}%` }} />
                                            </div>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-all ${expandedPlan === plan.plan_id ? 'rotate-180' : ''}`}>
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </button>

                                {expandedPlan === plan.plan_id && (
                                    <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                                        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                                Détail des participants critiques
                                            </h4>
                                            
                                            {plan.participants_risque.length === 0 ? (
                                                <p className="text-xs font-bold text-slate-400 italic text-center py-4">✅ Aucun participant n'a dépassé le seuil d'alerte sur ce plan.</p>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {plan.participants_risque.map(p => (
                                                        <div key={p.participant_id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">
                                                                    {p.nom_complet.split(' ').map((n: string) => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black text-slate-900">{p.nom_complet}</p>
                                                                    <p className="text-[9px] font-bold text-red-500 uppercase tracking-tight">{p.absences} absences NJ</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${p.taux >= 20 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                                    {p.taux}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Focus sur les participants à risque global */}
                {participantsARisque.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                                Participants en difficulté (Alerte Globale)
                            </h2>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant</th>
                                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Concerné</th>
                                            <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Absences NJ</th>
                                            <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {participantsARisque.flatMap(p =>
                                            p.plans.map((pl, i) => (
                                                <tr key={`${p.participant_id}-${pl.plan_id}`} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        {i === 0 ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-[11px] font-black text-white shadow-md">
                                                                    {p.nom_complet.split(' ').map((n: string) => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-900">{p.nom_complet}</p>
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Participant ID: #{p.participant_id}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 pl-12 text-slate-300">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Autre Plan</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-xs font-black text-slate-700">{pl.plan_titre}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{pl.entite}</p>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black border ${
                                                            pl.est_a_risque
                                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                        }`}>
                                                            {pl.absences} <span className="text-[10px] opacity-60">/ {pl.total_seances}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={`text-xs font-black ${pl.taux >= 20 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                            {pl.taux}%
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        {pl.est_a_risque ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100">
                                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                                                Alerte
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                                Conforme
                                                            </span>
                                                        )}
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
                    <div className="bg-emerald-50 border border-emerald-200 rounded-[2.5rem] p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-emerald-900">Excellent Suivi !</h3>
                        <p className="text-emerald-600/70 text-sm mt-2 max-w-md mx-auto font-medium">
                            Tous les participants respectent l'assiduité. Aucun profil à risque n'a été détecté pour les critères sélectionnés.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
