import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CdcModal from './CdcModal';
import SecteurModal from './SecteurModal';
import MetierModal from './MetierModal';

export default function Index({ cdcs, secteurs, metiers }: any) {
    const [activeTab, setActiveTab] = useState('cdc'); // cdc, secteur, metier
    
    // Modals state
    const [isCdcModalOpen, setIsCdcModalOpen] = useState(false);
    const [editingCdc, setEditingCdc] = useState(null);

    const [isSecteurModalOpen, setIsSecteurModalOpen] = useState(false);
    const [editingSecteur, setEditingSecteur] = useState(null);

    const [isMetierModalOpen, setIsMetierModalOpen] = useState(false);
    const [editingMetier, setEditingMetier] = useState(null);

    const handleCreate = () => {
        if (activeTab === 'cdc') {
            setEditingCdc(null);
            setIsCdcModalOpen(true);
        } else if (activeTab === 'secteur') {
            setEditingSecteur(null);
            setIsSecteurModalOpen(true);
        } else {
            setEditingMetier(null);
            setIsMetierModalOpen(true);
        }
    };

    const handleEditCdc = (cdc: any) => {
        setEditingCdc(cdc);
        setIsCdcModalOpen(true);
    };

    const handleEditSecteur = (secteur: any) => {
        setEditingSecteur(secteur);
        setIsSecteurModalOpen(true);
    };

    const handleEditMetier = (metier: any) => {
        setEditingMetier(metier);
        setIsMetierModalOpen(true);
    };

    return (
        <AuthenticatedLayout header={<span>Domaines & Spécialités</span>}>
            <Head title="Domaines & Spécialités" />

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Domaines (CDC), Secteurs et Métiers</h3>
                        <p className="mt-1 text-sm text-gray-500">Structuration hiérarchique : CDC &gt; Secteur &gt; Métier</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nouveau {activeTab === 'cdc' ? 'CDC' : activeTab === 'secteur' ? 'Secteur' : 'Métier'}
                    </button>
                </div>
                
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('cdc')}
                            className={`${activeTab === 'cdc' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            1. Centres (CDCs)
                        </button>
                        <button
                            onClick={() => setActiveTab('secteur')}
                            className={`${activeTab === 'secteur' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            2. Secteurs
                        </button>
                        <button
                            onClick={() => setActiveTab('metier')}
                            className={`${activeTab === 'metier' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            3. Métiers
                        </button>
                    </nav>
                </div>

                <div className="overflow-x-auto">
                    {activeTab === 'cdc' && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centre (CDC)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="relative px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cdcs.map((cdc: any) => (
                                    <tr key={cdc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cdc.nom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cdc.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cdc.description || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditCdc(cdc)} className="text-blue-600 hover:text-blue-900">Modifier</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'secteur' && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secteur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CDC Rattaché</th>
                                    <th className="relative px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {secteurs.map((secteur: any) => (
                                    <tr key={secteur.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{secteur.nom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{secteur.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{secteur.cdc?.nom || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditSecteur(secteur)} className="text-blue-600 hover:text-blue-900">Modifier</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'metier' && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métier</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secteur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CDC Parent</th>
                                    <th className="relative px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {metiers.map((metier: any) => (
                                    <tr key={metier.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metier.nom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metier.secteur?.nom || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metier.secteur?.cdc?.nom || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEditMetier(metier)} className="text-blue-600 hover:text-blue-900">Modifier</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <CdcModal isOpen={isCdcModalOpen} onClose={() => setIsCdcModalOpen(false)} cdc={editingCdc} />
            <SecteurModal isOpen={isSecteurModalOpen} onClose={() => setIsSecteurModalOpen(false)} secteur={editingSecteur} cdcs={cdcs} />
            <MetierModal isOpen={isMetierModalOpen} onClose={() => setIsMetierModalOpen(false)} metier={editingMetier} secteurs={secteurs} />

        </AuthenticatedLayout>
    );
}
