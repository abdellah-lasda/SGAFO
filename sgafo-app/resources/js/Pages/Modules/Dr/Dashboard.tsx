import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

interface DashboardProps extends PageProps {
    regionNames: string;
    stats: {
        total_plans: number;
        total_formateurs: number;
        total_seances: number;
        plans_confirmes: number;
    };
    recentSeances: any[];
    plansByStatus: any[];
    institutsStats: any[];
}

export default function Dashboard({ auth, regionNames, stats, recentSeances, plansByStatus, institutsStats }: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl text-slate-800 leading-tight">Tableau de Bord Régional — {regionNames}</h2>}
        >
            <Head title="Dashboard DR" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* Statistiques Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Plans de formation" value={stats.total_plans} icon="plans" color="blue" />
                        <StatCard title="Formateurs suivis" value={stats.total_formateurs} icon="users" color="indigo" />
                        <StatCard title="Séances réalisées" value={stats.total_seances} icon="seances" color="emerald" />
                        <StatCard title="Plans confirmés" value={stats.plans_confirmes} icon="check" color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Liste des dernières séances */}
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Dernières séances en région</h3>
                                <Link href={route('dr.plans.index')} className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">Voir tout</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Site</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentSeances.map((seance) => (
                                            <tr key={seance.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{seance.plan?.entite?.titre}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{seance.plan?.titre}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{seance.site?.nom}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{new Date(seance.date).toLocaleDateString()}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('dr.plans.show', seance.plan_id)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors inline-block">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Répartition par Statut */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">État des plans régionaux</h3>
                                <div className="space-y-4">
                                    {plansByStatus.map((item) => (
                                        <div key={item.statut} className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                                <span className="text-slate-500">{item.statut}</span>
                                                <span className="text-slate-800">{item.total}</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${getStatusColor(item.statut)}`}
                                                    style={{ width: `${(item.total / stats.total_plans) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* [NOUVEAU] Comparatif Instituts (Point 3) */}
                            <div className="bg-[#0f172a] rounded-3xl shadow-xl p-6 text-white">
                                <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    Activité par Institut
                                </h3>
                                <div className="space-y-6">
                                    {institutsStats?.map((inst: any) => (
                                        <div key={inst.nom} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate max-w-[150px]">{inst.nom}</span>
                                                <span className="text-xs font-bold text-blue-400">{inst.formateurs_count} Animateurs</span>
                                            </div>
                                            <div className="relative h-4 bg-slate-800 rounded-lg overflow-hidden">
                                                <div 
                                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg transition-all duration-1000"
                                                    style={{ width: `${Math.min(100, (inst.formateurs_count / (stats.total_formateurs || 1)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-800">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                        Cette vue compare la force d'animation disponible par établissement au sein de votre juridiction régionale.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
    };

    return (
        <div className={`p-6 rounded-3xl border bg-white shadow-sm flex items-center gap-5 transition-all hover:shadow-md`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]} border`}>
                {icon === 'plans' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                {icon === 'users' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                {icon === 'seances' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                {icon === 'check' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl font-black text-slate-800 tracking-tighter">{value}</p>
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case 'validé': return 'bg-emerald-500';
        case 'confirmé': return 'bg-blue-500';
        case 'soumis': return 'bg-amber-500';
        case 'brouillon': return 'bg-slate-400';
        case 'rejeté': return 'bg-red-500';
        default: return 'bg-slate-300';
    }
}
