import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InstitutModal from './InstitutModal';

interface Region {
    id: number;
    nom: string;
}

interface Institut {
    id: number;
    nom: string;
    code: string | null;
    region_id: number | null;
    adresse: string | null;
    ville: string | null;
    region?: Region;
}

export default function Index({ instituts, regions }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInstitut, setEditingInstitut] = useState<Institut | null>(null);

    const handleCreate = () => {
        setEditingInstitut(null);
        setIsModalOpen(true);
    };

    const handleEdit = (institut: Institut) => {
        setEditingInstitut(institut);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={<span>Établissements</span>}
        >
            <Head title="Établissements" />

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Établissements (Instituts)</h3>
                        <p className="mt-1 text-sm text-gray-500">Gérez la liste des établissements de l'OFPPT, leurs codes et régions.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nouvel Établissement
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Établissement</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Région</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville & Adresse</th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {instituts.map((institut: Institut) => (
                                <tr key={institut.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                {institut.nom.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{institut.nom}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {institut.code || <span className="text-gray-400 italic">N/A</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                        {institut.region?.nom || <span className="text-gray-400 italic">Non définie</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{institut.ville || '-'}</span>
                                            <span className="text-xs text-gray-400 truncate max-w-[200px]" title={institut.adresse || ''}>{institut.adresse || ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(institut)} className="text-blue-600 hover:text-blue-900">
                                            Modifier
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {instituts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Aucun établissement trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <InstitutModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                institut={editingInstitut}
                regions={regions}
            />
        </AuthenticatedLayout>
    );
}
