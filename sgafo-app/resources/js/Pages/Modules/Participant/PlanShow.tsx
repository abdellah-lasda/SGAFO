import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props extends PageProps {
    plan: any;
    stats: {
        total_seances: number;
        completed_seances: number;
        progress: number;
    };
}

export default function PlanShow({ plan, stats }: Props) {
    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2">
                <Link href={route('participant.formations')} className="text-slate-400 hover:text-blue-600 transition-colors font-bold">Mes Formations</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">Détails de la formation</span>
            </div>
        }>
            <Head title={`Formation - ${plan.titre}`} />

            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                
                {/* Hero Section */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 animate-in fade-in zoom-in duration-700">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent opacity-50"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30">
                                    {plan.entite?.titre || 'Formation'}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    ID: #{plan.id}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight italic mb-4">
                                {plan.titre}
                            </h1>
                            <p className="text-slate-400 font-bold flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                {plan.domaine?.libelle || 'Domaine non spécifié'}
                            </p>
                        </div>

                        <div className="w-full md:w-80 bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progression</p>
                                    <p className="text-3xl font-black">{stats.progress}%</p>
                                </div>
                                <p className="text-xs font-bold text-slate-500">{stats.completed_seances} / {stats.total_seances} séances</p>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                                    style={{ width: `${stats.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left: Modules list */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                            Modules programmés
                            <div className="flex-1 h-px bg-slate-100"></div>
                        </h2>

                        <div className="space-y-6">
                            {plan.themes.length > 0 ? (
                                plan.themes.map((theme: any, idx: number) => (
                                    <div key={theme.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors"></div>
                                        <div className="flex justify-between items-start gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-sm border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                                        {idx + 1}
                                                    </span>
                                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {theme.nom}
                                                    </h3>
                                                </div>
                                                <div 
                                                    className="text-slate-500 text-sm leading-relaxed italic prose prose-sm max-w-none line-clamp-3"
                                                    dangerouslySetInnerHTML={{ __html: theme.objectifs || "Aucun objectif spécifique n'est défini pour ce module." }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold">Aucun module n'est encore rattaché à ce plan.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Calendar of sessions */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                            Planning
                            <div className="flex-1 h-px bg-slate-100"></div>
                        </h2>

                        <div className="space-y-4">
                            {plan.seances.map((seance: any) => (
                                <Link 
                                    key={seance.id}
                                    href={route('participant.seance.show', seance.id)}
                                    className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                                        seance.statut === 'terminée' 
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' 
                                        : 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                                    }`}>
                                        <span className="text-[9px] font-black uppercase opacity-70">{format(new Date(seance.date), 'MMM', { locale: fr })}</span>
                                        <span className="text-xl font-black">{format(new Date(seance.date), 'dd')}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{seance.debut} - {seance.fin}</span>
                                            {seance.statut === 'terminée' && (
                                                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            )}
                                        </div>
                                        <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                            {seance.site?.nom || 'Lieu non défini'}
                                        </p>
                                        <div className="flex gap-1 mt-1 overflow-hidden">
                                            {seance.seance_themes?.slice(0, 2).map((st: any) => (
                                                <span key={st.id} className="text-[8px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold truncate max-w-[80px]">
                                                    {st.theme?.nom}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </Link>
                            ))}

                            {plan.seances.length === 0 && (
                                <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                    <p className="text-slate-400 text-sm font-bold italic">Aucune séance programmée.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
