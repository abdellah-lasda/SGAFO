import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function CdcModal({ isOpen, onClose, cdc }: { isOpen: boolean, onClose: () => void, cdc: any }) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nom: '',
        code: '',
        description: '',
    });

    useEffect(() => {
        if (cdc) {
            setData({
                nom: cdc.nom || '',
                code: cdc.code || '',
                description: cdc.description || '',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [cdc, isOpen]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cdc) {
            console.log(data);
            put(route('admin.cdcs.update', cdc.id), { onSuccess: () => onClose() });
        } else {
            post(route('admin.cdcs.store'), { onSuccess: () => { reset(); onClose(); } });
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 mb-4 border-b pb-2">
                                    {cdc ? 'Modifier le CDC' : 'Nouveau CDC'}
                                </Dialog.Title>
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="nom" value="Nom du CDC" />
                                        <TextInput id="nom" className="mt-1 block w-full" value={data.nom} onChange={e => setData('nom', e.target.value)} required />
                                        <InputError message={errors.nom} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="code" value="Code" />
                                        <TextInput id="code" className="mt-1 block w-full" value={data.code} onChange={e => setData('code', e.target.value)} required />
                                        <InputError message={errors.code} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="description" value="Description (Optionnel)" />
                                        <TextInput id="description" className="mt-1 block w-full" value={data.description} onChange={e => setData('description', e.target.value)} />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-8 border-t border-gray-200">
                                        <button type="submit" disabled={processing} className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">
                                            {cdc ? 'Mettre à jour' : 'Créer'}
                                        </button>
                                        <button type="button" onClick={onClose} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
