import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import FeedbackRadarChart from '@/Components/Analytics/FeedbackRadarChart';


export default function FeedbackDashboard({ auth, seances, plans, filters, stats, feedbackStats }: any) {
    const isManager = auth.user.roles.some((r: any) => r.code.includes('RF') || r.code.includes('ADMIN'));
    const [selectedPlan, setSelectedPlan] = useState(filters.plan_id || '');

    const handleFilter = (planId: string) => {
        setSelectedPlan(planId);
        router.get(route('modules.feedback.dashboard'), { plan_id: planId }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 text-sm">
                    <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('dashboard')} >SGAFO</Link>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Analyses Qualitatives & Feedbacks</span>
                </div>
            }
        >
            <Head title="Dashboard Feedback" />

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative">Note Moyenne Globale</p>
                        <div className="flex items-end gap-2 relative">
                            <h4 className="text-4xl font-black text-slate-900 tabular-nums">{stats.avg_rating}</h4>
                            <span className="text-xl font-bold text-amber-400 mb-1">★</span>
                            <span className="text-xs text-slate-400 mb-1 font-bold">/ 5</span>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative">Total Évaluations</p>
                        <h4 className="text-4xl font-black text-emerald-600 tabular-nums relative">{stats.total_submissions}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative">Témoignages Catalogue</p>
                        <h4 className="text-4xl font-black text-purple-600 tabular-nums relative">{stats.testimonial_count}</h4>
                    </div>
                </div>

                {/* Qualitative Chart - Only show if data exists */}
                {feedbackStats && feedbackStats.length > 0 && (
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Profil de Satisfaction</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                                    Cette visualisation agrège l'ensemble des réponses aux questionnaires d'évaluation. 
                                    Elle permet d'identifier rapidement les points forts et les axes d'amélioration pédagogique.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {feedbackStats.map((stat: any, i: number) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.categorie}</span>
                                            <span className="text-lg font-black text-slate-900">{parseFloat(stat.average).toFixed(1)}/5</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-50/50 rounded-[2rem] p-4">
                                <FeedbackRadarChart data={feedbackStats} />
                            </div>
                        </div>
                    </div>
                )}


                {/* Filters & Content */}
                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Rapports de Séances</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Analyse des performances par session de formation</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filtrer par formation :</label>
                            <select 
                                className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:border-blue-500 transition-all min-w-[250px]"
                                value={selectedPlan}
                                onChange={(e) => handleFilter(e.target.value)}
                            >
                                <option value="">Toutes les formations</option>
                                {plans.map((plan: any) => (
                                    <option key={plan.id} value={plan.id}>{plan.titre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/30">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Séance & Formation</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participation</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Note Moyenne</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {seances.data.map((seance: any) => (
                                    <tr key={seance.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(seance.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                                    <span className="text-lg font-black text-slate-900">{new Date(seance.date).getDate()}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{seance.plan.titre}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{seance.plan.entite?.titre}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-500">📍 {seance.site?.nom || 'Lieu non défini'}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center w-32">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{seance.participation_rate}%</span>
                                                    <span className="text-[10px] font-bold text-slate-600">{seance.submissions_count}/{seance.presences_count}</span>
                                                </div>
                                                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-1000 ${seance.participation_rate > 70 ? 'bg-emerald-500' : seance.participation_rate > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${seance.participation_rate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`px-3 py-1 rounded-lg text-sm font-black flex items-center gap-1 ${
                                                    seance.avg_rating >= 4 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    seance.avg_rating >= 3 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                    'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                    {parseFloat(seance.avg_rating || 0).toFixed(1)}
                                                    <span className="text-[10px] opacity-60 font-bold">/ 5</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link 
                                                href={route('modules.feedback.results', seance.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/20 active:scale-95"
                                            >
                                                Détails Complet
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {seances.data.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <p className="text-sm font-bold text-slate-400 italic">Aucune séance évaluée trouvée.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
