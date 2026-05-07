import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    Calendar, 
    CheckCircle, 
    AlertTriangle, 
    TrendingUp, 
    MapPin, 
    Award,
    ArrowUpRight,
    Search,
    Filter,
    FileText,
    BarChart3
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell
} from 'recharts';

interface Props {
    auth: any;
    regionNames: string;
    stats: {
        total_plans: number;
        total_formateurs: number;
        attendance_rate: number;
        qcm_average: number;
        plans_par_statut: any[];
    };
    satisfactionRadar: any[];
    competenceHeatmap: any[];
    topAbsents: any[];
    institutsStats: any[];
    recentSeances: any[];
}

export default function Dashboard({ 
    auth, 
    regionNames = '', 
    stats = {
        total_plans: 0,
        total_formateurs: 0,
        attendance_rate: 0,
        qcm_average: 0,
        plans_par_statut: []
    }, 
    satisfactionRadar = [], 
    competenceHeatmap = [],
    topAbsents = [], 
    institutsStats = [], 
    recentSeances = [] 
}: Props) {
    
    // Couleurs premium pour les graphiques
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 text-sm">
                    <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Pilotage Régional : {regionNames}</span>
                </div>
            }
        >
            <Head title="Pilotage Régional" />

            <div className="max-w-[1600px] mx-auto p-6 space-y-8 pb-32 animate-in fade-in duration-700">
                
                {/* Header Welcome */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-slate-900 italic mb-2">Bonjour, Directeur Régional</h1>
                        <p className="text-slate-500 font-medium">Analyse de la performance pédagogique pour la région <span className="text-emerald-600 font-bold">{regionNames}</span></p>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <a 
                            href={route('dr.documents.export-regional')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
                        >
                            <FileText className="w-4 h-4" />
                            Générer le Bilan PDF
                        </a>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">LIVE</span>
                        </div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Effectif Formateurs</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.total_formateurs}</span>
                            <span className="text-xs text-slate-400 font-medium">actifs en région</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                                <ArrowUpRight className="w-4 h-4" />
                                <span>+2.4%</span>
                            </div>
                        </div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Taux d'Assiduité</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.attendance_rate}%</span>
                            <span className="text-xs text-slate-400 font-medium">moyenne régionale</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-amber-500">Cible: 80%</span>
                        </div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Moyenne QCM</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.qcm_average}/100</span>
                            <span className="text-xs text-slate-400 font-medium">réussite globale</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-slate-400">Total Plans</span>
                        </div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Projets de Formation</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">{stats.total_plans}</span>
                            <span className="text-xs text-slate-400 font-medium">confirmés/validés</span>
                        </div>
                    </div>
                </div>

                {/* Performance Section : Heatmap and Radar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Heatmap des Compétences */}
                     <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 italic">Heatmap des Compétences</h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Moyenne de réussite QCM par secteur d'activité</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            {competenceHeatmap.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={competenceHeatmap}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis 
                                            dataKey="nom" 
                                            type="category" 
                                            width={150}
                                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f8fafc' }}
                                        />
                                        <Bar 
                                            dataKey="average" 
                                            name="Moyenne Score"
                                            radius={[0, 10, 10, 0]}
                                            barSize={20}
                                        >
                                            {competenceHeatmap.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.average > 70 ? '#10b981' : entry.average > 50 ? '#f59e0b' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <BarChart3 className="w-12 h-12 opacity-20" />
                                    <p className="text-sm font-medium italic">Données QCM insuffisantes</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Radar Chart : Satisfaction Pédagogique */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 italic">Profil de Satisfaction</h2>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Analyse par catégorie pédagogique</p>
                            </div>
                            <Award className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="h-[350px] w-full">
                            {satisfactionRadar.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={satisfactionRadar}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="categorie" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                                        <Radar
                                            name="Moyenne Régionale"
                                            dataKey="average"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fill="#10b981"
                                            fillOpacity={0.4}
                                        />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <BarChart3 className="w-12 h-12 opacity-20" />
                                    <p className="text-sm font-medium italic">Données de feedback insuffisantes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dynamisme des Instituts */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 italic">Dynamisme des Instituts</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Score d'activité par établissement</p>
                        </div>
                        <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={institutsStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="nom" 
                                    type="category" 
                                    width={140} 
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="activity_score" radius={[0, 10, 10, 0]} barSize={20}>
                                    {institutsStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Section : Absences and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Top Absences (Points Rouges) */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 italic">Surveillance de l'Assiduité</h2>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Alerte : Absences non justifiées les plus fréquentes</p>
                            </div>
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-50/30">
                                        <th className="px-8 py-4">Formateur</th>
                                        <th className="px-8 py-4">Établissement</th>
                                        <th className="px-8 py-4 text-center">Jours d'Absence</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topAbsents.map((abs, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs">
                                                        {abs.nom.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-700">{abs.nom}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-bold text-slate-500">{abs.institut}</span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-600 font-black text-xs">
                                                    {abs.count} jours
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-slate-300 group-hover:text-emerald-600 transition-colors">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {topAbsents.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic font-medium">
                                                Aucune absence critique enregistrée. Félicitations !
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Sessions Activity */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-50">
                            <h2 className="text-xl font-black text-slate-900 italic">Activité Récente</h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Dernières séances en région</p>
                        </div>
                        <div className="flex-1 p-6 space-y-4">
                            {recentSeances.map((seance, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex flex-col items-center justify-center text-emerald-600 flex-shrink-0">
                                        <span className="text-[10px] font-black leading-none">{new Date(seance.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                        <span className="text-lg font-black leading-tight">{new Date(seance.date).getDate()}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-800 text-sm truncate">{seance.plan.entite.titre}</h4>
                                        <p className="text-xs text-slate-400 font-medium truncate flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {seance.plan.siteFormation?.nom || 'Site non défini'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-slate-50/50">
                            <Link 
                                href={route('dr.plans.index')}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all"
                            >
                                <Search className="w-4 h-4" />
                                Voir tous les plans
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
