import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlanFormation, STATUT_CONFIG, PlanStatut } from '@/types/plan';
import { PageProps } from '@/types';
import { useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Props extends PageProps {
    plan: PlanFormation;
    isValidationContext?: boolean;
}

export default function Show({ plan, isValidationContext }: Props) {
    const { auth } = usePage<PageProps>().props;
    const userRoles = (auth.user as any).roles || [];
    const roleCodes = userRoles.map((r: any) => typeof r === 'object' ? r.code : r);
    const isRF = roleCodes.includes('RF');
    const config = STATUT_CONFIG[plan.statut as PlanStatut];
    const totalHeures = plan.themes.reduce((s, t) => s + Number(t.duree_heures), 0);
    const allAnimateurs = plan.themes
        .flatMap(t => t.animateurs || [])
        .filter((a, index, self) => self.findIndex(anim => anim.id === a.id) === index);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [motifRejet, setMotifRejet] = useState('');
    const isADistance = plan.entite?.mode?.toLowerCase().includes('distance') || null ;
    const isHybride = plan.entite?.mode?.toLowerCase().includes('hybride') || null;
    const isPresentiel = plan.entite?.mode?.toLowerCase().includes('présentiel') || null ;

    const handleValidate = () => {
        router.post(route('modules.plans.validate', plan.id));
    };

    const handleConfirm = () => {
        router.post(route('modules.plans.confirm', plan.id));
    };

    const handleReject = () => {
        if (motifRejet.trim().length < 10) return;
        router.post(route('modules.plans.reject', plan.id), { motif_rejet: motifRejet });
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [motifAnnulation, setMotifAnnulation] = useState('');
    
    const handleDelete = () => {
        router.delete(route('modules.plans.destroy', plan.id));
    };

    const handleCancel = () => {
        if (motifAnnulation.trim().length < 10) return;
        router.post(route('modules.plans.cancel', plan.id), { motif_annulation: motifAnnulation });
    };

    // Permissions
    const canDelete = (auth.user.id === plan.cree_par && ['brouillon', 'rejeté'].includes(plan.statut)) || 
                     (isRF && plan.statut !== 'validé');
    
    const canCancel = isRF && ['confirmé', 'validé'].includes(plan.statut);

    return (
        <AuthenticatedLayout header={
        <div className="flex items-center gap-2">
            <Link 
                href={isValidationContext ? route('modules.validations.index') : route('modules.plans.index')} 
                className="text-slate-400 hover:text-blue-600 transition-colors font-bold"
            >
                {isValidationContext ? 'Centre de Validation' : 'Plans de formation'}
            </Link>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            <span className="font-bold text-slate-900">{plan.titre}</span>
        </div>
        
        }>
            <Head title={plan.titre} />

            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg ${config.bg} ${config.color}`}>
                                {config.label}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{plan.titre}</h1>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            Créé par {plan.createur?.prenom} {plan.createur?.nom} · {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={route('modules.plans.export-pdf', plan.id)}
                            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                        >
                            📄 Générer PDF
                        </a>

                        {(plan.statut === 'brouillon' || plan.statut === 'rejeté') && (
                            <Link
                                href={route('modules.plans.edit', plan.id)}
                                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                            >
                                ✏️ Modifier
                            </Link>
                        )}

                        {isRF && plan.statut === 'confirmé' && (
                            <Link
                                href={route('modules.validations.planning.index', plan.id)}
                                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                            >
                                🗓️ Gérer le Planning
                            </Link>
                        )}

                        {canCancel && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                            >
                                🚫 Annuler la formation
                            </button>
                        )}

                        {canDelete && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                🗑️ Supprimer
                            </button>
                        )}
                    </div>
                </div>

                {/* Cancellation/Rejection reason */}
                {['rejeté', 'annulé'].includes(plan.statut) && plan.motif_rejet && (
                    <div className={`p-6 rounded-2xl border-2 flex items-start gap-4 ${plan.statut === 'rejeté' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${plan.statut === 'rejeté' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                            {plan.statut === 'rejeté' ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${plan.statut === 'rejeté' ? 'text-red-700' : 'text-slate-700'}`}>
                                {plan.statut === 'rejeté' ? 'Motif du rejet' : 'Motif de l\'annulation'}
                            </h3>
                            <p className={`text-sm font-medium ${plan.statut === 'rejeté' ? 'text-red-600' : 'text-slate-600'}`}>
                                {plan.motif_rejet}
                            </p>
                            {plan.statut === 'rejeté' && plan.validateur && (
                                <p className="text-[10px] text-red-400 font-bold mt-2">Par {plan.validateur.prenom} {plan.validateur.nom} · {plan.date_validation ? new Date(plan.date_validation).toLocaleDateString() : ''}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Entity */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Entité de référence</h3>
                    <p className="text-sm font-black text-slate-900">{plan.entite?.titre}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">{plan.entite?.secteur?.nom}</p>
                </div>

                {/* Themes */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thèmes ({plan.themes.length}) · {totalHeures}h</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">#</th>
                                    <th className="py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Thème</th>
                                    <th className="py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Durée</th>
                                    <th className="py-3 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">Animateurs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plan.themes.map(t => (
                                    <tr key={t.id} className="border-b border-slate-50">
                                        <td className="py-3 font-bold text-slate-400">{t.ordre}</td>
                                        <td className="py-3 font-bold text-slate-800">{t.nom}</td>
                                        <td className="py-3 text-slate-500">{t.duree_heures}h</td>
                                        <td className="py-3 text-slate-500">
                                            {t.animateurs?.map(a => `${a.prenom} ${a.nom}`).join(', ') || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Participants */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Participants ({plan.participants?.length || 0})</h3>
                    <div className="flex flex-wrap gap-2">
                        {plan.participants?.map(p => (
                            <div key={p.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[9px] font-black">
                                    {p.prenom[0]}{p.nom[0]}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-700">{p.prenom} {p.nom}</p>
                                    <p className="text-[9px] text-slate-400">{(p as any).instituts?.[0]?.nom || ''}</p>
                                </div>
                            </div>
                        ))}
                        {(!plan.participants || plan.participants.length === 0) && (
                            <p className="text-xs text-slate-400 italic">Aucun participant</p>
                        )}
                    </div>
                </div>

                {/* Animateurs */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Animateurs ({allAnimateurs?.length || 0})</h3>
                    <div className="flex flex-wrap gap-2">
                        {allAnimateurs?.map(p => (
                            <div key={p.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[9px] font-black">
                                    {p.prenom[0]}{p.nom[0]}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-700">{p.prenom} {p.nom}</p>
                                    <p className="text-[9px] text-slate-400">{(p as any).instituts?.[0]?.nom || ''}</p>
                                </div>
                            </div>
                        ))}
                        {(!plan.participants || plan.participants.length === 0) && (
                            <p className="text-xs text-slate-400 italic">Aucun participant</p>
                        )}
                    </div>
                </div>


                {/* Logistics */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Logistique</h3>
                    {(isADistance || isHybride) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Plateforme virtuelle</p>
                                {plan.plateforme ? (
                                    <p className="text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block border border-blue-100">
                                        💻 {plan.plateforme}
                                    </p>
                                ) : (
                                    <p className="text-[10px] font-medium text-red-400 italic">Non sélectionnée</p>
                                )}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lien Visioconférence</p>
                                {plan.lien_visio ? (
                                    <p className="text-[10px] font-bold text-slate-600 truncate max-w-xs" title={plan.lien_visio}>
                                        🔗 {plan.lien_visio}
                                    </p>
                                ) : (
                                    <p className="text-[10px] font-medium text-red-400 italic">Non renseigné</p>
                                )}
                            </div>
                        </div>
                    )}

                    {(isPresentiel || isHybride) && (
                        plan.site_formation ? (
                            <p className="text-sm font-bold text-slate-800">📍 {plan.site_formation.nom} — {plan.site_formation.ville} ({plan.site_formation.capacite} places)</p>
                        ) : (
                            <p className="text-xs text-slate-400 italic">Aucun site défini</p>
                        )
                    )}
                </div>

                {/* Validation History (Timeline) */}
                {plan.validation_logs && plan.validation_logs.length > 0 && (
                    <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Historique des décisions</h3>
                        <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                            {plan.validation_logs.map((log) => {
                                const logConfig = log.action === 'soumis' 
                                    ? { icon: '📤', color: 'bg-amber-100 text-amber-600', label: 'Soumission' }
                                    : log.action === 'validé' || log.action === 'confirmé'
                                    ? { icon: '✅', color: 'bg-emerald-100 text-emerald-600', label: log.action === 'validé' ? 'Validation' : 'Confirmation' }
                                    : log.action === 'clôturé'
                                    ? { icon: '🔒', color: 'bg-slate-100 text-slate-600', label: 'Clôture' }
                                    : log.action === 'réouvert'
                                    ? { icon: '🔄', color: 'bg-blue-100 text-blue-600', label: 'Réouverture' }
                                    : log.action === 'rejeté'
                                    ? { icon: '❌', color: 'bg-red-100 text-red-600', label: 'Rejet' }
                                    : { icon: '📝', color: 'bg-slate-100 text-slate-400', label: 'Action' };

                                return (
                                    <div key={log.id} className="relative pl-12">
                                        <div className={`absolute left-0 w-9 h-9 rounded-full ${logConfig.color} flex items-center justify-center text-xs z-10 border-4 border-white shadow-sm font-bold`}>
                                            {logConfig.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">{logConfig.label}</span>
                                                <span className="text-[10px] font-bold text-slate-400">· {new Date(log.created_at).toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-700">Par {log.user?.prenom} {log.user?.nom}</p>
                                            {log.commentaire && (
                                                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                    <p className="text-xs text-slate-500 font-medium italic">"{log.commentaire}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* RF Validation Panel */}
                {isRF && plan.statut === 'soumis' && (
                    <div className="p-6 bg-white rounded-2xl border-2 border-amber-300 shadow-sm">
                        <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest mb-1">Décision — Validation du plan</h3>
                        <p className="text-xs text-amber-500 font-medium mb-6">Soumis par {plan.createur?.prenom} {plan.createur?.nom}</p>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                            >
                                🤝 Confirmer ce plan
                            </button>
                            <button
                                onClick={() => setShowRejectModal(!showRejectModal)}
                                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all active:scale-[0.98]"
                            >
                                ❌ Rejeter ce plan
                            </button>
                        </div>

                        {showRejectModal && (
                            <div className="mt-6 p-5 bg-red-50 rounded-xl border border-red-200">
                                <label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 block">Motif de rejet *</label>
                                <textarea
                                    value={motifRejet}
                                    onChange={(e) => setMotifRejet(e.target.value)}
                                    placeholder="Expliquez la raison du rejet (minimum 10 caractères)..."
                                    rows={3}
                                    className="w-full px-4 py-3 text-sm font-medium border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none mb-4"
                                />
                                <button
                                    onClick={handleReject}
                                    disabled={motifRejet.trim().length < 10}
                                    className={`w-full py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                                        motifRejet.trim().length >= 10
                                            ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    Confirmer le rejet
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* RF Technical Validation (Final step after planning) */}
                {isRF && plan.statut === 'confirmé' && (
                    <div className="p-6 bg-white rounded-2xl border-2 border-emerald-300 shadow-sm">
                        <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-1">Validation Technique Finale</h3>
                        <p className="text-xs text-emerald-500 font-medium mb-4">Une fois le planning complété, validez définitivement le plan pour le rendre visible au catalogue national.</p>
                        
                        {(plan.seances?.length || 0) === 0 ? (
                            <div className="p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold mb-4 flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                Attention : Vous devez planifier au moins une séance avant de pouvoir valider définitivement ce plan.
                            </div>
                        ) : (
                             <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold mb-4 flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Planning détecté ({plan.seances?.length} séance(s)). Vous pouvez valider le plan.
                            </div>
                        )}

                        <button
                            onClick={handleValidate}
                            disabled={(plan.seances?.length || 0) === 0}
                            className={`w-full py-4 text-xs font-black uppercase tracking-widest text-white rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                                (plan.seances?.length || 0) > 0 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                                    : 'bg-slate-300 cursor-not-allowed'
                            }`}
                        >
                            🚀 Valider définitivement et publier
                        </button>
                    </div>
                )}

                {/* RF Direct Confirmation (Self-Created) - Handled by the generic confirm button above if we adjust its logic */}
                {isRF && plan.cree_par === auth.user.id && plan.statut === 'brouillon' && (
                    <div className="p-6 bg-white rounded-2xl border-2 border-blue-300 shadow-sm">
                        <h3 className="text-sm font-black text-blue-700 uppercase tracking-widest mb-1">Confirmation directe</h3>
                        <p className="text-xs text-blue-500 font-medium mb-6">En tant que RF, vous pouvez confirmer directement votre propre plan pour démarrer la planification.</p>
                        <button
                            onClick={handleConfirm}
                            className="w-full py-4 text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                        >
                            🤝 Confirmer le plan
                        </button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Supprimer définitivement ce plan ?"
                message="Cette action est irréversible. Toutes les thématiques, séances, participants et logs associés seront définitivement supprimés."
                confirmLabel="Oui, supprimer définitivement"
                isDanger={true}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Annuler la formation</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Veuillez justifier l'annulation</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Les équipes (créateur, animateurs et participants) seront immédiatement informées par notification.
                            </p>
                            <textarea
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-medium focus:border-amber-500 focus:bg-white transition-all min-h-[150px]"
                                placeholder="Expliquez pourquoi cette formation est annulée..."
                                value={motifAnnulation}
                                onChange={(e) => setMotifAnnulation(e.target.value)}
                            />
                            {motifAnnulation.length > 0 && motifAnnulation.length < 10 && (
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-2">Le motif doit faire au moins 10 caractères</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                            >
                                Retour
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={motifAnnulation.trim().length < 10}
                                className="flex-[2] py-4 text-xs font-black uppercase tracking-widest text-white bg-amber-600 rounded-xl hover:bg-amber-500 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirmer l'annulation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
