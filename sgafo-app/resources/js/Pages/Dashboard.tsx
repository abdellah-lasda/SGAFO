import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Props extends PageProps {
    stats: {
        formations_count: number;
        secteurs_count: number;
        sites_count: number;
        formateurs_count: number;
        plans_pending_count: number;
    };
    latestFormations: any[];
}

export default function Dashboard({ stats: dataStats, latestFormations }: Props) {
    const user = usePage<PageProps>().props.auth.user;
    
    // Mock data for visual wow - will be replaced by real props in the future
    const stats = [
        { label: 'Formations au Catalogue', value: dataStats.formations_count.toString(), icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        ), color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Secteurs Couverts', value: dataStats.secteurs_count.toString(), icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        ), color: 'bg-blue-50 text-blue-600' },
        { label: 'Sites de Formation', value: dataStats.sites_count.toString(), icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        ), color: 'bg-amber-50 text-amber-600' },
        { label: 'Formateurs Actifs', value: dataStats.formateurs_count.toString(), icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        ), color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <AuthenticatedLayout
            header={<span>Tableau de bord</span>}
        >
            <Head title="Tableau de bord" />

            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                
                {/* Welcome Header */}
                <div className="relative p-10 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-bl-[15rem] -mr-32 -mt-32 opacity-40 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-blue-500/30">
                                Vue d'ensemble
                            </span>
                            <h1 className="mt-6 text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                Ravi de vous revoir,<br />
                                <span className="text-blue-600">{user.prenom} {user.nom}</span> !
                            </h1>
                            <p className="mt-4 text-slate-500 font-medium max-w-lg leading-relaxed">
                                Le système de gestion de l'offre de formation est opérationnel. Consultez vos dernières activités et pilotez votre catalogue national d'un seul coup d'œil.
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <Link 
                                href={route('modules.entites.index')}
                                className="inline-flex items-center px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
                            >
                                Explorer le Catalogue
                                <svg className="ml-3 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M5 12h16" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Pending Validation Alert (For RF) */}
                {dataStats.plans_pending_count > 0 && (
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-8 bg-white ring-1 ring-slate-200/60 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0 animate-bounce">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Validation en attente</h2>
                                    <p className="text-sm text-slate-500 font-medium mt-1">
                                        Il y a <span className="text-amber-600 font-bold">{dataStats.plans_pending_count} plan(s)</span> de formation en attente de votre validation pour votre secteur.
                                    </p>
                                </div>
                            </div>
                            <Link 
                                href={route('modules.plans.index', { statut: 'soumis' })}
                                className="px-8 py-4 bg-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 active:scale-95 whitespace-nowrap"
                            >
                                Examiner les plans
                            </Link>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center shadow-lg shadow-inner group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <span className="p-2 bg-slate-50 text-slate-300 rounded-xl group-hover:text-blue-200 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity / Next Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-10 border border-slate-200/60 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            Actualités du Catalogue
                        </h2>
                        <div className="space-y-6">
                            {latestFormations.length > 0 ? latestFormations.map((formation, i) => (
                                <Link 
                                    key={formation.id} 
                                    href={route('modules.entites.show', formation.id)}
                                    className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100/50 transition-colors cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 font-bold border border-slate-100 uppercase text-[10px]">
                                        {formation.secteur?.nom?.substring(0, 3) || 'FT'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1">{formation.titre}</h4>
                                        <p className="text-xs text-slate-400 font-medium mt-1">
                                            Ajouté le {new Date(formation.created_at).toLocaleDateString()} par <b>{formation.createur?.prenom} {formation.createur?.nom}</b> • Secteur {formation.secteur?.nom}
                                        </p>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            )) : (
                                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm font-medium text-slate-400">Aucune activité récente pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-10 border border-slate-800 shadow-xl overflow-hidden relative">
                         <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 rounded-tl-full opacity-10"></div>
                         <h2 className="text-xl font-black text-white mb-8 tracking-tight">Calendrier</h2>
                         <div className="space-y-6 relative z-10">
                            <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-2 border-blue-600 pl-4 py-2">
                                Aucune session planifiée pour cette semaine. 
                                Les modules de planification seront activés dès la Phase 6.
                            </p>
                            <div className="pt-4">
                                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Prochaine étape</p>
                                    <p className="text-xs text-slate-300 font-bold mb-6 italic leading-relaxed">
                                        Phase 5 : Configuration des sites d'accueil et des hôtels partenaires.
                                    </p>
                                    <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                                        Voir le plan
                                    </button>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
