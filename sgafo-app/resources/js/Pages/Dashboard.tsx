import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Props extends PageProps {
    stats: {
        formations_count: number;
        secteurs_count: number;
        sites_count: number;
        formateurs_count: number;
        plans_pending_count: number;
        plans: {
            total: number;
            by_status: Record<string, number>;
        };
        plans_per_sector: any[];
        plans_per_region: any[];
        top_sites: any[];
        plans_evolution: any[];
        attendance_rate: number;
        admin_alerts?: {
            users_sans_role: number;
            users_suspendus: number;
            sites_inactifs: number;
        };
        rf_alerts?: {
            pending_confirmation: number;
            pending_validation: number;
        };
        cdc_alerts?: {
            my_drafts: number;
            my_rejected: number;
        };
    };
    latestFormations: any[];
    filters: {
        annee?: string;
        region_id?: string;
        ville?: string;
        secteur_id?: string;
    };
    filterOptions: {
        regions: any[];
        secteurs: any[];
        villes: string[];
        annees: number[];
    };
}

export default function Dashboard({ stats: dataStats, latestFormations, filters, filterOptions, auth }: Props) {
    const user = auth.user;

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === '') delete (newFilters as any)[key];
        router.get(route('dashboard'), newFilters, { preserveState: true });
    };

    const resetFilters = () => {
        router.get(route('dashboard'));
    };
    
    const kpiStats = [
        { label: 'Formations au Catalogue', value: (dataStats?.formations_count ?? 0).toString(), icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        ), color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Secteurs Couverts', value: (dataStats?.secteurs_count ?? 0).toString(), icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        ), color: 'bg-blue-50 text-blue-600' },
        { label: 'Sites de Formation', value: (dataStats?.sites_count ?? 0).toString(), icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        ), color: 'bg-amber-50 text-amber-600' },
        { label: 'Formateurs Actifs', value: (dataStats?.formateurs_count ?? 0).toString(), icon: (
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
                                href={user.roles?.some((r: any) => r.code === 'ADMIN') 
                                    ? route('admin.pilotage.index', { tab: 'entites' }) 
                                    : route('modules.entites.index')
                                }
                                className="inline-flex items-center px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
                            >
                                Explorer le Catalogue
                                <svg className="ml-3 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M5 12h16" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Global Filter Bar */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
                    <div className="flex-1 flex flex-wrap gap-4">
                        <select 
                            value={filters.annee || ''} 
                            onChange={(e) => handleFilterChange('annee', e.target.value)}
                            className="bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Année</option>
                            {filterOptions.annees.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>

                        <select 
                            value={filters.region_id || ''} 
                            onChange={(e) => handleFilterChange('region_id', e.target.value)}
                            className="bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Région</option>
                            {filterOptions.regions.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
                        </select>

                        <select 
                            value={filters.ville || ''} 
                            onChange={(e) => handleFilterChange('ville', e.target.value)}
                            className="bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Ville</option>
                            {filterOptions.villes.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>

                        <select 
                            value={filters.secteur_id || ''} 
                            onChange={(e) => handleFilterChange('secteur_id', e.target.value)}
                            className="bg-slate-50 border-none rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Secteur</option>
                            {filterOptions.secteurs.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                    
                    <button 
                        onClick={resetFilters}
                        className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                    >
                        Reset
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiStats.map((stat, i) => (
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

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: Analytical Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Evolution Trend & Attendance Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Evolution Trend */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-6">
                                <h2 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                    <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                                    Évolution (6 mois)
                                </h2>
                                <div className="h-40 flex items-end justify-between gap-2 px-2">
                                    {dataStats.plans_evolution.map((point: any, i: number) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div 
                                                className="w-full bg-blue-100 rounded-t-lg group-hover:bg-blue-600 transition-all duration-500 relative"
                                                style={{ height: `${point.count > 0 ? (point.count / Math.max(...dataStats.plans_evolution.map((p: any) => p.count))) * 100 : 5}%` }}
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {point.count}
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter text-center line-clamp-1">{point.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attendance Radial */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex items-center gap-6">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-50" />
                                        <circle 
                                            cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                            strokeDasharray={351}
                                            strokeDashoffset={351 - (351 * dataStats.attendance_rate) / 100}
                                            className="text-emerald-500 transition-all duration-1000 ease-out" 
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-slate-900">{dataStats.attendance_rate}%</span>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Présence</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Taux de Présence</h3>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-2 italic">
                                        Calculé sur l'ensemble des sessions filtrées.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Distribution Sectors & Regions Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Sectors */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-6">
                                <h2 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                    <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
                                    Plans par Secteur
                                </h2>
                                <div className="space-y-4">
                                    {dataStats.plans_per_sector.slice(0, 5).map((sector: any) => (
                                        <div key={sector.id} className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-black uppercase">
                                                <span className="text-slate-500">{sector.nom}</span>
                                                <span className="text-slate-900">{sector.plans_count}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${dataStats.plans.total > 0 ? (sector.plans_count / dataStats.plans.total) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Regions Impact */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-6">
                                <h2 className="text-lg font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                    <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
                                    Impact Régional
                                </h2>
                                <div className="space-y-4">
                                    {dataStats.plans_per_region.slice(0, 5).map((region: any) => (
                                        <div key={region.id} className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-black uppercase">
                                                <span className="text-slate-500">{region.nom}</span>
                                                <span className="text-slate-900">{region.plans_count}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${dataStats.plans.total > 0 ? (region.plans_count / dataStats.plans.total) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Status & Actions */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-xl space-y-8">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                Statuts des Plans
                            </h2>
                            <div className="space-y-6">
                                {Object.entries(dataStats.plans.by_status).map(([status, count]: any) => (
                                    <PlanStatusRow key={status} status={status} count={count} total={dataStats.plans.total} />
                                ))}
                            </div>
                        </div>

                        {/* Top Sites Card */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                             <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                                Top Sites
                            </h2>
                            <div className="space-y-4">
                                {dataStats.top_sites.map((site: any, i: number) => (
                                    <div key={site.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-slate-300">#{i+1}</span>
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider line-clamp-1">{site.nom}</span>
                                        </div>
                                        <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg font-black text-[9px] group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">{site.plans_count} PLANS</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions Alert Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-xl space-y-8">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                                Actions
                            </h2>
                            <div className="space-y-4">
                                {dataStats.admin_alerts && (
                                    <>
                                        <SystemAlertItem label="Users sans rôle" count={dataStats.admin_alerts.users_sans_role} color="rose" link={route('admin.users.index')} />
                                        <SystemAlertItem label="Comptes suspendus" count={dataStats.admin_alerts.users_suspendus} color="amber" link={route('admin.users.index')} />
                                        <SystemAlertItem label="Sites inactifs" count={dataStats.admin_alerts.sites_inactifs} color="slate" link={route('admin.logistique.index')} />
                                    </>
                                )}
                                
                                {dataStats.rf_alerts && (
                                    <>
                                        <SystemAlertItem label="Plans à confirmer" count={dataStats.rf_alerts.pending_confirmation} color="rose" link={route('modules.plans.index', { statut: 'soumis' })} />
                                        <SystemAlertItem label="Plans à valider" count={dataStats.rf_alerts.pending_validation} color="amber" link={route('modules.plans.index', { statut: 'confirmé' })} />
                                    </>
                                )}

                                {dataStats.cdc_alerts && (
                                    <>
                                        <SystemAlertItem label="Mes brouillons" count={dataStats.cdc_alerts.my_drafts} color="blue" link={route('modules.plans.index', { statut: 'brouillon' })} />
                                        <SystemAlertItem label="Plans rejetés" count={dataStats.cdc_alerts.my_rejected} color="rose" link={route('modules.plans.index', { statut: 'rejeté' })} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent News Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            Actualités du Catalogue National
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {latestFormations.length > 0 ? latestFormations.map((formation, i) => (
                                <Link 
                                    key={formation.id} 
                                    href={route('modules.entites.show', formation.id)}
                                    className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 font-bold border border-slate-100 uppercase text-[9px] mb-4 group-hover:scale-110 transition-transform">
                                        {formation.secteur?.nom?.substring(0, 3) || 'FT'}
                                    </div>
                                    <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-2 min-h-[32px]">{formation.titre}</h4>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{new Date(formation.created_at).toLocaleDateString()}</span>
                                        <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </Link>
                            )) : (
                                <div className="col-span-3 p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Aucune activité récente pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

function PlanStatusRow({ status, count, total }: { status: string, count: number, total: number }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    const colors: any = {
        brouillon: 'bg-slate-500',
        soumis: 'bg-blue-500',
        validé: 'bg-emerald-500',
        confirmé: 'bg-indigo-500',
        rejeté: 'bg-rose-500',
        annulé: 'bg-red-600'
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{status}</span>
                <span className="text-[10px] font-black text-slate-100">{count}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${colors[status] || 'bg-slate-200'} transition-all duration-1000`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

function SystemAlertItem({ label, count, color, link }: any) {
    const colors: any = {
        rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20',
        slate: 'text-slate-400 bg-slate-400/10 border-slate-400/20 hover:bg-slate-400/20'
    };

    const content = (
        <div className={`p-4 rounded-xl border ${colors[color]} flex items-center justify-between transition-colors ${link ? 'cursor-pointer' : ''}`}>
            <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
            <span className="text-xs font-black">{count}</span>
        </div>
    );

    if (link && count > 0) {
        return <Link href={link}>{content}</Link>;
    }

    return content;
}
