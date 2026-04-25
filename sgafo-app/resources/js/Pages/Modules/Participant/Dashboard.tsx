import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Seance {
    id: number;
    date: string;
    debut: string;
    fin: string;
    statut: string;
    plan: {
        titre: string;
        entite: {
            titre: string;
        };
    };
    site: {
        nom: string;
        ville: string;
    } | null;
    seanceThemes: {
        id: number;
        theme: {
            nom: string;
        };
        formateur: {
            prenom: string;
            nom: string;
        };
    }[];
}

interface Qcm {
    id: number;
    titre: string;
    seance: Seance;
    deja_fait: boolean;
}

interface Props extends PageProps {
    seances: Seance[];
    stats: {
        sessions_count: number;
        attendance_rate: number;
        avg_qcm_score: number;
        upcoming_count: number;
    };
    nextSession: Seance | null;
    qcms: Qcm[];
}

export default function Dashboard({ auth, seances, stats, nextSession, qcms }: Props) {
    const user = auth.user;
    const isToday = nextSession && nextSession.date === format(new Date(), 'yyyy-MM-dd');

    return (
        <AuthenticatedLayout header={<span>Mon Espace Participant</span>}>
            <Head title="Mon Tableau de bord" />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Heureux de vous revoir, {user.prenom} ! 👋
                        </h1>
                        <p className="text-slate-400 font-medium mt-2">
                            {isToday 
                                ? "✨ Vous avez une session de formation aujourd'hui." 
                                : nextSession
                                ? `Votre prochaine session est prévue pour le ${format(new Date(nextSession.date), 'd MMMM', { locale: fr })}.`
                                : "Aucune formation prévue pour le moment."}
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4">
                        <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm min-w-[140px]">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assiduité</p>
                            <p className="text-2xl font-black text-slate-900">{stats.attendance_rate}%</p>
                        </div>
                        <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm min-w-[140px]">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Moyenne QCM</p>
                            <p className="text-2xl font-black text-blue-600">{stats.avg_qcm_score}%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Focus Card & Schedule */}
                    <div className="lg:col-span-2 space-y-8">
                        {nextSession ? (
                            <div className="relative group overflow-hidden bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-600/20 transition-all hover:scale-[1.01] duration-500">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 bg-white/20 text-[10px] font-black uppercase tracking-widest rounded-lg">Prochaine séance</span>
                                        {isToday && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                                    </div>

                                    <h2 className="text-3xl font-black mb-2 leading-tight">
                                        {nextSession.plan.titre}
                                    </h2>
                                    <p className="text-blue-100 font-bold mb-8 uppercase text-xs tracking-widest">
                                        {nextSession.plan.entite.titre}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/10 rounded-2xl">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Quand ?</p>
                                                <p className="text-lg font-black">{format(new Date(nextSession.date), 'EEEE d MMMM', { locale: fr })}</p>
                                                <p className="text-sm font-medium text-blue-100">{nextSession.debut} - {nextSession.fin}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/10 rounded-2xl">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Où ?</p>
                                                <p className="text-lg font-black">{nextSession.site?.nom || 'Site non défini'}</p>
                                                <p className="text-sm font-medium text-blue-100">{nextSession.site?.ville || '—'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/10 rounded-2xl">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Modules</p>
                                                <div className="space-y-0.5">
                                                    {(nextSession.seanceThemes || (nextSession as any).seance_themes || []).map((st: any) => (
                                                        <p key={st.id} className="text-xs font-bold truncate max-w-[150px]">
                                                            {st.theme.nom} <span className="text-blue-300 font-normal">({st.formateur.prenom})</span>
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link 
                                            href={route('participant.seance.show', nextSession.id)}
                                            className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg"
                                        >
                                            📄 Détails & Supports
                                        </Link>
                                        <button className="px-8 py-4 bg-blue-700/50 text-white border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                                            💬 Contacter le formateur
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-16 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-1.003l-.548-.547z" /></svg>
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Pas de session en vue</h3>
                                <p className="text-sm text-slate-400 mt-2">Toutes vos formations sont à jour. Profitez-en pour réviser !</p>
                            </div>
                        )}

                        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Mon Programme</h3>
                                <span className="text-[10px] font-bold text-slate-400">{seances.length} séances au total</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {seances.length > 0 ? (
                                    seances.slice(0, 10).map((s) => (
                                        <Link 
                                            key={s.id} 
                                            href={route('participant.seance.show', s.id)}
                                            className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{format(new Date(s.date), 'MMM', { locale: fr })}</span>
                                                    <span className="text-lg font-black text-slate-900 leading-none mt-0.5">{format(new Date(s.date), 'd')}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{s.plan.titre}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        {s.debut} - {s.fin} · {s.site?.nom || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                                                s.statut === 'terminée' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                s.statut === 'confirmée' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}>
                                                {s.statut}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-slate-400 text-sm">
                                        Vous n'êtes inscrit à aucune séance pour le moment.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: QCMs & Notifications */}
                    <div className="space-y-8">
                        {/* QCM Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">QCM à passer</h3>
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {qcms.filter(q => !q.deja_fait).length > 0 ? (
                                    qcms.filter(q => !q.deja_fait).map(qcm => {
                                        const now = new Date();
                                        const seanceStart = new Date(`${qcm.seance.date}T${qcm.seance.debut}`);
                                        const isPassable = now >= seanceStart;

                                        return (
                                            <div key={qcm.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 hover:bg-blue-50 transition-all">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{qcm.seance?.plan?.titre}</p>
                                                <p className="text-sm font-black text-slate-900 mb-4">{qcm.titre}</p>
                                                {isPassable ? (
                                                    <Link 
                                                        href={route('participant.qcm.passage', qcm.id)}
                                                        className="w-full inline-block py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-600 transition-all"
                                                    >
                                                        Commencer
                                                    </Link>
                                                ) : (
                                                    <div className="w-full py-2 bg-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-center italic cursor-not-allowed">
                                                        Déblocage à {qcm.seance.debut}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-8 text-center text-slate-400 italic text-sm">
                                        Aucun QCM en attente.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Results */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-6">Derniers scores</h3>
                            <div className="space-y-4">
                                {qcms.filter(q => q.deja_fait).length > 0 ? (
                                    qcms.filter(q => q.deja_fait).slice(0, 3).map(qcm => (
                                        <div key={qcm.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="min-w-0 flex-1 pr-4">
                                                <p className="text-[10px] font-bold text-slate-500 truncate">{qcm.titre}</p>
                                            </div>
                                            <span className="text-sm font-black text-blue-400">Terminé</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-slate-500 italic">Aucun résultat enregistré.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
