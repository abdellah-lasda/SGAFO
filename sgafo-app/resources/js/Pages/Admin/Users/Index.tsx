import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserModal from './UserModal';
import { User } from '@/types';

export default function Index({ users, roles, regions, instituts, secteurs, cdcs }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Utilisateurs</h2>}
        >
            <Head title="Utilisateurs" />

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Annuaire du personnel</h3>
                        <p className="mt-1 text-sm text-gray-500">Gérez les accès, les rôles et les affectations de tous les utilisateurs SGAFO.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-ofppt-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-ofppt-700 active:bg-ofppt-900 focus:outline-none focus:border-ofppt-900 focus:ring ring-ofppt-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nouvel Utilisateur
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identité</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entité / Région</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialité / Institut</th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user: any) => (
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
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.statut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role: any) => (
                                                <span key={role.id} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border border-gray-200">
                                                    {role.code}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                        {user.roles.some((r: any) => r.code === 'DR') && user.regions.map((r: any) => r.nom).join(', ')}
                                        {user.roles.some((r: any) => r.code === 'CDC') && user.cdcs.map((c: any) => c.nom).join(', ')}
                                        {user.roles.some((r: any) => r.code === 'FORMATEUR') && 'Formateur'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.roles.some((r: any) => r.code === 'FORMATEUR') && (
                                            <div>
                                                <span className="block text-purple-700 font-semibold">{user.secteurs.map((s: any) => s.nom).join(', ')}</span>
                                                <span className="text-xs text-gray-500">
                                                    {user.is_externe ? 'Externe' : user.instituts.map((i: any) => i.nom).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {user.roles.some((r: any) => ['DR', 'CDC'].includes(r.code)) && (
                                            <span className="text-xs italic text-gray-400">Périmètre National/Régional</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-ofppt-600 hover:text-ofppt-900">
                                            Modifier
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
        </AuthenticatedLayout>
    );
}
