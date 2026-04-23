import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlanFormation } from '@/types/plan';
import { useState, useMemo } from 'react';

interface Props {
    plans: PlanFormation[];
    secteurs: { id: number, nom: string }[];
    filters: {
        search?: string;
        secteur?: string;
    };
}

export default function Index({ plans, secteurs, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedSecteur, setSelectedSecteur] = useState(filters.secteur || '');

    const filteredPlans = useMemo(() => {
        return plans.filter(plan => {
            const matchesSearch = plan.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 plan.entite?.titre.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSecteur = selectedSecteur === '' || plan.entite?.secteur_id.toString() === selectedSecteur;
            return matchesSearch && matchesSecteur;
        });
    }, [plans, searchQuery, selectedSecteur]);

    return (
        <AuthenticatedLayout
            header={<span className="font-black text-slate-900">📚 Catalogue National des Formations</span>}
        >
            <Head title="Catalogue National" />

            <div className="space-y-10 animate-in fade-in duration-700">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                            Explorez l'excellence pédagogique de l'OFPPT.
                        </h1>
                        <p className="mt-4 text-slate-400 font-medium text-lg leading-relaxed">
                            Accédez à la bibliothèque nationale des plans de formation validés. 
                            Consultez les expériences réussies et inspirez-vous pour vos futurs projets.
                        </p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
                            placeholder="Rechercher une formation par titre ou mot-clé..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <select
                        className="w-full md:w-64 bg-slate-50 border-transparent rounded-xl py-4 pl-5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xs font-black uppercase tracking-widest text-slate-500 cursor-pointer"
                        value={selectedSecteur}
                        onChange={(e) => setSelectedSecteur(e.target.value)}
                    >
                        <option value="">Tous les Secteurs</option>
                        {secteurs.map(s => (
                            <option key={s.id} value={s.id}>{s.nom}</option>
                        ))}
                    </select>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPlans.map((plan) => (
                        <div key={plan.id} className="group bg-white rounded-3xl border border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col overflow-hidden">
                            {/* Card Header (Stats & ID) */}
                            <div className="p-6 pb-0 flex justify-between items-start">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                                    {plan.entite?.secteur?.nom}
                                </span>
                                <span className="text-[10px] font-black text-slate-300">#PLAN-{plan.id}</span>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-1">
                                <Link href={route('modules.catalogue.show', plan.id)}>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                                        {plan.titre}
                                    </h3>
                                </Link>
                                <p className="mt-3 text-sm text-slate-500 font-medium line-clamp-2 italic">
                                    "{plan.entite?.titre}"
                                </p>
                                
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-200">
                                        {plan.createur?.prenom[0]}{plan.createur?.nom[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-slate-900">{plan.createur?.prenom} {plan.createur?.nom}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auteur</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900">{plan.themes?.length || 0}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest tracking-tighter">Thèmes</span>
                                    </div>
                                    <div className="flex flex-col border-l border-slate-200 pl-4">
                                        <span className="text-sm font-black text-slate-900">
                                            {plan.themes?.reduce((sum, t) => sum + Number(t.duree_heures), 0)}h
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest tracking-tighter">Total</span>
                                    </div>
                                </div>
                                
                                <Link
                                    href={route('modules.catalogue.show', plan.id)}
                                    className="p-3 bg-white text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm border border-slate-200 transition-all hover:scale-110 active:scale-90"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M5 12h16" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlans.length === 0 && (
                    <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-slate-200 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-8">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Aucun plan trouvé</h3>
                        <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">
                            Il n'y a pas encore de plans validés pour ces critères dans le catalogue national.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
