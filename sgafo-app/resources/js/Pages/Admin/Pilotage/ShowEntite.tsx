import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Entite } from '@/types/entite';

interface Props {
    entite: Entite;
}

export default function ShowEntite({ entite }: Props) {
    const totalHours = entite.themes?.reduce((acc, t) => acc + Number(t.duree_heures), 0) || 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <Link href={route('admin.pilotage.index', { tab: 'entites' })} className="text-slate-400 hover:text-blue-600 transition-colors font-bold">Pilotage Global</Link>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    <span className="font-bold text-slate-900">Détails Formation #{entite.id}</span>
                </div>
            }
        >
            <Head title={`Admin - ${entite.titre}`} />

            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                
                {/* Header Information */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full -mr-20 -mt-20 opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 shadow-sm">
                                {entite.type}
                            </span>
                            <span className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 shadow-sm">
                                {entite.mode}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl">{entite.titre}</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {entite.secteur?.nom}
                        </p>
                    </div>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Description Pédagogique</h3>
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{entite.description}"</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Objectifs principaux :</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{entite.objectifs}</p>
                                </div>
                            </div>
                        </div>

                        {/* Program / Curriculum */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curriculum & Modules</h3>
                                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest">
                                    {totalHours}H Total
                                </div>
                            </div>

                            <div className="space-y-4">
                                {entite.themes?.map((theme, index) => (
                                    <div key={theme.id} className="flex items-start gap-4 p-5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs font-black text-slate-400 shrink-0">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-black text-slate-900">{theme.titre}</h4>
                                                <span className="text-[10px] font-black text-blue-600">{theme.duree_heures}h</span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                                {theme.objectifs || "Détails thématiques standard conformes au référentiel."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Summary Sidebar */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Méta-données</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date de création</p>
                                    <p className="text-sm font-bold text-slate-900">{new Date(entite.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Auteur</p>
                                    <p className="text-sm font-bold text-slate-900">{entite.createur?.prenom} {entite.createur?.nom}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Interne</p>
                                    <code className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">REF-{entite.id}</code>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.4em]">Administration SGAFO • Supervision Archivée</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
