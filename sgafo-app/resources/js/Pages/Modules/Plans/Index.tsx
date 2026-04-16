import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PlanFormation, STATUT_CONFIG, PlanStatut } from '@/types/plan';
import { useState } from 'react';

interface Props {
    plans: PlanFormation[];
    filtreStatut: string | null;
}

const FILTRES: { value: string | null; label: string }[] = [
    { value: null, label: 'Tous' },
    { value: 'brouillon', label: 'Brouillons' },
    { value: 'soumis', label: 'Soumis' },
    { value: 'confirmé', label: 'Confirmés' },
    { value: 'rejeté', label: 'Rejetés' },
    { value: 'archivé', label: 'Archivés' },
];

export default function Index({ plans, filtreStatut }: Props) {
    const handleFilter = (statut: string | null) => {
        router.get(route('modules.plans.index'), statut ? { statut } : {}, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header={<span>Plans de formation</span>}>
            <Head title="Plans de formation" />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Plans de Formation</h1>
                        <p className="text-sm text-slate-400 font-medium mt-1">Planification et suivi des formations du catalogue</p>
                    </div>
                    <Link
                        href={route('modules.plans.create')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Nouveau plan
                    </Link>
                </div>

                {/* Filtres par statut */}
                <div className="flex items-center gap-2 flex-wrap">
                    {FILTRES.map((f) => (
                        <button
                            key={f.value ?? 'all'}
                            onClick={() => handleFilter(f.value)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                                filtreStatut === f.value
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Liste des plans */}
                {plans.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <p className="text-sm font-bold text-slate-400">Aucun plan de formation trouvé.</p>
                        <p className="text-xs text-slate-300 mt-1">Créez votre premier plan en cliquant sur "Nouveau plan".</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {plans.map((plan) => {
                            const config = STATUT_CONFIG[plan.statut as PlanStatut];
                            const totalHeures = plan.themes?.reduce((sum, t) => sum + Number(t.duree_heures), 0) || 0;

                            return (
                                <Link
                                    key={plan.id}
                                    href={plan.statut === 'brouillon' || plan.statut === 'rejeté'
                                        ? route('modules.plans.edit', plan.id)
                                        : route('modules.plans.show', plan.id)
                                    }
                                    className="block bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{plan.titre}</h3>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                                                    {plan.entite?.titre} · {plan.themes?.length || 0} thèmes · {totalHeures}h
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {plan.createur?.prenom} {plan.createur?.nom}
                                                </p>
                                                <p className="text-[10px] text-slate-300 mt-0.5">
                                                    {new Date(plan.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg ${config.bg} ${config.color}`}>
                                                {config.label}
                                            </span>
                                            <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>

                                    {plan.statut === 'rejeté' && plan.motif_rejet && (
                                        <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Motif de rejet</p>
                                            <p className="text-xs text-red-500 font-medium line-clamp-2">{plan.motif_rejet}</p>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
