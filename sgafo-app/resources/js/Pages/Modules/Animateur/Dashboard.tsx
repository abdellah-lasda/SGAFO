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
    themes: any[];
}

interface Props extends PageProps {
    seances: Seance[];
    stats: {
        total_hours: number;
        upcoming_count: number;
        pending_attendance: number;
    };
    nextSession: Seance | null;
}

export default function Dashboard({ auth, seances, stats, nextSession }: Props) {
    const user = auth.user;

    return (
        <AuthenticatedLayout header={<span>Espace Animateur</span>}>
            <Head title="Tableau de bord Animateur" />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Bonjour, {user.prenom} ! 👋
                        </h1>
                        <p className="text-slate-400 font-medium mt-2">
                            {nextSession 
                                ? `Votre prochaine séance commence bientôt.` 
                                : "Vous n'avez pas de séance prévue aujourd'hui."}
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4">
                        <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Heures (Mois)</p>
                            <p className="text-2xl font-black text-slate-900">{stats.total_hours}h</p>
                        </div>
                        <div className="px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">À venir</p>
                            <p className="text-2xl font-black text-blue-600">{stats.upcoming_count}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Next Session Focus */}
                    <div className="lg:col-span-2 space-y-8">
                        {nextSession ? (
                            <div className="relative group overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl transition-all hover:scale-[1.01] duration-500">
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Prochaine séance</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    </div>

                                    <h2 className="text-2xl font-black mb-2 leading-tight">
                                        {nextSession.plan.titre}
                                    </h2>
                                    <p className="text-slate-400 font-bold mb-8 uppercase text-xs tracking-widest">
                                        {nextSession.plan.entite.titre}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date & Heure</span>
                                            <span className="text-sm font-bold">
                                                {format(new Date(nextSession.date), 'EEEE d MMMM', { locale: fr })}
                                                <br />
                                                <span className="text-blue-400">{nextSession.debut} - {nextSession.fin}</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lieu</span>
                                            <span className="text-sm font-bold">
                                                {nextSession.site?.nom || 'Non défini'}
                                                <br />
                                                <span className="text-slate-400">{nextSession.site?.ville || '—'}</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thèmes</span>
                                            <span className="text-sm font-bold">
                                                {nextSession.themes.length} module(s)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link 
                                            href={route('modules.animateur.seances.attendance', nextSession.id)}
                                            className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-center shadow-lg active:scale-95"
                                        >
                                            ✅ Faire l'appel
                                        </Link>
                                        <button className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/20 transition-all text-center active:scale-95">
                                            📍 Localiser le site
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Aucune séance aujourd'hui</h3>
                                <p className="text-sm text-slate-400 mt-2">Profitez de ce temps pour préparer vos prochaines interventions.</p>
                            </div>
                        )}

                        {/* Recent History or List */}
                        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Planning des séances</h3>
                                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Voir tout le calendrier</button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {seances.length > 0 ? (
                                    seances.slice(0, 5).map((s) => (
                                        <div key={s.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{format(new Date(s.date), 'MMM', { locale: fr })}</span>
                                                    <span className="text-lg font-black text-slate-900 leading-none mt-0.5">{format(new Date(s.date), 'd')}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{s.plan.titre}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        {s.debut} - {s.fin} · {s.site?.nom || 'Site non défini'}
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
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-slate-400 text-sm">
                                        Aucune séance assignée pour le moment.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Info */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Actions rapides</h3>
                            <div className="space-y-3">
                                <button className="w-full p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all text-left flex items-center justify-between group">
                                    📤 Déposer un support
                                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 12h16" /></svg>
                                </button>
                                <button className="w-full p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all text-left flex items-center justify-between group">
                                    🏨 Infos Hébergement
                                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 12h16" /></svg>
                                </button>
                                <button className="w-full p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all text-left flex items-center justify-between group">
                                    📄 Mes feuilles d'émargement
                                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 12h16" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Besoin d'aide ?</h4>
                            <p className="text-xs text-blue-100 font-medium leading-relaxed mb-6">
                                Un problème avec la salle ou un participant ? Contactez directement le responsable du site.
                            </p>
                            <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
                                📞 Contacter le site
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
