import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import UserModal from './UserModal';
import { User } from '@/types';
import Pagination from '@/Components/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props {
    users: {
        data: User[];
        links: any[];
        total: number;
    };
    roles: any[];
    regions: any[];
    instituts: any[];
    secteurs: any[];
    cdcs: any[];
    filters: { search?: string };
}

export default function Index({ users, roles, regions, instituts, secteurs, cdcs, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search }, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        router.delete(route('admin.users.destroy', confirmDelete.id), {
            onSuccess: () => setConfirmDelete(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Gestion des Utilisateurs</span>
                </div>
            }
        >
            <Head title="Utilisateurs" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                
                {/* Header Action Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Annuaire du Personnel</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Gérez les accès, les rôles et les affectations</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative flex-1 md:w-64 group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>

                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                            Nouveau
                        </button>
                    </div>
                </div>

                {/* Users List Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôles & Accès</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Affectation</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {users.data.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-black text-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                                    {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user.prenom} {user.nom}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.roles?.map((role: any) => (
                                                    <span key={role.id} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-200/60">
                                                        {role.code}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                {user.roles.some((r: any) => r.code === 'DR') && (
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">DR : {user.regions.map((r: any) => r.nom).join(', ')}</div>
                                                )}
                                                {user.roles.some((r: any) => r.code === 'CDC') && (
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">CDC : {user.cdcs.map((c: any) => c.nom).join(', ')}</div>
                                                )}
                                                {user.roles.some((r: any) => ['FORMATEUR', 'RF'].includes(r.code)) && (
                                                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{user.secteurs.map((s: any) => s.nom).join(', ')}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                user.statut === 'actif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.statut === 'actif' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                {user.statut}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2">
                                            <button 
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Modifier"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => setConfirmDelete(user)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Supprimer"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                </div>
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Aucun utilisateur trouvé</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>

            <UserModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={editingUser}
                roles={roles}
                regions={regions}
                instituts={instituts}
                secteurs={secteurs}
                cdcs={cdcs}
            />

            <ConfirmDialog 
                isOpen={!!confirmDelete}
                title="Supprimer l'utilisateur ?"
                message={`Êtes-vous sûr de vouloir supprimer définitivement ${confirmDelete?.prenom} ${confirmDelete?.nom} ? Toutes ses données seront effacées.`}
                confirmLabel="Supprimer définitivement"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}
