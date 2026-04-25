import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect, useRef } from 'react';

interface Seance {
    id: number;
    date: string;
    debut: string;
    fin: string;
    description: string | null;
    qcms: Array<{
        id: number;
        titre: string;
        est_publie: boolean;
    }>;
    plan: {
        id: number;
        titre: string;
        entite: { nom: string };
    };
    site: { nom: string } | null;
    ressources: any[];
}

export default function SeancePreparation({ seance }: { seance: Seance }) {
    const editorRef = useRef<any>(null);
    const { data, setData, post, processing, errors } = useForm({
        description: seance.description || '',
    });

    // Synchroniser les données si la prop `seance` change (lors d'un retour Inertia)
    useEffect(() => {
        setData('description', seance.description || '');
    }, [seance.description]);

    const { data: resData, setData: setResData, post: postRes, processing: resProcessing, reset: resetRes } = useForm({
        titre: '',
        type: 'file',
        file: null as File | null,
        url: '',
    });

    const { data: qcmData, setData: setQcmData, post: postQcm, processing: qcmProcessing, reset: resetQcm } = useForm({
        titre: '',
    });

    const handleCreateQcm = (e: React.FormEvent) => {
        e.preventDefault();
        postQcm(route('modules.animateur.qcms.store', seance.id), {
            onSuccess: () => {
                resetQcm();
                setShowQcmModal(false);
            },
        });
    };

    const handleSaveDescription = (e: React.FormEvent) => {
        e.preventDefault();

        // S'assurer qu'on a le contenu le plus récent depuis l'éditeur
        const currentContent = editorRef.current ? editorRef.current.getContent() : data.description;

        // On envoie le contenu forcé via le router d'Inertia
        router.post(route('modules.animateur.seances.update-description', seance.id), {
            description: currentContent
        }, {
            preserveScroll: true
        });
    };

    const handleAddResource = (e: React.FormEvent) => {
        e.preventDefault();
        postRes(route('modules.animateur.seances.add-resource', seance.id), {
            onSuccess: () => {
                resetRes();
                setShowAddModal(false);
            },
        });
    };

    const [showAddModal, setShowAddModal] = useState(false);
    const [showQcmModal, setShowQcmModal] = useState(false);

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link className="text-slate-400 hover:text-blue-600 transition-colors font-bold" href={route('modules.animateur.formations')} >Mes Formations</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">{seance.plan.titre}</span>
            </div>
        }>
            <Head title={`Préparer : ${seance.plan.titre}`} />

            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header Info */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                {seance.plan.entite.nom}
                            </span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                {format(new Date(seance.date), 'EEEE d MMMM yyyy', { locale: fr })}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">{seance.plan.titre}</h1>
                        <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                            {seance.debut} - {seance.fin} · {seance.site?.nom || 'Visio'}
                        </p>
                    </div>
                    <Link
                        href={route('modules.animateur.formations.show', seance.plan.id)} // Correction : ID du plan
                        className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                        Retour au planning
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: TinyMCE Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Résumé & Contenu de la séance</h3>
                                {processing && <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Enregistrement...</span>}
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleSaveDescription}>
                                    <Editor
                                        key={seance.id}
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                                        licenseKey="gpl"
                                        onEditorChange={(content) => setData('description', content)}
                                        initialValue={seance.description || ''}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            promotion: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }',
                                            skin: 'oxide',
                                            content_css: 'default',
                                            branding: false,
                                        }}
                                    />
                                    <div className="mt-6 flex flex-col items-end gap-2">
                                        {Object.keys(errors).length > 0 && (
                                            <div className="text-red-500 text-xs font-bold bg-red-50 px-3 py-2 rounded-lg w-full">
                                                Une erreur est survenue : {Object.values(errors).join(', ')}
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                        >
                                            {processing ? 'Enregistrement...' : '💾 Enregistrer le contenu'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right: Resources List */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Documents & Liens</h3>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all"
                                >
                                    +
                                </button>
                            </div>

                            <div className="space-y-3">
                                {seance.ressources.length > 0 ? seance.ressources.map((res) => (
                                    <div key={res.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm">
                                                {res.type === 'file' ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-900 truncate max-w-[150px]">{res.titre}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {res.type === 'file' ? `${res.extension} · ${(res.size / 1024).toFixed(0)} Ko` : 'Lien externe'}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('modules.animateur.ressources.delete', res.id)}
                                            method="delete"
                                            as="button"
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </Link>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aucun document</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tip Box */}
                        <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl">
                            <h4 className="text-sm font-black uppercase tracking-widest mb-4">Conseil Pédagogique</h4>
                            <p className="text-xs text-blue-100 font-medium leading-relaxed">
                                Un résumé clair et quelques documents clés permettent aux participants de mieux assimiler les concepts après la séance.
                            </p>
                        </div>

                        {/* QCMs List */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Évaluations (QCM)</h3>
                                <button 
                                    onClick={() => setShowQcmModal(true)}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md"
                                >
                                    + Créer un QCM
                                </button>
                            </div>

                            <div className="space-y-3">
                                {seance.qcms && seance.qcms.length > 0 ? seance.qcms.map((qcm) => (
                                    <div key={qcm.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 border border-slate-100 shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-900 truncate max-w-[150px]">{qcm.titre}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {qcm.est_publie ? '🟢 Publié' : '🟠 Brouillon'}
                                                </p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={route('modules.animateur.qcms.edit', qcm.id)} 
                                            className="px-3 py-1.5 bg-slate-200 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Modifier
                                        </Link>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aucune évaluation</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create QCM Modal */}
            {showQcmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Nouveau QCM</h2>
                        <form onSubmit={handleCreateQcm} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre du QCM</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="Ex: Évaluation finale"
                                    className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                                    value={qcmData.titre}
                                    onChange={e => setQcmData('titre', e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button 
                                    type="button"
                                    onClick={() => setShowQcmModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    disabled={qcmProcessing}
                                    className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                >
                                    {qcmProcessing ? 'Création...' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Resource Modal (Simple) */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Ajouter une ressource</h2>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre de la ressource</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                    value={resData.titre}
                                    onChange={e => setResData('titre', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Type</label>
                                <select
                                    className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                    value={resData.type}
                                    onChange={e => setResData('type', e.target.value)}
                                >
                                    <option value="file">Fichier (PDF, PPTX, Docx)</option>
                                    <option value="link">Lien Externe (URL)</option>
                                </select>
                            </div>

                            {resData.type === 'file' ? (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Fichier (Max 10Mo)</label>
                                    <input
                                        type="file"
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={e => setResData('file', e.target.files?.[0] || null)}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lien URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                        value={resData.url}
                                        onChange={e => setResData('url', e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={resProcessing}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20"
                                >
                                    {resProcessing ? 'Upload...' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
