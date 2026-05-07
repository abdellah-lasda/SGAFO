import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function FeedbackResults({ auth, seance, stats, submissions, submissionCount }: any) {
    const isManager = auth.user.roles.some((r: any) => r.code.includes('RF'));

    const togglePublish = (submissionId: number) => {
        router.patch(route('modules.feedback.submissions.toggle-publish', submissionId), {}, {
            preserveScroll: true,
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 4) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (score >= 3) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };
    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4 text-sm">
                {isManager && (
                    <>
                        <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('modules.validations.planning.index', seance.plan_id)} >Planning du Plan</Link>
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('modules.feedback.builder', seance.id)} >Configuration</Link>
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </>
                )}

                <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Résultats du Feedback</span>
            </div>
        }>
            <Head title="Résultats du Feedback" />

            <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
                
                {/* Analytics Header */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block">Rapport d'analyse</span>
                            <h1 className="text-3xl font-black text-slate-900 italic leading-tight">
                                {seance.feedbackForm?.titre || 'Feedback de session'}
                            </h1>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                                {seance.plan.entite?.titre} · Séance du {new Date(seance.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="px-8 py-6 bg-emerald-600 text-white rounded-[2rem] shadow-xl shadow-emerald-600/20 text-center min-w-[160px]">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Participation</p>
                                <p className="text-4xl font-black">{submissionCount}</p>
                                <p className="text-[10px] font-bold opacity-60 mt-1 uppercase">Réponses reçues</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.filter((q: any) => q.type === 'rating').map((question: any, idx: number) => {
                        const colorClass = getScoreColor(question.average || 0);
                        return (
                            <div key={idx} className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] duration-300 ${colorClass.split(' ').slice(1).join(' ')}`}>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-3 truncate">{question.question_text}</p>
                                <div className="flex items-end gap-1">
                                    <span className={`text-3xl font-black ${colorClass.split(' ')[0]}`}>{question.average?.toFixed(1) || '0.0'}</span>
                                    <span className="text-xs font-bold opacity-40 mb-1.5">/ 5</span>
                                </div>
                                <div className="mt-4 flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <div 
                                            key={star} 
                                            className={`h-1.5 flex-1 rounded-full ${star <= Math.round(question.average) ? colorClass.split(' ')[0].replace('text', 'bg') : 'bg-slate-200'}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Testimonials Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                                Commentaires & Modération
                            </h2>

                            <div className="space-y-6">
                                {submissions.map((submission: any, idx: number) => (
                                    <div key={idx} className="group relative bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-100 shadow-sm group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all">
                                                    {submission.participant.nom[0]}{submission.participant.prenom[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{submission.participant.nom} {submission.participant.prenom}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(submission.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                            </div>
                                            {isManager && (
                                                <button 
                                                    onClick={() => togglePublish(submission.id)}
                                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${submission.est_affiche_sur_plan ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600'}`}
                                                >
                                                    {submission.est_affiche_sur_plan ? '✓ Publié au catalogue' : 'Publier au catalogue'}
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-6 p-4 bg-white/60 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed relative">
                                            <svg className="absolute -top-3 -left-1 w-8 h-8 text-emerald-50 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.893h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.893h3.999v10h-9.999z" />
                                            </svg>
                                            "{submission.commentaire_general || 'Aucun commentaire textuel.'}"
                                        </div>
                                    </div>
                                ))}
                                {(submissions.length === 0) && (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                        <p className="text-slate-400 font-bold italic">Aucune réponse pour le moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Qualitative Details */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-emerald-400">Questions Libres</h3>
                            <div className="space-y-6">
                                {stats.filter((q: any) => q.type === 'text').map((question: any, idx: number) => (
                                    <div key={idx} className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{question.question_text}</p>
                                        <div className="space-y-3">
                                            {question.responses.map((resp: any, rIdx: number) => (
                                                <div key={rIdx} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-medium italic text-slate-300">
                                                    "{resp.answer_text}"
                                                </div>
                                            ))}
                                            {question.responses.length === 0 && <p className="text-[10px] text-slate-600 italic">En attente de réponses...</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
