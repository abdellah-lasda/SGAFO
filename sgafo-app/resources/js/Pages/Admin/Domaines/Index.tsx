import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Modal from '@/Components/Modal';

interface Props {
    cdcs: any[];
    secteurs: { data: any[]; links: any[]; total: number; };
    filters: { search?: string };
}

export default function Index({ cdcs, secteurs, filters }: Props) {
    const [activeTab, setActiveTab] = useState<'cdc' | 'secteurs' | 'metiers'>('cdc');
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<{ id: number, type: 'cdc' | 'secteur' | 'metier', title: string } | null>(null);
    const [editingItem, setEditingItem] = useState<{ type: 'cdc' | 'secteur' | 'metier', data: any } | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.domaines.index'), { search, tab: activeTab }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        const routes: any = {
            cdc: 'admin.domaines.cdcs.destroy',
            secteur: 'admin.domaines.secteurs.destroy',
            metier: 'admin.domaines.metiers.destroy',
        };
        router.delete(route(routes[confirmDelete.type], confirmDelete.id), { onSuccess: () => setConfirmDelete(null) });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Spécialités</h2>}>
            <Head title="Spécialités" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-200 bg-white px-4 rounded-t-lg shadow-sm">
                        {(['cdc', 'secteurs', 'metiers'] as const).map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                                    activeTab === tab ? 'border-ofppt-600 text-ofppt-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab === 'cdc' ? 'Domaines (CDC)' : tab === 'secteurs' ? 'Secteurs' : 'Métiers'}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-b-lg border border-gray-200">
                        {/* Search Bar */}
                        <div className="p-6 border-b border-gray-200">
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

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            {activeTab === 'cdc' && (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom du Domaine</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {cdcs.map(cdc => (
                                            <tr key={cdc.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{cdc.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cdc.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <button onClick={() => setEditingItem({ type: 'cdc', data: cdc })} className="text-ofppt-600 hover:text-ofppt-900 font-bold uppercase text-[10px]">Modifier</button>
                                                    <button onClick={() => setConfirmDelete({ id: cdc.id, type: 'cdc', title: cdc.nom })} className="text-red-600 hover:text-red-900 font-bold uppercase text-[10px]">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'secteurs' && (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom du Secteur</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domaine</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {secteurs.data.map(sect => (
                                            <tr key={sect.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{sect.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sect.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sect.cdc?.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <button onClick={() => setEditingItem({ type: 'secteur', data: sect })} className="text-ofppt-600 hover:text-ofppt-900 font-bold uppercase text-[10px]">Modifier</button>
                                                    <button onClick={() => setConfirmDelete({ id: sect.id, type: 'secteur', title: sect.nom })} className="text-red-600 hover:text-red-900 font-bold uppercase text-[10px]">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'metiers' && (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom du Métier</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Secteur</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {secteurs.data.flatMap(s => s.metiers).map((m: any) => m && (
                                            <tr key={m.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{m.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {secteurs.data.find(s => s.id === m.secteur_id)?.nom}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <button onClick={() => setEditingItem({ type: 'metier', data: m })} className="text-ofppt-600 hover:text-ofppt-900 font-bold uppercase text-[10px]">Modifier</button>
                                                    <button onClick={() => setConfirmDelete({ id: m.id, type: 'metier', title: m.nom })} className="text-red-600 hover:text-red-900 font-bold uppercase text-[10px]">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination for secteurs/metiers */}
                        {activeTab !== 'cdc' && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <Pagination links={secteurs.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <EditSpecialiteModal 
                    isOpen={!!editingItem} 
                    onClose={() => setEditingItem(null)} 
                    item={editingItem.data} 
                    type={editingItem.type} 
                    cdcs={cdcs}
                    secteurs={secteurs.data}
                />
            )}

            <ConfirmDialog 
                isOpen={!!confirmDelete}
                title="Confirmer la suppression"
                message={`Voulez-vous supprimer "${confirmDelete?.title}" ?`}
                confirmLabel="Supprimer"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}

function EditSpecialiteModal({ isOpen, onClose, item, type, cdcs, secteurs }: any) {
    const { data, setData, patch, processing, errors } = useForm({
        nom: item.nom || '',
        code: item.code || '',
        description: item.description || '',
        cdc_id: item.cdc_id || '',
        secteur_id: item.secteur_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeNameMap: Record<string, string> = {
            cdc: 'admin.domaines.cdcs.update',
            secteur: 'admin.domaines.secteurs.update',
            metier: 'admin.domaines.metiers.update',
        };
        const routeName = routeNameMap[type];
        patch(route(routeName, item.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Modifier {type.toUpperCase()}</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        {errors.nom && <div className="text-red-500 text-xs mt-1">{errors.nom}</div>}
                    </div>
                    
                    {type !== 'metier' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Code</label>
                            <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.code && <div className="text-red-500 text-xs mt-1">{errors.code}</div>}
                        </div>
                    )}

                    {type === 'cdc' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows={3} />
                        </div>
                    )}

                    {type === 'secteur' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Domaine (CDC)</label>
                            <select value={data.cdc_id} onChange={e => setData('cdc_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="">Choisir...</option>
                                {cdcs.map((c: any) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                            </select>
                        </div>
                    )}

                    {type === 'metier' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Secteur</label>
                            <select value={data.secteur_id} onChange={e => setData('secteur_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="">Choisir...</option>
                                {secteurs.map((s: any) => <option key={s.id} value={s.id}>{s.nom}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 uppercase font-black tracking-widest">Annuler</button>
                    <button type="submit" disabled={processing} className="px-6 py-2 bg-ofppt-600 text-white rounded-md font-black text-[10px] uppercase tracking-widest shadow-lg">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
}
