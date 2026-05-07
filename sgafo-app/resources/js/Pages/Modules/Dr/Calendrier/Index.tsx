import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Calendar as CalendarIcon, 
    Clock, 
    MapPin, 
    User as UserIcon,
    Info
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Seance {
    id: number;
    date: string;
    heure_debut?: string;
    debut: string;
    fin: string;
    plan: {
        entite: { titre: string };
        siteFormation: { nom: string };
    };
    animator: { nom: string, prenom: string };
}

interface Props {
    seances: Seance[];
}

export default function Index({ seances }: Props) {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getSessionsForDay = (day: Date) => {
        return seances.filter(s => isSameDay(new Date(s.date), day));
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Calendrier de Surveillance Régionale</span>
                </div>
            }
        >
            <Head title="Calendrier Régional" />

            <div className="max-w-[1600px] mx-auto p-6 pb-32">
                
                {/* Calendar Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: fr })}
                        </h1>
                        <p className="text-slate-500 font-medium">Vue d'ensemble des sessions actives dans la région</p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                        <button 
                            onClick={prevMonth}
                            className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <button 
                            onClick={() => setCurrentDate(new Date())}
                            className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-emerald-600 transition-colors"
                        >
                            Aujourd'hui
                        </button>
                        <button 
                            onClick={nextMonth}
                            className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-slate-50">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                            <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, idx) => {
                            const daySessions = getSessionsForDay(day);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div 
                                    key={idx}
                                    className={`min-h-[160px] border-r border-b border-slate-50 p-4 transition-colors ${
                                        !isCurrentMonth ? 'bg-slate-50/30' : 'bg-white'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`text-sm font-black ${
                                            isToday ? 'w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20' : 
                                            isCurrentMonth ? 'text-slate-900' : 'text-slate-300'
                                        }`}>
                                            {format(day, 'd')}
                                        </span>
                                        {daySessions.length > 0 && (
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                {daySessions.length} Séances
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {daySessions.slice(0, 3).map((session, sIdx) => (
                                            <div 
                                                key={sIdx}
                                                className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer"
                                            >
                                                <div className="text-[10px] font-black text-slate-900 truncate group-hover:text-emerald-700">
                                                    {session.plan.entite.titre}
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-400">
                                                    <Clock className="w-3 h-3" />
                                                    {session.debut.substring(0, 5)}
                                                </div>
                                            </div>
                                        ))}
                                        {daySessions.length > 3 && (
                                            <div className="text-[10px] font-bold text-slate-400 text-center pt-1">
                                                + {daySessions.length - 3} autres
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm inline-flex">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aujourd'hui</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-50 border border-slate-100 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Séance programmée</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
