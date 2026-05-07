import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    tentative: any;
    auth: any;
}

const DIFFICULTY_OPTIONS = [
    {
        key: 'easy',
        label: 'Facile',
        emoji: '😌',
        description: 'Le test était simple',
        color: '#22c55e',
        bgColor: '#f0fdf4',
        borderColor: '#86efac',
        hoverShadow: '0 4px 20px rgba(34,197,94,0.25)',
    },
    {
        key: 'medium',
        label: 'Moyen',
        emoji: '🤔',
        description: 'Quelques défis',
        color: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fcd34d',
        hoverShadow: '0 4px 20px rgba(245,158,11,0.25)',
    },
    {
        key: 'hard',
        label: 'Difficile',
        emoji: '😤',
        description: 'Très challengeant',
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        hoverShadow: '0 4px 20px rgba(239,68,68,0.25)',
    },
];

export default function Resultat({ tentative, auth }: Props) {
    const scorePercentage = (tentative.score / tentative.total_points) * 100;
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
        tentative.difficulty_feedback ?? null
    );
    const [feedbackSent, setFeedbackSent] = useState(!!tentative.difficulty_feedback);
    const [hoveredDifficulty, setHoveredDifficulty] = useState<string | null>(null);

    const getStatusColor = () => {
        if (scorePercentage >= 80) return '#16a34a';
        if (scorePercentage >= 50) return '#2563eb';
        return '#dc2626';
    };

    const getStatusBg = () => {
        if (scorePercentage >= 80) return '#f0fdf4';
        if (scorePercentage >= 50) return '#eff6ff';
        return '#fef2f2';
    };

    const getStatusLabel = () => {
        if (scorePercentage >= 80) return { text: 'Excellent !', icon: '🏆' };
        if (scorePercentage >= 50) return { text: 'Validé', icon: '✅' };
        return { text: 'À revoir', icon: '📚' };
    };

    const submitDifficulty = (key: string) => {
        if (feedbackSent) return;
        setSelectedDifficulty(key);
        router.patch(
            route('participant.qcm.feedback', tentative.id),
            { difficulty: key },
            {
                preserveScroll: true,
                onSuccess: () => setFeedbackSent(true),
            }
        );
    };

    const status = getStatusLabel();

    return (
        <AuthenticatedLayout
            header={<span className="font-semibold text-gray-800 leading-tight">Résultats du QCM</span>}
        >
            <Head title="Résultats QCM" />

            <div className="py-12 min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Score Card */}
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100" style={{ boxShadow: '0 8px 40px rgba(15,23,42,0.08)' }}>
                        <div className="p-10 text-center">
                            {/* Score Circle */}
                            <div
                                className="w-36 h-36 rounded-full mx-auto flex flex-col items-center justify-center mb-6 ring-8 ring-white"
                                style={{
                                    backgroundColor: getStatusBg(),
                                    boxShadow: `0 8px 30px ${getStatusColor()}30`,
                                }}
                            >
                                <span className="text-5xl font-black" style={{ color: getStatusColor() }}>
                                    {Math.round(scorePercentage)}%
                                </span>
                            </div>

                            <div className="mb-2 text-3xl">{status.icon}</div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1">
                                {status.text}
                            </h3>
                            <p className="text-slate-400 font-medium mb-8">
                                Vous avez terminé le QCM <span className="font-bold text-slate-600">"{tentative.qcm.titre}"</span>
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                                {[
                                    { label: 'Score', value: `${tentative.score} / ${tentative.total_points}` },
                                    { label: 'Durée', value: `${Math.floor(tentative.duree_secondes / 60)}m ${tentative.duree_secondes % 60}s` },
                                    { label: 'Réussite', value: scorePercentage >= 50 ? 'Oui ✓' : 'Non ✗' },
                                ].map((stat) => (
                                    <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-slate-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row justify-center gap-3">
                            <Link
                                href={route('participant.dashboard')}
                                className="px-7 py-3 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-200 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Tableau de bord
                            </Link>
                            <Link
                                href={route('participant.qcm.passage', tentative.qcm_id)}
                                className="px-7 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm text-white"
                                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', boxShadow: '0 4px 15px rgba(15,23,42,0.25)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Repasser le QCM
                            </Link>
                        </div>
                    </div>

                    {/* ─── MICRO-FEEDBACK WIDGET ─── */}
                    <div
                        className="bg-white rounded-[2rem] border overflow-hidden"
                        style={{
                            borderColor: feedbackSent ? '#86efac' : '#e2e8f0',
                            boxShadow: feedbackSent
                                ? '0 4px 20px rgba(34,197,94,0.12)'
                                : '0 4px 20px rgba(15,23,42,0.05)',
                            transition: 'all 0.4s ease',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="px-8 py-5 border-b flex items-center gap-3"
                            style={{
                                borderColor: feedbackSent ? '#bbf7d0' : '#f1f5f9',
                                background: feedbackSent
                                    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                transition: 'all 0.4s ease',
                            }}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                                style={{ background: feedbackSent ? '#22c55e20' : '#6366f120' }}
                            >
                                {feedbackSent ? '✅' : '💬'}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">
                                    {feedbackSent ? 'Merci pour votre avis !' : 'Votre avis nous intéresse'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {feedbackSent
                                        ? 'Votre retour aide les formateurs à calibrer les prochains tests.'
                                        : 'Comment avez-vous trouvé la difficulté de ce test ?'}
                                </p>
                            </div>
                        </div>

                        {/* Difficulty Buttons */}
                        <div className="p-8">
                            {feedbackSent ? (
                                <div className="flex items-center justify-center gap-3">
                                    {DIFFICULTY_OPTIONS.map((opt) => (
                                        <div
                                            key={opt.key}
                                            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all"
                                            style={selectedDifficulty === opt.key ? {
                                                backgroundColor: opt.bgColor,
                                                borderColor: opt.borderColor,
                                                transform: 'scale(1.1)',
                                                boxShadow: opt.hoverShadow,
                                            } : {
                                                backgroundColor: '#f8fafc',
                                                borderColor: '#e2e8f0',
                                                opacity: 0.4,
                                            }}
                                        >
                                            <span className="text-3xl">{opt.emoji}</span>
                                            <span className="text-xs font-bold" style={{ color: selectedDifficulty === opt.key ? opt.color : '#94a3b8' }}>
                                                {opt.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-4">
                                    {DIFFICULTY_OPTIONS.map((opt) => {
                                        const isHovered = hoveredDifficulty === opt.key;
                                        return (
                                            <button
                                                key={opt.key}
                                                type="button"
                                                onClick={() => submitDifficulty(opt.key)}
                                                onMouseEnter={() => setHoveredDifficulty(opt.key)}
                                                onMouseLeave={() => setHoveredDifficulty(null)}
                                                className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 cursor-pointer focus:outline-none"
                                                style={{
                                                    backgroundColor: isHovered ? opt.bgColor : '#f8fafc',
                                                    borderColor: isHovered ? opt.borderColor : '#e2e8f0',
                                                    transform: isHovered ? 'scale(1.08) translateY(-2px)' : 'scale(1) translateY(0)',
                                                    boxShadow: isHovered ? opt.hoverShadow : 'none',
                                                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                }}
                                            >
                                                <span className="text-4xl" style={{ filter: isHovered ? 'none' : 'grayscale(0.2)' }}>
                                                    {opt.emoji}
                                                </span>
                                                <span
                                                    className="text-xs font-bold"
                                                    style={{ color: isHovered ? opt.color : '#64748b' }}
                                                >
                                                    {opt.label}
                                                </span>
                                                {isHovered && (
                                                    <span
                                                        className="text-[10px] font-medium"
                                                        style={{ color: opt.color }}
                                                    >
                                                        {opt.description}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Section */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-slate-900 px-2 flex items-center gap-2">
                            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs">📝</span>
                            Révision des réponses
                        </h4>

                        {tentative.reponses.map((reponse: any, index: number) => (
                            <div key={reponse.id} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Question {index + 1}</span>
                                        <p className="text-base font-bold text-slate-800">{reponse.question.texte}</p>
                                    </div>
                                    <div
                                        className={`p-2 rounded-xl flex-shrink-0 ml-4 ${reponse.est_correcte ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                                    >
                                        {reponse.est_correcte ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {reponse.question.options.map((option: any) => {
                                        const isSelected = reponse.options_selectionnees.includes(option.id);
                                        const isCorrect = option.est_correcte;

                                        let style: React.CSSProperties = { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' };
                                        if (isSelected && isCorrect) style = { backgroundColor: '#f0fdf4', borderColor: '#86efac', color: '#15803d', fontWeight: 700 };
                                        else if (isSelected && !isCorrect) style = { backgroundColor: '#fef2f2', borderColor: '#fca5a5', color: '#b91c1c', fontWeight: 700 };
                                        else if (!isSelected && isCorrect) style = { backgroundColor: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8', fontWeight: 700 };

                                        return (
                                            <div
                                                key={option.id}
                                                className="p-3 rounded-xl border-2 flex items-center justify-between transition-all"
                                                style={style}
                                            >
                                                <span className="text-sm">{option.texte}</span>
                                                {isCorrect && (
                                                    <span className="text-[10px] font-black uppercase tracking-tighter bg-blue-100 text-blue-600 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                                                        Bonne réponse
                                                    </span>
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
