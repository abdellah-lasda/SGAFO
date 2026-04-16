import { Entite } from '@/types/entite';
import { PlanTheme, PlanFormateur, PlanFormation } from '@/types/plan';
import { SiteFormation } from '@/types/logistique';

interface Props {
    selectedEntite: Entite | null;
    titre: string;
    themes: PlanTheme[];
    formateurs: PlanFormateur[];
    participantIds: number[];
    sites: SiteFormation[];
    siteId: number | null;
    isRF: boolean;
    plan: PlanFormation | null;
    onSave: () => void;
    onSubmit: () => void;
    onConfirm: () => void;
}

export default function Step6Summary({
    selectedEntite, titre, themes, formateurs, participantIds, sites, siteId, isRF, plan, onSave, onSubmit, onConfirm
}: Props) {
    const getFormateur = (id: number) => formateurs.find(f => f.id === id);
    const site = sites.find(s => s.id === siteId);
    const allAnimateurIds = [...new Set(themes.flatMap(t => t.animateur_ids || []))];
    const totalHeures = themes.reduce((s, t) => s + Number(t.duree_heures || 0), 0);

    // Validation checks
    const checks = [
        { label: 'Tous les thèmes ont au moins un animateur', ok: themes.every(t => (t.animateur_ids?.length || 0) > 0) },
        { label: 'Au moins 1 participant sélectionné', ok: participantIds.length > 0 },
        { label: 'Titre du plan renseigné', ok: titre.trim().length > 0 },
    ];
    const allValid = checks.every(c => c.ok);

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 6 / 6 — Récapitulatif</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Vérifiez les informations avant l'action finale.</p>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                {/* Entity */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Entité de référence</h3>
                    <p className="text-sm font-black text-slate-900">{selectedEntite?.titre}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{selectedEntite?.secteur?.nom} · {selectedEntite?.type} · {selectedEntite?.mode}</p>
                </div>

                {/* Plan Title */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Plan</h3>
                    <p className="text-sm font-black text-slate-900">{titre}</p>
                </div>

                {/* Themes + Animators */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Thèmes ({themes.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-2 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">#</th>
                                    <th className="py-2 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Thème</th>
                                    <th className="py-2 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Durée</th>
                                    <th className="py-2 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Animateurs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {themes.map((t, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                        <td className="py-3 font-bold text-slate-400">{t.ordre}</td>
                                        <td className="py-3 font-bold text-slate-800">{t.nom}</td>
                                        <td className="py-3 font-medium text-slate-500">{t.duree_heures}h</td>
                                        <td className="py-3 font-medium text-slate-500">
                                            {(t.animateur_ids || []).map(id => {
                                                const f = getFormateur(id);
                                                return f ? `${f.prenom[0]}. ${f.nom}` : '';
                                            }).join(', ') || <span className="text-red-400">Non affecté</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-3">
                        Total : {totalHeures}h · {allAnimateurIds.length} animateur(s)
                    </p>
                </div>

                {/* Participants */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Participants ({participantIds.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {participantIds.slice(0, 10).map(id => {
                            const f = getFormateur(id);
                            return f ? (
                                <span key={id} className="px-3 py-1.5 bg-white rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600">
                                    {f.prenom} {f.nom}
                                </span>
                            ) : null;
                        })}
                        {participantIds.length > 10 && (
                            <span className="px-3 py-1.5 bg-blue-50 rounded-lg text-[10px] font-bold text-blue-600">
                                +{participantIds.length - 10} autres
                            </span>
                        )}
                    </div>
                </div>

                {/* Logistics */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Logistique</h3>
                    {site ? (
                        <p className="text-sm font-bold text-slate-800">
                            📍 {site.nom} — {site.ville} ({site.capacite} places)
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-slate-400 italic">Aucun site sélectionné</p>
                    )}
                </div>

                {/* Validation Checklist */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Validation</h3>
                    <div className="space-y-2">
                        {checks.map((c, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {c.ok ? (
                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                )}
                                <span className={`text-xs font-medium ${c.ok ? 'text-emerald-600' : 'text-red-500'}`}>{c.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 p-5 bg-white rounded-xl border-2 border-slate-200">
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onSave}
                        className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all"
                    >
                        Enregistrer brouillon
                    </button>

                    {isRF ? (
                        <button
                            onClick={onConfirm}
                            disabled={!allValid}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${
                                allValid
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20 active:scale-95'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            ✅ Confirmer
                        </button>
                    ) : (
                        <button
                            onClick={onSubmit}
                            disabled={!allValid}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${
                                allValid
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20 active:scale-95'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            📤 Soumettre au RF
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
