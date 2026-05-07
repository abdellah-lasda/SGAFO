import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import EmojiRating from '@/Components/EmojiRating';

export default function FeedbackForm({ seance, feedbackForm }: any) {
    const { data, setData, post, processing } = useForm({
        responses: feedbackForm.questions.map((q: any) => ({
            question_id: q.id,
            rating: q.type === 'rating' ? null : null,
            answer_text: q.type === 'text' ? '' : null
        })),
        commentaire_general: ''
    });

    const updateRating = (qId: number, val: number) => {
        const newResponses = data.responses.map((r: any) =>
            r.question_id === qId ? { ...r, rating: val } : r
        );
        setData('responses', newResponses);
    };

    const updateText = (qId: number, val: string) => {
        const newResponses = data.responses.map((r: any) =>
            r.question_id === qId ? { ...r, answer_text: val } : r
        );
        setData('responses', newResponses);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('participant.feedback.submit', seance.id));
    };

    const allRatingsFilled = feedbackForm.questions
        .filter((q: any) => q.type === 'rating')
        .every((q: any) => {
            const response = data.responses.find((r: any) => r.question_id === q.id);
            return response?.rating !== null && response?.rating !== undefined;
        });

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('participant.seance.show', seance.id)}>Retour à la Séance</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">Évaluation de la formation</span>
            </div>
        }>
            <Head title="Évaluation de la formation" />

            <div
                className="min-h-screen py-10"
                style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)' }}
            >
                <div className="max-w-3xl mx-auto px-4 space-y-6 pb-16">

                    {/* Header Card */}
                    <div
                        className="bg-white p-8 rounded-[2rem] border border-emerald-100 text-center"
                        style={{ boxShadow: '0 4px 30px rgba(16,185,129,0.08)' }}
                    >
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl"
                            style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}
                        >
                            ⭐
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">{feedbackForm.titre}</h1>
                        {feedbackForm.description && (
                            <p className="text-sm font-medium text-slate-500 mt-2">{feedbackForm.description}</p>
                        )}
                        <p className="text-xs text-emerald-600 font-bold mt-3 bg-emerald-50 px-4 py-2 rounded-xl inline-block">
                            Votre avis est précieux et complètement anonyme 🔒
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {feedbackForm.questions.map((q: any, idx: number) => {
                            const response = data.responses.find((r: any) => r.question_id === q.id);
                            const hasValue = q.type === 'rating' ? (response?.rating !== null && response?.rating !== undefined) : true;

                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-[2rem] border-2 overflow-hidden transition-all"
                                    style={{
                                        borderColor: hasValue ? '#a7f3d0' : '#e2e8f0',
                                        boxShadow: hasValue
                                            ? '0 4px 20px rgba(16,185,129,0.1)'
                                            : '0 2px 10px rgba(15,23,42,0.04)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {/* Question Header */}
                                    <div
                                        className="px-8 pt-7 pb-2 flex items-start gap-3"
                                    >
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5"
                                            style={{ background: hasValue ? '#10b981' : '#94a3b8' }}
                                        >
                                            {hasValue ? '✓' : idx + 1}
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 leading-snug">
                                            {q.question_text}
                                        </h3>
                                    </div>

                                    {/* Input */}
                                    <div className="px-8 pb-7 pt-4">
                                        {q.type === 'rating' ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <EmojiRating
                                                    value={response?.rating ?? null}
                                                    onChange={(val) => updateRating(q.id, val)}
                                                    size="lg"
                                                />
                                                {!hasValue && (
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        Sélectionnez votre niveau de satisfaction
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <textarea
                                                className="w-full rounded-2xl text-sm font-medium p-4 h-28 border-2 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                                                style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                                                placeholder="Partagez votre avis ici..."
                                                value={response?.answer_text ?? ''}
                                                onChange={(e) => updateText(q.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Commentaire Général */}
                        <div
                            className="bg-white p-8 rounded-[2rem] border-2 border-slate-100"
                            style={{ boxShadow: '0 2px 10px rgba(15,23,42,0.04)' }}
                        >
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
                                <span className="text-xl">💬</span>
                                Commentaire général <span className="text-slate-400 font-normal text-sm">(facultatif)</span>
                            </h3>
                            <p className="text-xs font-medium text-slate-400 mb-4">
                                Un commentaire positif pourra être affiché comme témoignage sur la fiche de la formation.
                            </p>
                            <textarea
                                className="w-full rounded-2xl text-sm font-medium p-4 h-28 border-2 focus:outline-none focus:border-emerald-400 transition-colors resize-none"
                                style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                                placeholder="Votre ressenti global sur cette expérience de formation..."
                                value={data.commentaire_general}
                                onChange={(e) => setData('commentaire_general', e.target.value)}
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between pt-2">
                            {!allRatingsFilled && (
                                <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                    <span>⚠️</span>
                                    Veuillez répondre à toutes les questions de satisfaction
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={processing || !allRatingsFilled}
                                className="ml-auto px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: allRatingsFilled
                                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                        : '#94a3b8',
                                    boxShadow: allRatingsFilled ? '0 6px 20px rgba(16,185,129,0.35)' : 'none',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {processing ? '⏳ Envoi...' : '✅ Envoyer mon évaluation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
