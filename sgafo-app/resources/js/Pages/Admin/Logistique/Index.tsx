import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Modal from '@/Components/Modal';

interface Props {
    sites: { data: any[]; links: any[]; total: number; };
    hotels: { data: any[]; links: any[]; total: number; };
    regions: any[];
    filters: { search?: string };
}

export default function Index({ sites, hotels, regions, filters }: Props) {
    const [activeTab, setActiveTab] = useState<'sites' | 'hotels'>('sites');
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<{ id: number, type: 'site' | 'hotel', title: string } | null>(null);
    
    // Modals states
    const [editingItem, setEditingItem] = useState<{ type: 'site' | 'hotel', data: any } | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.logistique.index'), { search, tab: activeTab }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        const r = confirmDelete.type === 'site' ? 'admin.logistique.sites.destroy' : 'admin.logistique.hotels.destroy';
        router.delete(route(r, confirmDelete.id), { onSuccess: () => setConfirmDelete(null) });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion Logistique</h2>}>
            <Head title="Logistique" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-200">
                        <button 
                            onClick={() => setActiveTab('sites')}
                            className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'sites' ? 'border-b-2 border-ofppt-600 text-ofppt-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Sites de Formation
                        </button>
                        <button 
                            onClick={() => setActiveTab('hotels')}
                            className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'hotels' ? 'border-b-2 border-ofppt-600 text-ofppt-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Hébergements (Hôtels)
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        {/* Search Bar */}
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <form onSubmit={handleSearch} className="relative w-full md:w-80">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={`Rechercher un ${activeTab === 'sites' ? 'site' : 'hôtel'}...`}
                                    className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-md text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                            </form>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            {activeTab === 'sites' ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom du Site</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacité</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sites.data.map(site => (
                                            <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{site.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.ville}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.capacite} places</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <button onClick={() => setEditingItem({ type: 'site', data: site })} className="text-ofppt-600 hover:text-ofppt-900">Modifier</button>
                                                    <button onClick={() => setConfirmDelete({ id: site.id, type: 'site', title: site.nom })} className="text-red-600 hover:text-red-900">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hôtel</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarif Nuitée</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {hotels.data.map(hotel => (
                                            <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{hotel.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.ville}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.prix_nuitee} MAD</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <button onClick={() => setEditingItem({ type: 'hotel', data: hotel })} className="text-ofppt-600 hover:text-ofppt-900">Modifier</button>
                                                    <button onClick={() => setConfirmDelete({ id: hotel.id, type: 'hotel', title: hotel.nom })} className="text-red-600 hover:text-red-900">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <Pagination links={activeTab === 'sites' ? sites.links : hotels.links} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modals */}
            {editingItem && (
                <EditModal 
                    isOpen={!!editingItem} 
                    onClose={() => setEditingItem(null)} 
                    item={editingItem.data} 
                    type={editingItem.type} 
                    regions={regions} 
                />
            )}

            <ConfirmDialog 
                isOpen={!!confirmDelete}
                title="Confirmer la suppression"
                message={`Voulez-vous supprimer définitivement "${confirmDelete?.title}" ?`}
                confirmLabel="Supprimer"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}

function EditModal({ isOpen, onClose, item, type, regions }: any) {
    const { data, setData, patch, processing, errors } = useForm({
        nom: item.nom || '',
        ville: item.ville || '',
        adresse: item.adresse || '',
        capacite: item.capacite || 0,
        prix_nuitee: item.prix_nuitee || 0,
        region_id: item.region_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const r = type === 'site' ? 'admin.logistique.sites.update' : 'admin.logistique.hotels.update';
        // Note: For hotels, I might need to check if the route is correct. In web.php I defined update for site but maybe not hotel.
        // Actually I'll check web.php after this.
        patch(route(r, item.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Modifier {type === 'site' ? 'le site' : "l'hôtel"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        {errors.nom && <div className="text-red-500 text-xs mt-1">{errors.nom}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ville</label>
                        <input type="text" value={data.ville} onChange={e => setData('ville', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Région</label>
                        <select value={data.region_id} onChange={e => setData('region_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option value="">Sélectionner...</option>
                            {regions.map((r: any) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                        </select>
                    </div>
                    {type === 'site' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacité</label>
                            <input type="number" value={data.capacite} onChange={e => setData('capacite', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prix Nuitée (MAD)</label>
                            <input type="number" value={data.prix_nuitee} onChange={e => setData('prix_nuitee', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
                    <button type="submit" disabled={processing} className="px-4 py-2 bg-ofppt-600 text-white rounded-md font-bold text-sm disabled:opacity-50">Enregistrer</button>
                </div>
            </form>
        </Modal>
    );
}
