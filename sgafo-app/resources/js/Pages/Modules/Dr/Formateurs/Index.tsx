import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, User as UserIcon, Building2, ChevronRight, Mail, MapPin } from 'lucide-react';

interface Formateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    instituts: Array<{ id: number, nom: string }>;
}

interface Props {
    formateurs: {
        data: Formateur[];
        links: any[];
    };
    filters: {
        search: string;
    };
}

export default function Index({ formateurs, filters }: Props) {
    const [search, setSearch] = React.useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('dr.formateurs.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Annuaire des Formateurs</span>
                </div>
            }
        >
            <Head title="Annuaire des Formateurs" />

            <div className="max-w-[1600px] mx-auto p-6 space-y-8 pb-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic mb-2">Annuaire Régional</h1>
                        <p className="text-slate-500 font-medium">Consultez et gérez les profils des formateurs de votre région</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-600"
                        />
                    </form>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-50/30">
                                    <th className="px-8 py-5">Formateur</th>
                                    <th className="px-8 py-5">Établissement</th>
                                    <th className="px-8 py-5">Contact</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {formateurs.data.map((formateur) => (
                                    <tr key={formateur.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                    <UserIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-slate-900">{formateur.prenom} {formateur.nom}</h3>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: #{formateur.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Building2 className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-bold">{formateur.instituts[0]?.nom || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium">{formateur.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link 
                                                href={route('dr.formateurs.show', formateur.id)}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                            >
                                                Voir Profile
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Simple */}
                {formateurs.links && formateurs.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {formateurs.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    link.active 
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                        : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                )}

                {/* No Results */}
                {formateurs.data.length === 0 && (
                    <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <UserIcon className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 italic">Aucun formateur trouvé</h3>
                        <p className="text-slate-500 font-medium mt-2">Essayez d'ajuster votre recherche</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
