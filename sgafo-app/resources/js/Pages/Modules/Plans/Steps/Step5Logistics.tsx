import { SiteFormation } from '@/types/logistique';

interface Props {
    sites: SiteFormation[];
    siteId: number | null;
    setSiteId: (v: number | null) => void;
}

export default function Step5Logistics({ sites, siteId, setSiteId }: Props) {
    const selected = sites.find(s => s.id === siteId);

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 5 / 6 — Logistique</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Sélectionnez le site de formation où se déroulera cette formation.</p>

            {/* Site Selection */}
            <div className="mb-8">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Site de formation</label>
                <select
                    value={siteId ?? ''}
                    onChange={(e) => setSiteId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                    <option value="">— Aucun site sélectionné —</option>
                    {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.nom} — {s.ville} (Capacité: {s.capacite})</option>
                    ))}
                </select>
            </div>

            {/* Selected site details */}
            {selected && (
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h3 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-4">Site sélectionné</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Nom</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{selected.nom}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Ville</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{selected.ville || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Capacité</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{selected.capacite} places</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Adresse</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{selected.adresse || '—'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Upcoming Feature Notice */}
            <div className="mt-8 p-5 bg-slate-900 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prochaine version</p>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                            Les fonctionnalités avancées de logistique (hébergement multi-sites avec affectation individuelle, gestion des déplacements) seront disponibles dans une prochaine mise à jour.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
