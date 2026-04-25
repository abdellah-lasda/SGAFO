import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import QcmSimulatorModal from './QcmSimulatorModal';

export default function QcmBuilder({ seance, qcm }: any) {
    // State pour les paramètres
    const { data: metaData, setData: setMetaData, put: updateMeta, processing: metaProcessing } = useForm({
        titre: qcm.titre,
        description: qcm.description || '',
        duree_minutes: qcm.duree_minutes || '',
        est_publie: qcm.est_publie,
    });

    const [showSimulator, setShowSimulator] = useState(false);

    // State pour la structure complexe des questions
    const [questions, setQuestions] = useState<any[]>(
        qcm.questions.length > 0 
            ? qcm.questions 
            : [{ id: null, texte: '', type: 'unique', points: 1, ordre: 1, options: [
                { id: null, texte: 'Option 1', est_correcte: false },
                { id: null, texte: 'Option 2', est_correcte: false }
            ]}]
    );
    const [isSaving, setIsSaving] = useState(false);

    // --- Gestion des Paramètres ---
    const handleSaveMeta = (e: React.FormEvent) => {
        e.preventDefault();
        updateMeta(route('modules.animateur.qcms.update', qcm.id), { preserveScroll: true });
    };

    // --- Gestion de la Structure ---
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: null,
                texte: '',
                type: 'unique',
                points: 1,
                ordre: questions.length + 1,
                options: [
                    { id: null, texte: '', est_correcte: false },
                    { id: null, texte: '', est_correcte: false }
                ]
            }
        ]);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQs = [...questions];
        newQs[index][field] = value;
        setQuestions(newQs);
    };

    const removeQuestion = (index: number) => {
        if(confirm("Supprimer cette question ?")) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const addOption = (qIndex: number) => {
        const newQs = [...questions];
        newQs[qIndex].options.push({ id: null, texte: '', est_correcte: false });
        setQuestions(newQs);
    };

    const updateOption = (qIndex: number, oIndex: number, field: string, value: any) => {
        const newQs = [...questions];
        
        // Comportement "Choix Unique" : décocher les autres
        if (field === 'est_correcte' && value === true && newQs[qIndex].type === 'unique') {
            newQs[qIndex].options.forEach((opt: any) => opt.est_correcte = false);
        }
        
        newQs[qIndex].options[oIndex][field] = value;
        setQuestions(newQs);
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const newQs = [...questions];
        if (newQs[qIndex].options.length > 2) {
            newQs[qIndex].options.splice(oIndex, 1);
            setQuestions(newQs);
        } else {
            alert("Une question doit avoir au moins 2 options.");
        }
    };

    const saveStructure = () => {
        setIsSaving(true);
        // Recalculer l'ordre
        const cleanQuestions = questions.map((q, idx) => ({ ...q, ordre: idx + 1 }));
        
        router.post(route('modules.animateur.qcms.structure.save', qcm.id), { questions: cleanQuestions }, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
            onSuccess: () => alert("QCM sauvegardé avec succès !"),
            onError: (err) => alert("Erreur lors de la sauvegarde : vérifiez que tous les champs sont remplis.")
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link className="text-slate-400 hover:text-emerald-600 transition-colors font-bold" href={route('modules.animateur.seances.preparation', seance.id)} >Préparation Séance</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">Édition du QCM</span>
            </div>
        }>
            <Head title={`Éditer QCM : ${qcm.titre}`} />

            <div className="max-w-5xl mx-auto space-y-8 pb-32">
                {/* Header Actions */}
                <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">{qcm.titre}</h1>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Constructeur de QCM</p>
                    </div>
                    <div className="flex gap-4">
                        <Link 
                            href={route('modules.animateur.seances.preparation', seance.id)}
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Retour à la séance
                        </Link>
                        <button 
                            onClick={() => setShowSimulator(true)}
                            className="px-6 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2"
                        >
                            ▶️ Tester l'aperçu
                        </button>
                        <button 
                            onClick={saveStructure}
                            disabled={isSaving}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? 'Sauvegarde...' : '💾 Sauvegarder les Questions'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Params */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Paramètres</h3>
                            <form onSubmit={handleSaveMeta} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                                        value={metaData.titre} onChange={e => setMetaData('titre', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Durée (minutes)</label>
                                    <input 
                                        type="number" min="1" placeholder="Illimité"
                                        className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                                        value={metaData.duree_minutes} onChange={e => setMetaData('duree_minutes', e.target.value)}
                                    />
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={metaData.est_publie} onChange={e => setMetaData('est_publie', e.target.checked)} />
                                            <div className={`block w-10 h-6 rounded-full transition-colors ${metaData.est_publie ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${metaData.est_publie ? 'translate-x-4' : ''}`}></div>
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-emerald-600 transition-colors">
                                            Rendre Public
                                        </div>
                                    </label>
                                </div>
                                <button type="submit" disabled={metaProcessing} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                                    {metaProcessing ? 'Mise à jour...' : 'Appliquer'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Questions Builder */}
                    <div className="lg:col-span-3 space-y-6">
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-transparent focus-within:border-emerald-100 shadow-sm transition-all relative group">
                                <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                                    {qIndex + 1}
                                </div>
                                
                                <div className="flex justify-end absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => removeQuestion(qIndex)} className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="md:col-span-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Question</label>
                                        <input 
                                            type="text" required placeholder="Tapez votre question ici..."
                                            className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 py-4"
                                            value={q.texte} onChange={e => updateQuestion(qIndex, 'texte', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Type</label>
                                            <select 
                                                className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 h-12"
                                                value={q.type} onChange={e => updateQuestion(qIndex, 'type', e.target.value)}
                                            >
                                                <option value="unique">Choix Unique</option>
                                                <option value="multiple">Choix Multiple</option>
                                            </select>
                                        </div>
                                        <div className="w-20">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Points</label>
                                            <input 
                                                type="number" min="1" required
                                                className="w-full bg-emerald-50 text-emerald-700 border-none rounded-xl text-center font-black focus:ring-2 focus:ring-emerald-500 h-12"
                                                value={q.points} onChange={e => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Options de réponse (Cochez les bonnes réponses)</label>
                                    {q.options.map((opt: any, oIndex: number) => (
                                        <div key={oIndex} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${opt.est_correcte ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                                            <div className="flex-shrink-0">
                                                {q.type === 'unique' ? (
                                                    <input 
                                                        type="radio" 
                                                        checked={opt.est_correcte} 
                                                        onChange={() => updateOption(qIndex, oIndex, 'est_correcte', true)}
                                                        className="w-5 h-5 text-emerald-500 border-slate-300 focus:ring-emerald-500"
                                                    />
                                                ) : (
                                                    <input 
                                                        type="checkbox" 
                                                        checked={opt.est_correcte} 
                                                        onChange={(e) => updateOption(qIndex, oIndex, 'est_correcte', e.target.checked)}
                                                        className="w-5 h-5 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                                                    />
                                                )}
                                            </div>
                                            <input 
                                                type="text" required placeholder={`Option ${oIndex + 1}`}
                                                className="flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0"
                                                value={opt.texte} onChange={e => updateOption(qIndex, oIndex, 'texte', e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <button type="button" onClick={() => addOption(qIndex)} className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Ajouter une option
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button onClick={addQuestion} className="w-full py-8 border-2 border-dashed border-slate-200 text-slate-400 rounded-[2rem] hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex flex-col items-center justify-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Ajouter une question</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Simulation */}
            <QcmSimulatorModal 
                isOpen={showSimulator} 
                onClose={() => setShowSimulator(false)} 
                titre={metaData.titre || 'QCM Sans Titre'} 
                questions={questions} 
            />
        </AuthenticatedLayout>
    );
}
