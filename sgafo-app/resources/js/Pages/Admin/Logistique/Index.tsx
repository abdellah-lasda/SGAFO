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
    const [managingItem, setManagingItem] = useState<{ type: 'site' | 'hotel', data?: any } | null>(null);

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
        <AuthenticatedLayout header={<span className="font-bold text-slate-900 uppercase tracking-tight">Logistique & Infrastructures</span>}>
            <Head title="Logistique" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Stats / Overview Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sites de formation</p>
                            <p className="text-3xl font-black text-slate-900 leading-none mt-1">{sites.total}</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hébergements (Hôtels)</p>
                            <p className="text-3xl font-black text-slate-900 leading-none mt-1">{hotels.total}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation & Search */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-1 p-1">
                        <button 
                            onClick={() => setActiveTab('sites')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sites' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            Sites de Formation
                        </button>
                        <button 
                            onClick={() => setActiveTab('hotels')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'hotels' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            Hébergements (Hôtels)
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative w-full md:w-64 group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                        
                        <button 
                            onClick={() => setManagingItem({ type: activeTab === 'sites' ? 'site' : 'hotel' })}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            {activeTab === 'sites' ? 'Nouveau Site' : 'Nouvel Hôtel'}
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {activeTab === 'sites' ? (
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Site</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville & Région</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacité</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sites.data.map(site => (
                                        <tr key={site.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{site.nom}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: #{site.id}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-xs font-bold text-slate-700">{site.ville}</div>
                                                <div className="text-[9px] font-black text-blue-400 uppercase mt-1 tracking-wider">{site.region?.nom}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase border border-slate-200">
                                                    {site.capacite} PLACES
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right space-x-2">
                                                <button onClick={() => setManagingItem({ type: 'site', data: site })} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => setConfirmDelete({ id: site.id, type: 'site', title: site.nom })} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hôtel</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville & Région</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarif</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {hotels.data.map(hotel => (
                                        <tr key={hotel.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">{hotel.nom}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Hébergement Certifié</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-xs font-bold text-slate-700">{hotel.ville}</div>
                                                <div className="text-[9px] font-black text-amber-500 uppercase mt-1 tracking-wider">{hotel.region?.nom}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase border border-amber-100">
                                                    {hotel.prix_nuitee} MAD / NUIT
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right space-x-2">
                                                <button onClick={() => setManagingItem({ type: 'hotel', data: hotel })} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => setConfirmDelete({ id: hotel.id, type: 'hotel', title: hotel.nom })} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {/* Pagination */}
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
                        <Pagination links={activeTab === 'sites' ? sites.links : hotels.links} />
                    </div>
                </div>
            </div>

            {/* Manage Modal */}
            {managingItem && (
                <ManageLogistiqueModal 
                    isOpen={!!managingItem} 
                    onClose={() => setManagingItem(null)} 
                    item={managingItem.data} 
                    type={managingItem.type} 
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

function ManageLogistiqueModal({ isOpen, onClose, item, type, regions }: any) {
    const isEditing = !!item;
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nom: item?.nom || '',
        ville: item?.ville || '',
        adresse: item?.adresse || '',
        capacite: item?.capacite || 0,
        prix_nuitee: item?.prix_nuitee || 0,
        region_id: item?.region_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const rPrefix = type === 'site' ? 'admin.logistique.sites' : 'admin.logistique.hotels';
        const rName = isEditing ? `${rPrefix}.update` : `${rPrefix}.store`;
        
        if (isEditing) {
            patch(route(rName, item.id), { onSuccess: () => onClose() });
        } else {
            post(route(rName), { 
                onSuccess: () => {
                    reset();
                    onClose();
                } 
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={submit} className="p-8 space-y-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {isEditing ? `Modifier ${type === 'site' ? 'le site' : "l'hôtel"}` : `Nouveau ${type === 'site' ? 'Site' : 'Hôtel'}`}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                        {isEditing ? `ID Unique: #${item.id}` : "Enregistrement d'une nouvelle ressource"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom</label>
                        <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" required />
                        {errors.nom && <div className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.nom}</div>}
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ville</label>
                        <input type="text" value={data.ville} onChange={e => setData('ville', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Région</label>
                        <select value={data.region_id} onChange={e => setData('region_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" required>
                            <option value="">Sélectionner...</option>
                            {regions.map((r: any) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                        </select>
                    </div>
                    {type === 'site' ? (
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capacité d'accueil</label>
                            <input type="number" value={data.capacite} onChange={e => setData('capacite', parseInt(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" />
                        </div>
                    ) : (
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tarif Nuitée (MAD)</label>
                            <input type="number" value={data.prix_nuitee} onChange={e => setData('prix_nuitee', parseFloat(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Annuler</button>
                    <button type="submit" disabled={processing} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 disabled:opacity-50 transition-all active:scale-95">
                        {isEditing ? 'Mettre à jour' : 'Créer'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
