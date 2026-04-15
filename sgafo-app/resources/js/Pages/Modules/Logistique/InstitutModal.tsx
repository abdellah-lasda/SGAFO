import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { Institut } from '@/types/logistique';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    institut: Institut | null;
}

export default function InstitutModal({ isOpen, onClose, institut }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        adresse: '',
        ville: '',
    });

    useEffect(() => {
        if (institut) {
            setData({
                adresse: institut.adresse || '',
                ville: institut.ville || '',
            });
        }
    }, [institut, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('modules.logistique.instituts.update', institut!.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Localisation du Site</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{institut?.nom}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <InputLabel value="Adresse" className="text-[9px] font-black text-slate-400 uppercase mb-2" />
                        <TextInput
                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-blue-500 rounded-lg text-sm font-bold"
                            value={data.adresse}
                            onChange={(e) => setData('adresse', e.target.value)}
                            required
                        />
                        <InputError message={errors.adresse} />
                    </div>
                    <div>
                        <InputLabel value="Ville" className="text-[9px] font-black text-slate-400 uppercase mb-2" />
                        <TextInput
                            className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-blue-500 rounded-lg text-sm font-bold"
                            value={data.ville}
                            onChange={(e) => setData('ville', e.target.value)}
                            required
                        />
                        <InputError message={errors.ville} />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="text-[10px] font-black uppercase text-slate-400">Annuler</button>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50"
                    >
                        Mettre à jour
                    </button>
                </div>
            </form>
        </Modal>
    );
}

import { useEffect } from 'react';
