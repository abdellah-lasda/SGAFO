import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Ressource {
    id: number;
    titre: string;
    type: string;
    url: string;
    extension: string;
    size: number;
}

interface Qcm {
    id: number;
    titre: string;
    deja_fait: boolean;
    derniere_tentative?: {
        id: number;
        score: number;
        total_points: number;
    };
}

interface Seance {
    id: number;
    date: string;
    debut: string;
    fin: string;
    statut: string;
    description: string | null;
    plan: {
        titre: string;
        entite: {
            titre: string;
        };
    };
    site: {
        nom: string;
        ville: string;
        adresse: string;
    } | null;
    seanceThemes: {
        id: number;
        theme: {
            nom: string;
            objectifs: string | null;
        };
        formateur: {
            prenom: string;
            nom: string;
            email: string;
        };
    }[];
    ressources: Ressource[];
}

interface Props extends PageProps {
    seance: Seance;
    canPassQcm: boolean;
    qcms: Qcm[];
    hasFeedbackForm: boolean;
    hasSubmittedFeedback: boolean;
}

export default function SeanceShow({ auth, seance, canPassQcm, qcms, hasFeedbackForm, hasSubmittedFeedback }: Props) {
    return (
        <AuthenticatedLayout header={<div className="flex items-center gap-2">
            <Link href={route('participant.formations')} className="text-slate-400 hover:text-blue-600 transition-colors font-bold">Mes formations</Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            <span className="font-bold text-slate-900">Détails de la séance</span>
        </div>}>
            <Head title={`Séance - ${seance.plan.titre}`} />

            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header Section */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50"></div>

                    <div className="relative z-10">
                        <Link
                            href={route('participant.formations')}
                            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors mb-8"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            Retour aux formations
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="flex-1">
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block">
                                    Session de formation
                                </span>
                                <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2 italic">
                                    {seance.plan.titre}
                                </h1>
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                                    {seance.plan.entite.titre}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-lg font-black text-slate-900">{format(new Date(seance.date), 'd MMM yyyy', { locale: fr })}</p>
                                </div>
                                <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horaire</p>
                                    <p className="text-lg font-black text-blue-600">{seance.debut} - {seance.fin}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Modules & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description & Site */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-1 gap-12">
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                                        À propos de la séance
                                    </h3>
                                    <div
                                        className="text-slate-600 text-sm leading-relaxed prose prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: seance.description || "Aucune description supplémentaire fournie pour cette séance." }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                                        Lieu de formation
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mt-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{seance.site?.nom || 'Non défini'}</p>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{seance.site?.adresse}<br />{seance.site?.ville}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modules & Formateurs */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4">Modules programmés</h3>
                            {(seance.seanceThemes || (seance as any).seance_themes || []).map((st: any) => (
                                <div key={st.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:border-blue-200 transition-all group">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors italic">
                                            {st.theme.nom}
                                        </h4>
                                        <div
                                            className="text-sm text-slate-500 leading-relaxed italic prose prose-sm prose-slate max-w-none"
                                            dangerouslySetInnerHTML={{ __html: st.theme.objectifs || "Consultez les objectifs de ce module pendant la séance." }}
                                        />
                                    </div>
                                    <div className="w-full md:w-64 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Animateur</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                                                {st.formateur.prenom.charAt(0)}{st.formateur.nom.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{st.formateur.prenom} {st.formateur.nom}</p>
                                                <p className="text-[10px] text-slate-400 font-bold truncate max-w-[120px]">{st.formateur.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: QCM & Resources */}
                    <div className="space-y-8">

                        {/* QCM Access Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>

                            <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Évaluation
                            </h3>

                            {qcms.length > 0 ? (
                                <div className="space-y-6">
                                    {qcms.map(qcm => (
                                        <div key={qcm.id} className="space-y-4">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                                <p className="text-sm font-black mb-2">{qcm.titre}</p>
                                                {qcm.deja_fait ? (
                                                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase">
                                                        <span>✅ Déjà complété</span>
                                                        <span>Score: {qcm.derniere_tentative?.score}/{qcm.derniere_tentative?.total_points}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">En attente de passage</p>
                                                )}
                                            </div>

                                            {canPassQcm ? (
                                                <Link
                                                    href={route('participant.qcm.passage', qcm.id)}
                                                    className="w-full inline-block py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest text-center hover:bg-blue-500 transition-all shadow-lg active:scale-95"
                                                >
                                                    {qcm.deja_fait ? "Refaire le test" : "Démarrer le QCM"}
                                                </Link>
                                            ) : (
                                                <div className="w-full py-4 bg-white/5 border border-white/5 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center italic cursor-not-allowed">
                                                    🔒 Déblocage à {seance.debut}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 italic">Aucune évaluation prévue pour cette séance.</p>
                            )}
                        </div>

                        {/* Resources / Support Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Supports de cours</h3>

                            {seance.ressources.length > 0 ? (
                                <div className="space-y-3">
                                    {seance.ressources.map(res => (
                                        <a
                                            key={res.id}
                                            href={res.url}
                                            target="_blank"
                                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-100 group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                                    {res.type === 'link' ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-black text-slate-900 truncate max-w-[140px] group-hover:text-blue-600 transition-colors">{res.titre}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{res.type === 'link' ? 'Lien externe' : res.extension}</p>
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <p className="text-xs text-slate-400 italic">Aucun support pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
