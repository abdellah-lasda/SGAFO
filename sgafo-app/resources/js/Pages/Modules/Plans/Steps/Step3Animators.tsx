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
        const all = formateurs.flatMap(f => f.secteurs || []);
        return [...new Map(all.map(s => [s.id, s])).values()];
    }, [formateurs]);

    const institutsList = useMemo(() => {
        const all = formateurs.flatMap(f => f.instituts || []);
        return [...new Map(all.map(i => [i.id, i])).values()];
    }, [formateurs]);

    const activeTheme = themes[selectedThemeIndex];
    if (!activeTheme) return null;
    const assignedIdsInActiveTheme = activeTheme.animateur_ids || [];

    const getFormateur = (id: number) => formateurs.find(f => f.id === id);

    const filteredFormateurs = useMemo(() => {
        return formateurs.filter(f => {
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

    // Affecter au thème actif uniquement
    const handleAffecter = () => {
        if (selectedFormateurs.length === 0) return;
        const updated = [...themes];
        updated[selectedThemeIndex] = {
            ...updated[selectedThemeIndex],
            animateur_ids: [...new Set([...assignedIdsInActiveTheme, ...selectedFormateurs])]
        };
        setThemes(updated);
        setSelectedFormateurs([]);
    };

    // ★ NOUVEAU : Affecter à TOUS les thèmes
    const handleAffecterTous = () => {
        if (selectedFormateurs.length === 0) return;
        const updated = themes.map(t => ({
            ...t,
            animateur_ids: [...new Set([...(t.animateur_ids || []), ...selectedFormateurs])]
        }));
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

    const clearTheme = () => {
        const updated = [...themes];
        updated[selectedThemeIndex] = { ...updated[selectedThemeIndex], animateur_ids: [] };
        setThemes(updated);
    };

    const allFilteredSelected = filteredFormateurs.length > 0 && filteredFormateurs.every(f => selectedFormateurs.includes(f.id));

    const toggleSelectAll = () => {
        const ids = filteredFormateurs.map(f => f.id);
        if (allFilteredSelected) {
            setSelectedFormateurs(prev => prev.filter(id => !ids.includes(id)));
        } else {
            setSelectedFormateurs(prev => [...new Set([...prev, ...ids])]);
        }
    };

    const totalIncomplete = themes.filter(t => (t.animateur_ids?.length || 0) === 0).length;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">
                        Étape 3 / 6 — Affectation des animateurs
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                        Sélectionnez des animateurs puis affectez-les à un thème ou à <strong>tous les thèmes</strong> en un clic.
                    </p>
                </div>
                {totalIncomplete === 0 ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Tous complétés</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl">
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{totalIncomplete} thème(s) sans animateur</span>
                    </div>
                )}
            </div>

            {/* ─── THÈMES EN ONGLETS VISUELS ─── */}
            <div className="mb-8">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sélectionnez le thème à configurer</p>
                <div className="flex flex-wrap gap-2">
                    {themes.map((theme, idx) => {
                        const isActive = selectedThemeIndex === idx;
                        const isDone = (theme.animateur_ids?.length || 0) > 0;
                        return (
                            <button
                                key={idx}
                                onClick={() => { setSelectedThemeIndex(idx); setSelectedFormateurs([]); }}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 text-xs font-black transition-all duration-200 ${
                                    isActive
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105'
                                        : isDone
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30'
                                }`}
                            >
                                {/* Status dot */}
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    isActive ? 'bg-blue-400' : isDone ? 'bg-emerald-500' : 'bg-slate-300'
                                }`} />
                                <span className="truncate max-w-[140px]">
                                    {idx + 1}. {theme.nom || `Thème ${idx + 1}`}
                                </span>
                                <span className={`text-[9px] font-bold flex-shrink-0 ${
                                    isActive ? 'text-white/60' : isDone ? 'text-emerald-500' : 'text-slate-400'
                                }`}>
                                    {theme.duree_heures}h
                                </span>
                                {isDone && (
                                    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* ─── LEFT: Catalogue formateurs ─── */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Catalogue des formateurs
                        </h3>
                        {selectedFormateurs.length > 0 && (
                            <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                {selectedFormateurs.length} sélectionné(s)
                            </span>
                        )}
                    </div>

                    {/* Filtres */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Rechercher un formateur..."
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <select value={filterSecteur} onChange={(e) => setFilterSecteur(e.target.value)} className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                            <option value="">Tous les secteurs</option>
                            {secteursList.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                        <select value={filterOrigine} onChange={(e) => setFilterOrigine(e.target.value)} className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                            <option value="">Toutes origines</option>
                            <option value="interne">Interne</option>
                            <option value="externe">Externe</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="max-h-[340px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 w-10">
                                            {filteredFormateurs.length > 0 && (
                                                <div
                                                    onClick={toggleSelectAll}
                                                    className={`w-5 h-5 rounded-md flex items-center justify-center border-2 cursor-pointer transition-all mx-auto ${allFilteredSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white hover:border-blue-400'}`}
                                                >
                                                    {allFilteredSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                            )}
                                        </th>
                                        <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Formateur</th>
                                        <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Établissement</th>
                                        <th className="px-4 py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Origine</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredFormateurs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-slate-300 text-xs font-bold">
                                                Aucun formateur disponible (déjà tous affectés ou aucun résultat)
                                            </td>
                                        </tr>
                                    ) : filteredFormateurs.map(f => {
                                        const isSelected = selectedFormateurs.includes(f.id);
                                        return (
                                            <tr
                                                key={f.id}
                                                onClick={() => toggleFormateurSelection(f.id)}
                                                className={`cursor-pointer transition-all ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/80'}`}
                                            >
                                                <td className="px-4 py-3 text-center">
                                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all mx-auto ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-200 bg-white'}`}>
                                                        {isSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                                            {f.prenom?.[0]}{f.nom?.[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-800">{f.prenom} {f.nom}</p>
                                                            {f.secteurs?.length > 0 && (
                                                                <p className="text-[9px] text-slate-400 font-medium">{f.secteurs[0].nom}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-medium text-slate-500">
                                                    {f.instituts?.length > 0 ? f.instituts[0].nom : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full ${f.is_externe ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {f.is_externe ? 'Ext.' : 'Int.'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ─── BOUTONS D'AFFECTATION ─── */}
                    <div className={`flex gap-3 transition-all duration-300 ${selectedFormateurs.length > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        {/* Affecter au thème actif */}
                        <button
                            onClick={handleAffecter}
                            disabled={selectedFormateurs.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            Affecter à ce thème
                        </button>

                        {/* ★ Affecter à TOUS les thèmes */}
                        <button
                            onClick={handleAffecterTous}
                            disabled={selectedFormateurs.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/20 active:scale-95 group"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Affecter à tous ({themes.length})
                        </button>
                    </div>

                    {selectedFormateurs.length === 0 && (
                        <p className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-widest">
                            ↑ Cochez des formateurs pour activer l'affectation
                        </p>
                    )}
                </div>

                {/* ─── RIGHT: Animateurs du thème actif ─── */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thème sélectionné</p>
                                <h4 className="text-sm font-black text-slate-900 mt-0.5 truncate max-w-[200px]">
                                    {activeTheme.nom || `Thème ${selectedThemeIndex + 1}`}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium">{activeTheme.duree_heures}h prévues</p>
                            </div>
                            {assignedIdsInActiveTheme.length > 0 && (
                                <button
                                    onClick={clearTheme}
                                    className="text-[9px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
                                >
                                    Vider
                                </button>
                            )}
                        </div>

                        {assignedIdsInActiveTheme.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">
                                    Aucun animateur
                                </p>
                                <p className="text-[9px] text-slate-300 font-medium mt-1 text-center">
                                    Sélectionnez dans le catalogue
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {assignedIdsInActiveTheme.map(id => {
                                    const f = getFormateur(id);
                                    if (!f) return null;
                                    return (
                                        <div key={id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-red-100 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                                    {f.prenom?.[0]}{f.nom?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{f.prenom} {f.nom}</p>
                                                    <p className="text-[9px] text-slate-400 font-medium">
                                                        {f.is_externe ? 'Externe' : 'Interne'}
                                                        {f.instituts?.length > 0 ? ` · ${f.instituts[0].nom}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeAnimateur(id)}
                                                className="w-7 h-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                title="Retirer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Parcourir les thèmes rapide */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                            <button
                                onClick={() => { setSelectedThemeIndex(Math.max(0, selectedThemeIndex - 1)); setSelectedFormateurs([]); }}
                                disabled={selectedThemeIndex === 0}
                                className="flex-1 py-2 rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 hover:bg-white hover:border-slate-300 disabled:opacity-30 transition-all"
                            >
                                ← Précédent
                            </button>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">
                                {selectedThemeIndex + 1}/{themes.length}
                            </span>
                            <button
                                onClick={() => { setSelectedThemeIndex(Math.min(themes.length - 1, selectedThemeIndex + 1)); setSelectedFormateurs([]); }}
                                disabled={selectedThemeIndex === themes.length - 1}
                                className="flex-1 py-2 rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 hover:bg-white hover:border-slate-300 disabled:opacity-30 transition-all"
                            >
                                Suivant →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerte globale */}
            {totalIncomplete > 0 && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    <p className="text-xs font-bold text-red-600">
                        {totalIncomplete} thème(s) sans animateur. Affectez au moins 1 formateur par thème pour continuer.
                    </p>
                </div>
            )}
        </div>
    );
}
