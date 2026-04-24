import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props extends PageProps {
    plans: any[];
    allSeances: any[];
    stats: {
        total_plans: number;
        total_hours: number;
        completed_hours: number;
        completion_rate: number;
    };
}

export default function Formations({ plans, allSeances, stats }: Props) {
    const [activeTab, setActiveTab] = useState<'timeline' | 'projets'>('timeline');

    return (
        <AuthenticatedLayout header={
            <span className="font-bold text-slate-900">Mes Formations</span>
        }>
            <Head title="Mes Formations" />

            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Formations Actives</p>
                            <p className="text-3xl font-black text-slate-900">{stats.total_plans}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Heures Effectuées</p>
                            <p className="text-3xl font-black text-slate-900">{stats.completed_hours}h <span className="text-sm text-slate-300">/ {stats.total_hours}h</span></p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex flex-col justify-center gap-4 group transition-all relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Taux de réalisation</p>
                            <div className="flex items-center gap-4">
                                <p className="text-4xl font-black text-white">{stats.completion_rate}%</p>
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 transition-all duration-1000" 
                                        style={{ width: `${stats.completion_rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Navigation & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
                        <button 
                            onClick={() => setActiveTab('timeline')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'timeline' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📅 Timeline Séances
                        </button>
                        <button 
                            onClick={() => setActiveTab('projets')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'projets' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📚 Mes Projets
                        </button>
                    </div>

                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="Rechercher une formation..."
                            className="w-full md:w-72 pl-12 pr-6 py-4 bg-white border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {activeTab === 'timeline' && (
                        <div className="space-y-6">
                            {allSeances.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {allSeances.map((seance) => {
                                        const isToday = format(new Date(seance.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                                        const isPast = isBefore(new Date(seance.date), startOfDay(new Date()));
                                        
                                        return (
                                            <div 
                                                key={seance.id} 
                                                className={`group bg-white p-6 rounded-[2rem] border transition-all hover:shadow-xl hover:shadow-slate-200/50 flex flex-col md:flex-row md:items-center gap-6 ${isToday ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-100'}`}
                                            >
                                                {/* Date Block */}
                                                <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border ${isToday ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-900 border-slate-100'}`}>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{format(new Date(seance.date), 'MMM', { locale: fr })}</span>
                                                    <span className="text-2xl font-black">{format(new Date(seance.date), 'dd')}</span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{seance.plan.entite?.nom}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{seance.site?.nom || 'Visio'}</span>
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{seance.plan.titre}</h3>
                                                    <p className="text-sm text-slate-500 font-medium mt-1">
                                                        {seance.themes.map((t: any) => t.nom).join(', ')}
                                                    </p>
                                                </div>

                                                {/* Meta & Action */}
                                                <div className="flex flex-col md:items-end gap-3 min-w-[200px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-slate-600 text-[10px] font-black uppercase border border-slate-100">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {substr(seance.debut, 0, 5)} - {substr(seance.fin, 0, 5)}
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                                                            seance.statut === 'terminée' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            seance.statut === 'en_cours' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                        }`}>
                                                            {seance.statut}
                                                        </span>
                                                    </div>
                                                    
                                                    {!isPast && (
                                                        <Link 
                                                            href={route('modules.animateur.seances.attendance', seance.id)}
                                                            className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all text-center shadow-lg active:scale-95"
                                                        >
                                                            Faire l'appel
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">Aucune séance prévue</h3>
                                    <p className="text-slate-500 font-medium mt-2">Votre emploi du temps est libre pour le moment.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'projets' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {plans.map((plan) => {
                                const completed = plan.seances.filter((s: any) => s.statut === 'terminée').length;
                                const total = plan.seances.length;
                                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                                return (
                                    <div key={plan.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all group overflow-hidden flex flex-col h-full">
                                        <div className="p-8 flex-1">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                    {plan.entite?.nom || 'Projet'}
                                                </span>
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                                                            {i}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                                                {plan.titre}
                                            </h3>
                                            
                                            {/* Progress */}
                                            <div className="space-y-3 mb-8">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-slate-400">Progression</span>
                                                    <span className="text-slate-900">{completed} / {total} séances</span>
                                                </div>
                                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-500 transition-all duration-1000" 
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                                            <button className="flex-1 px-4 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                📁 Ressources
                                            </button>
                                            <button className="flex-1 px-4 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                ✍️ QCM
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper pour substr car substr est deprecated
function substr(str: string, start: number, len: number) {
    return str.substring(start, start + len);
}
