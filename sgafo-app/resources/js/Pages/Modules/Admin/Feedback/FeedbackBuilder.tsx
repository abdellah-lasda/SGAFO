import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function FeedbackBuilder({ seance, feedbackForm }: any) {
    const { props } = usePage<any>();
    const flashSuccess = props.flash?.success ?? null;
    const [showFlash, setShowFlash] = useState(true);

    const { data, setData, post, processing } = useForm({
        titre: feedbackForm?.titre || `Évaluation : ${seance.plan.entite.titre}`,
        description: feedbackForm?.description || 'Merci de prendre quelques minutes pour évaluer cette séance.',
        questions: feedbackForm?.questions.length > 0 
            ? feedbackForm.questions 
            : [{ id: null, question_text: 'Qualité de l\'animation', type: 'rating', ordre: 1 },
               { id: null, question_text: 'Utilité des supports', type: 'rating', ordre: 2 },
               { id: null, question_text: 'Commentaires additionnels', type: 'text', ordre: 3 }]
    });

    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const addQuestion = () => {
        setData('questions', [
            ...data.questions,
            { id: null, question_text: '', type: 'rating', ordre: data.questions.length + 1 }
        ]);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQs = [...data.questions];
        newQs[index][field] = value;
        setData('questions', newQs);
    };

    const removeQuestion = (index: number) => {
        setConfirmDelete(index);
    };

    const confirmRemoveQuestion = () => {
        if (confirmDelete === null) return;
        const newQs = data.questions.filter((_: any, i: number) => i !== confirmDelete);
        setData('questions', newQs);
        setConfirmDelete(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('modules.feedback.save', seance.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('modules.validations.planning.index', seance.plan_id)} >Planning du Plan</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">Configuration du Feedback</span>
            </div>
        }>
            <Head title="Configuration du Feedback" />

            <div className="max-w-5xl mx-auto space-y-8 pb-32">
                {flashSuccess && showFlash && (
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] p-6 animate-in slide-in-from-top duration-300 relative">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-emerald-700">{flashSuccess}</p>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="text-emerald-400 hover:text-emerald-700 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-slate-900">Paramètres du Questionnaire</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Détails globaux de l'évaluation</p>
                            </div>
                            <div className="flex gap-4">
                                <Link 
                                    href={route('modules.feedback.results', seance.id)}
                                    className="px-6 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2"
                                >
                                    📊 Voir les résultats
                                </Link>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Sauvegarde...' : '💾 Sauvegarder le Questionnaire'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Titre du questionnaire</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 py-4 px-6"
                                    value={data.titre} onChange={e => setData('titre', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description / Instructions</label>
                                <input 
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 py-4 px-6"
                                    value={data.description} onChange={e => setData('description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Questions ({data.questions.length})</h3>
                            <button 
                                type="button" 
                                onClick={addQuestion}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Ajouter une question
                            </button>
                        </div>

                        {data.questions.map((q: any, index: number) => (
                            <div key={index} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all relative group animate-in zoom-in-95 duration-200">
                                <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                                    {index + 1}
                                </div>
                                
                                <div className="absolute right-4 top-4">
                                    <button 
                                        type="button"
                                        onClick={() => removeQuestion(index)} 
                                        className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="md:col-span-3 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Intitulé de la question</label>
                                        <input 
                                            type="text" required
                                            className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 py-3"
                                            value={q.question_text} onChange={e => updateQuestion(index, 'question_text', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Type de réponse</label>
                                        <select 
                                            className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 h-[46px]"
                                            value={q.type} onChange={e => updateQuestion(index, 'type', e.target.value)}
                                        >
                                            <option value="rating">⭐ Note (1 à 5)</option>
                                            <option value="text">📝 Texte libre</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data.questions.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <p className="text-sm font-bold text-slate-400">Aucune question ajoutée. Cliquez sur le bouton pour commencer.</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            <ConfirmDialog
                isOpen={confirmDelete !== null}
                title="Supprimer cette question ?"
                message="Cette question sera retirée du questionnaire. Les données déjà collectées pour cette question (le cas échéant) pourraient être affectées."
                confirmLabel="Oui, supprimer"
                isDanger={true}
                onConfirm={confirmRemoveQuestion}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}
