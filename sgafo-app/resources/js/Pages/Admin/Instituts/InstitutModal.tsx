import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

interface InstitutModalProps {
    isOpen: boolean;
    onClose: () => void;
    institut: any | null;
    regions: any[];
}

export default function InstitutModal({ isOpen, onClose, institut, regions }: InstitutModalProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nom: '',
        code: '',
        region_id: '',
        adresse: '',
        ville: '',
    });

    useEffect(() => {
        if (institut) {
            setData({
                nom: institut.nom || '',
                code: institut.code || '',
                region_id: institut.region_id || '',
                adresse: institut.adresse || '',
                ville: institut.ville || '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [institut, isOpen]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (institut) {
            put(route('admin.instituts.update', institut.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('admin.instituts.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-2xl">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 border-b pb-4 mb-4">
                                                {institut ? 'Modifier l\'établissement' : 'Nouvel établissement'}
                                            </Dialog.Title>
                                            <form onSubmit={onSubmit} className="space-y-6">
                                                {/* Informations Générales */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-700 bg-gray-50 p-2 rounded mb-4">Informations Principales</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="col-span-2 md:col-span-1">
                                                            <InputLabel htmlFor="nom" value="Nom de l'établissement" />
                                                            <TextInput
                                                                id="nom"
                                                                type="text"
                                                                className="mt-1 block w-full"
                                                                value={data.nom}
                                                                onChange={(e) => setData('nom', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={errors.nom} className="mt-2" />
                                                        </div>
                                                        <div className="col-span-2 md:col-span-1">
                                                            <InputLabel htmlFor="code" value="Code (Optionnel)" />
                                                            <TextInput
                                                                id="code"
                                                                type="text"
                                                                className="mt-1 block w-full"
                                                                value={data.code}
                                                                onChange={(e) => setData('code', e.target.value)}
                                                            />
                                                            <InputError message={errors.code} className="mt-2" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Localisation */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-700 bg-gray-50 p-2 rounded mb-4">Localisation</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="col-span-2">
                                                            <InputLabel htmlFor="region_id" value="Région" />
                                                            <select
                                                                id="region_id"
                                                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                                                value={data.region_id}
                                                                onChange={(e) => setData('region_id', e.target.value)}
                                                            >
                                                                <option value="">Sélectionnez une région...</option>
                                                                {regions.map((region) => (
                                                                    <option key={region.id} value={region.id}>
                                                                        {region.nom}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <InputError message={errors.region_id} className="mt-2" />
                                                        </div>

                                                        <div className="col-span-2">
                                                            <InputLabel htmlFor="adresse" value="Adresse" />
                                                            <TextInput
                                                                id="adresse"
                                                                type="text"
                                                                className="mt-1 block w-full"
                                                                value={data.adresse}
                                                                onChange={(e) => setData('adresse', e.target.value)}
                                                            />
                                                            <InputError message={errors.adresse} className="mt-2" />
                                                        </div>

                                                        <div className="col-span-2 md:col-span-1">
                                                            <InputLabel htmlFor="ville" value="Ville" />
                                                            <TextInput
                                                                id="ville"
                                                                type="text"
                                                                className="mt-1 block w-full"
                                                                value={data.ville}
                                                                onChange={(e) => setData('ville', e.target.value)}
                                                            />
                                                            <InputError message={errors.ville} className="mt-2" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-8 border-t border-gray-200">
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                                                    >
                                                        {institut ? 'Mettre à jour' : 'Créer'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        onClick={onClose}
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
