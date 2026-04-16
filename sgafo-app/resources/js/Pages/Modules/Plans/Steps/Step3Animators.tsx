import { PlanTheme, PlanFormateur } from '@/types/plan';
import { useState, useMemo } from 'react';

interface Props {
    themes: PlanTheme[];
    setThemes: (v: PlanTheme[]) => void;
    formateurs: PlanFormateur[];
}

export default function Step3Animators({ themes, setThemes, formateurs }: Props) {
    const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
    const [searchTitle, setSearchTitle] = useState('');
    const [filterSecteur, setFilterSecteur] = useState('');
    const [filterEtablissement, setFilterEtablissement] = useState('');
    const [filterOrigine, setFilterOrigine] = useState('');
    
    const [selectedFormateurs, setSelectedFormateurs] = useState<number[]>([]);

    const secteursList = useMemo(() => {
        const allSecteurs = formateurs.flatMap(f => f.secteurs || []);
        return [...new Map(allSecteurs.map(s => [s.id, s])).values()];
    }, [formateurs]);
     
    const institutsList = useMemo(() => {
        const allInstituts = formateurs.flatMap(f => f.instituts || []);
        return [...new Map(allInstituts.map(i => [i.id, i])).values()];
    }, [formateurs]);

    const activeTheme = themes[selectedThemeIndex];
    if (!activeTheme) return null; // Safe guard
    const assignedIdsInActiveTheme = activeTheme.animateur_ids || [];

    const getFormateur = (id: number) => formateurs.find(f => f.id === id);

    const filteredFormateurs = useMemo(() => {
        return formateurs.filter(f => {
            // Ne pas afficher ceux déjà affectés à ce thème précis
            if (assignedIdsInActiveTheme.includes(f.id)) return false;

            if (searchTitle) {
                const fullName = `${f.prenom} ${f.nom}`.toLowerCase();
                if (!fullName.includes(searchTitle.toLowerCase())) return false;
            }

            if (filterOrigine) {
                if (filterOrigine === 'interne' && f.is_externe) return false;
                if (filterOrigine === 'externe' && !f.is_externe) return false;
            }

            if (filterSecteur) {
                const sIds = (f.secteurs || []).map(s => s.id.toString());
                if (!sIds.includes(filterSecteur)) return false;
            }

            if (filterEtablissement) {
                const iIds = (f.instituts || []).map(i => i.id.toString());
                if (!iIds.includes(filterEtablissement)) return false;
            }

            return true;
        });
    }, [formateurs, searchTitle, filterOrigine, filterSecteur, filterEtablissement, assignedIdsInActiveTheme]);

    const toggleFormateurSelection = (id: number) => {
        setSelectedFormateurs(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleAffecter = () => {
        if (selectedFormateurs.length === 0) return;
        
        const updated = [...themes];
        updated[selectedThemeIndex] = {
            ...updated[selectedThemeIndex],
            animateur_ids: [...assignedIdsInActiveTheme, ...selectedFormateurs]
        };
        setThemes(updated);
        setSelectedFormateurs([]); 
    };

    const removeAnimateur = (id: number) => {
        const updated = [...themes];
        updated[selectedThemeIndex] = {
            ...updated[selectedThemeIndex],
            animateur_ids: assignedIdsInActiveTheme.filter(cid => cid !== id)
        };
        setThemes(updated);
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedThemeIndex(Number(e.target.value));
        setSelectedFormateurs([]);
    };

    const allAnimateurIds = [...new Set(themes.flatMap(t => t.animateur_ids || []))];

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 3 / 6 — Affectation des animateurs</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Sélectionnez les formateurs thème par thème avec précision.</p>

            {/* SELECTION DU THEME CIBLE */}
            <div className="mb-8">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Sélectionnez le thème à configurer
                </label>
                <div className="relative">
                    <select
                        value={selectedThemeIndex}
                        onChange={handleThemeChange}
                        className="w-full bg-slate-50 border-2 border-blue-100 text-blue-900 text-sm font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 appearance-none shadow-sm"
                    >
                        {themes.map((theme, idx) => (
                            <option key={idx} value={idx}>
                                Thème {theme.ordre} : {theme.nom} ({theme.duree_heures}h) — {theme.animateur_ids?.length || 0} affecté(s)
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            {/* 1. ANIMATEURS AFFECTÉS AU THÈME */}
            <div className="mb-10 bg-blue-50/50 rounded-2xl border border-blue-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-blue-900 flex items-center gap-2">
                        <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Animateurs actuellement affectés à ce thème
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">
                            {assignedIdsInActiveTheme.length} formateur(s)
                        </span>
                        {assignedIdsInActiveTheme.length > 0 && (
                            <button
                                onClick={() => {
                                    const updated = [...themes];
                                    updated[selectedThemeIndex] = { ...updated[selectedThemeIndex], animateur_ids: [] };
                                    setThemes(updated);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                Tout retirer
                            </button>
                        )}
                    </div>
                </div>

                {assignedIdsInActiveTheme.length === 0 ? (
                    <div className="text-center py-6 bg-white rounded-xl border border-blue-100/50 border-dashed">
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">⚠️ Aucun animateur affecté</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {assignedIdsInActiveTheme.map(id => {
                            const f = getFormateur(id);
                            if (!f) return null;
                            return (
                                <div key={id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-inner">
                                            {f.prenom[0]}{f.nom[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{f.prenom} {f.nom}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                {f.is_externe ? 'Prestataire Externe' : 'Formateur Interne'} 
                                                {f.instituts && f.instituts.length > 0 ? ` · ${f.instituts[0].nom}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeAnimateur(id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                                        title="Désaffecter"
                                    >
                                        Retirer
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 2. CATALOGUE DES FORMATEURS (FILTRES + TABLE) */}
            <div>
                <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Rechercher et Affecter de Nouveaux Animateurs
                </h3>

                {/* Filtres */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-1">
                        <input
                            type="text"
                            placeholder="Nom du formateur..."
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <select
                            value={filterSecteur}
                            onChange={(e) => setFilterSecteur(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="">Tous les Secteurs</option>
                            {secteursList.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                    <div>
                        <select
                            value={filterEtablissement}
                            onChange={(e) => setFilterEtablissement(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="">Tous les Établissements</option>
                            {institutsList.map(i => <option key={i.id} value={i.id}>{i.nom}</option>)}
                        </select>
                    </div>
                    <div>
                        <select
                            value={filterOrigine}
                            onChange={(e) => setFilterOrigine(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="">Toutes Origines</option>
                            <option value="interne">Direct / Interne</option>
                            <option value="externe">Prestataire Externe</option>
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={handleAffecter}
                            disabled={selectedFormateurs.length === 0}
                            className={`w-full h-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                                selectedFormateurs.length > 0
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            Affecter ({selectedFormateurs.length})
                        </button>
                    </div>
                </div>

                {/* Table des formateurs filtrés */}
                <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-y-auto max-h-[35vh]">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm font-bold">
                            <tr>
                                <th className="px-4 py-3 text-center w-12">
                                    {filteredFormateurs.length > 0 && (() => {
                                        const allFilteredSelected = filteredFormateurs.every(f => selectedFormateurs.includes(f.id));
                                        return (
                                            <div
                                                onClick={() => {
                                                    if (allFilteredSelected) {
                                                        // Deselect all filtered
                                                        const filteredIds = filteredFormateurs.map(f => f.id);
                                                        setSelectedFormateurs(prev => prev.filter(id => !filteredIds.includes(id)));
                                                    } else {
                                                        // Select all filtered
                                                        const filteredIds = filteredFormateurs.map(f => f.id);
                                                        setSelectedFormateurs(prev => [...new Set([...prev, ...filteredIds])]);
                                                    }
                                                }}
                                                className={`w-5 h-5 rounded flex items-center justify-center border-2 cursor-pointer transition-colors mx-auto ${
                                                    allFilteredSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white hover:border-emerald-400'
                                                }`}
                                                title={allFilteredSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                                            >
                                                {allFilteredSelected && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                        );
                                    })()}
                                </th>
                                <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase">Nom Prénom</th>
                                <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase">Établissement</th>
                                <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase">Secteur(s)</th>
                                <th className="px-4 py-3 text-left text-[10px] text-slate-400 uppercase">Origine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredFormateurs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs font-medium bg-slate-50 border-b border-t">
                                        Aucun formateur ne correspond à ces critères (ou ils sont déjà affectés).
                                    </td>
                                </tr>
                            ) : (
                                filteredFormateurs.map(f => {
                                    const isSelected = selectedFormateurs.includes(f.id);
                                    return (
                                        <tr 
                                            key={f.id} 
                                            onClick={() => toggleFormateurSelection(f.id)}
                                            className={`cursor-pointer transition-colors ${
                                                isSelected ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <td className="px-4 py-4 text-center">
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors mx-auto ${
                                                    isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white'
                                                }`}>
                                                    {isSelected && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 font-bold text-slate-800">
                                                {f.prenom} {f.nom}
                                            </td>
                                            <td className="px-4 py-4 font-medium text-slate-500 text-xs">
                                                {f.instituts && f.instituts.length > 0 ? f.instituts[0].nom : '-'}
                                            </td>
                                            <td className="px-4 py-4 text-xs font-medium text-slate-500">
                                                {f.secteurs && f.secteurs.length > 0 ? (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {f.secteurs.map(s => <span key={s.id} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">{s.nom}</span>)}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${
                                                    f.is_externe ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {f.is_externe ? 'Externe' : 'Interne'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ERROR SUMMARY */}
            {themes.some(t => (t.animateur_ids?.length || 0) === 0) && (
                <div className="mt-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    Attention : Vous devez affecter au moins 1 formateur à chaque thème pour continuer.
                    ({themes.filter(t => (t.animateur_ids?.length || 0) === 0).length} thèmes incomplets)
                </div>
            )}
        </div>
    );
}
