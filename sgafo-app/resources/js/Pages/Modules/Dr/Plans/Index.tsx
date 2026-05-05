import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

interface IndexProps extends PageProps {
    plans: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ auth, plans }: IndexProps) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl text-slate-800 leading-tight">Plans de Formation de la Région</h2>}
        >
            <Head title="Plans Régionaux" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Répertoire des Formations</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultation uniquement</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Formation / Plan</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lieu</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Période</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Détails</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {plans.data.map((plan) => (
                                        <tr key={plan.id} className="hover:bg-slate-50/30 transition-all group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{plan.entite?.titre}</span>
                                                    <span className="text-xs font-bold text-slate-400 mt-0.5">{plan.titre}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {plan.site_formation_id ? (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        <span className="text-xs font-bold">{plan.site_formation?.nom}</span>
                                                    </div>
                                                ) : (
                                                    <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase rounded-lg border border-purple-100">À distance</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col text-xs font-bold text-slate-500">
                                                    <span>Du {new Date(plan.date_debut).toLocaleDateString()}</span>
                                                    <span>Au {new Date(plan.date_fin).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border shadow-sm ${getStatusClasses(plan.statut)}`}>
                                                    {plan.statut}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link 
                                                    href={route('dr.plans.show', plan.id)} 
                                                    className="inline-flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-200 hover:border-blue-600 shadow-sm"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination simplifiée */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                             {/* Component de pagination standard Laravel/Inertia à injecter ici si dispo */}
                             <div className="flex gap-2">
                                {plans.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}
                                    />
                                ))}
                             </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function getStatusClasses(status: string) {
    switch (status.toLowerCase()) {
        case 'validé': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'confirmé': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'soumis': return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'brouillon': return 'bg-slate-100 text-slate-500 border-slate-200';
        case 'rejeté': return 'bg-red-50 text-red-600 border-red-100';
        case 'annulé': return 'bg-slate-800 text-white border-slate-900';
        default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
}
