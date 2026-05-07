import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

interface DocumentIndexProps extends PageProps {
    plans: any[];
}

export default function Index({ auth, plans }: DocumentIndexProps) {
    return (
        <AuthenticatedLayout
            header={<span className="font-black text-slate-800 leading-tight">Documents Officiels & Reporting</span>}
        >
            <Head title="Documents DR" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* Action Reporting Global */}
                    <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        
                        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black tracking-tighter">Bilan Stratégique Régional</h3>
                                    <p className="text-blue-100/80 font-medium text-lg">Analyse haute résolution de la performance pédagogique de votre région.</p>
                                </div>
                            </div>
                            <a 
                                href={route('dr.documents.export-regional')} 
                                className="bg-white text-indigo-700 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 whitespace-nowrap"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Générer le Rapport PDF
                            </a>
                        </div>
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
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-800">{plan.entite?.titre}</span>
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                            plan.statut === 'validé' ? 'bg-emerald-100 text-emerald-700' : 
                                                            plan.statut === 'soumis' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {plan.statut}
                                                        </span>
                                                    </div>
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
