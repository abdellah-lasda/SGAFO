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

    function ManageInstitutModal({ isOpen, onClose, institut, regions }: any) {
        const isEditing = !!institut;
        const { data, setData, post, put, processing, errors, reset } = useForm({
            nom: institut?.nom || '',
            code: institut?.code || '',
            adresse: institut?.adresse || '',
            ville: institut?.ville || '',
            region_id: institut?.region_id || '',
        });

        const submit = (e: React.FormEvent) => {
            e.preventDefault();
            if (isEditing) {
                put(route('admin.instituts.update', institut.id), { onSuccess: () => onClose() });
            } else {
                post(route('admin.instituts.store'), { 
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
                            {isEditing ? "Modifier l'Établissement" : "Nouvel Établissement"}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                            {isEditing ? `Code Système: ${institut.code}` : "Ajout d'un nouvel institut au réseau"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom de l'institut</label>
                            <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none" required />
                            {errors.nom && <div className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.nom}</div>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Code</label>
                            <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none" required />
                            {errors.code && <div className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.code}</div>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ville</label>
                            <input type="text" value={data.ville} onChange={e => setData('ville', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Région</label>
                            <select value={data.region_id} onChange={e => setData('region_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none" required>
                                <option value="">Sélectionner une région...</option>
                                {regions.map((r: any) => <option key={r.id} value={r.id}>{r.nom}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Adresse</label>
                            <input type="text" value={data.adresse} onChange={e => setData('adresse', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Annuler</button>
                        <button type="submit" disabled={processing} className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-95">
                            {isEditing ? 'Mettre à jour' : 'Créer'}
                        </button>
                    </div>
                </form>
            </Modal>
        );
    }

    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
    const [managingInstitut, setManagingInstitut] = useState<any | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.instituts.index'), { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        router.delete(route('admin.instituts.destroy', confirmDelete.id), { onSuccess: () => setConfirmDelete(null) });
    };

    return (
        <AuthenticatedLayout header={<span className="font-bold text-slate-900 uppercase tracking-tight">Réseau des Établissements</span>}>
            <Head title="Établissements" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Header & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 ml-2">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Instituts</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{instituts.total} Centres de formation</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="relative w-full md:w-64 group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher un institut..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>

                        <button 
                            onClick={() => setManagingInstitut({})}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            Nouvel Institut
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Code & Nom</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Région de Rattachement</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {instituts.data.map(inst => (
                                    <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{inst.nom}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Code: {inst.code}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase border border-indigo-100">
                                                {inst.region?.nom}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-slate-500 uppercase">{inst.ville}</td>
                                         <td className="px-8 py-5 text-right space-x-2">
                                            <button onClick={() => setManagingInstitut(inst)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => setConfirmDelete(inst)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
                        <Pagination links={instituts.links} />
                    </div>
                </div>
            </div>

            {/* Manage Modal */}
            {managingInstitut && (
                <ManageInstitutModal 
                    isOpen={!!managingInstitut} 
                    onClose={() => setManagingInstitut(null)} 
                    institut={Object.keys(managingInstitut).length > 0 ? managingInstitut : null} 
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
)}




