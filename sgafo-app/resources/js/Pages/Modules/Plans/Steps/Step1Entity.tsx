import { Entite } from '@/types/entite';
import { useState } from 'react';
import EntiteModal from '../../Entites/EntiteModal';

interface Props {
    entites: Entite[];
    secteurs: { id: number; nom: string }[];
    selectedEntite: Entite | null;
    onSelect: (entite: Entite) => void;
}

export default function Step1Entity({ entites, secteurs, selectedEntite, onSelect }: Props) {
    const [search, setSearch] = useState('');
    const [filterSecteur, setFilterSecteur] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const availableSecteurs = entites
        .map(e => e.secteur)
        .filter((secteur, index, self) => secteur && self.findIndex(s => s?.id === secteur.id) === index);

    const filtered = entites.filter(e => {
        const matchSearch = !search || e.titre.toLowerCase().includes(search.toLowerCase());
        const matchSecteur = !filterSecteur || e.secteur_id === filterSecteur;
        return matchSearch && matchSecteur;
    });

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 1 / 6 — Choix de l'entité de référence</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Sélectionnez la formation du catalogue qui servira de base à ce plan.</p>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Rechercher une entité..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <select
                    value={filterSecteur ?? ''}
                    onChange={(e) => setFilterSecteur(e.target.value ? Number(e.target.value) : null)}
                    className="px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                    <option value="">Tous les secteurs</option>
                    {availableSecteurs.map(s => s && <option key={s.id} value={s.id}>{s.nom}</option>)}
                </select>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm ring-1 ring-inset ring-blue-500/20"
                    title="Ajouter une entité au catalogue"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>

            {/* Entity List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-12 text-slate-300">
                        <p className="text-sm font-bold">Aucune entité trouvée.</p>
                    </div>
                ) : filtered.map(entite => {
                    const isSelected = selectedEntite?.id === entite.id;
                    const totalHeures = entite.themes.reduce((s, t) => s + Number(t.duree_heures), 0);

                    return (
                        <button
                            key={entite.id}
                            onClick={() => onSelect(entite)}
                            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                    ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10'
                                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                                }`}>
                                    {isSelected && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-black tracking-tight ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>{entite.titre}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        {entite.secteur?.nom} · {entite.themes.length} thèmes · {totalHeures}h · {entite.type}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                    {entite.mode}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-6">
                ⚠️ Seules les entités avec le statut "actif" sont affichées
            </p>

            <EntiteModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                entite={null} 
                secteurs={secteurs} 
            />
        </div>
    );
}
