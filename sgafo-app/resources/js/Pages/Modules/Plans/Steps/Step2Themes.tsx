import { PlanTheme } from '@/types/plan';

interface Props {
    titre: string;
    setTitre: (v: string) => void;
    themes: PlanTheme[];
    setThemes: (v: PlanTheme[]) => void;
}

export default function Step2Themes({ titre, setTitre, themes, setThemes }: Props) {
    const totalHeures = themes.reduce((s, t) => s + Number(t.duree_heures || 0), 0);

    const updateTheme = (index: number, field: keyof PlanTheme, value: any) => {
        const updated = [...themes];
        (updated[index] as any)[field] = value;
        setThemes(updated);
    };

    const addTheme = () => {
        setThemes([...themes, {
            nom: '',
            duree_heures: 0,
            objectifs: '',
            ordre: themes.length + 1,
            animateur_ids: [],
        }]);
    };

    const removeTheme = (index: number) => {
        const updated = themes.filter((_, i) => i !== index).map((t, i) => ({ ...t, ordre: i + 1 }));
        setThemes(updated);
    };

    const moveTheme = (index: number, direction: -1 | 1) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= themes.length) return;
        const updated = [...themes];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setThemes(updated.map((t, i) => ({ ...t, ordre: i + 1 })));
    };

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 2 / 6 — Thèmes de la formation</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Personnalisez les thèmes repris de l'entité. Vous pouvez modifier, ajouter ou supprimer des thèmes.</p>

            {/* Plan Title */}
            <div className="mb-8">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Titre du plan *</label>
                <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder="Ex: Formation React.js Avancé — Mai 2026"
                    className="w-full px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Themes */}
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                {themes.map((theme, index) => (
                    <div key={index} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thème {index + 1}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => moveTheme(index, -1)} disabled={index === 0} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                                </button>
                                <button onClick={() => moveTheme(index, 1)} disabled={index === themes.length - 1} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {themes.length > 1 && (
                                    <button onClick={() => removeTheme(index)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nom *</label>
                                <input
                                    type="text"
                                    value={theme.nom}
                                    onChange={(e) => updateTheme(index, 'nom', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm font-medium border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Durée (h) *</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    value={theme.duree_heures}
                                    onChange={(e) => updateTheme(index, 'duree_heures', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm font-medium border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Objectifs</label>
                                <input
                                    type="text"
                                    value={theme.objectifs}
                                    onChange={(e) => updateTheme(index, 'objectifs', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm font-medium border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add + Summary */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={addTheme}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    Ajouter un thème
                </button>
                <div className="text-right">
                    <p className="text-sm font-black text-slate-900">Durée totale : {totalHeures}h</p>
                    <p className="text-[10px] text-slate-400 font-bold">{themes.length} thème(s)</p>
                </div>
            </div>
        </div>
    );
}
