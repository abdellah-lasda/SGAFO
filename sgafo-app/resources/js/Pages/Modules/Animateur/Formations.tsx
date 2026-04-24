import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { 
    format, 
    isAfter, 
    isBefore, 
    startOfDay, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    isSameMonth, 
    isSameDay, 
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

    // Filtrage des séances en temps réel
    const filteredSeances = allSeances.filter(seance => {
        const query = searchQuery.toLowerCase();
        return (
            seance.plan.titre.toLowerCase().includes(query) ||
            seance.plan.entite?.nom.toLowerCase().includes(query) ||
            seance.site?.nom?.toLowerCase().includes(query) ||
            seance.themes.some((t: any) => t.nom.toLowerCase().includes(query))
        );
    });

    return (
        <AuthenticatedLayout header={
            <span className="font-bold text-slate-900">Mes Formations</span>
        }>
            <Head title="Mes Formations" />

            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Formations Actives</p>
                            <p className="text-3xl font-black text-slate-900">{stats.total_plans}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Heures Effectuées</p>
                            <p className="text-3xl font-black text-slate-900">{stats.completed_hours}h <span className="text-sm text-slate-300">/ {stats.total_hours}h</span></p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl shadow-slate-900/20 flex flex-col justify-center gap-4 group transition-all relative overflow-hidden">
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

                {/* Navigation & Search & View Toggle */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                        <button 
                            onClick={() => setActiveTab('timeline')}
                            className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📅 Planning
                        </button>
                        <button 
                            onClick={() => setActiveTab('projets')}
                            className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'projets' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            📚 Mes Projets
                        </button>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-4 max-w-3xl">
                        {viewMode === 'calendar' ? (
                            <div className="flex items-center gap-3">
                                {/* Navigation Mois */}
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest min-w-[100px] text-center text-slate-700">
                                        {format(currentMonth, calendarScale === 'year' ? 'yyyy' : 'MMMM yyyy', { locale: fr })}
                                    </span>
                                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>

                                {/* Sélecteur d'Échelle */}
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    {[
                                        { id: 'week', label: 'Sem' },
                                        { id: 'month', label: 'Mois' },
                                        { id: 'year', label: 'An' }
                                    ].map((scale) => (
                                        <button 
                                            key={scale.id}
                                            onClick={() => setCalendarScale(scale.id as any)}
                                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${calendarScale === scale.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {scale.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex-1 group">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher par formation, site..."
                                    className="w-full pl-12 pr-6 py-3 bg-slate-50 border-transparent rounded-xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                    title="Vue Liste"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                </button>
                                <button 
                                    onClick={() => setViewMode('calendar')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                    title="Vue Calendrier"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {activeTab === 'timeline' && (
                        <div className="space-y-6">
                            {viewMode === 'list' ? (
                                <div className="space-y-3">
                                    {filteredSeances.length > 0 ? (
                                        filteredSeances.map((seance) => {
                                            const isToday = format(new Date(seance.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                                            const isFuture = isAfter(new Date(seance.date), startOfDay(new Date())) && !isToday;
                                            
                                            return (
                                                <div key={seance.id} className={`group bg-white p-4 rounded-xl border transition-all hover:shadow-lg hover:shadow-slate-200/50 flex flex-col md:flex-row md:items-center gap-4 ${isToday ? 'border-blue-500 bg-blue-50/10' : 'border-slate-100'}`}>
                                                    {/* Compact Date Block */}
                                                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border shrink-0 ${isToday ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30' : 'bg-slate-50 text-slate-900 border-slate-100'}`}>
                                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-80">{format(new Date(seance.date), 'MMM', { locale: fr })}</span>
                                                        <span className="text-lg font-black">{format(new Date(seance.date), 'dd')}</span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-md truncate">{seance.plan.entite?.nom}</span>
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{seance.site?.nom || 'Visio'}</span>
                                                        </div>
                                                        <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{seance.plan.titre}</h3>
                                                    </div>

                                                    {/* Meta & Action */}
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {substr(seance.debut, 0, 5)} - {substr(seance.fin, 0, 5)}
                                                        </div>
                                                        
                                                        <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase border ${
                                                            seance.statut === 'terminée' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            seance.statut === 'en_cours' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                        }`}>
                                                            {seance.statut}
                                                        </span>

                                                        {(!isFuture && seance.statut !== 'terminée') ? (
                                                            <Link 
                                                                href={route('modules.animateur.seances.attendance', seance.id)}
                                                                className="px-5 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all shadow-sm active:scale-95"
                                                            >
                                                                Appel
                                                            </Link>
                                                        ) : seance.statut === 'terminée' ? (
                                                            <div className="px-5 py-2 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                                                                Clôturée
                                                            </div>
                                                        ) : (
                                                            <div className="px-5 py-2 bg-slate-50 text-slate-300 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 italic" title="Trop tôt pour l'appel">
                                                                À venir
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                                            <h3 className="text-xl font-black text-slate-900">Aucune séance trouvée</h3>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {calendarScale === 'year' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in zoom-in-95 duration-500">
                                            {Array.from({ length: 12 }).map((_, monthIdx) => {
                                                const year = currentMonth.getFullYear();
                                                const monthDate = new Date(year, monthIdx, 1);
                                                const monthStart = startOfMonth(monthDate);
                                                const monthEnd = endOfMonth(monthDate);
                                                const days = eachDayOfInterval({ 
                                                    start: startOfWeek(monthStart, { weekStartsOn: 1 }), 
                                                    end: endOfWeek(monthEnd, { weekStartsOn: 1 }) 
                                                });
                                                
                                                return (
                                                    <div key={monthIdx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <button 
                                                                onClick={() => {
                                                                    setCurrentMonth(monthDate);
                                                                    setCalendarScale('month');
                                                                }}
                                                                className="text-xs font-black text-slate-900 group-hover:text-blue-600 uppercase tracking-widest transition-colors"
                                                            >
                                                                {format(monthDate, 'MMMM', { locale: fr })}
                                                            </button>
                                                            <span className="text-[10px] font-black text-slate-300">{year}</span>
                                                        </div>

                                                        {/* Mini Grid Header */}
                                                        <div className="grid grid-cols-7 mb-1">
                                                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                                                                <div key={d} className="text-[8px] font-black text-slate-300 text-center">{d}</div>
                                                            ))}
                                                        </div>

                                                        {/* Mini Days Grid */}
                                                        <div className="grid grid-cols-7 gap-1">
                                                            {days.map((day, dIdx) => {
                                                                const hasSession = allSeances.some(s => isSameDay(new Date(s.date), day));
                                                                const isCurrMonth = isSameMonth(day, monthStart);
                                                                const isToday = isSameDay(day, new Date());

                                                                return (
                                                                    <div 
                                                                        key={dIdx}
                                                                        className={`aspect-square flex items-center justify-center rounded-full text-[8px] font-bold transition-all ${
                                                                            !isCurrMonth ? 'opacity-0 pointer-events-none' : 
                                                                            hasSession ? 'bg-blue-600 text-white shadow-sm scale-110' : 
                                                                            isToday ? 'bg-slate-900 text-white' :
                                                                            'text-slate-400 hover:bg-slate-100'
                                                                        }`}
                                                                    >
                                                                        {format(day, 'd')}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 animate-in zoom-in-95 duration-500">
                                            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                                                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                                    <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 last:border-0">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 bg-white">
                                                {calendarDays.map((day, idx) => {
                                                    const daySeances = allSeances.filter(s => isSameDay(new Date(s.date), day));
                                                    const isCurrentMonth = isSameMonth(day, monthStart);
                                                    const isToday = isSameDay(day, new Date());

                                                    return (
                                                        <div 
                                                            key={idx} 
                                                            className={`min-h-[140px] p-2 border-r border-b border-slate-100 last:border-r-0 transition-all hover:bg-slate-50/50 ${!isCurrentMonth && calendarScale === 'month' ? 'bg-slate-50/30 opacity-40' : ''}`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className={`w-7 h-7 flex items-center justify-center text-[11px] font-black rounded-lg ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400'}`}>
                                                                    {format(day, 'd')}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                {daySeances.map(s => (
                                                                    <Link 
                                                                        key={s.id}
                                                                        href={route('modules.animateur.seances.attendance', s.id)}
                                                                        className={`block p-2 rounded-xl border text-[9px] font-bold leading-tight transition-all hover:scale-105 hover:shadow-lg ${
                                                                            s.statut === 'terminée' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-blue-50 border-blue-100 text-blue-700'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <span>{substr(s.debut, 0, 5)}</span>
                                                                            <div className={`w-1.5 h-1.5 rounded-full ${s.statut === 'terminée' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                                                        </div>
                                                                        <div className="line-clamp-2 uppercase tracking-tighter">
                                                                            {s.plan.titre}
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
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
                                            
                                            <Link 
                                                href={route('modules.animateur.formations.show', plan.id)}
                                                className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2"
                                            >
                                                {plan.titre}
                                            </Link>
                                            
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
                                            <Link 
                                                href={route('modules.animateur.formations.show', plan.id)}
                                                className="flex-1 px-4 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm text-center"
                                            >
                                                📁 Ressources
                                            </Link>
                                            <Link 
                                                href={route('modules.animateur.formations.show', plan.id)}
                                                className="flex-1 px-4 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm text-center"
                                            >
                                                ✍️ QCM
                                            </Link>
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
