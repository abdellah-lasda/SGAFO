import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlanFormation } from '@/types/plan';
import { useState, useMemo } from 'react';

interface Props {
    plan: PlanFormation;
}

export default function Show({ plan }: Props) {
    const [activeTab, setActiveTab] = useState('resume');

    const totalHours = useMemo(() => {
        return plan.themes?.reduce((sum, t) => sum + Number(t.duree_heures), 0) || 0;
    }, [plan.themes]);

    const tabs = [
        { id: 'resume', label: 'Résumé', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" /></svg> },
        { id: 'programme', label: 'Programme', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        { id: 'equipe', label: 'Équipe & Participants', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { id: 'logistique', label: 'Logistique & Planning', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('modules.catalogue.index')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <span className="font-black text-slate-900">Détails de la Formation</span>
                </div>
            }
        >
            <Head title={`Catalogue - ${plan.titre}`} />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
                {/* Hero Header */}
                <div className="relative bg-slate-900 rounded-[3rem] p-10 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-6 max-w-3xl">
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                    {plan.entite?.secteur?.nom || 'Secteur'}
                                </span>
                                <span className="px-4 py-1.5 bg-white/10 text-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                                    Référence: #PF-{plan.id}
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                                {plan.titre}
                            </h1>
                            
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black">
                                        {plan.createur?.prenom[0]}{plan.createur?.nom[0]}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Responsable</p>
                                        <p className="text-sm font-bold text-white">{plan.createur?.prenom} {plan.createur?.nom}</p>
                                    </div>
                                </div>
                                
                                <div className="hidden md:block h-10 w-px bg-white/10"></div>
                                
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Période</p>
                                    <p className="text-sm font-bold text-white">
                                        {new Date(plan.date_debut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })} - {new Date(plan.date_fin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <a 
                                href={route('modules.plans.export-pdf', plan.id)}
                                target="_blank"
                                className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Télécharger PDF
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Chiffres Clés</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-500">Durée Totale</span>
                                        <span className="text-lg font-black text-slate-900">{totalHours}h</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-500">Nb. Thèmes</span>
                                        <span className="text-lg font-black text-slate-900">{plan.themes?.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-500">Participants</span>
                                        <span className="text-lg font-black text-slate-900">{plan.participants?.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-500">Modalité</span>
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-600">
                                            {plan.is_remote ? 'Distanciel' : plan.is_hybrid ? 'Hybride' : 'Présentiel'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Entité Porteuse</h3>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-sm font-black text-slate-900 leading-tight mb-1">{plan.entite?.titre}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plan.entite?.secteur?.nom}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Tabs Navigation */}
                        <div className="bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content: Resume */}
                        {activeTab === 'resume' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-10">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                            Description du projet
                                        </h2>
                                        <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                            {plan.description || "Aucune description détaillée fournie."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50">
                                            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Objectif Global</h3>
                                            <p className="text-slate-900 font-bold leading-relaxed italic">
                                                "{plan.objectif_global || "Non défini"}"
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Objectifs Spécifiques</h3>
                                            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-sm">
                                                {plan.objectifs_specifiques || "Non définis"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Programme */}
                        {activeTab === 'programme' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {plan.themes?.map((theme, idx) => (
                                    <div key={theme.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:border-blue-200 transition-all">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="flex-1 space-y-2 text-center md:text-left">
                                            <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{theme.nom}</h4>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {theme.duree_heures} Heures
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    {theme.animateurs?.length || 0} Animateurs
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex -space-x-4">
                                            {theme.animateurs?.slice(0, 3).map((anim: any) => (
                                                <div key={anim.id} className="w-12 h-12 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center text-xs font-black text-slate-400 bg-slate-50 uppercase" title={anim.prenom + ' ' + anim.nom}>
                                                    {anim.prenom[0]}{anim.nom[0]}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab Content: Equipe */}
                        {activeTab === 'equipe' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                        👥 Liste des Participants
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">{plan.participants?.length}</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {plan.participants?.map(user => (
                                            <div key={user.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400">
                                                    {user.prenom[0]}{user.nom[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{user.prenom} {user.nom}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.instituts?.[0]?.nom || "OFPPT"}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Logistique */}
                        {activeTab === 'logistique' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">📍 Lieu de Formation</h3>
                                        {plan.site_formation ? (
                                            <div className="space-y-4">
                                                <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10"><svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>
                                                    <h4 className="text-xl font-black mb-1">{plan.site_formation.nom}</h4>
                                                    <p className="text-blue-400 text-xs font-black uppercase tracking-widest">{plan.site_formation.ville}</p>
                                                    <p className="mt-4 text-slate-400 text-sm font-medium">{plan.site_formation.adresse || "Adresse non spécifiée"}</p>
                                                </div>
                                            </div>
                                        ) : plan.is_remote ? (
                                            <div className="p-10 bg-indigo-50 border-2 border-indigo-100 border-dashed rounded-3xl text-center">
                                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </div>
                                                <h4 className="text-lg font-black text-indigo-900 mb-1">Formation 100% à distance</h4>
                                                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Plateforme Virtuelle OFPPT</p>
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic font-medium">Informations sur le site non disponibles.</p>
                                        )}
                                    </div>

                                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">🏨 Hébergement</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                <span className="text-sm font-bold text-slate-500">Participants hébergés</span>
                                                <span className="text-sm font-black text-slate-900">{plan.hebergements?.filter(h => plan.participants.some(p => p.id === h.user_id)).length || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                <span className="text-sm font-bold text-slate-500">Animateurs hébergés</span>
                                                <span className="text-sm font-black text-slate-900">{plan.hebergements?.filter(h => !plan.participants.some(p => p.id === h.user_id)).length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">📅 Planning des Séances</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-slate-50">
                                                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Date</th>
                                                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horaires</th>
                                                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thème / Module</th>
                                                    <th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Formateur</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {plan.seances?.map(seance => (
                                                    <tr key={seance.id} className="group hover:bg-slate-50/50 transition-all">
                                                        <td className="py-6 pl-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-slate-900">{new Date(seance.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(seance.date).getFullYear()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-6">
                                                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">
                                                                {seance.debut.substring(0, 5)} - {seance.fin.substring(0, 5)}
                                                            </span>
                                                        </td>
                                                        <td className="py-6">
                                                            <p className="text-sm font-bold text-slate-800">{seance.themes?.[0]?.nom || "Multi-thèmes"}</p>
                                                        </td>
                                                        <td className="py-6">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-black text-blue-600">
                                                                    FA
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-600">Formateur Affecté</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!plan.seances || plan.seances.length === 0) && (
                                                    <tr>
                                                        <td colSpan={4} className="py-10 text-center text-slate-400 font-medium italic">Planning en cours de finalisation...</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
