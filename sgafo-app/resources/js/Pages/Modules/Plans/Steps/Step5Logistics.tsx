import { useState, useMemo, useEffect } from 'react';
import { SiteFormation, Hotel } from '@/types/logistique';
import { PlanHebergement, PlanFormateur } from '@/types/plan';

interface Props {
    mode: string;
    sites: SiteFormation[];
    siteId: number | null;
    setSiteId: (v: number | null) => void;
    hotels: Hotel[];
    hebergements: PlanHebergement[];
    setHebergements: (v: PlanHebergement[]) => void;
    formateurs: PlanFormateur[];
    participantIds: number[];
    animateurIds: number[];
    dateDebut: string;
    dateFin: string;
    plateforme: string;
    setPlateforme: (v: string) => void;
    lienVisio: string;
    setLienVisio: (v: string) => void;
}

const PLATFORMES = ['Microsoft Teams', 'Zoom', 'Google Meet', 'Webex', 'Autre'];

export default function Step5Logistics({
    mode,
    sites,
    siteId,
    setSiteId,
    hotels,
    hebergements,
    setHebergements,
    formateurs,
    participantIds,
    animateurIds,
    dateDebut,
    dateFin,
    plateforme,
    setPlateforme,
    lienVisio,
    setLienVisio
}: Props) {
    const isADistance = mode?.toLowerCase().includes('distance');
    const isHybride = mode?.toLowerCase().includes('hybride');

    const [activeTab, setActiveTab] = useState<'site' | 'hebergement' | 'virtuel'>(
        isADistance ? 'virtuel' : 'site'
    );

    // ─── Variables communes ───
    const defaultNbNuits = useMemo(() => {
        if (!dateDebut || !dateFin) return 0;
        const diff = new Date(dateFin).getTime() - new Date(dateDebut).getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    }, [dateDebut, dateFin]);

    const totalHebergementCost = hebergements.reduce((sum, h) => sum + Number(h.cout_total), 0);

    const getFormateurInfo = (id: number) => formateurs.find(f => f.id === id);
    const getHotelInfo = (id: number) => hotels.find(h => h.id === id);

    // ─── ONGLET 1: SITE DE FORMATION ───
    const [searchSite, setSearchSite] = useState('');
    const [filterVilleSite, setFilterVilleSite] = useState('');
    const [filterRegionSite, setFilterRegionSite] = useState('');

    const villesSites = useMemo(() => [...new Set(sites.map(s => s.ville).filter(Boolean))] as string[], [sites]);
    const regionsSites = useMemo(() => [...new Set(sites.map(s => s.region?.nom).filter(Boolean))] as string[], [sites]);

    const filteredSites = useMemo(() => {
        return sites.filter(s => {
            if (searchSite && !s.nom.toLowerCase().includes(searchSite.toLowerCase())) return false;
            if (filterVilleSite && s.ville !== filterVilleSite) return false;
            if (filterRegionSite && s.region?.nom !== filterRegionSite) return false;
            return true;
        });
    }, [sites, searchSite, filterVilleSite, filterRegionSite]);

    const selectedSiteObj = sites.find(s => s.id === siteId);

    // ─── ONGLET 2: HEBERGEMENT ───
    const personnes = useMemo(() => {
        const list: { user: PlanFormateur, role: 'Animateur' | 'Participant' }[] = [];
        animateurIds.forEach(id => {
            const f = getFormateurInfo(id);
            if (f && !list.find(item => item.user.id === id)) list.push({ user: f, role: 'Animateur' });
        });
        participantIds.forEach(id => {
            const f = getFormateurInfo(id);
            if (f && !list.find(item => item.user.id === id)) list.push({ user: f, role: 'Participant' });
        });
        return list;
    }, [animateurIds, participantIds, formateurs]);

    const [searchHeb, setSearchHeb] = useState('');
    const [filterRoleHeb, setFilterRoleHeb] = useState('');
    const [selectedHebUserIds, setSelectedHebUserIds] = useState<number[]>([]);

    const [searchHotel, setSearchHotel] = useState('');
    const [filterVilleHotel, setFilterVilleHotel] = useState('');
    const villesHotels = useMemo(() => [...new Set(hotels.map(h => h.ville).filter(Boolean))] as string[], [hotels]);

    const filteredPersonnes = useMemo(() => {
        return personnes.filter(p => {
            if (searchHeb) {
                const search = searchHeb.toLowerCase();
                const fullName = `${p.user.prenom} ${p.user.nom}`.toLowerCase();
                if (!fullName.includes(search)) return false;
            }
            if (filterRoleHeb && p.role !== filterRoleHeb) return false;
            return true;
        });
    }, [personnes, searchHeb, filterRoleHeb]);

    const allFilteredSelected = filteredPersonnes.length > 0 && filteredPersonnes.every(p => selectedHebUserIds.includes(p.user.id));

    const toggleSelectUser = (id: number) => {
        if (selectedHebUserIds.includes(id)) {
            setSelectedHebUserIds(prev => prev.filter(uId => uId !== id));
        } else {
            setSelectedHebUserIds(prev => [...prev, id]);
        }
    };

    const toggleSelectAllUsers = () => {
        if (allFilteredSelected) {
            const ids = filteredPersonnes.map(p => p.user.id);
            setSelectedHebUserIds(prev => prev.filter(id => !ids.includes(id)));
        } else {
            const ids = filteredPersonnes.map(p => p.user.id);
            setSelectedHebUserIds(prev => [...new Set([...prev, ...ids])]);
        }
    };

    const filteredHotels = useMemo(() => {
        return hotels.filter(h => {
            if (searchHotel && !h.nom.toLowerCase().includes(searchHotel.toLowerCase())) return false;
            if (filterVilleHotel && h.ville !== filterVilleHotel) return false;
            return true;
        });
    }, [hotels, searchHotel, filterVilleHotel]);

    const handleAffecterHotel = (hotel: Hotel) => {
        if (selectedHebUserIds.length === 0 || defaultNbNuits === 0) return;
        
        const newHebs = [...hebergements];
        
        selectedHebUserIds.forEach(userId => {
            const existingIndex = newHebs.findIndex(h => h.user_id === userId);
            if (existingIndex !== -1) newHebs.splice(existingIndex, 1);
            
            const cout = hotel.prix_nuitee * defaultNbNuits;
            
            newHebs.push({
                user_id: userId,
                hotel_id: hotel.id,
                nombre_nuits: defaultNbNuits,
                cout_total: cout
            });
        });
        
        setHebergements(newHebs);
        setSelectedHebUserIds([]); 
        setSearchHotel('');
    };

    const updateNuits = (userId: number, nuits: number) => {
        const newHebs = hebergements.map(h => {
            if (h.user_id === userId) {
                const hotel = getHotelInfo(h.hotel_id);
                const cout = hotel ? hotel.prix_nuitee * nuits : 0;
                return { ...h, nombre_nuits: nuits, cout_total: cout };
            }
            return h;
        });
        setHebergements(newHebs);
    };

    const removeHebergement = (userId: number) => {
        setHebergements(hebergements.filter(h => h.user_id !== userId));
    };

    const removeAllHebergements = () => {
        setHebergements([]);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Étape 5 / 6 — Logistique & Hébergement</h2>
                    <p className="text-xs text-slate-400 font-medium">
                        Configurez le lieu et les conditions de la formation.
                    </p>
                </div>
                <div className="bg-blue-600 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20">
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-none mb-1">Mode Actuel</p>
                    <p className="text-xs font-black text-white uppercase tracking-wider">{mode}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-8 gap-6">
                {!isADistance && (
                    <button
                        onClick={() => setActiveTab('site')}
                        className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'site'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        📍 Site physique
                    </button>
                )}
                
                {(isADistance || isHybride) && (
                    <button
                        onClick={() => setActiveTab('virtuel')}
                        className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'virtuel'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        💻 Virtuel {isADistance ? '(Requis)' : '(Optionnel)'}
                    </button>
                )}

                {!isADistance && (
                    <button
                        onClick={() => setActiveTab('hebergement')}
                        className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'hebergement'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        🏨 Hébergement ({hebergements.length})
                    </button>
                )}
            </div>

            {/* ─── CONTENU VIRTUEL ─── */}
            {activeTab === 'virtuel' && (
                <div className="animate-in fade-in duration-300 space-y-8">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider">Configuration de la Plateforme</h3>
                                <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest mt-0.5">Détails de la visioconférence</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Choix de la Plateforme</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PLATFORMES.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPlateforme(p)}
                                            className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all ${
                                                plateforme === p
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lien de la Visioconférence</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        placeholder="https://teams.microsoft.com/l/meetup-join/..."
                                        value={lienVisio}
                                        onChange={e => setLienVisio(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                                    />
                                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.823a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" /></svg>
                                </div>
                                <p className="text-[9px] font-medium text-slate-400 italic">Copiez et collez le lien complet d'invitation ici.</p>
                            </div>
                        </div>
                    </div>

                    {isADistance && (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">Note pour le mode à distance</h4>
                                <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                                    En mode 100% à distance, le choix d'un site physique et la gestion de l'hébergement sont désactivés. 
                                    Tous les participants recevront le lien de connexion configuré ci-dessus.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── CONTENU SITE ─── */}
            {activeTab === 'site' && !isADistance && (
                <div className="animate-in fade-in duration-300">
                    <div className="mb-10">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Site Sélectionné</h3>
                        {selectedSiteObj ? (
                            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-black text-blue-900 flex items-center gap-2">
                                        📍 {selectedSiteObj.nom}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 mt-1">
                                        {selectedSiteObj.ville}{selectedSiteObj.region ? ` · ${selectedSiteObj.region.nom}` : ''}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                                            selectedSiteObj.capacite < participantIds.length
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            Capacité: {selectedSiteObj.capacite} places
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                            ({participantIds.length} participant{participantIds.length > 1 ? 's' : ''})
                                        </span>
                                    </div>
                                    {selectedSiteObj.capacite < participantIds.length && (
                                        <p className="text-[10px] font-bold text-red-500 mt-2">
                                            ⚠️ Attention : La capacité du site est inférieure au nombre de participants.
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSiteId(null)}
                                    className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                >
                                    ✕ Retirer
                                </button>
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">⚠️ Aucun site sélectionné</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-1">Étape optionnelle pour les formations hors-site.</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Catalogue des Sites
                        </h3>
                        
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="Rechercher un site..."
                                value={searchSite}
                                onChange={e => setSearchSite(e.target.value)}
                                className="flex-1 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <select
                                value={filterVilleSite}
                                onChange={e => setFilterVilleSite(e.target.value)}
                                className="w-48 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Toutes les Villes</option>
                                {villesSites.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-y-auto max-h-[40vh]">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-center w-12 text-[10px] font-black text-slate-400 uppercase">Choix</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Nom du site</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Ville</th>
                                        <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase w-24">Capacité</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredSites.map(site => {
                                        const isSelected = site.id === siteId;
                                        return (
                                            <tr key={site.id} onClick={() => setSiteId(site.id)} className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                                                <td className="px-4 py-4 text-center">
                                                    <div className={`w-4 h-4 rounded-full border-2 mx-auto flex items-center justify-center ${
                                                        isSelected ? 'border-blue-500' : 'border-slate-300'
                                                    }`}>
                                                        {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 font-bold text-slate-800">{site.nom}</td>
                                                <td className="px-4 py-4 font-medium text-slate-500 text-xs">{site.ville || '-'}</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">{site.capacite} pl.</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── CONTENU HÉBERGEMENT ─── */}
            {activeTab === 'hebergement' && !isADistance && (
                <div className="animate-in fade-in duration-300">
                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Période de la formation</p>
                                <p className="text-sm font-bold text-slate-800">
                                    {dateDebut && dateFin ? `Du ${dateDebut} au ${dateFin}` : 'Non définie'} 
                                    <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-black">= {defaultNbNuits} nuits (calendaire)</span>
                                </p>
                            </div>
                        </div>
                        {isHybride && (
                            <div className="bg-blue-100/50 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-200">
                                Mode Hybride : Ajustez les nuits manuellement
                            </div>
                        )}
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Affectations Hébergement
                            </h3>
                            {hebergements.length > 0 && (
                                <button onClick={removeAllHebergements} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">
                                    Tout retirer
                                </button>
                            )}
                        </div>

                        {hebergements.length === 0 ? (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucun hébergement enregistré</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-sm">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Nom Prénom</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Hôtel</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase w-32">Nombres de Nuits</th>
                                            <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase w-28">Coût Total</th>
                                            <th className="px-4 py-3 text-center w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {hebergements.map(heb => {
                                            const uInfo = getFormateurInfo(heb.user_id);
                                            const hInfo = getHotelInfo(heb.hotel_id);
                                            return (
                                                <tr key={heb.user_id}>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{uInfo ? `${uInfo.prenom} ${uInfo.nom}` : '-'}</td>
                                                    <td className="px-4 py-3 font-medium text-slate-600 text-xs">{hInfo?.nom || '-'}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button 
                                                                onClick={() => updateNuits(heb.user_id, Math.max(1, heb.nombre_nuits - 1))}
                                                                className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400"
                                                            >-</button>
                                                            <input 
                                                                type="number" 
                                                                value={heb.nombre_nuits}
                                                                onChange={e => updateNuits(heb.user_id, parseInt(e.target.value) || 1)}
                                                                className="w-12 text-center text-xs font-black border-none focus:ring-0 p-0"
                                                            />
                                                            <button 
                                                                onClick={() => updateNuits(heb.user_id, heb.nombre_nuits + 1)}
                                                                className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400"
                                                            >+</button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-xs font-black text-emerald-600">{Number(heb.cout_total).toLocaleString()} MAD</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button onClick={() => removeHebergement(heb.user_id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-slate-50 font-black text-xs">
                                            <td colSpan={3} className="px-4 py-3 text-right uppercase text-slate-400 tracking-widest">Total hébergement</td>
                                            <td className="px-4 py-3 text-right text-emerald-600">{totalHebergementCost.toLocaleString()} MAD</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Sélection des personnes et hôtels identique au code original... */}
                    {defaultNbNuits > 0 && (
                        <div>
                             <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Sélectionner des personnes
                            </h3>
                            
                            <div className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="Rechercher nom..."
                                    value={searchHeb}
                                    onChange={e => setSearchHeb(e.target.value)}
                                    className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                <select
                                    value={filterRoleHeb}
                                    onChange={e => setFilterRoleHeb(e.target.value)}
                                    className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tous les rôles</option>
                                    <option value="Animateur">Animateurs</option>
                                    <option value="Participant">Participants</option>
                                </select>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl overflow-y-auto max-h-[35vh] text-sm">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 text-center w-12">
                                                {filteredPersonnes.length > 0 && (
                                                    <div
                                                        onClick={toggleSelectAllUsers}
                                                        className={`w-4 h-4 rounded border-2 mx-auto cursor-pointer flex items-center justify-center transition-colors ${
                                                            allFilteredSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 hover:border-blue-500'
                                                        }`}
                                                    >
                                                        {allFilteredSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                )}
                                            </th>
                                            <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Nom & Prénom</th>
                                            <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Rôle</th>
                                            <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredPersonnes.map(p => {
                                            const isSelected = selectedHebUserIds.includes(p.user.id);
                                            const isAlreadyAssigned = hebergements.some(h => h.user_id === p.user.id);
                                            return (
                                                <tr key={p.user.id} onClick={() => toggleSelectUser(p.user.id)} className={`cursor-pointer transition-colors ${isAlreadyAssigned ? 'opacity-50 bg-slate-50' : isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className={`w-4 h-4 rounded border-2 mx-auto flex items-center justify-center transition-colors ${
                                                            isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'
                                                        }`}>
                                                            {isSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{p.user.prenom} {p.user.nom}</td>
                                                    <td className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">{p.role}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {isAlreadyAssigned && (
                                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">✓ Hébergé</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {selectedHebUserIds.length > 0 && (
                                <div className="mt-6 p-5 border-2 border-blue-200 bg-blue-50/30 rounded-xl animate-in fade-in slide-in-from-top-4">
                                    <h4 className="text-sm font-black text-blue-900 flex items-center gap-2 mb-4">
                                        🏨 Choisir un hôtel pour les {selectedHebUserIds.length} personnes
                                    </h4>
                                    <div className="bg-white border border-blue-100 rounded-xl overflow-y-auto max-h-[30vh]">
                                        <table className="min-w-full divide-y divide-blue-50">
                                            <thead className="bg-blue-50/50 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-[10px] font-black text-blue-800 uppercase">Hôtel</th>
                                                    <th className="px-4 py-2 text-right text-[10px] font-black text-blue-800 uppercase">Prix / Nuit</th>
                                                    <th className="px-4 py-2 text-center w-24"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 text-xs">
                                                {filteredHotels.map(hotel => (
                                                    <tr key={hotel.id}>
                                                        <td className="px-4 py-3 font-bold text-slate-800">{hotel.nom}</td>
                                                        <td className="px-4 py-3 text-right font-medium text-slate-600">{Number(hotel.prix_nuitee).toLocaleString()} MAD</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button
                                                                onClick={() => handleAffecterHotel(hotel)}
                                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
                                                            >
                                                                Affecter
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
