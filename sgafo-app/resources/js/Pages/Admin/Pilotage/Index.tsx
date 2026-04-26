import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface Stats {
    entites: { total: number; recent: any[] };
    plans: { total: number; by_status: any; recent: any[] };
    sessions: { total: number; recent: any[] };
    qcms: { total: number; published: number; recent: any[] };
}

interface Props extends PageProps {
    stats: Stats;
}

export default function Index({ auth, stats }: Props) {
    const [activeTab, setActiveTab] = useState<'entites' | 'plans' | 'sessions' | 'qcms'>('entites');

    const tabs = [
        { id: 'entites', label: 'Entités', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'plans', label: 'Plans', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2', color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'sessions', label: 'Sessions', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'qcms', label: 'QCMs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pilotage Global</h2>}
        >
            <Head title="Pilotage Global" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tableau de bord administratif</h1>
                        <p className="text-slate-500 font-medium mt-1">Supervision globale des ressources et des processus du système.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                                    activeTab === tab.id 
                                    ? `${tab.bg} ${tab.color} shadow-sm` 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Entités Total" value={stats.entites.total} color="text-emerald-600" bg="bg-emerald-50" icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    <StatCard label="Plans Actifs" value={stats.plans.total} color="text-blue-600" bg="bg-blue-50" icon="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    <StatCard label="Sessions" value={stats.sessions.total} color="text-purple-600" bg="bg-purple-50" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    <StatCard label="QCMs Créés" value={stats.qcms.total} color="text-amber-600" bg="bg-amber-50" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-bl-full -mr-32 -mt-32 opacity-50"></div>
                    
                    <div className="relative z-10">
                        {activeTab === 'entites' && (
                            <ListSection 
                                title="Entités de formation" 
                                description="Dernières entités ajoutées au catalogue national."
                                items={stats.entites.recent}
                                renderItem={(item) => (
                                    <div key={item.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600 font-bold border border-slate-100 text-[10px]">
                                            ENT
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-slate-900">{item.titre}</h4>
                                            <p className="text-xs text-slate-400 font-medium mt-1">
                                                Secteur: {item.secteur?.nom} • Par: {item.createur?.prenom} {item.createur?.nom}
                                            </p>
                                        </div>
                                        <Link href={route('modules.entites.show', item.id)} className="px-4 py-2 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 border border-slate-100 hover:border-emerald-200 transition-all shadow-sm">
                                            Détails
                                        </Link>
                                    </div>
                                )}
                            />
                        )}

                        {activeTab === 'plans' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    <StatusPill label="Brouillon" value={stats.plans.by_status.brouillon} color="bg-slate-100 text-slate-600" />
                                    <StatusPill label="Soumis" value={stats.plans.by_status.soumis} color="bg-amber-100 text-amber-600" />
                                    <StatusPill label="Validé" value={stats.plans.by_status.validé} color="bg-emerald-100 text-emerald-600" />
                                    <StatusPill label="Confirmé" value={stats.plans.by_status.confirmé} color="bg-blue-100 text-blue-600" />
                                    <StatusPill label="Rejeté" value={stats.plans.by_status.rejeté} color="bg-red-100 text-red-600" />
                                    <StatusPill label="Archivé" value={stats.plans.by_status.archivé} color="bg-gray-100 text-gray-500" />
                                </div>
                                <ListSection 
                                    title="Plans de formation récents" 
                                    description="Derniers plans créés ou modifiés."
                                    items={stats.plans.recent}
                                    renderItem={(item) => (
                                        <div key={item.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 font-bold border border-slate-100 text-[10px]">
                                                PLAN
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-slate-900">{item.entite?.titre || 'Titre non spécifié'}</h4>
                                                <p className="text-xs text-slate-400 font-medium mt-1">
                                                    Site: {item.site_formation?.nom || 'Non spécifié'} • Statut: <span className="font-bold uppercase tracking-widest text-[10px]">{item.statut}</span>
                                                </p>
                                            </div>
                                            <Link href={route('modules.plans.show', item.id)} className="px-4 py-2 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                                                Détails
                                            </Link>
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {activeTab === 'sessions' && (
                            <ListSection 
                                title="Sessions (Séances)" 
                                description="Suivi des dernières séances de formation planifiées."
                                items={stats.sessions.recent}
                                renderItem={(item) => (
                                    <div key={item.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-600 font-bold border border-slate-100 text-[10px]">
                                            SES
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-slate-900">{item.plan?.entite?.titre || 'Session'}</h4>
                                            <p className="text-xs text-slate-400 font-medium mt-1">
                                                Date: {new Date(item.date).toLocaleDateString()} • Site: {item.site?.nom} • Horaire: {item.debut} - {item.fin}
                                            </p>
                                        </div>
                                        <div className="px-4 py-2 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 shadow-sm">
                                            {item.statut}
                                        </div>
                                    </div>
                                )}
                            />
                        )}

                        {activeTab === 'qcms' && (
                            <ListSection 
                                title="Questionnaires (QCM)" 
                                description="Gestion et supervision des tests d'évaluation."
                                items={stats.qcms.recent}
                                renderItem={(item) => (
                                    <div key={item.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-600 font-bold border border-slate-100 text-[10px]">
                                            QCM
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-slate-900">{item.titre}</h4>
                                            <p className="text-xs text-slate-400 font-medium mt-1">
                                                Plan: {item.seance?.plan?.entite?.titre} • Durée: {item.duree_minutes} min • {item.est_publie ? '✅ Publié' : '❌ Brouillon'}
                                            </p>
                                        </div>
                                        <Link href={route('modules.animateur.qcms.edit', item.id)} className="px-4 py-2 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 border border-slate-100 hover:border-amber-200 transition-all shadow-sm">
                                            Éditer
                                        </Link>
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, color, bg, icon }: { label: string; value: number; color: string; bg: string; icon: string }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-bl-full opacity-30 -mr-8 -mt-8 group-hover:scale-150 transition-transform`}></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner mb-6`}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} />
                    </svg>
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
                </div>
            </div>
        </div>
    );
}

function ListSection({ title, description, items, renderItem }: { title: string; description: string; items: any[]; renderItem: (item: any) => React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                <p className="text-sm text-slate-500 font-medium">{description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {items.length > 0 ? items.map(renderItem) : (
                    <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-400 italic">Aucune donnée trouvée.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusPill({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={`px-6 py-4 rounded-2xl ${color} flex flex-col items-center justify-center border border-current border-opacity-10`}>
            <span className="text-2xl font-black">{value}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
        </div>
    );
}
