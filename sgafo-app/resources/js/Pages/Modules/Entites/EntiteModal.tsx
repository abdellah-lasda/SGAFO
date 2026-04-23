import { useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { Entite } from '@/types/entite';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    entite: Entite | null;
    secteurs: { id: number, nom: string }[];
}

export default function EntiteModal({ isOpen, onClose, entite, secteurs }: Props) {
    const isEdit = !!entite;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        titre: '',
        type: 'technique' as Entite['type'],
        mode: 'présentiel' as Entite['mode'],
        secteur_id: '',
        description: '',
        objectifs: '',
        themes: [{ titre: '', duree_heures: '', objectifs: '' }] as any[],
    });

    useEffect(() => {
        if (entite) {
            setData({
                titre: entite.titre,
                type: entite.type,
                mode: entite.mode,
                secteur_id: entite.secteur_id.toString(),
                description: entite.description || '',
                objectifs: entite.objectifs,
                themes: entite.themes.map(t => ({ 
                    id: t.id, 
                    titre: t.titre, 
                    duree_heures: t.duree_heures.toString(), 
                    objectifs: t.objectifs || '' 
                })),
            });
        } else {
            reset();
        }
    }, [entite, isOpen]);

    const addTheme = () => {
        setData('themes', [...data.themes, { titre: '', duree_heures: '', objectifs: '' }]);
    };

    const removeTheme = (index: number) => {
        const newThemes = [...data.themes];
        newThemes.splice(index, 1);
        setData('themes', newThemes);
    };

    const handleThemeChange = (index: number, field: string, value: string) => {
        const newThemes = [...data.themes];
        newThemes[index] = { ...newThemes[index], [field]: value };
        setData('themes', newThemes);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? route('modules.entites.update', entite!.id) : route('modules.entites.store');

        action(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const totalHours = data.themes.reduce((acc, t) => acc + (parseFloat(t.duree_heures) || 0), 0);

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="6xl">
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl overflow-hidden flex flex-col h-[85vh]">
                
                {/* Header Section */}
                <div className="px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {isEdit ? 'Modifier la Formation' : 'Ajouter au Référentiel'}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Édition du Catalogue National
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                             <span className="text-[10px] font-black text-blue-400 uppercase">Total:</span>
                             <span className="text-sm font-black text-blue-600 tracking-tighter">{totalHours}h</span>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                    
                    {/* BLOC 1: INFOS GLOBALES */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Étape 1: Détails Généraux</span>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3">
                                <InputLabel value="Intitulé exact de la formation" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                                <TextInput
                                    className="block w-full text-base font-bold bg-slate-50 border-transparent focus:bg-white focus:ring-blue-500 rounded-lg"
                                    value={data.titre}
                                    onChange={(e) => setData('titre', e.target.value)}
                                    placeholder="Ex: Perfectionnement en Développement React"
                                    required
                                />
                                <InputError message={errors.titre} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Secteur porteur" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                                <select
                                    className="block w-full text-base font-bold bg-slate-50 border-transparent focus:bg-white focus:ring-blue-500 rounded-lg"
                                    value={data.secteur_id}
                                    onChange={(e) => setData('secteur_id', e.target.value)}
                                    required
                                >
                                    <option value="">Choisir...</option>
                                    {secteurs.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nom}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='md:col-span-2 ' >
                                <InputLabel value="Type" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                                <select
                                    className="block w-full bg-slate-50 border-transparent focus:bg-white focus:ring-blue-500 rounded-lg text-sm font-bold"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as any)}
                                >
                                    <option value="technique">Technique</option>
                                    <option value="pedagogique">Pédagogique</option>
                                    <option value="manageriale">Managériale</option>
                                    <option value="transversale">Transversale</option>
                                </select>
                            </div>
                            <div className='md:col-span-2' >
                                <InputLabel value="Mode" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                                <select
                                    className="block w-full bg-slate-50 border-transparent focus:bg-white focus:ring-blue-500 rounded-lg text-sm font-bold"
                                    value={data.mode}
                                    onChange={(e) => setData('mode', e.target.value as any)}
                                >
                                    <option value="présentiel">Présentiel</option>
                                    <option value="distance">À distance</option>
                                    <option value="hybride">Hybride</option>
                                </select>
                            </div>
                            <div className="md:col-span-4">
                                <InputLabel value="Description rapide" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                                <textarea
                                    className="block w-full bg-slate-50 border-transparent focus:bg-white focus:ring-blue-500 rounded-lg text-sm font-medium h-12"
                                    value={data.objectifs}
                                    onChange={(e) => setData('objectifs', e.target.value)}
                                    placeholder="En quelques mots..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* BLOC 2: TABLEAU DES THÈMES */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Étape 2: Programme et Modules</span>
                            </div>
                            <button
                                type="button"
                                onClick={addTheme}
                                className="px-4 py-2 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-100 transition-all border border-blue-100"
                            >
                                + Ajouter une ligne
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-sm">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase w-12 text-center">N°</th>
                                        <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase w-1/3">Intitulé du Module</th>
                                        <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase w-24">Durée (h)</th>
                                        <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase">Objectifs Spécifiques / Contenu</th>
                                        <th className="px-4 py-3 text-right text-[9px] font-black text-slate-400 uppercase w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.themes.map((theme, index) => (
                                        <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-4 py-3 text-center align-top pt-5">
                                                <span className="text-[10px] font-black text-slate-300">{index +1}</span>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    className="w-full bg-slate-50 text-sm font-bold border-transparent focus:bg-white focus:ring-0 focus:border-b-blue-500 border-b-2 transition-all p-2 rounded-md"
                                                    value={theme.titre}
                                                    onChange={(e) => handleThemeChange(index, 'titre', e.target.value)}
                                                    placeholder="Titre du thème..."
                                                    required
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    type="number"
                                                    className="w-full bg-slate-50 text-sm font-black border-transparent focus:bg-white focus:ring-blue-500 rounded-md p-2 text-center shadow-inner"
                                                    value={theme.duree_heures}
                                                    onChange={(e) => handleThemeChange(index, 'duree_heures', e.target.value)}
                                                    required
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <textarea
                                                    className="w-full bg-slate-50/50 text-xs font-medium border-transparent focus:bg-white focus:ring-0 rounded-md p-2 h-10 italic transition-all"
                                                    value={theme.objectifs}
                                                    onChange={(e) => handleThemeChange(index, 'objectifs', e.target.value)}
                                                    placeholder="Contenu indicatif..."
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right align-top pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => removeTheme(index)}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                                    disabled={data.themes.length === 1}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-6 border-t border-slate-200 bg-white flex justify-end gap-3 sticky bottom-0 z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isEdit ? 'Mettre à jour le Référentiel' : 'Ajouter au Catalogue'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
