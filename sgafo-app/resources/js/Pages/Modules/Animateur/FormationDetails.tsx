import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props extends PageProps {
    plan: any;
}

export default function FormationDetails({ plan }: Props) {
    const [activeTab, setActiveTab] = useState<'aperçu' | 'planning' | 'documents' | 'qcm'>('aperçu');

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link 
                    href={route('modules.animateur.formations')}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </Link>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{plan.entite?.nom}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: #{plan.id}</span>
                    </div>
                    <h2 className="font-black text-xl text-slate-800 leading-tight">{plan.titre}</h2>
                </div>
            </div>
        }>
            <Head title={plan.titre} />

            <div className="max-w-7xl mx-auto pb-20">
                {/* Tabs Navigation */}
                <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                    {[
                        { id: 'aperçu', label: '📊 Aperçu', color: 'blue' },
                        { id: 'planning', label: '📅 Planning', color: 'indigo' },
                        { id: 'documents', label: '📁 Documents', color: 'emerald' },
                        { id: 'qcm', label: '✍️ QCM & Évals', color: 'purple' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative min-w-max ${
                                activeTab === tab.id 
                                ? `text-slate-900` 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'aperçu' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Objectifs de la formation</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                        {plan.entite?.objectifs || "Aucun objectif spécifique défini."}
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Thèmes abordés</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {plan.themes.map((theme: any) => (
                                            <div key={theme.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                                                <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">{theme.nom}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{theme.code}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Participants</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">Total inscrits</span>
                                            <span className="text-2xl font-black text-blue-400">{plan.participants?.length || 0}</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex -space-x-2 overflow-hidden mb-4">
                                                {plan.participants?.slice(0, 5).map((user: any) => (
                                                    <div key={user.id} className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase" title={user.nom}>
                                                        {user.nom.charAt(0)}
                                                    </div>
                                                ))}
                                                {plan.participants?.length > 5 && (
                                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-black uppercase">
                                                        +{plan.participants.length - 5}
                                                    </div>
                                                )}
                                            </div>
                                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                Voir la liste complète
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Prochaine Séance</h3>
                                    {plan.seances.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                                                    <span className="text-[8px] font-black uppercase">{format(new Date(plan.seances[0].date), 'MMM', { locale: fr })}</span>
                                                    <span className="text-lg font-black">{format(new Date(plan.seances[0].date), 'dd')}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{plan.seances[0].site?.nom || 'Visio'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">08:30 - 12:30</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 font-medium italic">Aucune séance planifiée.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'planning' && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thèmes</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {plan.seances.map((seance: any) => (
                                        <tr key={seance.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-slate-900">{format(new Date(seance.date), 'dd MMMM yyyy', { locale: fr })}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{seance.debut.substring(0, 5)} - {seance.fin.substring(0, 5)}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-600">
                                                {seance.site?.nom || 'Visio'}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {seance.themes.map((t: any) => (
                                                        <span key={t.id} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">
                                                            {t.code}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                                    seance.statut === 'terminée' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {seance.statut}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link 
                                                    href={route('modules.animateur.seances.attendance', seance.id)}
                                                    className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all shadow-sm"
                                                >
                                                    Appel
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="bg-white p-12 rounded-[3rem] border border-dashed border-slate-200 text-center">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Support de cours & Ressources</h3>
                            <p className="text-slate-500 font-medium mt-2 mb-8">Uploadez vos PDF, présentations ou liens utiles pour cette formation.</p>
                            <button className="px-8 py-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                                Ajouter un document
                            </button>
                        </div>
                    )}

                    {activeTab === 'qcm' && (
                        <div className="bg-white p-12 rounded-[3rem] border border-dashed border-slate-200 text-center">
                            <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Évaluations & QCM</h3>
                            <p className="text-slate-500 font-medium mt-2 mb-8">Créez des questionnaires pour évaluer le niveau des participants.</p>
                            <button className="px-8 py-4 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20 active:scale-95">
                                Créer un nouveau QCM
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
