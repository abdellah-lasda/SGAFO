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
        users_by_role: {
            formateurs: number;
            rf: number;
            cdc: number;
            admin: number;
        };
        instituts_per_region: any[];
        content_counts: {
            metiers: number;
            secteurs: number;
            qcm: number;
            seances: number;
            formations: number;
        };
        admin_alerts?: {
            users_sans_role: number;
            users_suspendus: number;
            sites_inactifs: number;
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

    return (
        <AuthenticatedLayout
            header={<span className="font-black text-slate-900 uppercase tracking-widest text-sm">Tableau de bord Stratégique</span>}
        >
            <Head title="Dashboard" />

            <div className="space-y-8 animate-in fade-in duration-1000 p-2 lg:p-6 bg-slate-50/50 min-h-screen">
                
                {/* Header & Filter Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bonjour, {user.prenom}</h1>
                        <p className="text-slate-500 font-medium text-xs uppercase tracking-widest mt-1">SGAFO • Pilotage National d'Activité</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
                        <FilterSelect label="Année" value={filters.annee} options={filterOptions.annees} onChange={(v: string) => handleFilterChange('annee', v)} />
                        <FilterSelect label="Région" value={filters.region_id} options={filterOptions.regions.map(r => ({ label: r.nom, value: r.id }))} onChange={(v: string) => handleFilterChange('region_id', v)} />
                        <FilterSelect label="Secteur" value={filters.secteur_id} options={filterOptions.secteurs.map(s => ({ label: s.nom, value: s.id }))} onChange={(v: string) => handleFilterChange('secteur_id', v)} />
                        <button onClick={resetFilters} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    </div>
                </div>

                {/* ROW 1: Main Circular KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CircularKPI label="Présence" value={dataStats.attendance_rate} color="blue" />
                    <CircularKPI label="Plans Actifs" value={dataStats.plans.total} max={100} color="indigo" />
                    <CircularKPI label="Sites Occupés" value={dataStats.site_occupancy.length} max={dataStats.sites_count} color="emerald" />
                    <CircularKPI label="Formateurs" value={dataStats.users_by_role.formateurs} max={dataStats.formateurs_count} color="purple" />
                </div>

                {/* ROW 2: Evolution Area Chart (Full Width) */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                            Évolution de l'Activité
                        </h2>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> PLANS CRÉÉS</div>
                        </div>
                    </div>
                    <TrendAreaChart data={dataStats.plans_evolution} />
                </div>

                {/* ROW 3: Distributions (Donuts) */}
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
                                {Object.entries(dataStats.plans.by_status).map(([status, count], i) => (
                                    <div key={status} className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{status}</span>
                                        <span className="text-xl font-black text-slate-900 mt-1">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-3">
                            <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                            Répartition RH
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <DonutChart 
                                data={Object.entries(dataStats.users_by_role).map(([k, v]) => ({ label: k, value: v }))} 
                                colors={['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e']}
                            />
                            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                                {Object.entries(dataStats.users_by_role).map(([role, count]) => (
                                    <div key={role} className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{role}</span>
                                        <span className="text-xl font-black text-slate-900 mt-1">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 4: Impact (Horizontal Bars) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                            <div className="w-2 h-6 bg-emerald-600 rounded-full"></div>
                            Impact par Secteur
                        </h2>
                        <HorizontalBarChart data={dataStats.plans_per_sector.slice(0, 8)} color="#10b981" />
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200/60">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                            Impact par Région
                        </h2>
                        <HorizontalBarChart data={dataStats.plans_per_region.slice(0, 8)} color="#f59e0b" />
                    </div>
                </div>

                {/* ROW 5: Inventory & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Content Inventory */}
                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-slate-800 flex flex-col justify-between">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8">Inventaire Digital</h2>
                        <div className="space-y-6">
                            {Object.entries(dataStats.content_counts).map(([label, count]) => (
                                <div key={label} className="flex items-center justify-between group">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-white font-black text-lg">{count}</span>
                                        <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[60%]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200/60 lg:col-span-2">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Planning Immédiat</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dataStats.upcoming_seances.map((seance, i) => (
                                <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-5 hover:scale-[1.02] transition-transform">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm text-blue-600">
                                        <span className="text-xs font-black leading-none">{new Date(seance.date).getDate()}</span>
                                        <span className="text-[8px] font-black uppercase tracking-tighter">{new Date(seance.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 line-clamp-1">{seance.plan?.entite?.titre}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[8px] font-black text-slate-400 uppercase">{seance.debut.substring(0,5)}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{seance.site?.nom}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
        rose: 'text-rose-600'
    };
    const percentage = Math.min((value / max) * 100, 100);
    const strokeDash = 264;
    const offset = strokeDash - (strokeDash * percentage) / 100;

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col items-center gap-6 hover:shadow-lg transition-all group">
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">{label}</span>
        </div>
    );
}

function TrendAreaChart({ data }: any) {
    if (!data.length) return null;
    const max = Math.max(...data.map((d: any) => d.count), 1);
    const height = 160;
    const width = 800; // Relative to viewbox
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
                <polyline 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    points={points} 
                    className="animate-in fade-in duration-1000"
                />
                {data.map((d: any, i: number) => {
                    const x = (i / (data.length - 1)) * width;
                    const y = height - (d.count / max) * height;
                    return (
                        <g key={i} className="group cursor-pointer">
                            <circle cx={x} cy={y} r="6" fill="#fff" stroke="#3b82f6" strokeWidth="3" className="transition-all group-hover:r-8" />
                            <text x={x} y={y - 15} textAnchor="middle" className="text-[12px] font-black fill-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {d.count}
                            </text>
                        </g>
                    );
                })}
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
                    return <path key={i} d={pathData} fill={colors[i % colors.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />;
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{total}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</span>
            </div>
        </div>
    );
}

function HorizontalBarChart({ data, color }: any) {
    const max = Math.max(...data.map((d: any) => d.plans_count), 1);
    return (
        <div className="space-y-6 pt-4">
            {data.map((d: any, i: number) => (
                <div key={i} className="space-y-2 group">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{d.nom}</span>
                        <span className="text-xs font-black text-slate-900">{d.plans_count}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                        <div 
                            className="h-full rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${(d.plans_count / max) * 100}%`, backgroundColor: color }}
                        ></div>
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
