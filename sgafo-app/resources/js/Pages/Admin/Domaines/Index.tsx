import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Modal from '@/Components/Modal';

interface Props {
    cdcs: any[];
    secteurs: { data: any[]; links: any[]; total: number; };
    metiers: { data: any[]; links: any[]; total: number; };
    filters: { search?: string };
}

export default function Index({ cdcs, secteurs, metiers, filters }: Props) {
    const [activeTab, setActiveTab] = useState<'cdc' | 'secteurs' | 'metiers'>('cdc');
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<{ id: number, type: 'cdc' | 'secteur' | 'metier', title: string } | null>(null);
    const [managingItem, setManagingItem] = useState<{ type: 'cdc' | 'secteur' | 'metier', data?: any } | null>(null);

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
        <AuthenticatedLayout header={<span className="font-bold text-slate-900 uppercase tracking-tight">Ingénierie & Spécialités</span>}>
            <Head title="Spécialités" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Navigation & Search Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-1 p-1">
                        {(['cdc', 'secteurs', 'metiers'] as const).map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {tab === 'cdc' ? 'Domaines (CDC)' : tab === 'secteurs' ? 'Secteurs' : 'Métiers'}
                            </button>
                        ))}
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
                            onClick={() => setManagingItem({ type: activeTab === 'cdc' ? 'cdc' : activeTab === 'secteurs' ? 'secteur' : 'metier' })}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            {activeTab === 'cdc' ? 'Nouveau CDC' : activeTab === 'secteurs' ? 'Nouveau Secteur' : 'Nouveau Métier'}
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {activeTab === 'cdc' && (
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Domaine</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cdcs.map(cdc => (
                                        <tr key={cdc.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 font-black text-slate-900 text-sm tracking-tight">{cdc.code}</td>
                                            <td className="px-6 py-5 text-sm font-bold text-slate-700">{cdc.nom}</td>
                                            <td className="px-8 py-5 text-right space-x-2">
                                                <button onClick={() => setManagingItem({ type: 'cdc', data: cdc })} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => setConfirmDelete({ id: cdc.id, type: 'cdc', title: cdc.nom })} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'secteurs' && (
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Domaine (CDC)</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {secteurs.data.map(sect => (
                                        <tr key={sect.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 font-black text-slate-900 text-sm tracking-tight">{sect.code}</td>
                                            <td className="px-6 py-5 text-sm font-bold text-slate-700">{sect.nom}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase border border-blue-100">
                                                    {sect.cdc?.nom}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right space-x-2">
                                                <button onClick={() => setManagingItem({ type: 'secteur', data: sect })} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => setConfirmDelete({ id: sect.id, type: 'secteur', title: sect.nom })} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'metiers' && (
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Métier</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {metiers.data.map((m: any) => (
                                        <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{m.nom}</td>
                                            <td className="px-6 py-5">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    {m.secteur?.nom}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right space-x-2">
                                                <button onClick={() => setManagingItem({ type: 'metier', data: m })} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => setConfirmDelete({ id: m.id, type: 'metier', title: m.nom })} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {activeTab !== 'cdc' && (
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
                            <Pagination links={activeTab === 'secteurs' ? secteurs.links : metiers.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Manage Modal */}
            {managingItem && (
                <ManageSpecialiteModal 
                    isOpen={!!managingItem} 
                    onClose={() => setManagingItem(null)} 
                    item={managingItem.data} 
                    type={managingItem.type} 
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

function ManageSpecialiteModal({ isOpen, onClose, item, type, cdcs, secteurs }: any) {
    const isEditing = !!item;
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nom: item?.nom || '',
        code: item?.code || '',
        description: item?.description || '',
        cdc_id: item?.cdc_id || '',
        secteur_id: item?.secteur_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const rPrefixMap: Record<string, string> = {
            cdc: 'admin.domaines.cdcs',
            secteur: 'admin.domaines.secteurs',
            metier: 'admin.domaines.metiers',
        };
        const rPrefix = rPrefixMap[type];
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
                        {isEditing ? `Modifier ${type.toUpperCase()}` : `Nouveau ${type === 'cdc' ? 'Domaine (CDC)' : type === 'secteur' ? 'Secteur' : 'Métier'}`}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">Structure Pédagogique</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom</label>
                        <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" required />
                        {errors.nom && <div className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.nom}</div>}
                    </div>
                    
                    {type !== 'metier' && (
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Code</label>
                            <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" required />
                            {errors.code && <div className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.code}</div>}
                        </div>
                    )}

                    {type === 'cdc' && (
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" rows={3} />
                        </div>
                    )}

                    {type === 'secteur' && (
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Domaine (CDC)</label>
                            <select value={data.cdc_id} onChange={e => setData('cdc_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" required>
                                <option value="">Choisir...</option>
                                {cdcs.map((c: any) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                            </select>
                        </div>
                    )}

                    {type === 'metier' && (
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secteur</label>
                            <select value={data.secteur_id} onChange={e => setData('secteur_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-500 focus:bg-white transition-all outline-none" required>
                                <option value="">Choisir...</option>
                                {secteurs.map((s: any) => <option key={s.id} value={s.id}>{s.nom}</option>)}
                            </select>
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
