import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function FeedbackForm({ seance, feedbackForm }: any) {
    const { data, setData, post, processing } = useForm({
        responses: feedbackForm.questions.map((q: any) => ({
            question_id: q.id,
            rating: q.type === 'rating' ? 5 : null,
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

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('participant.seance.show', seance.id)} >Retour à la Séance</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">Évaluation de la formation</span>
            </div>
        }>
            <Head title="Évaluation de la formation" />

            <div className="max-w-3xl mx-auto space-y-8 pb-32">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">{feedbackForm.titre}</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">{feedbackForm.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {feedbackForm.questions.map((q: any, idx: number) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-lg font-black text-slate-800">{q.question_text}</h3>
                            
                            {q.type === 'rating' ? (
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => updateRating(q.id, star)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${data.responses.find((r: any) => r.question_id === q.id)?.rating >= star ? 'bg-amber-100 text-amber-500 scale-110' : 'bg-slate-50 text-slate-300'}`}
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        </button>
                                    ))}
                                    <span className="ml-auto text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        {['Pas satisfait', 'Peu satisfait', 'Satisfait', 'Très satisfait', 'Excellent'][data.responses.find((r: any) => r.question_id === q.id)?.rating - 1]}
                                    </span>
                                </div>
                            ) : (
                                <textarea 
                                    className="w-full bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 p-4 h-32"
                                    placeholder="Partagez votre avis ici..."
                                    value={data.responses.find((r: any) => r.question_id === q.id)?.answer_text}
                                    onChange={(e) => updateText(q.id, e.target.value)}
                                ></textarea>
                            )}
                        </div>
                    ))}

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                            Commentaire Général (facultatif)
                        </h3>
                        <p className="text-xs font-bold text-slate-400">Ce commentaire pourra être affiché comme témoignage sur la fiche du plan de formation.</p>
                        <textarea 
                            className="w-full bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 p-4 h-32"
                            placeholder="Votre ressenti global sur cette expérience..."
                            value={data.commentaire_general}
                            onChange={(e) => setData('commentaire_general', e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            disabled={processing}
                            className="px-12 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Envoi...' : 'Envoyer mon évaluation'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
