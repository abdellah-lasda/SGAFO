import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { validateFile, validateUrl, validateRequiredString } from '@/utils/validators';

interface Props extends PageProps {
    plan: any;
}

export default function FormationDetails({ plan }: Props) {
    const [activeTab, setActiveTab] = useState<'aperçu' | 'planning' | 'documents' | 'qcm'>('aperçu');

    // States for Documents
    const [showAddModal, setShowAddModal] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
    const [editResTarget, setEditResTarget] = useState<any | null>(null);

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

    const handleAddResource = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

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
        postRes(route('modules.animateur.formations.ressources.store', plan.id), {
            preserveScroll: true,
            onSuccess: () => {
                resetRes();
                setShowAddModal(false);
            },
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
        putRes(route('modules.animateur.formations.ressources.update', editResTarget.id), {
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
                <span className="font-bold text-slate-900">{plan.titre}</span>
            </div>
        }>
            <Head title={plan.titre} />

            <div className="max-w-7xl mx-auto pb-20">
                {/* Tabs Navigation */}
                <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                    {[
                        { id: 'aperçu', label: '📊 Aperçu', color: 'blue' },
                        { id: 'planning', label: '📅 Planning', color: 'indigo' },
                        { id: 'documents', label: '📁 Documents', color: 'emerald' },
                        { id: 'qcm', label: '✍️ QCM & Évals', color: 'purple' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative min-w-max ${
                                activeTab === tab.id 
                                ? `text-slate-900` 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'aperçu' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Objectifs de la formation</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                                        {plan.entite?.objectifs || "Aucun objectif spécifique défini."}
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Thèmes abordés</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {plan.themes.map((theme: any) => (
                                            <div key={theme.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                                                <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">{theme.nom}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{theme.code}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Participants</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">Total inscrits</span>
                                            <span className="text-2xl font-black text-blue-400">{plan.participants?.length || 0}</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex -space-x-2 overflow-hidden mb-4">
                                                {plan.participants?.slice(0, 5).map((user: any) => (
                                                    <div key={user.id} className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase" title={user.nom}>
                                                        {user.nom.charAt(0)}
                                                    </div>
                                                ))}
                                                {plan.participants?.length > 5 && (
                                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-black uppercase">
                                                        +{plan.participants.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                Voir la liste complète
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Prochaine Séance</h3>
                                    {plan.seances.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                                                    <span className="text-[8px] font-black uppercase">{format(new Date(plan.seances[0].date), 'MMM', { locale: fr })}</span>
                                                    <span className="text-lg font-black">{format(new Date(plan.seances[0].date), 'dd')}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{plan.seances[0].site?.nom || 'Visio'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">08:30 - 12:30</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 font-medium italic">Aucune séance planifiée.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'planning' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thèmes</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {plan.seances.map((seance: any) => (
                                        <tr key={seance.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-slate-900">{format(new Date(seance.date), 'dd MMMM yyyy', { locale: fr })}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{seance.debut.substring(0, 5)} - {seance.fin.substring(0, 5)}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-600">
                                                {seance.site?.nom || 'Visio'}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2"> 
                                                    {seance.themes.map((t: any) => (
                                                        <span key={t.id} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">
                                                            {t.nom}
                                                        </span>
                                                        
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                                    seance.statut === 'terminée' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {seance.statut}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link 
                                                        href={route('modules.animateur.seances.preparation', seance.id)}
                                                        className="px-4 py-2 bg-white text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all border border-slate-200"
                                                        title="Préparer le contenu et les documents"
                                                    >
                                                        ✍️ Préparer
                                                    </Link>
                                                    <Link 
                                                        href={route('modules.animateur.seances.attendance', seance.id)}
                                                        className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all shadow-sm"
                                                    >
                                                        Appel
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="animate-in fade-in duration-300 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Documents & Liens Globaux</h3>
                                <button 
                                    onClick={() => setShowAddModal(true)}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all text-[10px] font-black uppercase tracking-widest shadow-md"
                                >
                                    + Ajouter
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {plan.ressources && plan.ressources.length > 0 ? plan.ressources.map((res: any) => (
                                    <div key={res.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                                        <div className="flex items-center gap-4 overflow-hidden flex-1">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm overflow-hidden shrink-0 ${res.type === 'file' ? 'bg-white text-emerald-600 border border-slate-100' : 'bg-slate-900 text-white'}`}>
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
                                                className="p-2.5 bg-white text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm border border-slate-100"
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
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Aucun document global pour cette formation</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'qcm' && (
                        <div className="bg-white p-12 rounded-[3rem] border border-dashed border-slate-200 text-center">
                            <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Évaluations & QCM</h3>
                            <p className="text-slate-500 font-medium mt-2 mb-8">Créez des questionnaires pour évaluer le niveau des participants.</p>
                            <button className="px-8 py-4 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20 active:scale-95">
                                Créer un nouveau QCM
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal : Ajouter Ressource */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Ajouter un document</h2>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl mb-6">
                                <button
                                    type="button"
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${resData.type === 'file' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    onClick={() => setResData('type', 'file')}
                                >
                                    Fichier
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${resData.type === 'link' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    onClick={() => setResData('type', 'link')}
                                >
                                    Lien Web
                                </button>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre</label>
                                <input 
                                    type="text"
                                    className={`w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 ${clientErrors.titre ? 'ring-2 ring-red-400' : ''}`}
                                    value={resData.titre}
                                    onChange={e => { setResData('titre', e.target.value); setClientErrors(prev => ({...prev, titre: ''})); }}
                                />
                                {clientErrors.titre && <p className="text-[10px] text-red-500 font-bold mt-1">{clientErrors.titre}</p>}
                            </div>

                            {resData.type === 'file' ? (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Fichier (Max 5Mo)</label>
                                    <input 
                                        type="file"
                                        className={`w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all ${clientErrors.file ? 'ring-2 ring-red-400 rounded-xl' : ''}`}
                                        onChange={e => { setResData('file', e.target.files ? e.target.files[0] : null); setClientErrors(prev => ({...prev, file: ''})); }}
                                    />
                                    {clientErrors.file && <p className="text-[10px] text-red-500 font-bold mt-1">{clientErrors.file}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL</label>
                                    <input 
                                        type="url"
                                        placeholder="https://"
                                        className={`w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 ${clientErrors.url ? 'ring-2 ring-red-400' : ''}`}
                                        value={resData.url}
                                        onChange={e => { setResData('url', e.target.value); setClientErrors(prev => ({...prev, url: ''})); }}
                                    />
                                    {clientErrors.url && <p className="text-[10px] text-red-500 font-bold mt-1">{clientErrors.url}</p>}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => { setShowAddModal(false); resetRes(); setClientErrors({}); }}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    disabled={resProcessing}
                                    className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                >
                                    {resProcessing ? 'Ajout...' : '✓ Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal : Modifier Ressource */}
            {editResTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Modifier la ressource</h2>
                        <form onSubmit={handleUpdateResource} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
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
                                        className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                                        value={editResData.url}
                                        onChange={e => setEditResData('url', e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setEditResTarget(null); resetEditRes(); }}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={editResProcessing}
                                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
                                >
                                    {editResProcessing ? 'Enregistrement...' : '✓ Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                title="Supprimer cette ressource ?"
                message="Ce document global sera supprimé pour tous les participants."
                confirmLabel="Oui, supprimer"
                isDanger={true}
                onConfirm={() => {
                    if (deleteTarget) {
                        router.delete(route('modules.animateur.formations.ressources.destroy', deleteTarget), {
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
