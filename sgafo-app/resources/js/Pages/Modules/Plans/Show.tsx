import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PlanFormation, STATUT_CONFIG, PlanStatut } from '@/types/plan';
import { PageProps } from '@/types';
import { useState } from 'react';

interface Props extends PageProps {
    plan: PlanFormation;
}

export default function Show({ plan }: Props) {
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

    const handleValidate = () => {
        router.post(route('modules.plans.validate', plan.id));
    };

    const handleReject = () => {
        if (motifRejet.trim().length < 10) return;
        router.post(route('modules.plans.reject', plan.id), { motif_rejet: motifRejet });
    };

    return (
        <AuthenticatedLayout header={<span>Détail du plan</span>}>
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
                    {(plan.statut === 'brouillon' || plan.statut === 'rejeté') && (
                        <a
                            href={route('modules.plans.edit', plan.id)}
                            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                        >
                            ✏️ Modifier
                        </a>
                    )}
                </div>

                {/* Rejection reason */}
                {plan.statut === 'rejeté' && plan.motif_rejet && (
                    <div className="p-5 bg-red-50 rounded-2xl border border-red-200">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Motif de rejet</p>
                        <p className="text-sm text-red-600 font-medium">{plan.motif_rejet}</p>
                        {plan.validateur && (
                            <p className="text-[10px] text-red-400 font-bold mt-2">Par {plan.validateur.prenom} {plan.validateur.nom} · {plan.date_validation ? new Date(plan.date_validation).toLocaleDateString() : ''}</p>
                        )}
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

                {/* Logistics */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Logistique</h3>
                    {plan.site_formation ? (
                        <p className="text-sm font-bold text-slate-800">📍 {plan.site_formation.nom} — {plan.site_formation.ville} ({plan.site_formation.capacite} places)</p>
                    ) : (
                        <p className="text-xs text-slate-400 italic">Aucun site défini</p>
                    )}
                </div>

                {/* RF Validation Panel */}
                {isRF && plan.statut === 'soumis' && (
                    <div className="p-6 bg-white rounded-2xl border-2 border-amber-300 shadow-sm">
                        <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest mb-1">Décision — Validation du plan</h3>
                        <p className="text-xs text-amber-500 font-medium mb-6">Soumis par {plan.createur?.prenom} {plan.createur?.nom}</p>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleValidate}
                                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                            >
                                ✅ Valider ce plan
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
            </div>
        </AuthenticatedLayout>
    );
}
