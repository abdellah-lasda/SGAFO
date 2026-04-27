import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import React from 'react';

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
        top_formateurs: any[];
        upcoming_seances: any[];
        site_occupancy: any[];
        plans_evolution: any[];
        attendance_rate: number;
        qcm_stats: {
            count: number;
            rate: number;
        };
        users_by_role: {
            formateurs: number;
            rf: number;
            cdc: number;
            admin: number;
        } | null;
        instituts_per_region: any[];
        content_counts: {
            metiers: number;
            secteurs: number;
            qcm: number;
            seances: number;
            formations: number;
        } | null;
        my_latest_created: any[] | null;
        my_latest_validated: any[] | null;
        admin_alerts?: {
            users_sans_role: number;
            users_suspendus: number;
            sites_inactifs: number;
        };
        rf_alerts?: {
            pending_confirmation: number;
            pending_validation: number;
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
    const isAdmin = user.roles?.some((r: any) => r.code === 'ADMIN');
    const isRF = user.roles?.some((r: any) => r.code === 'RF');

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === '') delete (newFilters as any)[key];
        router.get(route('dashboard'), newFilters, { preserveState: true });
    };

    const resetFilters = () => {
        router.get(route('dashboard'));
    };

    return (
        <AuthenticatedLayout
            header={<span className="font-black text-slate-900 uppercase tracking-widest text-sm">Pilotage de la Formation</span>}
        >
            <Head title="Tableau de bord" />

            <div className="space-y-8 animate-in fade-in duration-1000 p-2 lg:p-6 bg-slate-50/50 min-h-screen">
                
                {/* Header & Filter Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bonjour, {user.prenom}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">SGAFO • {isAdmin ? 'Administration Centrale' : 'Gestion de Formation'}</p>
                            {isRF && user.regions && user.regions.length > 0 && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-tighter border border-blue-100">
                                    Périmètre: {user.regions.map((r: any) => r.nom).join(', ')}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
                        <FilterSelect label="Année" value={filters.annee} options={filterOptions.annees} onChange={(v: string) => handleFilterChange('annee', v)} />
                        {isAdmin && (
                            <FilterSelect label="Région" value={filters.region_id} options={filterOptions.regions.map(r => ({ label: r.nom, value: r.id }))} onChange={(v: string) => handleFilterChange('region_id', v)} />
                        )}
                        <FilterSelect label="Secteur" value={filters.secteur_id} options={filterOptions.secteurs.map(s => ({ label: s.nom, value: s.id }))} onChange={(v: string) => handleFilterChange('secteur_id', v)} />
                        <button onClick={resetFilters} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    </div>
                </div>

                {/* ROW 1: Main Circular KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CircularKPI label="Présence" value={dataStats.attendance_rate} color="blue" />
                    <CircularKPI label={isRF ? "Mes Plans" : "Plans Actifs"} value={dataStats.plans.total} max={100} color="indigo" />
                    <CircularKPI label="Sites Occupés" value={dataStats.site_occupancy.length} max={dataStats.sites_count} color="emerald" />
                    {/* New QCM KPI for RF or Formateurs Count for Admin */}
                    {isRF ? (
                        <CircularKPI label="Réponse QCM" value={dataStats.qcm_stats.rate} color="rose" />
                    ) : (
                        <CircularKPI label="Formateurs" value={dataStats.formateurs_count} max={dataStats.formateurs_count} color="purple" />
                    )}
                </div>

                {/* ROW 2: Special RF Activity Row or Evolution */}
                {isRF ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Latest Created */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                Mes dernières créations
                            </h2>
                            <div className="space-y-4">
                                {dataStats.my_latest_created?.map((plan: any) => (
                                    <Link key={plan.id} href={route('modules.plans.show', plan.id)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{plan.entite?.titre}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase mt-0.5">{new Date(plan.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-white text-slate-400 rounded-lg text-[8px] font-black uppercase border border-slate-100">{plan.statut}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* QCM Performance Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <div className="w-2 h-6 bg-rose-600 rounded-full"></div>
                                    Performance QCM
                                </h2>
                                <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black">{dataStats.qcm_stats.count} QCMs ACTIFS</span>
                            </div>
                            <div className="flex items-center gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white" />
                                        <circle 
                                            cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" 
                                            strokeDasharray={213}
                                            strokeDashoffset={213 - (213 * dataStats.qcm_stats.rate) / 100}
                                            className="text-rose-500 transition-all duration-1000" 
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-sm font-black text-slate-900">{dataStats.qcm_stats.rate}%</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Taux de participation</p>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                                        Moyenne des réponses enregistrées sur l'ensemble des QCMs du périmètre.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                Évolution de l'Activité Nationale
                            </h2>
                        </div>
                        <TrendAreaChart data={dataStats.plans_evolution} />
                    </div>
                )}

                {/* ROW 3: Distributions & Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-3">
                            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                            Statuts des Dossiers
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <DonutChart 
                                data={Object.entries(dataStats.plans.by_status).map(([k, v]) => ({ label: k, value: v }))} 
                                colors={['#64748b', '#3b82f6', '#10b981', '#6366f1', '#f43f5e', '#dc2626']}
                            />
                            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                                {Object.entries(dataStats.plans.by_status).map(([status, count]) => (
                                    <div key={status} className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{status}</span>
                                        <span className="text-xl font-black text-slate-900 mt-1">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {isAdmin ? (
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-3">
                                <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                                Répartition RH Nationale
                            </h2>
                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <DonutChart 
                                    data={Object.entries(dataStats.users_by_role || {}).map(([k, v]) => ({ label: k, value: v }))} 
                                    colors={['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e']}
                                />
                                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                                    {Object.entries(dataStats.users_by_role || {}).map(([role, count]) => (
                                        <div key={role} className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{role}</span>
                                            <span className="text-xl font-black text-slate-900 mt-1">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-800 space-y-8">
                             <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
                                Mes Actions Prioritaires
                            </h2>
                            <div className="space-y-4">
                                <SystemAlertItem label="Plans à confirmer" count={dataStats.rf_alerts?.pending_confirmation ?? 0} color="rose" link={route('modules.plans.index', { statut: 'soumis' })} />
                                <SystemAlertItem label="Plans à valider" count={dataStats.rf_alerts?.pending_validation ?? 0} color="amber" link={route('modules.plans.index', { statut: 'confirmé' })} />
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux de présence (Périmètre)</span>
                                <span className="text-2xl font-black text-blue-500">{dataStats.attendance_rate}%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ROW 4: Impact & Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                            Top Formateurs (Zone)
                        </h2>
                        <div className="space-y-4">
                            {dataStats.top_formateurs.map((formateur: any, i: number) => (
                                <div key={formateur.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-slate-300">#{i+1}</span>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{formateur.prenom} {formateur.nom}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black">{formateur.sessions_count} SESSIONS</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                            <div className="w-2 h-6 bg-teal-500 rounded-full"></div>
                            Performance des Sites
                        </h2>
                        <HorizontalBarChart data={dataStats.site_occupancy} color="#14b8a6" />
                    </div>
                </div>

                {/* ROW 5: Planning Feed */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200/60">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Flux de Planning Prochain</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {dataStats.upcoming_seances.map((seance, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between hover:bg-white hover:shadow-2xl transition-all group">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm text-blue-600">
                                            <span className="text-sm font-black leading-none">{new Date(seance.date).getDate()}</span>
                                            <span className="text-[8px] font-black uppercase tracking-tighter">{new Date(seance.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-200 transition-colors">0{i+1}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight line-clamp-2 min-h-[30px]">{seance.plan?.entite?.titre}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{seance.debut.substring(0,5)}</span>
                                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{seance.site?.nom}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

{/* --- CUSTOM SVG CHART COMPONENTS --- */}

function CircularKPI({ label, value, max = 100, color }: any) {
    const colors: any = {
        blue: 'text-blue-600',
        indigo: 'text-indigo-600',
        emerald: 'text-emerald-500',
        purple: 'text-purple-600',
        rose: 'text-rose-500'
    };
    const percentage = Math.min((value / max) * 100, 100);
    const strokeDash = 264;
    const offset = strokeDash - (strokeDash * percentage) / 100;

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col items-center gap-6 hover:shadow-lg transition-all">
            <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                    <circle 
                        cx="56" cy="56" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={strokeDash}
                        strokeDashoffset={offset}
                        className={`${colors[color]} transition-all duration-1000 ease-out`} 
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">{max === 100 ? `${value}%` : value}</span>
                </div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
        </div>
    );
}

function TrendAreaChart({ data }: any) {
    if (!data?.length) return null;
    const max = Math.max(...data.map((d: any) => d.count), 1);
    const height = 160;
    const width = 800;
    const points = data.map((d: any, i: number) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d.count / max) * height;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
        <div className="relative pt-10">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
                <polyline fill="url(#gradient)" points={areaPoints} />
                <polyline fill="none" stroke="#3b82f6" strokeWidth="4" points={points} />
            </svg>
            <div className="flex justify-between mt-6 px-2">
                {data.map((d: any, i: number) => (
                    <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.label}</span>
                ))}
            </div>
        </div>
    );
}

function DonutChart({ data, colors }: any) {
    const total = data.reduce((acc: number, d: any) => acc + d.value, 0);
    let currentAngle = 0;
    const radius = 50;
    const innerRadius = 35;
    const center = 60;

    return (
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                {data.map((d: any, i: number) => {
                    if (d.value === 0) return null;
                    const angle = (d.value / total) * 360;
                    const x1 = center + radius * Math.cos((Math.PI * currentAngle) / 180);
                    const y1 = center + radius * Math.sin((Math.PI * currentAngle) / 180);
                    const x2 = center + radius * Math.cos((Math.PI * (currentAngle + angle)) / 180);
                    const y2 = center + radius * Math.sin((Math.PI * (currentAngle + angle)) / 180);
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${center + innerRadius * Math.cos((Math.PI * (currentAngle + angle)) / 180)} ${center + innerRadius * Math.sin((Math.PI * (currentAngle + angle)) / 180)} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${center + innerRadius * Math.cos((Math.PI * currentAngle) / 180)} ${center + innerRadius * Math.sin((Math.PI * currentAngle) / 180)} Z`;
                    currentAngle += angle;
                    return <path key={i} d={pathData} fill={colors[i % colors.length]} />;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{total}</span>
            </div>
        </div>
    );
}

function HorizontalBarChart({ data, color }: any) {
    const max = Math.max(...data.map((d: any) => d.rate), 1);
    return (
        <div className="space-y-6 pt-4">
            {data.map((d: any, i: number) => (
                <div key={i} className="space-y-2 group">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{d.nom}</span>
                        <span className="text-xs font-black text-slate-900">{d.rate}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(d.rate / max) * 100}%`, backgroundColor: color }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function FilterSelect({ label, value, options, onChange }: any) {
    return (
        <div className="flex flex-col px-2">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">{label}</span>
            <select 
                value={value || ''} 
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent border-none p-0 pr-6 text-[10px] font-black text-slate-900 uppercase tracking-wider focus:ring-0 cursor-pointer"
            >
                <option value="">Tous</option>
                {options.map((o: any) => (
                    <option key={typeof o === 'object' ? o.value : o} value={typeof o === 'object' ? o.value : o}>
                        {typeof o === 'object' ? o.label : o}
                    </option>
                ))}
            </select>
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
    return (
        <Link href={link} className={`p-4 rounded-2xl border ${colors[color]} flex items-center justify-between transition-colors`}>
            <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
            <span className="text-xs font-black">{count}</span>
        </Link>
    );
}
