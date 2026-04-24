import { PlanTheme } from '@/types/plan';

interface Props {
    titre: string;
    setTitre: (v: string) => void;
    themes: PlanTheme[];
    setThemes: (v: PlanTheme[]) => void;
    dateDebut: string;
    setDateDebut: (v: string) => void;
    dateFin: string;
    setDateFin: (v: string) => void;
}

export default function Step2Themes({ titre, setTitre, themes, setThemes, dateDebut, setDateDebut, dateFin, setDateFin }: Props) {
    const totalHeures = themes.reduce((s, t) => s + Number(t.duree_heures || 0), 0);

    const nbJours = (() => {
        if (!dateDebut || !dateFin) return null;
        const diff = new Date(dateFin).getTime() - new Date(dateDebut).getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
        return days > 0 ? days : null;
    })();

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
        if (themes.length <= 1) return;
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
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 2 / 6 — Thèmes & Dates</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Définissez la période, le titre et le programme détaillé de la formation.</p>

            {/* ─── Bloc Infos Générales ─── */}
            <div className="mb-8 bg-blue-50/40 rounded-2xl border border-blue-100 p-6">
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Informations générales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Titre */}
                    <div className="md:col-span-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Titre du plan *</label>
                        <input
                            type="text"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Ex: Formation React.js Avancé — Juin 2026"
                            className="w-full px-4 py-3 text-sm font-medium border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    {/* Date début */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Date de début</label>
                        <input
                            type="date"
                            value={dateDebut}
                            onChange={(e) => setDateDebut(e.target.value)}
                            className="w-full px-4 py-3 text-sm font-medium border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    {/* Date fin */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Date de fin</label>
                        <input
                            type="date"
                            value={dateFin}
                            min={dateDebut || undefined}
                            onChange={(e) => setDateFin(e.target.value)}
                            className="w-full px-4 py-3 text-sm font-medium border border-blue-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    {/* Durée calculée */}
                    <div className="flex flex-col gap-2 justify-end">
                        {nbJours ? (
                            <div className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Durée</p>
                                <p className="text-lg font-black">{nbJours} jour{nbJours > 1 ? 's' : ''}</p>
                            </div>
                        ) : (
                            <div className={`w-full px-4 py-3 rounded-xl text-center border-2 border-dashed transition-all ${dateDebut && dateFin && new Date(dateFin) < new Date(dateDebut) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                <p className="text-xs font-bold">
                                    {dateDebut && dateFin && new Date(dateFin) < new Date(dateDebut) 
                                        ? 'Date de fin invalide' 
                                        : 'Sélectionnez les dates'}
                                </p>
                            </div>
                        )}
                        {dateDebut && dateFin && new Date(dateFin) < new Date(dateDebut) && (
                             <p className="text-[9px] text-red-500 font-black uppercase tracking-widest text-center animate-pulse">La fin doit être après le début</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Tableau des Thèmes ─── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Programme des thèmes — {themes.length} thème(s) · {totalHeures}h au total
                    </h3>
                    <button
                        onClick={addTheme}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-xl border border-emerald-200 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Ajouter un thème
                    </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase w-10">#</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Nom du Thème *</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase w-28">Durée (h) *</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Objectifs</th>
                                <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase w-24">Ordre</th>
                                <th className="px-4 py-3 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {themes.map((theme, index) => (
                                <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center">{theme.ordre}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={theme.nom}
                                            onChange={(e) => updateTheme(index, 'nom', e.target.value)}
                                            placeholder="Titre du thème..."
                                            className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            value={theme.duree_heures}
                                            onChange={(e) => updateTheme(index, 'duree_heures', e.target.value)}
                                            className="w-full px-3 py-2 text-sm font-black text-center bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={theme.objectifs}
                                            onChange={(e) => updateTheme(index, 'objectifs', e.target.value)}
                                            placeholder="Objectifs du module..."
                                            className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => moveTheme(index, -1)}
                                                disabled={index === 0}
                                                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <button
                                                onClick={() => moveTheme(index, 1)}
                                                disabled={index === themes.length - 1}
                                                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => removeTheme(index)}
                                            disabled={themes.length <= 1}
                                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 disabled:opacity-20 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* Total row */}
                            <tr className="bg-slate-50/80 border-t-2 border-slate-200">
                                <td colSpan={2} className="px-4 py-3"></td>
                                <td className="px-4 py-3 text-center">
                                    <span className="text-sm font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">{totalHeures}h</span>
                                </td>
                                <td colSpan={3} className="px-4 py-3 text-xs text-slate-400 font-bold">{themes.length} thème(s) au total</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {themes.some(t => !t.nom.trim() || Number(t.duree_heures) <= 0) && (
                    <p className="mt-3 text-[10px] text-red-400 font-bold">⚠️ Tous les thèmes doivent avoir un nom et une durée &gt; 0 pour continuer.</p>
                )}
            </div>
        </div>
    );
}
