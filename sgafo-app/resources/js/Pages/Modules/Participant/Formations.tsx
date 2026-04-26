import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    format, 
    isAfter, 
    startOfDay, 
    isSameDay, 
    isSameMonth,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths
} from 'date-fns';
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
    console.log(plans)
    const [activeTab, setActiveTab] = useState<'timeline' | 'projets'>('timeline');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [calendarScale, setCalendarScale] = useState<'week' | 'month' | 'year'>('month');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Génération des jours selon l'échelle
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    
    let calendarDays: Date[] = [];
    if (calendarScale === 'month') {
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
        calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    } else if (calendarScale === 'week') {
        const weekStart = startOfWeek(currentMonth, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentMonth, { weekStartsOn: 1 });
        calendarDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    }

    const filteredSeances = allSeances.filter(seance => {
        const query = searchQuery.toLowerCase();
        return (
            seance.plan.titre.toLowerCase().includes(query) ||
            seance.plan.entite?.titre?.toLowerCase().includes(query) ||
            seance.site?.nom?.toLowerCase().includes(query)
        );
    });

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2">            
                <span className="font-bold text-slate-900">Mes Formations</span>
            </div>
        }>
            <Head title="Mes Formations" />

            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plans de formation</p>
                            <p className="text-3xl font-black text-slate-900">{stats.total_plans}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Heures validées</p>
                            <p className="text-3xl font-black text-slate-900">{stats.completed_hours}h <span className="text-sm text-slate-300">/ {stats.total_hours}h</span></p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex flex-col justify-center gap-4 group transition-all relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Progression globale</p>
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
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                        <button 
                            onClick={() => setActiveTab('timeline')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📅 Planning
                        </button>
                        <button 
                            onClick={() => setActiveTab('projets')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'projets' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📚 Mes Projets
                        </button>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-4 max-w-3xl">
                        {viewMode === 'calendar' && activeTab === 'timeline' ? (
                            <div className="flex items-center gap-4">
                                {/* Scale Selector */}
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setCalendarScale('week')}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calendarScale === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Semaine
                                    </button>
                                    <button 
                                        onClick={() => setCalendarScale('month')}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${calendarScale === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Mois
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => setCurrentMonth(new Date())}
                                        className="text-[10px] font-black uppercase tracking-widest px-2 hover:text-blue-600 transition-colors"
                                    >
                                        Aujourd'hui
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest min-w-[120px] text-center text-slate-700">
                                        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                                    </span>
                                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex-1 group">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher une formation..."
                                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-transparent rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                                <button 
                                    onClick={() => setViewMode('calendar')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {activeTab === 'timeline' && (
                        <div className="space-y-6">
                            {viewMode === 'list' ? (
                                <div className="space-y-4">
                                    {filteredSeances.length > 0 ? (
                                        filteredSeances.map((s) => (
                                            <Link 
                                                key={s.id} 
                                                href={route('participant.seance.show', s.id)}
                                                className="group bg-white p-6 rounded-[2rem] border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50 flex flex-col md:flex-row md:items-center gap-6"
                                            >
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{format(new Date(s.date), 'MMM', { locale: fr })}</span>
                                                    <span className="text-2xl font-black">{format(new Date(s.date), 'dd')}</span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                            {s.plan.entite?.titre}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {s.site?.nom || '—'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                        {s.plan.titre}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horaire</p>
                                                        <p className="text-sm font-black text-slate-900">{s.debut} - {s.fin}</p>
                                                    </div>
                                                    <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border ${
                                                        s.statut === 'terminée' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        s.statut === 'confirmée' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {s.statut}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                                            <p className="text-slate-400 font-bold">Aucune séance trouvée.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                                    <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                            <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 last:border-0">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7">
                                        {calendarDays.map((day, idx) => {
                                            const daySeances = allSeances.filter(s => isSameDay(new Date(s.date), day));
                                            const isCurrentMonth = isSameMonth(day, monthStart);
                                            const isToday = isSameDay(day, new Date());

                                            return (
                                                <div 
                                                    key={idx} 
                                                    className={`${calendarScale === 'week' ? 'min-h-[400px]' : 'min-h-[160px]'} p-3 border-r border-b border-slate-100 last:border-r-0 transition-all hover:bg-slate-50/50 ${!isCurrentMonth && calendarScale === 'month' ? 'bg-slate-50/30 opacity-40' : ''}`}
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className={`w-8 h-8 flex items-center justify-center text-[12px] font-black rounded-xl ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400'}`}>
                                                            {format(day, 'd')}
                                                        </span>
                                                        {calendarScale === 'week' && (
                                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                                {format(day, 'EEEE', { locale: fr })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        {daySeances.length > 0 ? daySeances.map(s => (
                                                            <Link 
                                                                key={s.id}
                                                                href={route('participant.seance.show', s.id)}
                                                                className={`block p-3 rounded-2xl border text-[9px] font-bold leading-tight transition-all hover:scale-[1.03] hover:shadow-xl group ${
                                                                    s.statut === 'terminée' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' : 
                                                                    s.statut === 'confirmée' ? 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100' :
                                                                    'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start gap-2 mb-2">
                                                                    <span className="uppercase tracking-widest text-[8px] font-black opacity-60">
                                                                        {s.debut} - {s.fin}
                                                                    </span>
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                                        s.statut === 'terminée' ? 'bg-emerald-500' : 
                                                                        s.statut === 'confirmée' ? 'bg-blue-500' : 'bg-slate-300'
                                                                    }`}></div>
                                                                </div>
                                                                <div className="line-clamp-2 uppercase tracking-tight mb-1 group-hover:text-blue-900">
                                                                    {s.plan.entite?.titre || 'Formation'}
                                                                </div>
                                                                <div className="text-[8px] opacity-50 flex items-center gap-1">
                                                                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                    {s.site?.nom || 'Lieu non spécifié'}
                                                                </div>
                                                            </Link>
                                                        )) : (
                                                            calendarScale === 'week' && (
                                                                <div className="h-full flex items-center justify-center py-10 opacity-20">
                                                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
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
                                                    {plan.entite?.titre || 'Formation'}
                                                </span>
                                            </div>
                                            
                                            <h2 className="text-xl font-black text-slate-900 leading-tight mb-6 group-hover:text-blue-600 transition-colors line-clamp-2 italic">
                                                {plan.titre}
                                            </h2>
                                            
                                            <div className="space-y-4 mb-8">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                    <span className="text-slate-400">Progression</span>
                                                    <span className="text-slate-900">{completed} / {total} séances</span>
                                                </div>
                                                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                    <div 
                                                        className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Modules</p>
                                                    <p className="text-sm font-black text-slate-900">{plan.seances.length} sessions</p>
                                                </div>
                                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Heures</p>
                                                    <p className="text-sm font-black text-slate-900">{plan.seances.length * 4}h approx.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                                            {plan.seances && plan.seances.length > 0 ? (
                                                <Link 
                                                    href={route('participant.plan.show', plan.id)}
                                                    className="block w-full px-6 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-lg text-center"
                                                >
                                                    👁️ Voir le parcours
                                                </Link>
                                            ) : (
                                                <button 
                                                    disabled
                                                    className="block w-full px-6 py-4 bg-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-not-allowed text-center"
                                                >
                                                    Pas de séances prévues
                                                </button>
                                            )}
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
