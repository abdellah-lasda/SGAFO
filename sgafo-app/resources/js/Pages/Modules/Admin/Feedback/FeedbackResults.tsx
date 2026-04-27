import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function FeedbackResults({ seance, stats }: any) {
    const togglePublish = (submissionId: number) => {
        router.patch(route('modules.feedback.submissions.toggle-publish', submissionId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('modules.validations.planning.index', seance.plan_id)} >Planning du Plan</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('modules.feedback.builder', seance.id)} >Configuration</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">Résultats du Feedback</span>
            </div>
        }>
            <Head title="Résultats du Feedback" />

            <div className="max-w-6xl mx-auto space-y-8 pb-32">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">{seance.feedbackForm?.titre || 'Feedback'}</h1>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Analyse des retours participants</p>
                        </div>
                        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                            <span className="text-2xl font-black text-emerald-600">{seance.feedbackForm?.submissions?.length || 0}</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-2">Réponses reçues</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stats.map((question: any, idx: number) => (
                            <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <h3 className="text-sm font-black text-slate-800 mb-4">{question.question_text}</h3>
                                {question.type === 'rating' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg key={star} className={`w-5 h-5 ${star <= Math.round(question.average) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                ))}
                                            </div>
                                            <span className="text-xl font-black text-slate-900">{question.average?.toFixed(1) || '0.0'} / 5</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(question.average / 5) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                                        {question.responses.map((resp: any, rIdx: number) => (
                                            <div key={rIdx} className="text-xs bg-white p-3 rounded-xl border border-slate-100 text-slate-600 font-medium italic">
                                                "{resp.answer_text}"
                                            </div>
                                        ))}
                                        {question.responses.length === 0 && <p className="text-[10px] text-slate-400 italic">Aucune réponse textuelle.</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                        Commentaires Généraux & Témoignages
                    </h2>

                    <div className="space-y-4">
                        {seance.feedbackForm?.submissions?.map((submission: any, idx: number) => (
                            <div key={idx} className={`p-6 rounded-[2rem] border transition-all ${submission.est_affiche_sur_plan ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-100 uppercase">
                                            {submission.participant.nom[0]}{submission.participant.prenom[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900">{submission.participant.nom} {submission.participant.prenom}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(submission.created_at).toLocaleDateString()}</p>
                                            <div className="mt-3 text-sm font-medium text-slate-700 italic">
                                                "{submission.commentaire_general || 'Aucun commentaire.'}"
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => togglePublish(submission.id)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${submission.est_affiche_sur_plan ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                                    >
                                        {submission.est_affiche_sur_plan ? '✓ Publié sur Plan' : 'Publier sur Plan'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {(seance.feedbackForm?.submissions?.length === 0 || !seance.feedbackForm) && (
                            <div className="text-center py-12 text-slate-400 font-bold italic">
                                Aucun commentaire n'a encore été soumis.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
