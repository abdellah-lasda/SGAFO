import React, { useState } from 'react';

interface QcmSimulatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    titre: string;
    questions: any[];
}

export default function QcmSimulatorModal({ isOpen, onClose, titre, questions }: QcmSimulatorModalProps) {
    // State pour stocker les choix de l'utilisateur. Format: { [qIndex]: [oIndex1, oIndex2] }
    const [answers, setAnswers] = useState<Record<number, number[]>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [scoreInfo, setScoreInfo] = useState({ totalPoints: 0, pointsEarned: 0, percentage: 0 });

    if (!isOpen) return null;

    const toggleOption = (qIndex: number, oIndex: number, type: string) => {
        if (isSubmitted) return; // Empêcher la modification après soumission

        const currentAnswers = answers[qIndex] || [];
        
        if (type === 'unique') {
            setAnswers({ ...answers, [qIndex]: [oIndex] });
        } else {
            if (currentAnswers.includes(oIndex)) {
                setAnswers({ ...answers, [qIndex]: currentAnswers.filter(i => i !== oIndex) });
            } else {
                setAnswers({ ...answers, [qIndex]: [...currentAnswers, oIndex] });
            }
        }
    };

    const calculateScore = () => {
        let earned = 0;
        let total = 0;

        questions.forEach((q, qIndex) => {
            total += q.points;
            const selectedOptIndices = answers[qIndex] || [];
            
            // Trouver les indices des options correctes selon le builder
            const correctOptIndices = q.options
                .map((opt: any, idx: number) => opt.est_correcte ? idx : -1)
                .filter((idx: number) => idx !== -1);

            // Pour avoir les points de la question, il faut avoir coché TOUTES les bonnes réponses,
            // et AUCUNE mauvaise réponse. (Logique stricte, standard pour les QCM).
            const isExactlyCorrect = 
                selectedOptIndices.length === correctOptIndices.length &&
                selectedOptIndices.every(val => correctOptIndices.includes(val));

            if (isExactlyCorrect) {
                earned += q.points;
            }
        });

        setScoreInfo({
            totalPoints: total,
            pointsEarned: earned,
            percentage: total > 0 ? Math.round((earned / total) * 100) : 0
        });
        setIsSubmitted(true);
    };

    const resetSimulation = () => {
        setAnswers({});
        setIsSubmitted(false);
        setScoreInfo({ totalPoints: 0, pointsEarned: 0, percentage: 0 });
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100 animate-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Mode Simulation
                    </span>
                    <h2 className="text-sm font-black text-slate-900">{titre}</h2>
                </div>
                <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    Fermer l'aperçu
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
                <div className="max-w-3xl mx-auto space-y-8">
                    
                    {isSubmitted && (
                        <div className={`p-8 rounded-[2rem] text-center shadow-lg ${
                            scoreInfo.percentage >= 50 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        } animate-in zoom-in duration-500`}>
                            <h3 className="text-sm font-black uppercase tracking-widest mb-2">Résultat de la simulation</h3>
                            <div className="text-6xl font-black mb-2">{scoreInfo.percentage}%</div>
                            <p className="text-sm font-bold opacity-90">
                                Vous avez obtenu {scoreInfo.pointsEarned} points sur {scoreInfo.totalPoints} possibles.
                            </p>
                            <button 
                                onClick={resetSimulation}
                                className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                🔄 Recommencer
                            </button>
                        </div>
                    )}

                    {questions.map((q, qIndex) => {
                        const selectedOptIndices = answers[qIndex] || [];
                        
                        // Verification logique stricte
                        const correctOptIndices = q.options.map((o: any, i: number) => o.est_correcte ? i : -1).filter((i: number) => i !== -1);
                        const isQuestionCorrect = selectedOptIndices.length === correctOptIndices.length && selectedOptIndices.every(val => correctOptIndices.includes(val));

                        return (
                            <div key={qIndex} className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border-2 transition-all ${
                                isSubmitted 
                                    ? (isQuestionCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30')
                                    : 'border-transparent hover:border-blue-100'
                            }`}>
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <h4 className="text-lg font-black text-slate-900 leading-snug">
                                        <span className="text-slate-300 mr-2">{qIndex + 1}.</span>
                                        {q.texte || <span className="text-slate-300 italic">Question sans texte...</span>}
                                    </h4>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg shrink-0">
                                        {q.points} pt{q.points > 1 ? 's' : ''}
                                    </span>
                                </div>
                                
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    {q.type === 'unique' ? 'Sélectionnez une seule réponse' : 'Sélectionnez plusieurs réponses'}
                                </p>

                                <div className="space-y-3">
                                    {q.options.map((opt: any, oIndex: number) => {
                                        const isSelected = selectedOptIndices.includes(oIndex);
                                        const isActuallyCorrect = opt.est_correcte;
                                        
                                        // Déterminer les couleurs en mode soumis
                                        let optionClasses = "border-slate-200 hover:border-blue-300 hover:bg-blue-50";
                                        if (isSelected && !isSubmitted) optionClasses = "border-blue-500 bg-blue-50";
                                        
                                        if (isSubmitted) {
                                            if (isActuallyCorrect && isSelected) {
                                                optionClasses = "border-emerald-500 bg-emerald-100 text-emerald-900"; // Bonne réponse trouvée
                                            } else if (isActuallyCorrect && !isSelected) {
                                                optionClasses = "border-emerald-500 border-dashed bg-white text-emerald-700"; // Oubliée
                                            } else if (!isActuallyCorrect && isSelected) {
                                                optionClasses = "border-red-500 bg-red-100 text-red-900"; // Faute
                                            } else {
                                                optionClasses = "border-slate-100 bg-slate-50 opacity-50"; // Ignorée avec raison
                                            }
                                        }

                                        return (
                                            <div 
                                                key={oIndex} 
                                                onClick={() => toggleOption(qIndex, oIndex, q.type)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${optionClasses} ${isSubmitted ? 'pointer-events-none' : ''}`}
                                            >
                                                <div className="shrink-0 flex items-center justify-center">
                                                    {q.type === 'unique' ? (
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                            isSelected ? (isSubmitted ? (isActuallyCorrect ? 'border-emerald-500' : 'border-red-500') : 'border-blue-500') : 'border-slate-300'
                                                        }`}>
                                                            {isSelected && <div className={`w-3 h-3 rounded-full ${isSubmitted ? (isActuallyCorrect ? 'bg-emerald-500' : 'bg-red-500') : 'bg-blue-500'}`} />}
                                                        </div>
                                                    ) : (
                                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                                            isSelected ? (isSubmitted ? (isActuallyCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-red-500 bg-red-500') : 'border-blue-500 bg-blue-500') : 'border-slate-300'
                                                        }`}>
                                                            {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-sm font-bold">
                                                    {opt.texte || <span className="text-slate-300 italic">Option vide...</span>}
                                                </div>
                                                
                                                {/* Icônes de correction */}
                                                {isSubmitted && isActuallyCorrect && (
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                )}
                                                {isSubmitted && !isActuallyCorrect && isSelected && (
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Action */}
            {!isSubmitted && (
                <div className="bg-white border-t border-slate-200 p-6 flex justify-center shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10 relative">
                    <button 
                        onClick={calculateScore}
                        className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                    >
                        Valider mes réponses
                    </button>
                </div>
            )}
        </div>
    );
}
