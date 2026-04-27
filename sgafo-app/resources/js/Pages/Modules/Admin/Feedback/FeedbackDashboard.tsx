import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function FeedbackDashboard({ submissions, plans, filters, stats }: any) {
    const [selectedPlan, setSelectedPlan] = useState(filters.plan_id || '');

    const handleFilter = (planId: string) => {
        setSelectedPlan(planId);
        router.get(route('modules.feedback.dashboard'), { plan_id: planId }, {
            preserveState: true,
            replace: true
        });
    };

    const togglePublish = (submissionId: number) => {
        router.patch(route('modules.feedback.submissions.toggle-publish', submissionId), {}, {
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={<span>Feedbacks & Avis Participants</span>}
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
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative">Témoignages Publiés</p>
                        <h4 className="text-4xl font-black text-purple-600 tabular-nums relative">{stats.published_count}</h4>
                    </div>
                </div>

                {/* Filters & Content */}
                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Liste des retours</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gérez la visibilité des témoignages sur le catalogue</p>
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
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant & Séance</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Commentaire Général</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibilité Catalogue</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {submissions.data.map((sub: any) => (
                                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                                                    {sub.participant.nom[0]}{sub.participant.prenom[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{sub.participant.nom} {sub.participant.prenom}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">Séance du {new Date(sub.seance.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-600 line-clamp-1 max-w-[200px]">{sub.plan.titre}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs italic text-slate-500 line-clamp-2 max-w-[300px]">
                                                "{sub.commentaire_general || 'Pas de commentaire'}"
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button 
                                                onClick={() => togglePublish(sub.id)}
                                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                                    sub.est_affiche_sur_plan 
                                                        ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                                                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                }`}
                                            >
                                                {sub.est_affiche_sur_plan ? '● Publié' : '○ Masqué'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link 
                                                href={route('modules.feedback.results', sub.seance_id)}
                                                className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                                            >
                                                Détails Complet
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {submissions.data.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <p className="text-sm font-bold text-slate-400 italic">Aucun feedback trouvé pour ce filtre.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
