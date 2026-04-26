import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props {
    sites: {
        data: any[];
        links: any[];
        total: number;
    };
    hotels: {
        data: any[];
        links: any[];
        total: number;
    };
    regions: any[];
    filters: { search?: string };
}

export default function Index({ sites, hotels, regions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<{ id: number, type: 'site' | 'hotel', title: string } | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.logistique.index'), { search }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        const r = confirmDelete.type === 'site' ? 'admin.logistique.sites.destroy' : 'admin.logistique.hotels.destroy';
        router.delete(route(r, confirmDelete.id), {
            onSuccess: () => setConfirmDelete(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={<span className="font-bold text-slate-900">Gestion Logistique</span>}
        >
            <Head title="Logistique" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Sites & Hébergements</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Infrastructures de formation et hôtellerie</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un site ou hôtel..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium focus:border-rose-500 focus:bg-white transition-all outline-none"
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* SITES SECTION */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sites de Formation</h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/30">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Site</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Localisation</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacité</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {sites.data.map(site => (
                                        <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 font-black text-slate-900 text-sm">{site.nom}</td>
                                            <td className="px-6 py-5">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{site.ville}</div>
                                                <div className="text-[10px] text-slate-400">{site.region?.nom}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black border border-rose-100">
                                                    {site.capacite} PLACES
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => setConfirmDelete({ id: site.id, type: 'site', title: site.nom })}
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
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
                            <Pagination links={sites.links} />
                        </div>
                    </div>

                    {/* HOTELS SECTION */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hôtels Partenaires</h2>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/30">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hôtel</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ville</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarif Nuitée</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {hotels.data.map(hotel => (
                                        <tr key={hotel.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 font-black text-slate-900 text-sm">{hotel.nom}</td>
                                            <td className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">{hotel.ville}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black border border-blue-100 uppercase">
                                                    {hotel.prix_nuitee} MAD
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => setConfirmDelete({ id: hotel.id, type: 'hotel', title: hotel.nom })}
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
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
                            <Pagination links={hotels.links} />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog 
                isOpen={!!confirmDelete}
                title={`Supprimer ${confirmDelete?.type === 'site' ? 'le site' : "l'hôtel"} ?`}
                message={`Êtes-vous sûr de vouloir supprimer définitivement "${confirmDelete?.title}" ?`}
                confirmLabel="Supprimer"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}
