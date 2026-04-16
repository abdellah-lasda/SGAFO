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
    const [filterSecteur, setFilterSecteur] = useState('');
    const [filterEtablissement, setFilterEtablissement] = useState('');
    const [filterOrigine, setFilterOrigine] = useState('');

    // Available formateurs (excluding animators already assigned in step 3)
    const available = useMemo(() => {
        return formateurs.filter(f => !excludeIds.includes(f.id));
    }, [formateurs, excludeIds]);

    const secteursList = useMemo(() => {
        const all = available.flatMap(f => f.secteurs || []);
        return [...new Map(all.map(s => [s.id, s])).values()];
    }, [available]);

    const institutsList = useMemo(() => {
        const all = available.flatMap(f => f.instituts || []);
        return [...new Map(all.map(i => [i.id, i])).values()];
    }, [available]);

    const filtered = useMemo(() => {
        return available.filter(f => {
            if (search) {
                const fullName = `${f.prenom} ${f.nom}`.toLowerCase();
                if (!fullName.includes(search.toLowerCase())) return false;
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
    }, [available, search, filterSecteur, filterEtablissement, filterOrigine]);

    // Pending selection (checkboxes before clicking "Ajouter")
    const [pendingIds, setPendingIds] = useState<number[]>([]);

    const togglePending = (id: number) => {
        setPendingIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const allFilteredPending = filtered.length > 0 && filtered.every(f => pendingIds.includes(f.id));

    const toggleSelectAll = () => {
        const filteredIds = filtered.map(f => f.id);
        if (allFilteredPending) {
            setPendingIds(prev => prev.filter(id => !filteredIds.includes(id)));
        } else {
            setPendingIds(prev => [...new Set([...prev, ...filteredIds])]);
        }
    };

    const handleAjouter = () => {
        if (pendingIds.length === 0) return;
        setParticipantIds([...new Set([...participantIds, ...pendingIds])]);
        setPendingIds([]);
    };

    const removeParticipant = (id: number) => {
        setParticipantIds(participantIds.filter(pid => pid !== id));
    };

    const removeAllParticipants = () => setParticipantIds([]);

    const getFormateur = (id: number) => formateurs.find(f => f.id === id);

    return (
        <div className="p-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 4 / 6 — Sélection des participants</h2>
            <p className="text-xs text-slate-400 font-medium mb-8">
                Choisissez les formateurs qui suivront cette formation. Les animateurs (étape 3) sont automatiquement exclus.
            </p>

            {/* Exclusion notice */}
            {excludeIds.length > 0 && (
                <div className="mb-6 px-4 py-2.5 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-600">
                        ⚠️ {excludeIds.length} animateur(s) exclu(s) de la liste (déjà affectés à l'étape 3)
                    </p>
                </div>
            )}

            {/* 1. PARTICIPANTS SÉLECTIONNÉS */}
            <div className="mb-10 bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-emerald-900 flex items-center gap-2">
                        <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Participants sélectionnés
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-xs font-bold">
                            {participantIds.length} participant(s)
                        </span>
                        {participantIds.length > 0 && (
                            <button
                                onClick={removeAllParticipants}
                                className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                Tout retirer
                            </button>
                        )}
                    </div>
                </div>

                {participantIds.length === 0 ? (
                    <div className="text-center py-6 bg-white rounded-xl border border-emerald-100/50 border-dashed">
                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">⚠️ Aucun participant sélectionné</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {participantIds.map(id => {
                            const f = getFormateur(id);
                            if (!f) return null;
                            return (
                                <div key={id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 shadow-sm hover:shadow transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-black shadow-inner flex-shrink-0">
                                            {f.prenom[0]}{f.nom[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{f.prenom} {f.nom}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                {f.is_externe ? 'Externe' : 'Interne'}
                                                {f.instituts && f.instituts.length > 0 ? ` · ${f.instituts[0].nom}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeParticipant(id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold flex-shrink-0"
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

            {/* 2. CATALOGUE  */}
            <div>
                <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Rechercher et Ajouter des Participants
                </h3>

                {/* Filtres */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-1">
                        <input
                            type="text"
                            placeholder="Nom du formateur..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <select
                            value={filterSecteur}
                            onChange={(e) => setFilterSecteur(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tous les Secteurs</option>
                            {secteursList.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                    <div>
                        <select
                            value={filterEtablissement}
                            onChange={(e) => setFilterEtablissement(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tous les Établissements</option>
                            {institutsList.map(i => <option key={i.id} value={i.id}>{i.nom}</option>)}
                        </select>
                    </div>
                    <div>
                        <select
                            value={filterOrigine}
                            onChange={(e) => setFilterOrigine(e.target.value)}
                            className="w-full text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Toutes Origines</option>
                            <option value="interne">Direct / Interne</option>
                            <option value="externe">Prestataire Externe</option>
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={handleAjouter}
                            disabled={pendingIds.length === 0}
                            className={`w-full h-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                                pendingIds.length > 0
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            Ajouter ({pendingIds.length})
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-y-auto max-h-[35vh] text-sm">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-4 py-3 text-center w-12">
                                    {filtered.length > 0 && (
                                        <div
                                            onClick={toggleSelectAll}
                                            className={`w-5 h-5 rounded flex items-center justify-center border-2 cursor-pointer transition-colors mx-auto ${
                                                allFilteredPending ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white hover:border-blue-400'
                                            }`}
                                            title={allFilteredPending ? 'Tout désélectionner' : 'Tout sélectionner'}
                                        >
                                            {allFilteredPending && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    )}
                                </th>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Nom Prénom</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Établissement</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Secteur(s)</th>
                                <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Origine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs font-medium bg-slate-50">
                                        Aucun formateur ne correspond à ces critères.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(f => {
                                    const isPending = pendingIds.includes(f.id);
                                    const isAlreadyAdded = participantIds.includes(f.id);
                                    return (
                                        <tr
                                            key={f.id}
                                            onClick={() => !isAlreadyAdded && togglePending(f.id)}
                                            className={`transition-colors ${
                                                isAlreadyAdded
                                                    ? 'opacity-40 cursor-not-allowed bg-slate-50'
                                                    : isPending
                                                        ? 'bg-blue-50/50 cursor-pointer'
                                                        : 'hover:bg-slate-50 cursor-pointer'
                                            }`}
                                        >
                                            <td className="px-4 py-4 text-center">
                                                {isAlreadyAdded ? (
                                                    <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                ) : (
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors mx-auto ${
                                                        isPending ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white'
                                                    }`}>
                                                        {isPending && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 font-bold text-slate-800">
                                                {f.prenom} {f.nom}
                                                {isAlreadyAdded && <span className="ml-2 text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Ajouté</span>}
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

            {/* Summary */}
            {participantIds.length === 0 && (
                <div className="mt-8 p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    Vous devez sélectionner au moins 1 participant pour continuer.
                </div>
            )}
        </div>
    );
}
