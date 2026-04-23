import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Entite } from '@/types/entite';

interface Props {
    auth: any;
    entite: Entite;
}

export default function Show({ auth, entite }: Props) {
    const totalHours = entite.themes.reduce((acc, t) => acc + Number(t.duree_heures), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <Link href={route('modules.entites.index')} className="text-slate-400 hover:text-blue-600 transition-colors font-bold">Catalogue</Link>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    <span className="font-bold text-slate-900">{entite.titre}</span>
                </div>
            }
        >
            <Head title={`Fiche - ${entite.titre}`} />

            <div className="space-y-6 animate-in fade-in duration-700 pb-12">
                
                {/* BLOC 1: INFORMATIONS GÉNÉRALES */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Informations Générales</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white ${
                                entite.type === 'technique' ? 'bg-blue-600' :
                                entite.type === 'pedagogique' ? 'bg-emerald-600' :
                                'bg-indigo-600'
                            }`}>
                                {entite.type}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Titre et Volume */}
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                                        {entite.titre}
                                    </h1>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        ID Référentiel: #{String(entite.id).padStart(6, '0')}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description & Objectifs Pédagogiques</h3>
                                    <div className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-line italic">
                                        {entite.objectifs}
                                    </div>
                                </div>
                            </div>

                            {/* Cartouche Technique */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6 self-start">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur</span>
                                        <span className="text-xs font-bold text-slate-900">{entite.secteur?.nom}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode</span>
                                        <span className="text-xs font-bold text-slate-900 capitalize">{entite.mode}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/60">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durée Totale</span>
                                        <span className="text-sm font-black text-blue-600">{totalHours} <span className="text-[10px] uppercase ml-0.5">Heures</span></span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${entite.statut === 'actif' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{entite.statut}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-3 no-print">
                                    <a 
                                        href={route('modules.entites.export-pdf', entite.id)}
                                        target="_blank"
                                        className="w-full py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Exporter en PDF
                                    </a>
                                    <button 
                                        onClick={() => window.print()}
                                        className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H9v4h10z" /></svg>
                                        Imprimer
                                    </button>
                                    <Link 
                                        href={route('dashboard')}
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        Planifier
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 12h16" /></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BLOC 2: PROGRAMME (TABLEAU) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Détails du Programme (Curriculum)</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/30">
                                <tr>
                                    <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16">N°</th>
                                    <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">Intitulé du Module</th>
                                    <th scope="col" className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24">Durée</th>
                                    <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contenu & Compétences visées</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {entite.themes.map((theme, index) => (
                                    <tr key={theme.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-slate-400">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-6 font-bold text-slate-900 text-sm leading-tight">
                                            {theme.titre}
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-black rounded-lg border border-blue-100">
                                                {theme.duree_heures}h
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                                                {theme.objectifs || "Détails thématiques standard conformes au référentiel."}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center pb-6 no-print">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                        Document généré le {new Date().toLocaleDateString()} • SGAFO v2.0
                    </p>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
