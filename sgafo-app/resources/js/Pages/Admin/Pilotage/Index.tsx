import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface PaginationData {
    data: any[];
    links: any[];
    current_page: number;
    total: number;
}

interface Props extends PageProps {
    stats: any;
    currentTab: string;
    filters: { search?: string };
    entites?: PaginationData;
    plans?: PaginationData;
    sessions?: PaginationData;
    qcms?: PaginationData;
    users?: PaginationData;
    sites?: PaginationData;
    hotels?: PaginationData;
    instituts?: PaginationData;
    secteurs?: PaginationData;
    recent_plans?: any[];
}

export default function Index({ auth, stats, currentTab, filters, entites, plans, sessions, qcms, users, sites, hotels, instituts, secteurs, recent_plans }: Props) {
    const [activeTab, setActiveTab] = useState(currentTab || 'dashboard');
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<{ id: number, type: string, title: string } | null>(null);
    const [confirmArchive, setConfirmArchive] = useState<number | null>(null);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', color: 'text-slate-600', bg: 'bg-slate-50' },
        { id: 'entites', label: 'Bibliothèque', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'plans', label: 'Plans', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2', color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'sessions', label: 'Sessions', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'logistique', label: 'Logistique', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'users', label: 'Utilisateurs', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { id: 'instituts', label: 'Établissements', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-cyan-500', bg: 'bg-cyan-50' },
        { id: 'specialites', label: 'Spécialités', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        router.get(route('admin.pilotage.index'), { tab: tabId, search: '' }, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.pilotage.index'), { tab: activeTab, search }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        const routes: any = {
            plan: 'admin.pilotage.plans.destroy',
            entite: 'admin.pilotage.entites.destroy',
            session: 'admin.pilotage.sessions.destroy',
            user: 'admin.pilotage.users.destroy',
            site: 'admin.pilotage.sites.destroy',
            institut: 'admin.pilotage.instituts.destroy',
        };
        router.delete(route(routes[confirmDelete.type], confirmDelete.id), {
            onSuccess: () => setConfirmDelete(null)
        });
    };

    const handleArchive = () => {
        if (!confirmArchive) return;
        router.patch(route('admin.pilotage.plans.archive', confirmArchive), {}, {
            onSuccess: () => setConfirmArchive(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={<span className="font-bold text-slate-900">Pilotage Global Administratif</span>}
        >
            <Head title="Pilotage Global" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Header & Navigation Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Centre de Commandement</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Pilotage Intégré • Supervision des Ressources</p>
                    </div>

                    <div className="w-full xl:w-auto flex flex-col md:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>

                        <div className="flex flex-wrap justify-center items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-widest ${
                                        activeTab === tab.id 
                                        ? `${tab.bg} ${tab.color} shadow-sm border border-current border-opacity-10` 
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                                    }`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl shadow-slate-200/50 min-h-[700px]">
                    
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-12">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard label="Formations" value={stats.entites.total} color="text-emerald-600" bg="bg-emerald-50" icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                <StatCard label="Utilisateurs" value={stats.users.total} color="text-indigo-600" bg="bg-indigo-50" icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                <StatCard label="Plans Actifs" value={stats.plans.total} color="text-blue-600" bg="bg-blue-50" icon="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                <StatCard label="QCMs" value={stats.qcms.total} color="text-amber-600" bg="bg-amber-50" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <StatusPill label="Brouillon" value={stats.plans.by_status.brouillon} color="bg-slate-100 text-slate-600" />
                                <StatusPill label="Soumis" value={stats.plans.by_status.soumis} color="bg-amber-100 text-amber-600" />
                                <StatusPill label="Validé" value={stats.plans.by_status.validé} color="bg-emerald-100 text-emerald-600" />
                                <StatusPill label="Confirmé" value={stats.plans.by_status.confirmé} color="bg-blue-100 text-blue-600" />
                                <StatusPill label="Rejeté" value={stats.plans.by_status.rejeté} color="bg-red-100 text-red-600" />
                                <StatusPill label="Annulé" value={stats.plans.by_status.annulé} color="bg-gray-100 text-gray-500" />
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                    Dernières activités
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {recent_plans?.map(plan => (
                                        <div key={plan.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all shadow-sm group">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{plan.titre}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                    CDC: {plan.createur?.prenom} {plan.createur?.nom} • Statut: {plan.statut}
                                                </p>
                                            </div>
                                            <Link href={route('admin.pilotage.plans.show', plan.id)} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                Détails
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && users && (
                        <TableContainer title="Gestion des Utilisateurs" count={users.total}>
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nom & Prénom</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôles</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.data.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                                                        {user.prenom[0]}{user.nom[0]}
                                                    </div>
                                                    <span className="text-sm font-black text-slate-900">{user.prenom} {user.nom}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-500">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map((r:any) => (
                                                        <span key={r.id} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase">
                                                            {r.nom}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${user.statut === 'actif' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {user.statut || 'actif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => setConfirmDelete({ id: user.id, type: 'user', title: `${user.prenom} ${user.nom}` })}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={users.links} />
                        </TableContainer>
                    )}

                    {/* LOGISTIQUE TAB */}
                    {activeTab === 'logistique' && sites && (
                        <div className="space-y-12">
                            <TableContainer title="Sites de Formation" count={sites.total}>
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nom du Site</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ville</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Capacité</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {sites.data.map(site => (
                                            <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-black text-slate-900 text-sm">{site.nom}</td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{site.ville}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black border border-rose-100">
                                                        {site.capacite} PLACES
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button 
                                                        onClick={() => setConfirmDelete({ id: site.id, type: 'site', title: site.nom })}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination links={sites.links} />
                            </TableContainer>
                        </div>
                    )}

                    {/* INSTITUTS TAB */}
                    {activeTab === 'instituts' && instituts && (
                        <TableContainer title="Gestion des Établissements" count={instituts.total}>
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nom de l'Établissement</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Région</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {instituts.data.map(inst => (
                                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-black text-slate-900 text-sm">{inst.nom}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{inst.region?.nom}</td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => setConfirmDelete({ id: inst.id, type: 'institut', title: inst.nom })}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={instituts.links} />
                        </TableContainer>
                    )}

                    {/* SPECIALITES TAB */}
                    {activeTab === 'specialites' && secteurs && (
                        <TableContainer title="Secteurs & Métiers" count={secteurs.total}>
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Secteur</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Métiers associés</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {secteurs.data.map(sect => (
                                        <tr key={sect.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-black text-slate-900 text-sm">{sect.nom}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {sect.metiers?.map((m:any) => (
                                                        <span key={m.id} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[9px] font-black border border-amber-100">
                                                            {m.nom}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={secteurs.links} />
                        </TableContainer>
                    )}

                    {/* EXISTING TABS (PLANS, ENTITES, SESSIONS, QCMS) - Simplifed representation */}
                    {['entites', 'plans', 'sessions', 'qcms'].includes(activeTab) && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Utilisez la recherche pour filtrer les {activeTab}.</p>
                            
                            {activeTab === 'entites' && entites && (
                                <TableContainer title="" count={entites.total}>
                                    <table className="w-full text-left border-collapse">
                                        <tbody className="divide-y divide-slate-100">
                                            {entites.data.map(item => (
                                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-black text-slate-900 text-sm">{item.titre}</td>
                                                    <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{item.secteur?.nom}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={route('admin.pilotage.entites.show', item.id)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all">Détails</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Pagination links={entites.links} />
                                </TableContainer>
                            )}

                            {activeTab === 'plans' && plans && (
                                <TableContainer title="" count={plans.total}>
                                    <table className="w-full text-left border-collapse">
                                        <tbody className="divide-y divide-slate-100">
                                            {plans.data.map(item => (
                                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-black text-slate-900 text-sm">{item.titre}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase bg-blue-50 text-blue-600">{item.statut}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={route('admin.pilotage.plans.show', item.id)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all">Détails</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Pagination links={plans.links} />
                                </TableContainer>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* CONFIRM DIALOGS */}
            <ConfirmDialog
                isOpen={!!confirmDelete}
                title={`Supprimer cette ressource ?`}
                message={`Êtes-vous sûr de vouloir supprimer définitivement "${confirmDelete?.title}" ? Cette action est irréversible.`}
                confirmLabel="Supprimer définitivement"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, color, bg, icon }: { label: string; value: number; color: string; bg: string; icon: string }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-bl-full opacity-30 -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner mb-6`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} />
                    </svg>
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
                </div>
            </div>
        </div>
    );
}

function StatusPill({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={`px-6 py-4 rounded-2xl ${color} flex flex-col items-center justify-center border border-current border-opacity-10 min-w-[120px]`}>
            <span className="text-xl font-black">{value}</span>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-70 text-center">{label}</span>
        </div>
    );
}

function TableContainer({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            {title && (
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{count} TOTAL</span>
                </div>
            )}
            <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-sm">
                {children}
            </div>
        </div>
    );
}
