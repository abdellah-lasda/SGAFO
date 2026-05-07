import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    tentative: any;
    auth: any;
}

export default function Resultat({ tentative, auth }: Props) {
    const scorePercentage = (tentative.score / tentative.total_points) * 100;
    
    // Determine color based on performance
    const getStatusColor = () => {
        if (scorePercentage >= 80) return 'text-green-600';
        if (scorePercentage >= 50) return 'text-blue-600';
        return 'text-red-600';
    };

    const getStatusBg = () => {
        if (scorePercentage >= 80) return 'bg-green-50';
        if (scorePercentage >= 50) return 'bg-blue-50';
        return 'bg-red-50';
    };

    return (
        <AuthenticatedLayout
            header={<span className="font-semibold text-gray-800 leading-tight">Résultats du QCM</span>}
        >
            <Head title="Résultats QCM" />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Score Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden mb-8">
                        <div className="p-12 text-center">
                            <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-8 ring-8 ring-white shadow-xl ${getStatusBg()}`}>
                                <span className={`text-4xl font-black ${getStatusColor()}`}>
                                    {Math.round(scorePercentage)}%
                                </span>
                            </div>

                            <h3 className="text-3xl font-black text-slate-900 mb-2">
                                Félicitations, {auth.user.prenom} !
                            </h3>
                            <p className="text-slate-500 font-medium mb-8">
                                Vous avez terminé le QCM <span className="font-bold text-slate-700">"{tentative.qcm.titre}"</span>
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Score</p>
                                    <p className="text-2xl font-black text-slate-900">{tentative.score} / {tentative.total_points}</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Durée</p>
                                    <p className="text-2xl font-black text-slate-900">
                                        {Math.floor(tentative.duree_secondes / 60)}m {tentative.duree_secondes % 60}s
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Statut</p>
                                    <p className={`text-2xl font-black ${getStatusColor()}`}>
                                        {scorePercentage >= 50 ? 'Validé' : 'À revoir'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border-t border-slate-100 p-8 flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href={route('participant.dashboard')}
                                className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Retour au tableau de bord
                            </Link>
                            <Link
                                href={route('participant.qcm.passage', tentative.qcm_id)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Repasser le QCM
                            </Link>
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="space-y-6">
                        <h4 className="text-xl font-bold text-slate-900 px-4">Révision des réponses</h4>
                        
                        {tentative.reponses.map((reponse: any, index: number) => (
                            <div key={reponse.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Question {index + 1}</span>
                                        <p className="text-lg font-bold text-slate-800">{reponse.question.texte}</p>
                                    </div>
                                    <div className={`p-2 rounded-xl ${reponse.est_correcte ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {reponse.est_correcte ? (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {reponse.question.options.map((option: any) => {
                                        const isSelected = reponse.options_selectionnees.includes(option.id);
                                        const isCorrect = option.est_correcte;
                                        
                                        let borderClass = 'border-slate-100';
                                        let bgClass = 'bg-slate-50/50';
                                        let textClass = 'text-slate-600';

                                        if (isSelected && isCorrect) {
                                            borderClass = 'border-green-200';
                                            bgClass = 'bg-green-50/50';
                                            textClass = 'text-green-700 font-bold';
                                        } else if (isSelected && !isCorrect) {
                                            borderClass = 'border-red-200';
                                            bgClass = 'bg-red-50/50';
                                            textClass = 'text-red-700 font-bold';
                                        } else if (!isSelected && isCorrect) {
                                            borderClass = 'border-blue-200';
                                            bgClass = 'bg-blue-50/30';
                                            textClass = 'text-blue-700 font-bold';
                                        }

                                        return (
                                            <div key={option.id} className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${borderClass} ${bgClass}`}>
                                                <span className={textClass}>{option.texte}</span>
                                                {isCorrect && (
                                                    <span className="text-[10px] font-black uppercase text-green-600 tracking-tighter bg-green-100 px-2 py-1 rounded-lg">Réponse Correcte</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
