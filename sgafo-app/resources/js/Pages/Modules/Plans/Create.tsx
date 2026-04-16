import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { PlanFormation, PlanTheme, PlanFormateur } from '@/types/plan';
import { Entite } from '@/types/entite';
import { SiteFormation } from '@/types/logistique';
import { PageProps } from '@/types';
import Step1Entity from './Steps/Step1Entity';
import Step2Themes from './Steps/Step2Themes';
import Step3Animators from './Steps/Step3Animators';
import Step4Participants from './Steps/Step4Participants';
import Step5Logistics from './Steps/Step5Logistics';
import Step6Summary from './Steps/Step6Summary';

interface Props extends PageProps {
    plan?: PlanFormation;
    entites: Entite[];
    secteurs: { id: number; nom: string }[];
    sites: SiteFormation[];
    formateurs: PlanFormateur[];
}

const STEPS = [
    { num: 1, label: 'Entité' },
    { num: 2, label: 'Thèmes' },
    { num: 3, label: 'Animateurs' },
    { num: 4, label: 'Participants' },
    { num: 5, label: 'Logistique' },
    { num: 6, label: 'Récapitulatif' },
];

export default function Create({ plan, entites, secteurs, sites, formateurs }: Props) {
    const { auth } = usePage<PageProps>().props;
    const userRoles = (auth.user as any).roles || [];
    const roleCodes = userRoles.map((r: any) => typeof r === 'object' ? r.code : r);
    const isRF = roleCodes.includes('RF');

    // ─── State ──────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [selectedEntite, setSelectedEntite] = useState<Entite | null>(
        plan?.entite || null
    );
    const [titre, setTitre] = useState(plan?.titre || '');
    const [themes, setThemes] = useState<PlanTheme[]>(() => {
        if (plan?.themes?.length) {
            return plan.themes.map(t => ({
                ...t,
                animateur_ids: t.animateurs?.map(a => a.id) || [],
            }));
        }
        return [];
    });
    const [participantIds, setParticipantIds] = useState<number[]>(
        plan?.participants?.map(p => p.id) || []
    );
    const [siteId, setSiteId] = useState<number | null>(plan?.site_formation_id || null);

    // ─── Navigation ─────────────────────────────────────────
    const canGoNext = useCallback(() => {
        switch (step) {
            case 1: return selectedEntite !== null;
            case 2: return titre.trim().length > 0 && themes.length > 0 && themes.every(t => t.nom.trim() && Number(t.duree_heures) > 0);
            case 3: return themes.every(t => (t.animateur_ids?.length || 0) > 0);
            case 4: return participantIds.length > 0;
            case 5: return true; // Site is optional in sous-phase A
            default: return true;
        }
    }, [step, selectedEntite, titre, themes, participantIds]);

    const goNext = () => { if (canGoNext() && step < 6) setStep(step + 1); };
    const goPrev = () => { if (step > 1) setStep(step - 1); };

    // ─── When entity is selected (Step 1), preload themes ───
    const handleEntitySelect = (entite: Entite) => {
        setSelectedEntite(entite);
        if (!plan && themes.length === 0) {
            setTitre(entite.titre);
            setThemes(entite.themes.map((t, i) => ({
                nom: t.titre,
                duree_heures: t.duree_heures,
                objectifs: t.objectifs || '',
                ordre: i + 1,
                animateur_ids: [],
            })));
        }
    };

    // ─── Save ───────────────────────────────────────────────
    const buildPayload = () => ({
        entite_id: selectedEntite?.id,
        titre,
        themes: themes.map(t => ({
            nom: t.nom,
            duree_heures: t.duree_heures,
            objectifs: t.objectifs,
            ordre: t.ordre,
            animateur_ids: t.animateur_ids || [],
        })),
        participant_ids: participantIds,
        site_formation_id: siteId,
    });

    const handleSave = () => {
        const payload = buildPayload();
        if (plan) {
            router.put(route('modules.plans.update', plan.id), payload);
        } else {
            router.post(route('modules.plans.store'), payload);
        }
    };

    const handleSubmit = () => {
        const payload = buildPayload();
        if (plan) {
            router.put(route('modules.plans.update', plan.id), payload, {
                onSuccess: () => {
                    router.post(route('modules.plans.submit', plan.id));
                }
            });
        } else {
            router.post(route('modules.plans.store'), payload);
        }
    };

    const handleConfirm = () => {
        const payload = buildPayload();
        if (plan) {
            router.put(route('modules.plans.update', plan.id), payload, {
                onSuccess: () => {
                    router.post(route('modules.plans.confirm', plan.id));
                }
            });
        } else {
            router.post(route('modules.plans.store'), payload);
        }
    };

    // ─── Animateur IDs for exclusion in Step 4 ──────────────
    const animateurIds = [...new Set(themes.flatMap(t => t.animateur_ids || []))];

    return (
        <AuthenticatedLayout header={<span>{plan ? 'Modifier le plan' : 'Nouveau plan'}</span>}>
            <Head title={plan ? 'Modifier le plan' : 'Nouveau plan'} />

            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stepper Progress Bar */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        {STEPS.map((s, i) => (
                            <div key={s.num} className="flex items-center flex-1 last:flex-initial">
                                <button
                                    onClick={() => s.num <= step && setStep(s.num)}
                                    className={`flex items-center gap-3 ${s.num <= step ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300 ${
                                        s.num === step
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                            : s.num < step
                                                ? 'bg-emerald-500 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {s.num < step ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        ) : s.num}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest hidden lg:block ${
                                        s.num === step ? 'text-blue-600' : s.num < step ? 'text-emerald-600' : 'text-slate-300'
                                    }`}>{s.label}</span>
                                </button>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 rounded-full transition-colors duration-300 ${
                                        s.num < step ? 'bg-emerald-400' : 'bg-slate-100'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Motif de rejet (si plan rejeté) */}
                {plan?.statut === 'rejeté' && plan.motif_rejet && (
                    <div className="p-5 bg-red-50 rounded-2xl border border-red-200">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                            <div>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Motif de rejet du Responsable Formation</p>
                                <p className="text-sm text-red-600 font-medium">{plan.motif_rejet}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    {step === 1 && (
                        <Step1Entity
                            entites={entites}
                            selectedEntite={selectedEntite}
                            onSelect={handleEntitySelect}
                            secteurs={secteurs}
                        />
                    )}
                    {step === 2 && (
                        <Step2Themes
                            titre={titre}
                            setTitre={setTitre}
                            themes={themes}
                            setThemes={setThemes}
                        />
                    )}
                    {step === 3 && (
                        <Step3Animators
                            themes={themes}
                            setThemes={setThemes}
                            formateurs={formateurs}
                        />
                    )}
                    {step === 4 && (
                        <Step4Participants
                            formateurs={formateurs}
                            participantIds={participantIds}
                            setParticipantIds={setParticipantIds}
                            excludeIds={animateurIds}
                        />
                    )}
                    {step === 5 && (
                        <Step5Logistics
                            sites={sites}
                            siteId={siteId}
                            setSiteId={setSiteId}
                        />
                    )}
                    {step === 6 && (
                        <Step6Summary
                            selectedEntite={selectedEntite}
                            titre={titre}
                            themes={themes}
                            formateurs={formateurs}
                            participantIds={participantIds}
                            sites={sites}
                            siteId={siteId}
                            isRF={isRF}
                            plan={plan || null}
                            onSave={handleSave}
                            onSubmit={handleSubmit}
                            onConfirm={handleConfirm}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={goPrev}
                        disabled={step === 1}
                        className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${
                            step === 1
                                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        Précédent
                    </button>

                    {step < 6 ? (
                        <button
                            onClick={goNext}
                            disabled={!canGoNext()}
                            className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${
                                canGoNext()
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20 active:scale-95'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            Suivant
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
