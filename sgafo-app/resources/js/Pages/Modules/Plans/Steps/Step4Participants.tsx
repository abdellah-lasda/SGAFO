import { PlanFormateur } from '@/types/plan';
import { useState, useMemo } from 'react';

interface Props {
    formateurs: PlanFormateur[];
    participantIds: number[];
    setParticipantIds: (v: number[]) => void;
    excludeIds: number[]; // animateur IDs to exclude
}

export default function Step4Participants({ formateurs, participantIds, setParticipantIds, excludeIds }: Props) {
    const [search, setSearch] = useState('');
    const [filterRegion, setFilterRegion] = useState<string>('');

    // Available formateurs (excluding animators)
    const available = useMemo(() => {
        return formateurs.filter(f => !excludeIds.includes(f.id));
    }, [formateurs, excludeIds]);


    const regions = useMemo(() => {
        const r = new Set<string>();
        available.forEach(f => {
            f.instituts?.forEach(inst => {
                if (inst.region) r.add(inst.region.nom);
            });
        });
        return [...r].sort();
    }, [available]);

    const filtered = useMemo(() => {
        return available.filter(f => {
            const matchSearch = !search ||
                f.nom.toLowerCase().includes(search.toLowerCase()) ||
                f.prenom.toLowerCase().includes(search.toLowerCase());
            const matchRegion = !filterRegion ||
                f.instituts?.some(inst => inst.region?.nom === filterRegion);
            return matchSearch && matchRegion;
        });
    }, [available, search, filterRegion]);

    const toggleParticipant = (id: number) => {
        if (participantIds.includes(id)) {
            setParticipantIds(participantIds.filter(pid => pid !== id));
        } else {
            setParticipantIds([...participantIds, id]);
        }
    };

    const selectAll = () => {
        const allFilteredIds = filtered.map(f => f.id);
        const merged = [...new Set([...participantIds, ...allFilteredIds])];
        setParticipantIds(merged);
    };

    const deselectAll = () => {
        const filteredIds = new Set(filtered.map(f => f.id));
        setParticipantIds(participantIds.filter(id => !filteredIds.has(id)));
    };

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 4 / 6 — Sélection des participants</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">Choisissez les formateurs qui suivront cette formation. Les animateurs (étape 3) sont automatiquement exclus.</p>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou prénom..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="px-4 py-3 text-sm font-medium border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                    <option value="">Toutes les régions</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="flex gap-2">
                    <button onClick={selectAll} className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-all">
                        Tout cocher
                    </button>
                    <button onClick={deselectAll} className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 transition-all">
                        Tout décocher
                    </button>
                </div>
            </div>

            {/* Exclusion notice */}
            {excludeIds.length > 0 && (
                <div className="mb-4 px-4 py-2.5 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-600">
                        ⚠️ {excludeIds.length} animateur(s) exclu(s) de la liste (déjà affectés à l'étape 3)
                    </p>
                </div>
            )}

            {/* Dual list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available / Filterable list */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Formateurs disponibles ({filtered.length})</p>
                    <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-2">
                        {filtered.map(f => {
                            const isSelected = participantIds.includes(f.id);
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => toggleParticipant(f.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                                        isSelected
                                            ? 'border-blue-200 bg-blue-50/50'
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                                    }`}>
                                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{f.prenom} {f.nom}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{f.instituts?.[0]?.nom || 'Externe'} {f.instituts?.[0]?.region ? `· ${f.instituts[0].region.nom}` : ''}</p>
                                    </div>
                                </button>
                            );
                        })}
                        {filtered.length === 0 && (
                            <p className="text-center py-8 text-xs text-slate-300 font-medium">Aucun formateur trouvé.</p>
                        )}
                    </div>
                </div>

                {/* Selected list */}
                <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Sélectionnés ({participantIds.length})</p>
                    <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-2">
                        {participantIds.map(id => {
                            const f = formateurs.find(fo => fo.id === id);
                            if (!f) return null;
                            return (
                                <div key={id} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                                            {f.prenom[0]}{f.nom[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{f.prenom} {f.nom}</p>
                                            <p className="text-[10px] text-slate-400">{f.instituts?.[0]?.nom || 'Externe'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleParticipant(id)} className="p-1.5 text-emerald-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            );
                        })}
                        {participantIds.length === 0 && (
                            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-xs text-slate-300 font-medium">Aucun participant sélectionné.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 text-right">
                <p className="text-sm font-black text-slate-900">
                    📊 Total sélectionné : {participantIds.length} participant(s)
                </p>
            </div>
        </div>
    );
}
