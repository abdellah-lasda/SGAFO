import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Entite } from '@/types/entite';
import EntiteModal from './EntiteModal';

interface Props {
    auth: any;
    entites: Entite[];
    secteurs: { id: number, nom: string }[];
}

export default function Index({ auth, entites, secteurs }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntite, setEditingEntite] = useState<Entite | null>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSecteur, setSelectedSecteur] = useState('');
    const [selectedMode, setSelectedMode] = useState('');
    const [showArchived, setShowArchived] = useState(false);

    const openCreateModal = () => {
        setEditingEntite(null);
        setIsModalOpen(true);
    };

    const openEditModal = (entite: Entite) => {
        setEditingEntite(entite);
        setIsModalOpen(true);
    };

    const handleArchive = (entite: Entite) => {
        const actionLabel = entite.statut === 'archivé' ? 'restaurer' : 'archiver';
        if (confirm(`Voulez-vous vraiment ${actionLabel} la formation "${entite.titre}" ?`)) {
            router.delete(route('modules.entites.destroy', entite.id), {
                preserveScroll: true,
            });
        }
    };

    // Filter Logic
    const filteredEntites = useMemo(() => {
        return entites.filter(entite => {
            const matchesSearch = entite.titre.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSecteur = selectedSecteur === '' || entite.secteur_id.toString() === selectedSecteur;
            const matchesMode = selectedMode === '' || entite.mode === selectedMode;
            const matchesStatus = showArchived ? true : entite.statut === 'actif';
            return matchesSearch && matchesSecteur && matchesMode && matchesStatus;
        });
    }, [entites, searchQuery, selectedSecteur, selectedMode, showArchived]);

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'technique': 'bg-blue-500',
            'pedagogique': 'bg-emerald-500',
            'manageriale': 'bg-amber-500',
            'transversale': 'bg-rose-500',
        };
        return colors[type] || 'bg-slate-300';
    };

    return (
        <AuthenticatedLayout
            header={<span>Catalogue</span>}
        >
            <Head title="Catalogue de formation" />

            <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Référentiel National</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            {filteredEntites.length} concept(s) de formation répertorié(s)
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                        Nouvelle Formation
                    </button>
                </div>

                {/* SaaS Filter Bar */}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200/60 flex flex-wrap items-center gap-2">
                    <div className="relative flex-grow w-full group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3 bg-transparent border-transparent focus:border-transparent focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium"
                            placeholder="Rechercher par titre de formation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pr-2">
                        <select
                            className="bg-slate-50 border-transparent focus:ring-0 focus:border-transparent rounded-lg text-xs font-black uppercase tracking-wider text-slate-500 py-3 pl-4 pr-10 hover:bg-slate-100 transition-colors cursor-pointer"
                            value={selectedSecteur}
                            onChange={(e) => setSelectedSecteur(e.target.value)}
                        >
                            <option value="">Tous les Secteurs</option>
                            {secteurs.map(s => (
                                <option key={s.id} value={s.id}>{s.nom}</option>
                            ))}
                        </select>

                        <select
                            className="bg-slate-50 border-transparent focus:ring-0 focus:border-transparent rounded-2xl text-xs font-black uppercase tracking-wider text-slate-500 py-3 pl-4 pr-10 hover:bg-slate-100 transition-colors cursor-pointer"
                            value={selectedMode}
                            onChange={(e) => setSelectedMode(e.target.value)}
                        >
                            <option value="">Tous les Modes</option>
                            <option value="présentiel">Présentiel</option>
                            <option value="distance">Distance</option>
                            <option value="hybride">Hybride</option>
                        </select>

                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className={`px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${showArchived ? 'bg-slate-800 text-white border-slate-800 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                        >
                            {showArchived ? 'Masquer archives' : 'Voir archives'}
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                                <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur</th>
                                <th scope="col" className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</th>
                                <th scope="col" className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Durée</th>
                                <th scope="col" className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredEntites.map((entite) => (
                                <tr 
                                    key={entite.id} 
                                    className={`group hover:bg-slate-50/30 transition-colors duration-150 ${entite.statut === 'archivé' ? 'opacity-40 grayscale' : ''}`}
                                >
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${getTypeColor(entite.type)} shadow-sm`}></div>
                                            <div className="max-w-[300px]">
                                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                    {entite.titre}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {entite.type}
                                                    </span>
                                                    <span className="text-slate-200">•</span>
                                                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">
                                                        {new Date(entite.created_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className="px-3 py-1 bg-slate-50 rounded-full text-[11px] font-bold text-slate-600 border border-slate-200 tracking-tight">
                                            {entite.secteur?.nom}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            entite.mode === 'présentiel' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            entite.mode === 'hybride' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                            {entite.mode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap text-center">
                                        <div className="inline-flex items-center px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="text-sm font-black text-slate-800">
                                                {entite.themes.reduce((acc, t) => acc + Number(t.duree_heures), 0)}
                                            </span>
                                            <span className="text-slate-400 text-[9px] font-black ml-1 uppercase">h</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                                            <Link
                                                href={route('modules.entites.show', entite.id)}
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Voir le programme"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </Link>
                                            <button
                                                onClick={() => openEditModal(entite)}
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Modifier"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleArchive(entite)}
                                                className={`p-2.5 rounded-lg transition-all ${entite.statut === 'archivé' ? 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                                title={entite.statut === 'archivé' ? 'Désarchiver' : 'Archiver'}
                                            >
                                                {entite.statut === 'archivé' ? 
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> :
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredEntites.length === 0 && (
                    <div className="bg-white rounded-xl p-20 text-center border border-slate-200/60 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Aucun résultat</h3>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8 font-medium">Ajustez vos filtres ou lancez une nouvelle recherche pour trouver ce que vous cherchez.</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setSelectedSecteur(''); setSelectedMode('');}}
                            className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

            </div>

            <EntiteModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                entite={editingEntite}
                secteurs={secteurs}
            />
        </AuthenticatedLayout>
    );
}
