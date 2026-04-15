import { useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { Hotel } from '@/types/logistique';
import { Region } from '@/types/entite';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    hotel: Hotel | null;
    regions: Region[];
}

export default function HotelModal({ isOpen, onClose, hotel, regions }: Props) {
    const isEdit = !!hotel;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nom: '',
        ville: '',
        adresse: '',
        telephone: '',
        region_id: '',
        prix_nuitee: '0',
    });

    useEffect(() => {
        if (hotel) {
            setData({
                nom: hotel.nom,
                ville: hotel.ville,
                adresse: hotel.adresse || '',
                telephone: hotel.telephone || '',
                region_id: hotel.region_id.toString(),
                prix_nuitee: hotel.prix_nuitee.toString(),
            });
        } else {
            reset();
        }
    }, [hotel, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? route('modules.logistique.hotels.update', hotel!.id) : route('modules.logistique.hotels.store');

        action(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl overflow-hidden flex flex-col h-[85vh]">
                
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {isEdit ? 'Modifier l\'Hôtel' : 'Ajouter un Hébergement'}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Référentiel Logistique
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    <div>
                        <InputLabel value="Nom de site" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Téléphone" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                            <TextInput
                                className="block w-full bg-white border-slate-200 focus:ring-blue-500 rounded-lg text-sm font-bold"
                                value={data.telephone}
                                onChange={(e) => setData('telephone', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel value="Prix Nuitée (HT)" className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-1" />
                            <div className="relative">
                                <TextInput
                                    type="number"
                                    className="block w-full bg-white border-slate-200 focus:ring-blue-500 rounded-lg text-sm font-black pl-8"
                                    value={data.prix_nuitee}
                                    onChange={(e) => setData('prix_nuitee', e.target.value)}
                                    required
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">DH</span>
                            </div>
                            <InputError message={errors.prix_nuitee} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
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
                        {isEdit ? 'Enregistrer les modifications' : 'Confirmer l\'ajout'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
