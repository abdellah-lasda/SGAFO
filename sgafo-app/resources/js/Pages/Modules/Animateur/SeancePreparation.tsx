import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect, useRef } from 'react';
import { validateFile, validateUrl, validateRequiredString } from '@/utils/validators';
import ConfirmDialog from '@/Components/ConfirmDialog';

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

    const { data: editResData, setData: setEditResData, put: putRes, processing: editResProcessing, reset: resetEditRes } = useForm({
        titre: '',
        url: '',
        type: 'file',
    });

    const { data: qcmData, setData: setQcmData, post: postQcm, processing: qcmProcessing, reset: resetQcm } = useForm({
        titre: '',
    });

    const handleCreateQcm = (e: React.FormEvent) => {
        e.preventDefault();
        // Laisser le serveur gérer la redirection vers QcmBuilder
        postQcm(route('modules.animateur.qcms.store', seance.id));
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
        const newErrors: Record<string, string> = {};

        // Validation côté client
        const titreError = validateRequiredString(resData.titre, 'Titre');
        if (titreError) newErrors.titre = titreError;

        if (resData.type === 'file') {
            const fileError = validateFile(resData.file);
            if (fileError) newErrors.file = fileError;
        } else {
            const urlError = validateUrl(resData.url);
            if (urlError) newErrors.url = urlError;
        }

        if (Object.keys(newErrors).length > 0) {
            setClientErrors(newErrors);
            return;
        }

        setClientErrors({});
        postRes(route('modules.animateur.seances.add-resource', seance.id), {
            onSuccess: () => {
                resetRes();
                setShowAddModal(false);
            },
        });
    };

    const [showAddModal, setShowAddModal] = useState(false);
    const [showQcmModal, setShowQcmModal] = useState(false);
    const [activeTab, setActiveTab] = useState('contenu');
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
    const [editResTarget, setEditResTarget] = useState<any | null>(null); // ressource à éditer
    const [deleteQcmId, setDeleteQcmId] = useState<number | null>(null);
    const [editingQcmId, setEditingQcmId] = useState<number | null>(null);
    const [editingQcmTitle, setEditingQcmTitle] = useState('');

    const startEditingQcm = (qcm: any) => {
        setEditingQcmId(qcm.id);
        setEditingQcmTitle(qcm.titre);
    };

    const handleUpdateQcmTitle = (qcm: any) => {
        if (!editingQcmTitle.trim() || editingQcmTitle === qcm.titre) {
            setEditingQcmId(null);
            return;
        }

        router.put(route('modules.animateur.qcms.update', qcm.id), {
            titre: editingQcmTitle,
            est_publie: qcm.est_publie
        }, {
            preserveScroll: true,
            onSuccess: () => setEditingQcmId(null)
        });
    };

    const openEditRes = (res: any) => {
        setEditResTarget(res);
        setEditResData('titre', res.titre);
        setEditResData('type', res.type);
        setEditResData('url', res.type === 'link' ? res.path : '');
    };

    const handleUpdateResource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editResTarget) return;
        putRes(route('modules.animateur.ressources.update', editResTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditResTarget(null);
                resetEditRes();
            },
        });
    };

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

                {/* Tabs Navigation */}
                <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200 hide-scrollbar">
                    <button 
                        onClick={() => setActiveTab('contenu')}
                        className={`px-6 py-4 rounded-t-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'contenu' ? 'bg-slate-900 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                        📝 Contenu Pédagogique
                    </button>
                    <button 
                        onClick={() => setActiveTab('documents')}
                        className={`px-6 py-4 rounded-t-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'documents' ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                        📁 Documents & Liens
                    </button>
                    <button 
                        onClick={() => setActiveTab('evaluations')}
                        className={`px-6 py-4 rounded-t-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'evaluations' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                        ✅ Évaluations (QCM)
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-b-[2rem] rounded-tr-[2rem] p-8 border border-slate-100 shadow-sm min-h-[500px]">
                    
                    {/* TAB: CONTENU */}
                    {activeTab === 'contenu' && (
                        <div className="animate-in fade-in duration-300">
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
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:14px; line-height:1.6 }',
                                        skin: 'oxide',
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
                    )}

                    {/* TAB: DOCUMENTS */}
                    {activeTab === 'documents' && (
                        <div className="animate-in fade-in duration-300 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Documents & Liens</h3>
                                <button 
                                    onClick={() => setShowAddModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all text-[10px] font-black uppercase tracking-widest shadow-md"
                                >
                                    + Ajouter
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {seance.ressources.length > 0 ? seance.ressources.map((res) => (
                                    <div key={res.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                                        <div className="flex items-center gap-4 overflow-hidden flex-1">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm overflow-hidden shrink-0 ${res.type === 'file' ? 'bg-white text-blue-600 border border-slate-100' : 'bg-slate-900 text-white'}`}>
                                                {res.type === 'file' ? (
                                                    ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(res.extension?.toLowerCase()) ? (
                                                        <img src={res.url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[10px] font-black uppercase">{res.extension}</span>
                                                    )
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                )}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-black text-slate-900 truncate">{res.titre}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                    {res.type === 'file' ? `${res.extension} · ${(res.size / 1024).toFixed(0)} Ko` : 'Lien externe'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-slate-100"
                                                title="Ouvrir / Télécharger"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => openEditRes(res)}
                                                className="p-2.5 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100"
                                                title="Modifier"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(res.id)}
                                                className="p-2.5 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100"
                                                title="Supprimer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Aucun document ou lien pour le moment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB: EVALUATIONS */}
                    {activeTab === 'evaluations' && (
                        <div className="animate-in fade-in duration-300 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Évaluations (QCM)</h3>
                                <button 
                                    onClick={() => setShowQcmModal(true)}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md"
                                >
                                    + Créer un QCM
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {seance.qcms && seance.qcms.length > 0 ? seance.qcms.map((qcm) => (
                                    <div key={qcm.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between group hover:border-emerald-200 hover:shadow-md transition-all">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 border border-slate-100 shadow-sm shrink-0">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {editingQcmId === qcm.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text" 
                                                            autoFocus
                                                            className="w-full text-sm font-black text-slate-900 border-2 border-emerald-500 rounded-lg px-2 py-1 focus:ring-0 focus:outline-none"
                                                            value={editingQcmTitle}
                                                            onChange={(e) => setEditingQcmTitle(e.target.value)}
                                                            onBlur={() => handleUpdateQcmTitle(qcm)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleUpdateQcmTitle(qcm);
                                                                } else if (e.key === 'Escape') {
                                                                    setEditingQcmId(null);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start justify-between gap-2 group/title">
                                                        <p className="text-sm font-black text-slate-900 break-words cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => startEditingQcm(qcm)}>
                                                            {qcm.titre}
                                                        </p>
                                                        <button 
                                                            onClick={() => startEditingQcm(qcm)}
                                                            className="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-emerald-600 transition-all"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                    </div>
                                                )}
                                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 ${qcm.est_publie ? 'text-emerald-600' : 'text-amber-500'}">
                                                    {qcm.est_publie ? '🟢 Publié' : '🟠 Brouillon'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* 3 icones d'action */}
                                        <div className="flex items-center gap-2 pt-4 border-t border-slate-200/60">
                                            <Link
                                                href={route('modules.animateur.qcms.edit', qcm.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-100"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Éditer
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteQcmId(qcm.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all shadow-sm border border-slate-100"
                                                title="Supprimer le QCM"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Aucune évaluation programmée</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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

            {/* Add Resource Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Ajouter une ressource</h2>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre de la ressource</label>
                                <input
                                    type="text"
                                    className={`w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 ${clientErrors.titre ? 'ring-2 ring-red-400 bg-red-50' : 'focus:ring-blue-500'}`}
                                    value={resData.titre}
                                    onChange={e => { setResData('titre', e.target.value); setClientErrors(p => ({...p, titre: ''})); }}
                                />
                                {clientErrors.titre && <p className="text-xs font-bold text-red-500 mt-1">{clientErrors.titre}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Type</label>
                                <select
                                    className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                    value={resData.type}
                                    onChange={e => setResData('type', e.target.value)}
                                >
                                    <option value="file">Fichier (PDF, PPTX, Docx, Image)</option>
                                    <option value="link">Lien Externe (URL)</option>
                                </select>
                            </div>

                            {resData.type === 'file' ? (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Fichier (Max 5 Mo)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.jpg,.jpeg,.png"
                                        className={`w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${clientErrors.file ? 'ring-2 ring-red-400 rounded-xl' : ''}`}
                                        onChange={e => { setResData('file', e.target.files?.[0] || null); setClientErrors(p => ({...p, file: ''})); }}
                                    />
                                    {clientErrors.file && <p className="text-xs font-bold text-red-500 mt-1">{clientErrors.file}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lien URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className={`w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 ${clientErrors.url ? 'ring-2 ring-red-400 bg-red-50' : 'focus:ring-blue-500'}`}
                                        value={resData.url}
                                        onChange={e => { setResData('url', e.target.value); setClientErrors(p => ({...p, url: ''})); }}
                                    />
                                    {clientErrors.url && <p className="text-xs font-bold text-red-500 mt-1">{clientErrors.url}</p>}
                                </div>
                            )}

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); setClientErrors({}); }}
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
            {/* === MODAL : ÉDITION RESSOURCE === */}
            {editResTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Modifier la ressource</h2>
                        </div>
                        <form onSubmit={handleUpdateResource} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                    value={editResData.titre}
                                    onChange={e => setEditResData('titre', e.target.value)}
                                />
                            </div>
                            {editResTarget.type === 'link' && (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lien URL</label>
                                    <input
                                        type="url"
                                        required
                                        className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500"
                                        value={editResData.url}
                                        onChange={e => setEditResData('url', e.target.value)}
                                    />
                                </div>
                            )}
                            {editResTarget.type === 'file' && (
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fichier actuel</p>
                                    <p className="text-xs font-bold text-slate-600">{editResTarget.extension?.toUpperCase()} · {editResTarget.size ? `${(editResTarget.size / 1024).toFixed(0)} Ko` : ''}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Pour remplacer le fichier, supprimez puis recréez la ressource.</p>
                                </div>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setEditResTarget(null); resetEditRes(); }}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={editResProcessing}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {editResProcessing ? 'Enregistrement...' : '✓ Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ConfirmDialog : suppression QCM */}
            <ConfirmDialog
                isOpen={deleteQcmId !== null}
                title="Supprimer ce QCM ?"
                message="Toutes les questions et réponses associées seront définitivement perdues."
                confirmLabel="Oui, supprimer"
                isDanger={true}
                onConfirm={() => {
                    if (deleteQcmId) {
                        router.delete(route('modules.animateur.qcms.destroy', deleteQcmId), {
                            preserveScroll: true,
                            onSuccess: () => setDeleteQcmId(null),
                        });
                    }
                }}
                onCancel={() => setDeleteQcmId(null)}
            />

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                title="Supprimer cette ressource ?"
                message="Ce fichier ou lien sera définitivement supprimé de la séance."
                confirmLabel="Oui, supprimer"
                isDanger={true}
                onConfirm={() => {
                    if (deleteTarget) {
                        router.delete(route('modules.animateur.ressources.delete', deleteTarget), {
                            preserveScroll: true,
                            onSuccess: () => setDeleteTarget(null),
                        });
                    }
                }}
                onCancel={() => setDeleteTarget(null)}
            />
        </AuthenticatedLayout>
    );
}
