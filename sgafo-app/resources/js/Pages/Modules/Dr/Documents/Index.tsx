import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

interface DocumentIndexProps extends PageProps {
    plans: any[];
}

export default function Index({ auth, plans }: DocumentIndexProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-2xl text-slate-800 leading-tight">Documents Officiels & Reporting</h2>}
        >
            <Head title="Documents DR" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* Action Reporting Global */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black tracking-tight">Générer le rapport régional complet</h3>
                            <p className="text-blue-100 font-medium">Exportez la liste consolidée de toutes les formations de votre région au format PDF.</p>
                        </div>
                        <a 
                            href={route('dr.documents.export-regional')} 
                            className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg flex items-center gap-3 whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Exporter le Plan (.PDF)
                        </a>
                    </div>

                    {/* Liste des Convocations par Plan */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Convocations Officielles</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Période</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Site</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Téléchargement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {plans.map((plan) => (
                                        <tr key={plan.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{plan.entite?.titre}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase font-black">{plan.titre}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                                Du {new Date(plan.date_debut).toLocaleDateString()} au {new Date(plan.date_fin).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-600">
                                                {plan.site_formation?.nom || 'À distance'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <a 
                                                        href={route('dr.documents.convocation', plan.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                        title="Télécharger la convocation officielle"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        Convocation
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
