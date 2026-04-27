import { Entite } from '@/types/entite';
import { PlanTheme, PlanFormateur, PlanFormation, PlanHebergement } from '@/types/plan';
import { SiteFormation, Hotel } from '@/types/logistique';

interface Props {
    selectedEntite: Entite | null;
    titre: string;
    themes: PlanTheme[];
    formateurs: PlanFormateur[];
    participantIds: number[];
    sites: SiteFormation[];
    siteId: number | null;
    plateforme: string;
    lienVisio: string;
    dateDebut: string;
    dateFin: string;
    hebergements: PlanHebergement[];
    hotels: Hotel[];
    isRF: boolean;
    plan: PlanFormation | null;
    onSave: () => void;
    onSubmit: () => void;
    onConfirm: () => void;
}

export default function Step6Summary({
    selectedEntite, titre, themes, formateurs, participantIds, sites, siteId, plateforme, lienVisio, dateDebut, dateFin, hebergements, hotels, isRF, plan, onSave, onSubmit, onConfirm
}: Props) {
    const getFormateur = (id: number) => formateurs.find(f => f.id === id);
    const getParticipant = (id: number) => formateurs.find(f => f.id === id); // assuming formateurs contains all users for now
    const site = sites.find(s => s.id === siteId);
    const allAnimateurIds = [...new Set(themes.flatMap(t => t.animateur_ids || []))];
    const totalHeures = themes.reduce((s, t) => s + Number(t.duree_heures || 0), 0);

    const isADistance = selectedEntite?.mode?.toLowerCase().includes('distance');
    const isHybride = selectedEntite?.mode?.toLowerCase().includes('hybride');

    // Validation checks
    const checks = [
        { label: 'Tous les thèmes ont au moins un animateur', ok: themes.every(t => (t.animateur_ids?.length || 0) > 0) },
        { label: 'Au moins 1 participant sélectionné', ok: participantIds.length > 0 },
        { label: 'Titre du plan renseigné', ok: titre.trim().length > 0 },
        { label: 'Dates de formation définies', ok: !!dateDebut && !!dateFin },
    ];

    if (isADistance) {
        checks.push({ label: 'Plateforme virtuelle sélectionnée', ok: !!plateforme });
        checks.push({ label: 'Lien de visioconférence renseigné', ok: !!lienVisio });
    }

    const allValid = checks.every(c => c.ok);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 6 / 6 — Récapitulatif Final</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Veuillez vérifier attentivement toutes les informations avant de confirmer ou de soumettre le plan.</p>

            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
                {/* Informations Générales */}
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16"></div>
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Informations Générales</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Titre de la formation</p>
                            <p className="text-sm font-black text-slate-800">{titre || <span className="text-red-400 italic font-medium">Non renseigné</span>}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Période Prévue</p>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">{formatDate(dateDebut)}</span>
                                <span className="text-slate-400 font-bold">au</span>
                                <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">{formatDate(dateFin)}</span>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Entité & Mode de formation</p>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                                    {selectedEntite?.titre}
                                </span>
                                <span className="text-sm text-slate-400">•</span>
                                <span className="text-sm font-medium text-slate-600">{selectedEntite?.type}</span>
                                <span className="text-sm text-slate-400">•</span>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold">
                                    {selectedEntite?.mode}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Themes + Animators */}
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Programme & Animation</h3>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">{themes.length} Thèmes</span>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-100">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-3 px-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Ordre</th>
                                    <th className="py-3 px-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Thème</th>
                                    <th className="py-3 px-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Objectifs</th>
                                    <th className="py-3 px-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Durée</th>
                                    <th className="py-3 px-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Animateurs Assignés</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {themes.map((t, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 font-black text-slate-400">#{t.ordre}</td>
                                        <td className="py-3 px-4 font-bold text-slate-800">{t.nom}</td>
                                        <td className="py-3 px-4 text-slate-500 line-clamp-1" title={t.objectifs}>{t.objectifs || '-'}</td>
                                        <td className="py-3 px-4 font-medium text-slate-600">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs">{t.duree_heures}h</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(t.animateur_ids || []).map(id => {
                                                    const f = getFormateur(id);
                                                    return f ? (
                                                        <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                                                            <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[8px]">{f.prenom[0]}{f.nom[0]}</div>
                                                            {f.prenom} {f.nom}
                                                        </span>
                                                    ) : null;
                                                })}
                                                {(t.animateur_ids || []).length === 0 && <span className="text-red-400 italic">Aucun animateur</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-3 flex justify-end text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        Volume Total : <span className="text-indigo-600 ml-1">{totalHeures} heures</span>
                    </div>
                </div>

                {/* Participants */}
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Participants Sélectionnés</h3>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">{participantIds.length} Personnes</span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                        {participantIds.length > 0 ? participantIds.map(id => {
                            const p = getParticipant(id);
                            return p ? (
                                <span key={id} className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 shadow-sm">
                                    {p.prenom} {p.nom}
                                </span>
                            ) : (
                                <span key={id} className="px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-400">Utilisateur #{id}</span>
                            );
                        }) : (
                            <p className="text-sm text-red-400 italic py-2">Aucun participant n'a été ajouté au plan.</p>
                        )}
                    </div>
                </div>

                {/* Logistics */}
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Moyens & Logistique</h3>
                    <div className="space-y-6">
                        {!isADistance && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Lieu de formation (Présentiel)</p>
                                {site ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-lg">📍</div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{site.nom}</p>
                                            <p className="text-xs text-slate-500">{site.ville} — Capacité : {site.capacite} places</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-red-400 italic">⚠️ Aucun site physique sélectionné.</p>
                                )}
                            </div>
                        )}

                        {(isADistance || isHybride) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Plateforme Visio</p>
                                    {plateforme ? (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <span className="text-blue-500">💻</span>
                                            <span className="text-sm font-bold text-slate-700">{plateforme}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-red-400 italic">Non sélectionnée</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Lien d'accès</p>
                                    {lienVisio ? (
                                        <a href={lienVisio} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline truncate max-w-xs block" title={lienVisio}>
                                            {lienVisio}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-medium text-red-400 italic">Lien non renseigné</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {hebergements && hebergements.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    Hébergements Réservés ({hebergements.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {hebergements.map((heb, idx) => {
                                        const hotel = hotels.find(h => h.id === heb.hotel_id);
                                        const person = getParticipant(heb.user_id);
                                        return (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-lg">🛏️</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{person ? `${person.prenom} ${person.nom}` : `ID: ${heb.user_id}`}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{hotel?.nom} — {heb.nombre_nuits} nuit(s)</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-black text-amber-600">{heb.cout_total} DH</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Validation Checklist */}
                <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200">
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
