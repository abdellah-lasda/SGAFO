import { useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { SiteFormation, Institut } from '@/types/logistique';
import { Region } from '@/types/entite';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    site: SiteFormation | null;
    regions: Region[];
    instituts: Institut[];
}

export default function SiteModal({ isOpen, onClose, site, regions, instituts }: Props) {
    const isEdit = !!site;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nom: '',
        ville: '',
        adresse: '',
        capacite: '0',
        region_id: '',
    });

    useEffect(() => {
        if (site) {
            setData({
                nom: site.nom,
                ville: site.ville || '',
                adresse: site.adresse || '',
                capacite: site.capacite.toString(),
                region_id: site.region_id.toString(),
            });
        } else {
            reset();
        }
    }, [site, isOpen]);

    const handleAutoFill = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const instId = e.target.value;
        if (!instId) return;

        const selectedInst = instituts.find(i => i.id.toString() === instId);
        if (selectedInst) {
            setData({
                ...data,
                nom: selectedInst.nom,
                ville: selectedInst.ville || '',
                adresse: selectedInst.adresse || '',
                region_id: selectedInst.region_id.toString(),
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? route('modules.logistique.sites.update', site!.id) : route('modules.logistique.sites.store');

        action(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {isEdit ? 'Modifier le Site' : 'Ajouter un Site de Formation'}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Gestion des Infrastructures
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {!isEdit && (
                    <div className="px-8 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center gap-4">
                        <div className="flex-1">
                            <InputLabel value="Aide à la saisie (Référentiel Instituts)" className="text-[9px] font-black text-blue-600 uppercase mb-1.5 ml-1" />
                            <select
                                onChange={handleAutoFill}
                                className="block w-full bg-white border-blue-200 focus:ring-blue-500 rounded-lg text-xs font-bold text-slate-600 h-9"
                                defaultValue=""
                            >
                                <option value="">--- Sélectionner un Institut pour pré-remplir ---</option>
                                {instituts.map((inst) => (
                                    <option key={inst.id} value={inst.id}>{inst.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Form Body */}
                <div className="p-8 space-y-6">
                    <div>
                        <InputLabel value="Nom du site" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                        <TextInput
                            className="block w-full text-base font-bold bg-white border-slate-200 focus:ring-blue-500 rounded-lg"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            required
                        />
                        <InputError message={errors.nom} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Ville" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                            <TextInput
                                className="block w-full bg-white border-slate-200 focus:ring-blue-500 rounded-lg text-sm font-bold"
                                value={data.ville}
                                onChange={(e) => setData('ville', e.target.value)}
                                required
                            />
                            <InputError message={errors.ville} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Région" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                            <select
                                className="block w-full bg-white border-slate-200 focus:ring-blue-500 rounded-lg text-sm font-bold"
                                value={data.region_id}
                                onChange={(e) => setData('region_id', e.target.value)}
                                required
                            >
                                <option value="">Choisir...</option>
                                {regions.map((r) => (
                                    <option key={r.id} value={r.id}>{r.nom}</option>
                                ))}
                            </select>
                            <InputError message={errors.region_id} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Adresse complète" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                        <TextInput
                            className="block w-full bg-white border-slate-200 focus:ring-blue-500 rounded-lg text-sm font-medium"
                            value={data.adresse}
                            onChange={(e) => setData('adresse', e.target.value)}
                        />
                        <InputError message={errors.adresse} className="mt-1" />
                    </div>

                    <div className="w-1/2">
                        <InputLabel value="Capacité d'accueil (Sessions)" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                        <div className="relative">
                            <TextInput
                                type="number"
                                className="block w-full bg-white border-slate-200 focus:ring-blue-500 rounded-lg text-sm font-black pl-4"
                                value={data.capacite}
                                onChange={(e) => setData('capacite', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.capacite} className="mt-1" />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-200 bg-white flex justify-end gap-3">
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
                        {isEdit ? 'Enregistrer les modifications' : 'Confirmer l\'ajout'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
