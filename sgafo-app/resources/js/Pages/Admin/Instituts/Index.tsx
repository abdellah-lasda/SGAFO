import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Modal from '@/Components/Modal';

interface Props {
    instituts: { data: any[]; links: any[]; total: number; };
    regions: any[];
    filters: { search?: string };
}

export default function Index({ instituts, regions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
    const [editingInstitut, setEditingInstitut] = useState<any | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.instituts.index'), { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        router.delete(route('admin.instituts.destroy', confirmDelete.id), { onSuccess: () => setConfirmDelete(null) });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Établissements</h2>}>
            <Head title="Établissements" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        
                        <div className="p-6 bg-white border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Instituts et Centres</h3>
                                <p className="text-sm text-gray-500">Gérez les informations des établissements.</p>
                            </div>
                            <form onSubmit={handleSearch} className="relative w-full md:w-80">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher..."
                                    className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-md text-sm shadow-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Région</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {instituts.data.map(inst => (
                                        <tr key={inst.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{inst.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{inst.nom}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase border border-blue-100">{inst.region?.nom}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inst.ville}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <button onClick={() => setEditingInstitut(inst)} className="text-ofppt-600 hover:text-ofppt-900">Modifier</button>
                                                <button onClick={() => setConfirmDelete(inst)} className="text-red-600 hover:text-red-900">Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <Pagination links={instituts.links} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingInstitut && (
                <EditInstitutModal 
                    isOpen={!!editingInstitut} 
                    onClose={() => setEditingInstitut(null)} 
                    institut={editingInstitut} 
                    regions={regions} 
                />
            )}

            <ConfirmDialog 
                isOpen={!!confirmDelete}
                title="Supprimer l'établissement ?"
                message={`Voulez-vous supprimer définitivement "${confirmDelete?.nom}" ?`}
                confirmLabel="Supprimer"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}

function EditInstitutModal({ isOpen, onClose, institut, regions }: any) {
    const { data, setData, put, processing, errors } = useForm({
        nom: institut.nom || '',
        code: institut.code || '',
        adresse: institut.adresse || '',
        ville: institut.ville || '',
        region_id: institut.region_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.instituts.update', institut.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Modifier l'établissement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Nom de l'institut</label>
                        <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        {errors.nom && <div className="text-red-500 text-xs mt-1">{errors.nom}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Code</label>
                        <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        {errors.code && <div className="text-red-500 text-xs mt-1">{errors.code}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ville</label>
                        <input type="text" value={data.ville} onChange={e => setData('ville', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Région</label>
                        <select value={data.region_id} onChange={e => setData('region_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option value="">Sélectionner une région...</option>
                            {regions.map((r: any) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                        <input type="text" value={data.adresse} onChange={e => setData('adresse', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-bold uppercase tracking-widest">Annuler</button>
                    <button type="submit" disabled={processing} className="px-6 py-2 bg-ofppt-600 text-white rounded-md font-bold text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
}
