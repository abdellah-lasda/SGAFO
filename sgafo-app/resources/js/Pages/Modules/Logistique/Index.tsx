import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Hotel, Institut } from '@/types/logistique';
import { Region } from '@/types/entite';
import HotelModal from './HotelModal';
import InstitutModal from './InstitutModal';

interface Props {
    auth: any;
    hotels: Hotel[];
    instituts: Institut[];
    regions: Region[];
}

export default function Index({ auth, hotels, instituts, regions }: Props) {
    const [activeTab, setActiveTab] = useState<'sites' | 'hotels'>('sites');
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [isInstitutModalOpen, setIsInstitutModalOpen] = useState(false);
    const [selectedInstitut, setSelectedInstitut] = useState<Institut | null>(null);

    const handleEditHotel = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setIsHotelModalOpen(true);
    };

    const handleAddHotel = () => {
        setSelectedHotel(null);
        setIsHotelModalOpen(true);
    };

    const handleEditInstitut = (institut: Institut) => {
        setSelectedInstitut(institut);
        setIsInstitutModalOpen(true);
    };

    const handleAddSite = () => {
        setSelectedInstitut(null);
        setIsInstitutModalOpen(true);
    };

    const toggleHotelStatus = (hotel: Hotel) => {
        if (confirm(`Voulez-vous vraiment ${hotel.statut === 'actif' ? 'archiver' : 'réactiver'} cet hôtel ?`)) {
            router.patch(route('modules.logistique.hotels.archive', hotel.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-slate-900">Gestion Logistique</h2>}
        >
            <Head title="Logistique - Sites & Hébergements" />

            <div className="space-y-6 animate-in fade-in duration-700">
                {/* TABS HEADER */}
                <div className="flex items-center justify-between no-print">
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveTab('sites')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'sites' 
                                ? 'bg-slate-900 text-white shadow-lg' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Sites de formation
                        </button>
                        <button
                            onClick={() => setActiveTab('hotels')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'hotels' 
                                ? 'bg-slate-900 text-white shadow-lg' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Hébergements (Hôtels)
                        </button>
                    </div>

                    {activeTab === 'hotels' && (
                        <button
                            onClick={handleAddHotel}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            Ajouter un hôtel
                        </button>
                    )}

                    {activeTab === 'sites' && (
                        <button
                            onClick={handleAddSite}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            Ajouter un site
                        </button>
                    )}
                </div>

                {/* SITES TABLE */}
                {activeTab === 'sites' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Référentiel des Établissements OFPPT</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/30">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Nom de l'EFP</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Région</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Localisation</th>
                                        <th className="px-8 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    { instituts.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-400">Aucun établissement enregistré pour le moment.</p>
                                                    <button onClick={handleAddHotel} className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ajouter le premier établissement</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ):( instituts.map((inst) => (
                                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 text-xs font-black text-slate-400">{inst.code || '---'}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-slate-900">{inst.nom}</td>
                                            <td className="px-8 py-5">
                                                <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">
                                                    {inst.region?.nom}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                {inst.ville ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700">{inst.ville}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium italic">{inst.adresse}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-300 italic">Adresse non renseignée</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => handleEditInstitut(inst)}
                                                    className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* HOTELS TABLE */}
                {activeTab === 'hotels' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hôtels Partenaires & Hébergements</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/30">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Établissement</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Région / Ville</th>
                                        <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                        <th className="px-8 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Prix Nuitée</th>
                                        <th className="px-8 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                        <th className="px-8 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {hotels.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-400">Aucun hôtel enregistré pour le moment.</p>
                                                    <button onClick={handleAddHotel} className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ajouter le premier hôtel</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        hotels.map((hotel) => (
                                            <tr key={hotel.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900">{hotel.nom}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium italic">{hotel.adresse}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tabular-nums">{hotel.region?.nom}</span>
                                                        <span className="text-xs font-bold text-slate-900">{hotel.ville}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-xs font-black text-slate-600 tracking-tighter tabular-nums">{hotel.telephone || '---'}</span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-lg border border-emerald-100 tabular-nums">
                                                        {hotel.prix_nuitee} DH
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                        hotel.statut === 'actif' 
                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {hotel.statut}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button 
                                                            onClick={() => handleEditHotel(hotel)}
                                                            className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => toggleHotelStatus(hotel)}
                                                            className={`p-2 rounded-lg transition-all ${
                                                                hotel.statut === 'actif' 
                                                                ? 'text-slate-300 hover:text-amber-600 hover:bg-amber-50' 
                                                                : 'text-slate-300 hover:text-emerald-600 hover:bg-emerald-50'
                                                            }`}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            <HotelModal 
                isOpen={isHotelModalOpen} 
                onClose={() => setIsHotelModalOpen(false)} 
                hotel={selectedHotel} 
                regions={regions}
            />

            <InstitutModal
                isOpen={isInstitutModalOpen}
                onClose={() => setIsInstitutModalOpen(false)}
                institut={selectedInstitut}
            />

        </AuthenticatedLayout>
    );
}
