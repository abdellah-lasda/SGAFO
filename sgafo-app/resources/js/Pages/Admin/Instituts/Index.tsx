import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props {
    instituts: {
        data: any[];
        links: any[];
        total: number;
    };
    regions: any[];
    filters: { search?: string };
}

export default function Index({ instituts, regions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.instituts.index'), { search }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        router.delete(route('admin.instituts.destroy', confirmDelete.id), {
            onSuccess: () => setConfirmDelete(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={<span className="font-bold text-slate-900">Gestion des Établissements</span>}
        >
            <Head title="Établissements" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Action Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Instituts & Centres</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Gestion du parc immobilier et administratif</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un institut..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium focus:border-cyan-500 focus:bg-white transition-all outline-none"
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Établissement</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Région</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Localisation</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {instituts.data.map(inst => (
                                    <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors">{inst.nom}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inst.code || 'SANS CODE'}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-[9px] font-black border border-cyan-100 uppercase tracking-widest">
                                                {inst.region?.nom}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-medium text-slate-500 italic">
                                            {inst.ville} {inst.adresse && `• ${inst.adresse}`}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => setConfirmDelete(inst)}
                                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
                        <Pagination links={instituts.links} />
                    </div>
                </div>
            </div>

            <ConfirmDialog 
                isOpen={!!confirmDelete}
                title="Supprimer l'établissement ?"
                message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete?.nom}" ?`}
                confirmLabel="Supprimer"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}
