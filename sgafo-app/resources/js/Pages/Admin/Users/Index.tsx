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
    const [activeRole, setActiveRole] = useState<string>('');

    const roleFilters = [
        { code: '', label: 'Tous', color: 'bg-slate-900 text-white border-slate-900', inactive: 'bg-white text-slate-500 border-slate-200 hover:border-slate-400' },
        { code: 'RF', label: 'RF', color: 'bg-purple-600 text-white border-purple-600', inactive: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400' },
        { code: 'CDC', label: 'CDC', color: 'bg-blue-600 text-white border-blue-600', inactive: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400' },
        { code: 'FORMATEUR', label: 'Formateur', color: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-400' },
        { code: 'DR', label: 'DR', color: 'bg-amber-500 text-white border-amber-500', inactive: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400' },
        { code: 'ADMIN', label: 'Admin', color: 'bg-rose-600 text-white border-rose-600', inactive: 'bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-400' },
    ];

    const filteredUsers = users.data.filter((user: any) => {
        if (!activeRole) return true;
        return user.roles.some((r: any) => r.code === activeRole);
    });

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
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        router.delete(route('admin.users.destroy', confirmDelete.id), {
            onSuccess: () => setConfirmDelete(null)
        });
    };

    return (
        <AuthenticatedLayout header={<span className="font-bold text-slate-900 uppercase tracking-tight">Gestion des Utilisateurs</span>}>
            <Head title="Utilisateurs" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Header & Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 ml-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Annuaire</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {activeRole ? `${filteredUsers.length} résultat(s)` : `${users.total} Utilisateurs au total`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher un utilisateur..."
                                className="w-64 pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
                        >
                            Nouveau Compte
                        </button>
                    </div>
                </div>

                {/* Role Filter Badges */}
                <div className="flex flex-wrap items-center gap-2 px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Filtrer par rôle :</span>
                    {roleFilters.map((rf) => (
                        <button
                            key={rf.code}
                            onClick={() => setActiveRole(rf.code)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-200 active:scale-95 ${
                                activeRole === rf.code ? rf.color : rf.inactive
                            }`}
                        >
                            {rf.label}
                            {activeRole === rf.code && rf.code !== '' && (
                                <span className="ml-1.5 opacity-70">({filteredUsers.length})</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
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
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs border border-slate-200 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                                    {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 leading-none">{user.prenom} {user.nom}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role: any) => (
                                                    <span key={role.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-lg border border-blue-100">
                                                        {role.code}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight line-clamp-1">
                                                {user.roles.some((r: any) => r.code === 'DR') && user.regions.map((r: any) => r.nom).join(', ')}
                                                {user.roles.some((r: any) => r.code === 'CDC') && user.cdcs.map((c: any) => c.nom).join(', ')}
                                                {user.roles.some((r: any) => ['FORMATEUR', 'RF'].includes(r.code)) && user.secteurs.map((s: any) => s.nom).join(', ')}
                                                {(!user.regions.length && !user.cdcs.length && !user.secteurs.length) && 'Administration Centrale'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.statut === 'actif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {user.statut}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2">
                                            <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button onClick={() => setConfirmDelete(user)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
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
                message={`Êtes-vous sûr de vouloir supprimer ${confirmDelete?.prenom} ${confirmDelete?.nom} ?`}
                confirmLabel="Supprimer"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </AuthenticatedLayout>
    );
}
