import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Award, Users, Calendar, Clock, BarChart2, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
    auth: any;
    qcm: any;
    seance: any;
    tentatives: any[];
}

export default function QcmResults({ auth, qcm, seance, tentatives }: Props) {
    const participants = seance.plan?.participants || [];
    const participationRate = participants.length > 0 ? Math.round((tentatives.length / participants.length) * 100) : 0;
    
    const averageScore = tentatives.length > 0 
        ? Math.round(tentatives.reduce((acc, curr) => acc + (curr.score / curr.total_points * 100), 0) / tentatives.length)
        : 0;

    return (
        <AuthenticatedLayout >
            <Head title={`Résultats QCM - ${qcm.titre}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="mb-8">
                    <Link
                        href={route('modules.animateur.seances.preparation', seance.id)}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest mb-6 group"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Retour à la préparation
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                    Résultats des évaluations
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs font-bold text-slate-400">
                                    {seance.plan?.titre}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                {qcm.titre}
                            </h1>
                            <p className="text-slate-500 font-medium max-w-2xl">
                                Analyse détaillée des performances des participants pour cette évaluation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Participation</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{tentatives.length}</span>
                                <span className="text-sm font-bold text-slate-400">/ {participants.length}</span>
                            </div>
                            <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${participationRate}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Moyenne Globale</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">{averageScore}</span>
                                <span className="text-sm font-black text-slate-400">%</span>
                            </div>
                            <p className="text-[10px] text-emerald-600 font-bold mt-1">Sur l'ensemble des tentatives</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temps Moyen</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">
                                    {tentatives.length > 0 
                                        ? Math.round(tentatives.reduce((acc, curr) => acc + (curr.duree_secondes || 0), 0) / tentatives.length / 60)
                                        : 0}
                                </span>
                                <span className="text-sm font-black text-slate-400">min</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">Limite : {qcm.duree_minutes} min</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-[2.5rem] flex flex-col justify-between">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4">
                            <BarChart2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Taux de Réussite</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white">
                                    {tentatives.length > 0 
                                        ? Math.round(tentatives.filter(t => (t.score / t.total_points * 100) >= 50).length / tentatives.length * 100)
                                        : 0}
                                </span>
                                <span className="text-sm font-black text-white/60">%</span>
                            </div>
                            <p className="text-[10px] text-white/40 font-bold mt-1">Score ≥ 50%</p>
                        </div>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            Détail par Participant
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Heure</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durée</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {tentatives.map((tentative) => {
                                    const percentage = Math.round((tentative.score / tentative.total_points) * 100);
                                    const isPassed = percentage >= 50;

                                    return (
                                        <tr key={tentative.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm uppercase">
                                                        {tentative.user.prenom[0]}{tentative.user.nom[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                                            {tentative.user.prenom} {tentative.user.nom}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Participant</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-black text-slate-700">
                                                    {new Date(tentative.termine_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400">à {new Date(tentative.termine_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-slate-700">
                                                    {Math.floor(tentative.duree_secondes / 60)}m {tentative.duree_secondes % 60}s
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-lg font-black ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {percentage}%
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-300">({tentative.score}/{tentative.total_points})</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                    {isPassed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                    {isPassed ? 'Réussi' : 'Échec'}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {tentatives.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="max-w-xs mx-auto">
                                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                                                    <BarChart2 className="w-8 h-8" />
                                                </div>
                                                <p className="text-sm font-black text-slate-900 mb-1">Aucune tentative</p>
                                                <p className="text-xs font-medium text-slate-400">Les participants n'ont pas encore commencé cette évaluation.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
