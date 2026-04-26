import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PlanFormation, STATUT_CONFIG, PlanStatut } from '@/types/plan';
import { PageProps } from '@/types';

interface Props extends PageProps {
    plan: PlanFormation;
}

export default function ShowPlan({ plan }: Props) {
    const config = STATUT_CONFIG[plan.statut as PlanStatut] || { label: plan.statut, color: 'text-slate-500', bg: 'bg-slate-100' };
    const totalHeures = plan.themes?.reduce((s, t) => s + Number(t.duree_heures), 0) || 0;
    
    const allAnimateurs = plan.themes
        ?.flatMap(t => t.animateurs || [])
        .filter((a, index, self) => self.findIndex(anim => anim.id === a.id) === index) || [];

    const isADistance = plan.entite?.mode?.toLowerCase().includes('distance');
    const isHybride = plan.entite?.mode?.toLowerCase().includes('hybride');
    const isPresentiel = plan.entite?.mode?.toLowerCase().includes('présentiel');

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2">
                <Link href={route('admin.pilotage.index', { tab: 'plans' })} className="text-slate-400 hover:text-blue-600 transition-colors font-bold">Pilotage Global</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900">Détails du Plan #{plan.id}</span>
            </div>
        }>
            <Head title={`Admin - Plan ${plan.titre}`} />

            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                {/* Header Card */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -mr-20 -mt-20 opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl ${config.bg} ${config.color} border border-current border-opacity-10 shadow-sm`}>
                                {config.label}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{plan.titre}</h1>
                        <div className="flex items-center gap-4 mt-3">
                            <p className="text-sm text-slate-400 font-medium">
                                Créé par <span className="text-slate-900 font-bold">{plan.createur?.prenom} {plan.createur?.nom}</span>
                            </p>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <p className="text-sm text-slate-400 font-medium">
                                {new Date(plan.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-2 space-y-6">
                        {/* Entité Info */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                                Formation de référence
                            </h3>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="text-lg font-black text-slate-900 leading-tight">{plan.entite?.titre}</h4>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">{plan.entite?.secteur?.nom}</p>
                            </div>
                        </div>

                        {/* Themes */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                    Programme & Modules
                                </h3>
                                <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg uppercase">{totalHeures}H Total</span>
                            </div>

                            <div className="space-y-3">
                                {plan.themes?.map((t, idx) => (
                                    <div key={t.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{t.nom}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                {t.duree_heures}h • {t.animateurs?.map(a => `${a.prenom} ${a.nom}`).join(', ') || 'Aucun animateur'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Status / Logistics Card */}
                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10"></div>
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6 relative z-10">Logistique & Lieu</h3>
                            
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Mode de formation</p>
                                    <p className="text-sm font-bold capitalize">{plan.entite?.mode || '—'}</p>
                                </div>

                                {plan.site_formation && (
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Site physique</p>
                                        <p className="text-sm font-bold">{plan.site_formation.nom}</p>
                                        <p className="text-xs text-white/60 mt-1">{plan.site_formation.ville}</p>
                                    </div>
                                )}

                                {(isADistance || isHybride) && plan.plateforme && (
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Plateforme Digitale</p>
                                        <p className="text-sm font-bold">{plan.plateforme}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Effectifs</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-2xl font-black text-slate-900">{plan.participants?.length || 0}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Participants</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-2xl font-black text-slate-900">{allAnimateurs.length}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Animateurs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Validation Logs */}
                {plan.validation_logs && plan.validation_logs.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Historique des actions</h3>
                        <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                            {plan.validation_logs.map((log) => (
                                <div key={log.id} className="relative pl-12">
                                    <div className="absolute left-0 w-9 h-9 rounded-full bg-slate-50 border-4 border-white shadow-sm flex items-center justify-center text-xs z-10 font-bold">
                                        {log.action === 'soumis' ? '📤' : log.action === 'validé' ? '✅' : log.action === 'annulé' ? '🚫' : '📝'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">{log.action}</span>
                                            <span className="text-[10px] font-bold text-slate-400">· {new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700">Par {log.user?.prenom} {log.user?.nom}</p>
                                        {log.commentaire && (
                                            <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-xs text-slate-500 font-medium italic leading-relaxed">"{log.commentaire}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
