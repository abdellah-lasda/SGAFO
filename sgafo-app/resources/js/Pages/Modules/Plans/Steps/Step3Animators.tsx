import { PlanTheme, PlanFormateur } from '@/types/plan';
import { useState } from 'react';

interface Props {
    themes: PlanTheme[];
    setThemes: (v: PlanTheme[]) => void;
    formateurs: PlanFormateur[];
}

export default function Step3Animators({ themes, setThemes, formateurs }: Props) {
    const [searchTerms, setSearchTerms] = useState<Record<number, string>>({});

    const addAnimateur = (themeIndex: number, formateurId: number) => {
        const updated = [...themes];
        const ids = updated[themeIndex].animateur_ids || [];
        if (!ids.includes(formateurId)) {
            updated[themeIndex] = { ...updated[themeIndex], animateur_ids: [...ids, formateurId] };
            setThemes(updated);
        }
        setSearchTerms({ ...searchTerms, [themeIndex]: '' });
    };

    const removeAnimateur = (themeIndex: number, formateurId: number) => {
        const updated = [...themes];
        updated[themeIndex] = {
            ...updated[themeIndex],
            animateur_ids: (updated[themeIndex].animateur_ids || []).filter(id => id !== formateurId),
        };
        setThemes(updated);
    };

    const getFormateur = (id: number) => formateurs.find(f => f.id === id);

    // Récapitulatif animateurs uniques
    const allAnimateurIds = [...new Set(themes.flatMap(t => t.animateur_ids || []))];
    const animateurSummary = allAnimateurIds.map(id => {
        const f = getFormateur(id);
        const assignedThemes = themes.filter(t => (t.animateur_ids || []).includes(id));
        const totalH = assignedThemes.reduce((s, t) => s + Number(t.duree_heures || 0), 0);
        return { formateur: f, themes: assignedThemes, totalH };
    });

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 3 / 6 — Affectation des animateurs</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Affectez un ou plusieurs formateurs animateurs par thème (co-animation possible).</p>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {themes.map((theme, themeIndex) => {
                    const search = searchTerms[themeIndex] || '';
                    const assignedIds = theme.animateur_ids || [];
                    const available = formateurs.filter(f =>
                        !assignedIds.includes(f.id) &&
                        (f.nom.toLowerCase().includes(search.toLowerCase()) || f.prenom.toLowerCase().includes(search.toLowerCase()))
                    );

                    return (
                        <div key={themeIndex} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-slate-700">
                                    Thème {theme.ordre} : {theme.nom} <span className="text-slate-400 font-bold">({theme.duree_heures}h)</span>
                                </h3>
                                {assignedIds.length > 1 && (
                                    <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
                                        ℹ️ Co-animation : {assignedIds.length} animateurs
                                    </span>
                                )}
                            </div>

                            {/* Assigned animators */}
                            <div className="space-y-2 mb-3">
                                {assignedIds.map(id => {
                                    const f = getFormateur(id);
                                    if (!f) return null;
                                    return (
                                        <div key={id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                                                    {f.prenom[0]}{f.nom[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">{f.prenom} {f.nom}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {f.instituts?.[0]?.nom || 'Externe'} {f.instituts?.[0]?.region ? `· ${f.instituts[0].region.nom}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeAnimateur(themeIndex, id)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Search & Add */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="🔍 Rechercher un formateur..."
                                    value={search}
                                    onChange={(e) => setSearchTerms({ ...searchTerms, [themeIndex]: e.target.value })}
                                    className="w-full px-4 py-2.5 text-xs font-medium border border-dashed border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                />
                                {search.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-30 max-h-40 overflow-y-auto">
                                        {available.slice(0, 5).map(f => (
                                            <button
                                                key={f.id}
                                                onClick={() => addAnimateur(themeIndex, f.id)}
                                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-black">
                                                    {f.prenom[0]}{f.nom[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{f.prenom} {f.nom}</p>
                                                    <p className="text-[10px] text-slate-400">{f.instituts?.[0]?.nom || 'Externe'}</p>
                                                </div>
                                            </button>
                                        ))}
                                        {available.length === 0 && (
                                            <p className="px-4 py-3 text-xs text-slate-400">Aucun formateur trouvé.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {assignedIds.length === 0 && (
                                <p className="text-[10px] text-red-400 font-bold mt-2">⚠️ Au moins 1 animateur requis</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            {allAnimateurIds.length > 0 && (
                <div className="mt-6 p-4 bg-slate-900 rounded-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Récapitulatif animateurs</p>
                    <div className="space-y-2">
                        {animateurSummary.map(({ formateur, themes: assignedThemes, totalH }) => formateur && (
                            <div key={formateur.id} className="flex items-center justify-between text-xs">
                                <span className="text-white font-bold">{formateur.prenom} {formateur.nom}</span>
                                <span className="text-slate-400 font-medium">
                                    Thème {assignedThemes.map(t => t.ordre).join(', ')} · {totalH}h
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700 text-[10px] text-slate-500 font-bold">
                        {allAnimateurIds.length} animateur(s) unique(s) · {themes.reduce((s, t) => s + (t.animateur_ids?.length || 0), 0)} affectation(s)
                    </div>
                </div>
            )}
        </div>
    );
}
