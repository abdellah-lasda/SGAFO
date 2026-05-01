import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import FeedbackRadarChart from '@/Components/Analytics/FeedbackRadarChart';
import QcmPerformanceChart from '@/Components/Analytics/QcmPerformanceChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Award, Star } from 'lucide-react';

interface Props {
    qcmStats: {
        average_score: number;
        total_tentatives: number;
        pass_rate: number;
    };
    feedbackStats: any[];
    secteurStats: any[];
}

export default function Analytics({ qcmStats, feedbackStats, secteurStats }: Props) {
    return (
        <AuthenticatedLayout header={<span className="font-bold text-slate-900 uppercase tracking-tight">Analyse Qualitative</span>}>
            <Head title="Analyse Qualitative" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Global KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard 
                        label="Score QCM Moyen" 
                        value={`${qcmStats.average_score}%`} 
                        icon={<Award className="w-6 h-6" />}
                        color="indigo"
                        description="Moyenne nationale sur tous les thèmes"
                    />
                    <KpiCard 
                        label="Taux de Réussite" 
                        value={`${qcmStats.pass_rate}%`} 
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="emerald"
                        description="Participants ayant validé (>50%)"
                    />
                    <KpiCard 
                        label="Total Tentatives" 
                        value={qcmStats.total_tentatives} 
                        icon={<Users className="w-6 h-6" />}
                        color="blue"
                        description="Nombre total de QCM passés"
                    />
                    <KpiCard 
                        label="Satisfaction Globale" 
                        value="4.2/5" 
                        icon={<Star className="w-6 h-6" />}
                        color="amber"
                        description="Moyenne des feedbacks participants"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Feedback Radar Chart */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            Profil de Satisfaction Participant
                        </h3>
                        <FeedbackRadarChart data={feedbackStats} />
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {feedbackStats.map((stat, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.categorie}</p>
                                    <p className="text-lg font-black text-slate-900">{parseFloat(stat.average).toFixed(1)}/5</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QCM Performance by Sector */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                            Performance par Secteur (QCM)
                        </h3>
                        <QcmPerformanceChart data={secteurStats} />
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4">Secteur</th>
                                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 text-center">Plans</th>
                                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 text-right">Satisfaction</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {secteurStats.slice(0, 5).map((sec, i) => (
                                        <tr key={i} className="group">
                                            <td className="py-3 text-sm font-black text-slate-900">{sec.name}</td>
                                            <td className="py-3 text-sm font-bold text-slate-400 text-center">{sec.plans_count}</td>
                                            <td className="py-3 text-sm font-black text-emerald-600 text-right">{sec.avg_feedback}/5</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Detailed Comparison Table */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                            Analyse Comparative des Secteurs
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Plans Validés</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Moyenne QCM</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Satisfaction</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tendance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {secteurStats.map((sec, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 font-black text-slate-900 text-sm">{sec.name}</td>
                                        <td className="px-6 py-5 text-center text-sm font-bold text-slate-500">{sec.plans_count}</td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-black text-slate-900">{sec.avg_qcm}%</span>
                                                <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${sec.avg_qcm}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                                                sec.avg_feedback >= 4 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                sec.avg_feedback >= 3 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                                {sec.avg_feedback} / 5
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                                <TrendingUp className="w-3 h-3" />
                                                <span>Stable</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function KpiCard({ label, value, icon, color, description }: any) {
    const colors: any = {
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]} border`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                    KPI Global
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 italic">{description}</p>
            </div>
        </div>
    );
}
