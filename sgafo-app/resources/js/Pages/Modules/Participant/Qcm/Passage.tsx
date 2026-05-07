import React, { useState, useEffect, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Option {
    id: number;
    texte: string;
}

interface Question {
    id: number;
    texte: string;
    type: 'unique' | 'multiple';
    points: number;
    options: Option[];
}

interface Qcm {
    id: number;
    titre: string;
    description: string;
    duree_minutes: number;
    questions: Question[];
}

interface Props {
    qcm: Qcm;
    auth: any;
    derniere_tentative?: any;
}

export default function Passage({ qcm, auth, derniere_tentative }: Props) {
    const [hasStarted, setHasStarted] = useState(!derniere_tentative);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(qcm.duree_minutes * 60);
    const [startTime] = useState(Date.now());

    const { data, setData, post, processing, transform } = useForm({
        reponses: {} as Record<number, number[]>,
        duree_secondes: 0,
    });

    const currentQuestion = qcm.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / qcm.questions.length) * 100;

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionToggle = (questionId: number, optionId: number) => {
        const currentAnswers = data.reponses[questionId] || [];
        let newAnswers: number[];

        if (currentQuestion.type === 'unique') {
            newAnswers = [optionId];
        } else {
            if (currentAnswers.includes(optionId)) {
                newAnswers = currentAnswers.filter(id => id !== optionId);
            } else {
                newAnswers = [...currentAnswers, optionId];
            }
        }

        setData('reponses', {
            ...data.reponses,
            [questionId]: newAnswers,
        });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < qcm.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        const totalDuration = Math.floor((Date.now() - startTime) / 1000);

        transform((data) => ({
            ...data,
            duree_secondes: totalDuration,
        }));

        post(route('participant.qcm.submit', qcm.id), {
            preserveScroll: true,
        });
    };

    const isLastQuestion = currentQuestionIndex === qcm.questions.length - 1;

    if (!hasStarted) {
        return (
            <AuthenticatedLayout
                header={<span className="font-semibold text-gray-800 leading-tight">QCM: {qcm.titre}</span>}
            >
                <Head title={`QCM - ${qcm.titre}`} />
                <div className="py-12 bg-slate-50 min-h-screen flex items-center justify-center">
                    <div className="max-w-2xl w-full px-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-3xl mx-auto flex items-center justify-center mb-8">
                                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">QCM déjà effectué</h3>
                                <p className="text-slate-500 font-medium mb-12">
                                    Vous avez déjà passé ce QCM. Vous pouvez consulter vos résultats ou décider de le repasser pour améliorer votre score.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href={route('participant.qcm.resultat', derniere_tentative.id)}
                                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Voir mon résultat
                                    </Link>
                                    <button
                                        onClick={() => setHasStarted(true)}
                                        className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Repasser le QCM
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<span className="font-semibold text-gray-800 leading-tight">QCM: {qcm.titre}</span>}
        >
            <Head title={`QCM - ${qcm.titre}`} />

            <div className="py-12 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header with Timer & Progress */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8 flex items-center justify-between sticky top-4 z-10 backdrop-blur-md bg-white/90">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Temps restant</p>
                                <p className={`text-xl font-black ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                                    {formatTime(timeLeft)}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-xs mx-8">
                            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-2">
                                <span>Progression</span>
                                <span>{currentQuestionIndex + 1} / {qcm.questions.length}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={processing}
                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                        >
                            Terminer
                        </button>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
                        <div className="p-8 sm:p-12">
                            <div className="flex items-start justify-between mb-8">
                                <div className="space-y-1">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Question {currentQuestionIndex + 1}
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                                        {currentQuestion.texte}
                                    </h3>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-slate-400 text-xs font-bold uppercase">Points</span>
                                    <span className="text-2xl font-black text-slate-900">{currentQuestion.points}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {currentQuestion.options.map((option) => {
                                    const isSelected = (data.reponses[currentQuestion.id] || []).includes(option.id);
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionToggle(currentQuestion.id, option.id)}
                                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative ${
                                                isSelected 
                                                ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-500/10' 
                                                : 'border-slate-100 hover:border-slate-300 bg-slate-50/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                    isSelected 
                                                    ? 'bg-blue-600 border-blue-600' 
                                                    : 'border-slate-300 group-hover:border-slate-400'
                                                }`}>
                                                    {isSelected && (
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={`text-lg font-semibold transition-colors ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                                    {option.texte}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Navigation */}
                        <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                            <button
                                onClick={prevQuestion}
                                disabled={currentQuestionIndex === 0}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                    currentQuestionIndex === 0 
                                    ? 'text-slate-300 cursor-not-allowed' 
                                    : 'text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Précédent
                            </button>

                            {isLastQuestion ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                                >
                                    Soumettre le QCM
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                                >
                                    Suivant
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                        Vos réponses sont enregistrées automatiquement.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
