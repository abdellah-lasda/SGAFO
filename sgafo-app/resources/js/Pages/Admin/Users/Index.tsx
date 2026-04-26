import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
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
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!confirmDelete) return;
        router.delete(route('admin.users.destroy', confirmDelete.id), {
            onSuccess: () => setConfirmDelete(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Utilisateurs</h2>}
        >
            <Head title="Utilisateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        
                        {/* Header & Search */}
                        <div className="p-6 bg-white border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Annuaire des utilisateurs</h3>
                                <p className="text-sm text-gray-500">Gérez les comptes, les rôles et les affectations.</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <form onSubmit={handleSearch} className="relative flex-1">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Rechercher..."
                                        className="w-full md:w-64 pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-ofppt-500 focus:ring-ofppt-500 text-sm"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </form>
                                <button
                                    onClick={handleCreate}
                                    className="inline-flex items-center px-4 py-2 bg-ofppt-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-ofppt-700 active:bg-ofppt-900 focus:outline-none focus:border-ofppt-900 focus:ring ring-ofppt-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Nouveau
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôles</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affectation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-ofppt-100 flex items-center justify-center text-ofppt-700 font-bold">
                                                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role: any) => (
                                                        <span key={role.id} className="bg-gray-100 text-gray-800 text-[10px] px-2 py-0.5 rounded border border-gray-200">
                                                            {role.code}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.roles.some((r: any) => r.code === 'DR') && user.regions.map((r: any) => r.nom).join(', ')}
                                                {user.roles.some((r: any) => r.code === 'CDC') && user.cdcs.map((c: any) => c.nom).join(', ')}
                                                {user.roles.some((r: any) => ['FORMATEUR', 'RF'].includes(r.code)) && user.secteurs.map((s: any) => s.nom).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <button onClick={() => handleEdit(user)} className="text-ofppt-600 hover:text-ofppt-900">Modifier</button>
                                                <button onClick={() => setConfirmDelete(user)} className="text-red-600 hover:text-red-900">Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Aucun utilisateur trouvé.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <Pagination links={users.links} />
                        </div>
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
