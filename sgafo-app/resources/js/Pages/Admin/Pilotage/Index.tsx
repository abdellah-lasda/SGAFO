import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props {
    stats: any;
    currentTab: string;
    recent_plans?: any[];
    entites?: any;
    plans?: any;
    sessions?: any;
    qcms?: any;
    filters: { search?: string };
}

export default function Index({ stats, currentTab, recent_plans, entites, plans, sessions, qcms, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const [confirmDelete, setConfirmDelete] = useState<{ id: number, type: 'plan' | 'entite' | 'session', title: string } | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.pilotage.index'), { tab: currentTab, search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        const routes: any = {
            plan: 'admin.pilotage.plans.destroy',
            entite: 'admin.pilotage.entites.destroy',
            session: 'admin.pilotage.sessions.destroy'
        };
        router.delete(route(routes[confirmDelete.type], confirmDelete.id), {
            onSuccess: () => setConfirmDelete(null),
            preserveScroll: true
        });
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'entites', label: 'Bibliothèque', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { id: 'plans', label: 'Plans de Formation', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
        { id: 'sessions', label: 'Sessions', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z' },
        { id: 'qcms', label: 'QCMs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    ];

    return (
        <AuthenticatedLayout header={<span className="font-bold text-slate-900 uppercase tracking-tight">Pilotage Global</span>}>
            <Head title="Pilotage Global" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard label="Formations" value={stats.entites.total} color="blue" icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                    <StatCard label="Plans Actifs" value={stats.plans.by_status.confirmé + stats.plans.by_status.validé} value2={`Total: ${stats.plans.total}`} color="emerald" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    <StatCard label="Sessions" value={stats.sessions.total} color="purple" icon="M8 7V3m8 4V3m-9 8h10" />
                    <StatCard label="QCMs" value={stats.qcms.total} color="amber" icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    <StatCard label="Utilisateurs" value={stats.users.total} color="slate" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide p-1">
                        {tabs.map(tab => (
                            <Link
                                key={tab.id}
                                href={route('admin.pilotage.index', { tab: tab.id })}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${
                                    currentTab === tab.id 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
                                </svg>
                                {tab.label}
                            </Link>
                        ))}
                    </div>

                    {currentTab !== 'dashboard' && (
                        <form onSubmit={handleSearch} className="relative w-full md:w-64 group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                    )}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    {currentTab === 'dashboard' && <DashboardView recentPlans={recent_plans} stats={stats} />}
                    {currentTab === 'entites' && <EntitesTable data={entites} onDelete={(id: number, title: string) => setConfirmDelete({id, type: 'entite', title})} />}
                    {currentTab === 'plans' && <PlansTable data={plans} onDelete={(id: number, title: string) => setConfirmDelete({id, type: 'plan', title})} />}
                    {currentTab === 'sessions' && <SessionsTable data={sessions} onDelete={(id: number, title: string) => setConfirmDelete({id, type: 'session', title})} />}
                    {currentTab === 'qcms' && <QcmsTable data={qcms} />}
                </div>
            </div>

            <ConfirmDialog 
                isOpen={!!confirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer définitivement "${confirmDelete?.title}" ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, value2, color, icon }: any) {
    const colors: any = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        purple: 'text-purple-600 bg-purple-50 border-purple-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
        slate: 'text-slate-600 bg-slate-50 border-slate-100'
    };
    return (
        <div className={`p-6 rounded-[2rem] border bg-white shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow`}>
            <div className={`p-3 rounded-2xl ${colors[color]} border`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none mt-1">{value}</p>
                {value2 && <p className="text-[10px] font-bold text-slate-400 mt-1">{value2}</p>}
            </div>
        </div>
    );
}

function DashboardView({ recentPlans, stats }: any) {
    return (
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    Dernières Activités
                </h3>
                <div className="space-y-4">
                    {recentPlans?.map((plan: any) => (
                        <div key={plan.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-blue-600 border border-slate-100 group-hover:border-blue-100 transition-colors">
                                    {plan.id}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{plan.entite?.titre}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Par {plan.createur?.prenom} {plan.createur?.nom}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusBadge status={plan.statut} />
                                <Link href={route('admin.pilotage.plans.show', plan.id)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Répartition Plans</h3>
                <div className="space-y-3">
                    {Object.entries(stats.plans.by_status).map(([status, count]: any) => (
                        <div key={status} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{status}</span>
                            <span className="text-sm font-black text-slate-900">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EntitesTable({ data, onDelete }: any) {
    return (
        <TableContainer data={data}>
            <thead className="bg-slate-50/50">
                <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Créateur</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.data.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{item.titre}</td>
                        <td className="px-6 py-5">
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg font-black text-[9px] uppercase border border-slate-100">{item.secteur?.nom}</span>
                        </td>
                        <td className="px-6 py-5 text-xs text-slate-400 font-bold">{item.createur?.prenom} {item.createur?.nom}</td>
                        <td className="px-8 py-5 text-right space-x-2 flex justify-end items-center">
                            <Link href={route('admin.pilotage.entites.show', item.id)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </Link>
                            <button onClick={() => onDelete(item.id, item.titre)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </TableContainer>
    );
}

function PlansTable({ data, onDelete }: any) {
    return (
        <TableContainer data={data}>
            <thead className="bg-slate-50/50">
                <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Site</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.data.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 font-black text-slate-400 text-sm">#{item.id}</td>
                        <td className="px-6 py-5 font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{item.entite?.titre}</td>
                        <td className="px-6 py-5"><StatusBadge status={item.statut} /></td>
                        <td className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">{item.site_formation?.nom || 'Non défini'}</td>
                        <td className="px-8 py-5 text-right space-x-2 flex justify-end items-center">
                            <Link href={route('admin.pilotage.plans.show', item.id)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </Link>
                            <button onClick={() => onDelete(item.id, item.entite?.titre || 'Plan #' + item.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </TableContainer>
    );
}

function SessionsTable({ data, onDelete }: any) {
    return (
        <TableContainer data={data}>
            <thead className="bg-slate-50/50">
                <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Site</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.data.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                            <div className="text-sm font-black text-slate-900">{new Date(item.date).toLocaleDateString()}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.heure_debut} - {item.heure_fin}</div>
                        </td>
                        <td className="px-6 py-5 font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{item.plan?.entite?.titre}</td>
                        <td className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase">{item.site?.nom || 'N/A'}</td>
                        <td className="px-8 py-5 text-right">
                            <button onClick={() => onDelete(item.id, `Séance du ${new Date(item.date).toLocaleDateString()}`)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </TableContainer>
    );
}

function QcmsTable({ data }: any) {
    return (
        <TableContainer data={data}>
            <thead className="bg-slate-50/50">
                <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Titre du QCM</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Associée</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {data.data.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 font-black text-slate-900 text-sm">{item.titre}</td>
                        <td className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.seance?.plan?.entite?.titre}</td>
                        <td className="px-6 py-5"><span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg font-black text-[10px]">{item.questions?.length || 0} QUESTIONS</span></td>
                        <td className="px-8 py-5 text-right">
                            <span className="text-slate-300 text-[10px] italic">Lecture seule</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </TableContainer>
    );
}

function TableContainer({ children, data }: any) {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    {children}
                </table>
            </div>
            {data?.links && (
                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
                    <Pagination links={data.links} />
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        brouillon: 'bg-slate-100 text-slate-600 border-slate-200',
        soumis: 'bg-blue-50 text-blue-600 border-blue-100',
        validé: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        confirmé: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        rejeté: 'bg-rose-50 text-rose-600 border-rose-100',
        annulé: 'bg-red-50 text-red-600 border-red-100',
        archivé: 'bg-gray-100 text-gray-500 border-gray-200'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.brouillon}`}>
            {status}
        </span>
    );
}
