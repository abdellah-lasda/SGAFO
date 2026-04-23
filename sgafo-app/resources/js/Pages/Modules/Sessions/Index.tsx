import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { PlanFormation } from '@/types/plan';
import { useState, useMemo, useEffect } from 'react';

interface Props {
    plan: PlanFormation;
    seances: any[];
    themesStats: any[];
    sites: any[];
    formateurs: any[];
}

export default function Index({ plan, seances, themesStats, sites, formateurs }: Props) {
    // Liste des dates entre début et fin du plan
    const formationDates = useMemo(() => {
        if (!plan.date_debut || !plan.date_fin) return [];
        const start = new Date(plan.date_debut);
        const end = new Date(plan.date_fin);
        const dates = [];
        let curr = new Date(start);
        while (curr <= end) {
            dates.push(new Date(curr).toISOString().split('T')[0]);
            curr.setDate(curr.getDate() + 1);
        }
        return dates;
    }, [plan.date_debut, plan.date_fin]);

    const [selectedDate, setSelectedDate] = useState(formationDates[0] || '');
    const [isAdding, setIsAdding] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [themeToPlan, setThemeToPlan] = useState<any>(null);

    // STATS CALCULATIONS
    const stats = useMemo(() => {
        const totalPrevues = themesStats.reduce((s, t) => s + Number(t.duree_totale), 0);
        const totalPlanifiees = themesStats.reduce((s, t) => s + Number(t.heures_planifiees), 0);
        const progression = totalPrevues > 0 ? Math.round((totalPlanifiees / totalPrevues) * 100) : 0;
        
        return {
            total: totalPrevues,
            planified: totalPlanifiees,
            remaining: Math.max(0, totalPrevues - totalPlanifiees),
            progression
        };
    }, [themesStats]);

    const { data, setData, post, processing, reset, errors, transform } = useForm({
        date: selectedDate,
        debut: '08:30',
        fin: '12:30',
        site_id: plan.site_formation_id || '',
        themes: themesStats.map(t => ({
            plan_theme_id: t.id,
            nom: t.nom,
            heures_planifiees: 0,
            reste: t.reste,
            formateur_id: '',
            animateurs: t.animateurs || [],
            checked: false
        })),
        recurrence: {
            active: false,
            type: 'quotidien',
            date_fin: selectedDate,
            skip_saturday: true,
            skip_sunday: true
        }
    });

    // Synchroniser la date du formulaire avec la date sélectionnée dans le calendrier
    useEffect(() => {
        setData(d => ({
            ...d,
            date: selectedDate,
            recurrence: { 
                ...d.recurrence, 
                date_fin: d.recurrence.date_fin < selectedDate ? selectedDate : d.recurrence.date_fin 
            }
        }));
    }, [selectedDate]);

    // Séances filtrées pour le jour sélectionné
    const dailySeances = seances.filter(s => s.date.split('T')[0] === selectedDate);

    // CALCUL DE LA DURÉE DE LA SÉANCE
    const sessionDuration = useMemo(() => {
        if (!data.debut || !data.fin) return 0;
        const [h1, m1] = data.debut.split(':').map(Number);
        const [h2, m2] = data.fin.split(':').map(Number);
        const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        return Math.max(0, diff / 60);
    }, [data.debut, data.fin]);

    // CALCUL DES HEURES ALLOUÉES
    const allocatedHours = useMemo(() => {
        return data.themes.reduce((sum, t) => sum + (t.checked ? t.heures_planifiees : 0), 0);
    }, [data.themes]);

    const remainingTime = sessionDuration - allocatedHours;
    const isDurationValid = sessionDuration > 0 && allocatedHours > 0 && allocatedHours <= sessionDuration;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isDurationValid) return;

        // Validation des formateurs
        const selectedThemes = data.themes.filter(t => t.checked && t.heures_planifiees > 0);
        const missingFormateur = selectedThemes.some(t => !t.formateur_id);
        
        if (missingFormateur) {
            alert("Veuillez affecter un formateur à chaque thème sélectionné.");
            return;
        }

        transform((data) => ({
            ...data,
            date: selectedDate,
            themes: selectedThemes
        }));

        post(route('modules.validations.planning.store', plan.id), {
            onSuccess: () => {
                reset();
                setThemeToPlan(null);
                setIsAdding(false);
            }
        });
    };

    const isLocked = plan.statut === 'confirmé';

    const handleCloture = () => {
        if (confirm('Voulez-vous clôturer ce planning ? Il sera verrouillé pour exécution.')) {
            router.post(route('modules.validations.planning.cloturer', plan.id));
        }
    };

    const handleReouverture = () => {
        if (confirm('Voulez-vous réouvrir ce planning ? Cela permettra de le modifier à nouveau.')) {
            router.post(route('modules.validations.planning.reouvrir', plan.id));
        }
    };

    const deleteSeance = (id: number) => {
        if (isLocked) return;
        if (confirm('Supprimer cette séance du planning ?')) {
            router.delete(route('modules.seances.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const openPlanningForTheme = (theme: any) => {
        setThemeToPlan(theme);
        // On pré-coche ce thème et on met à zéro les autres
        const newThemes = data.themes.map(t => ({
            ...t,
            checked: t.plan_theme_id === theme.id,
            heures_planifiees: t.plan_theme_id === theme.id ? (theme.reste > 4 ? 4 : theme.reste) : 0
        }));
        setData('themes', newThemes);
        setIsAdding(true);
    };

    return (
        <AuthenticatedLayout
            header={
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Link href={route('modules.validations.index')} className="text-slate-400 hover:text-blue-600 transition-colors font-bold">Centre de Validation</Link>
                            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            <span className="text-slate-400 font-bold">Planification</span>
                            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            <span className="font-black text-slate-900">{plan.titre}</span>
                        </div>
                    </div>
            }
        >
            <Head title="Gestion du Planning" />

            {isLocked && (
                <div className="bg-emerald-600/10 border-b border-emerald-600/20 py-3 mb-4 animate-in slide-in-from-top duration-700">
                    <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Ce planning est officiellement clôturé et verrouillé pour l'exécution.</p>
                        </div>
                        
                        <button
                            onClick={handleReouverture}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-50 transition-all border border-amber-200 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            Réouvrir pour modification
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-700 pb-20">
                
                {/* ─── ZONE 1 : STATS DASHBOARD (HEADER) ─── */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
                    {/* Progression Card */}
                    <div className="md:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex flex-col items-center">
                            <div className="relative w-20 h-20 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-600 transition-all duration-1000" strokeDasharray={201} strokeDashoffset={201 - (201 * stats.progression) / 100} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-black text-slate-900">{stats.progression}%</span>
                                </div>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Progression Globale</p>
                        </div>
                    </div>

                    {/* Total Hours Card */}
                    <div className="md:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 tabular-nums">{stats.total}h</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Heures Prévues</p>
                        </div>
                    </div>

                    {/* Planified Hours Card */}
                    <div className="md:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/30 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            </div>
                            <h4 className="text-2xl font-black text-emerald-600 tabular-nums">{stats.planified}h</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Heures Planifiées</p>
                        </div>
                    </div>

                    {/* Remaining Hours Card */}
                    <div className="md:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/30 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h4 className="text-2xl font-black text-amber-600 tabular-nums">{stats.remaining}h</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Heures Restantes</p>
                        </div>
                    </div>

                    {/* Action/Validation Card */}
                    {!isLocked ? (
                        <div className="md:col-span-1 bg-slate-900 p-6 rounded-[2rem] shadow-2xl shadow-slate-900/40 flex flex-col justify-center relative overflow-hidden group transform hover:-translate-y-1 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                            <div className="relative">
                                <button
                                    onClick={handleCloture}
                                    className="w-full py-4 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mb-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    Finaliser
                                </button>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">Clôturer le planning</p>
                            </div>
                        </div>
                    ) : (
                        <div className="md:col-span-1 bg-emerald-500 p-6 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Planing Validé</span>
                        </div>
                    )}
                </div>

                {/* ─── ZONE 2 : INTERACTIVE TIMELINE (SELECTOR) ─── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2 text-slate-400">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Navigation Temporelle du Projet
                        </h3>
                        <span className="text-[9px] font-bold uppercase tracking-widest">{formationDates.length} Jours au total</span>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide px-2">
                        {formationDates.map((date, idx) => {
                            const isSelected = selectedDate === date;
                            const dailyCount = seances.filter(s => s.date.split('T')[0] === date).length;
                            const dateObj = new Date(date);
                            
                            return (
                                <button
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex-shrink-0 min-w-[120px] p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-1 group ${
                                        isSelected 
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20 -translate-y-1' 
                                            : 'bg-white border-slate-100 hover:border-blue-200'
                                    }`}
                                >
                                    <span className={`text-[8px] font-black uppercase tracking-tighter ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                                        Jour {idx + 1}
                                    </span>
                                    <span className={`text-sm font-black transition-colors ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                        {dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </span>
                                    <span className={`text-[9px] font-bold italic transition-colors ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                        {dateObj.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                    </span>
                                    
                                    {dailyCount > 0 && (
                                        <div className={`mt-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative">
                    {/* ─── ZONE 3 : MAIN WORKSPACE (DAILY VIEW) ─── */}
                    <div className="flex-1 space-y-8 min-w-0">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h2>
                                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
                                    {dailySeances.length} séance(s) planifiée(s) pour cette journée
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!showDrawer && (
                                    <button 
                                        onClick={() => setShowDrawer(true)}
                                        className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                        Catalogue Thèmes
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                    Ajouter une séance
                                </button>
                            </div>
                        </div>

                        {dailySeances.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center group cursor-pointer hover:bg-slate-100 transition-all" onClick={() => setIsAdding(true)}>
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                    <svg className="w-10 h-10 text-slate-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <p className="text-sm font-black text-slate-400">Aucune séance pour ce jour-là.</p>
                                <p className="text-xs text-slate-300 mt-2 font-bold uppercase tracking-widest">Cliquez pour planifier votre première séance</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                                {dailySeances.map((seance) => (
                                    <div key={seance.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:border-blue-200 transition-all">
                                        <div className="absolute top-0 right-0 p-6 flex gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => deleteSeance(seance.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>

                                        <div className="flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-200">
                                                    <span className="text-xs font-black uppercase mb-0.5">Time</span>
                                                    <span className="text-sm font-black tabular-nums">{seance.debut.substring(0, 5)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900 tracking-tight">{seance.debut.substring(0, 5)} — {seance.fin.substring(0, 5)}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{seance.site?.nom || 'Site non défini'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                {seance.themes.map((t: any) => {
                                                    const formateur = formateurs.find(f => f.id === t.pivot.formateur_id);
                                                    return (
                                                        <div key={t.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2 group/theme hover:border-blue-200 transition-all">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-xs font-black text-slate-700 truncate flex-1 pr-4">{t.nom}</p>
                                                                <span className="text-[10px] font-black text-blue-600 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">{t.pivot.heures_planifiees}h</span>
                                                            </div>
                                                            {formateur && (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-black text-blue-600">
                                                                        {formateur.nom[0]}{formateur.prenom[0]}
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{formateur.nom} {formateur.prenom}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─── ZONE 4 : FLOATING DRAWER (THEMES CATALOG) ─── */}
                    {showDrawer && (
                        <div className="w-full lg:w-96 flex-shrink-0 animate-in slide-in-from-right-8 duration-500">
                             <div className="sticky top-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-120px)] border-4 border-slate-50">
                                <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Thèmes du projet</h3>
                                        <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliquez sur📅 pour planifier rapidement</p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    {themesStats.map((theme) => {
                                        const progress = (theme.heures_planifiees / theme.duree_totale) * 100;
                                        const isDone = theme.reste === 0;

                                        return (
                                            <div key={theme.id} className={`p-5 rounded-3xl border transition-all ${isDone ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`text-xs font-black truncate ${isDone ? 'text-emerald-700' : 'text-slate-900'}`}>{theme.nom}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{theme.heures_planifiees}h / {theme.duree_totale}h</p>
                                                    </div>
                                                    {!isDone && !isLocked && (
                                                        <button 
                                                            onClick={() => openPlanningForTheme(theme)}
                                                            className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-md active:scale-90"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </button>
                                                    )}
                                                    {isDone && (
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full transition-all duration-1000 ${isDone ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(100, progress)}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* ─── ZONE 5 : RÉCAPITULATIF GLOBAL ─── */}
                <div className="pt-20 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Récapitulatif Global</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Vue d'ensemble chronologique</p>
                        </div>
                        <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/20 text-[10px] font-black uppercase tracking-widest">
                            {seances.length} séance(s) au total
                        </div>
                    </div>

                    {seances.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Jour & Date</th>
                                        <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Horaires</th>
                                        <th className="px-6 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thèmes & Durées</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {[...seances].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.debut.localeCompare(b.debut)).map((seance, index) => (
                                        <tr key={seance.id} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5 underline decoration-2 underline-offset-4 decoration-blue-200">Séance #{index + 1}</span>
                                                    <span className="text-[13px] font-black text-slate-900 capitalize italic">
                                                        {new Date(seance.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-8 text-center">
                                                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-xl border-2 border-slate-100 shadow-sm transition-all group-hover:border-blue-200">
                                                    <span className="text-[13px] font-black text-slate-700">{seance.debut.substring(0, 5)}</span>
                                                    <div className="w-4 h-0.5 bg-slate-200 rounded-full"></div>
                                                    <span className="text-[13px] font-black text-slate-700">{seance.fin.substring(0, 5)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-8">
                                                <div className="flex flex-wrap gap-2.5">
                                                    {seance.themes.map((t: any) => {
                                                        const formateur = formateurs.find(f => f.id === t.pivot.formateur_id);
                                                        return (
                                                            <div key={t.id} className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2 bg-blue-50/50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100/50 w-fit">
                                                                    <span className="text-[10px] font-black uppercase truncate max-w-[150px]">{t.nom}</span>
                                                                    <span className="text-[10px] font-bold opacity-60">({t.pivot.heures_planifiees}h)</span>
                                                                </div>
                                                                {formateur && (
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-4">By: {formateur.nom} {formateur.prenom}</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedDate(seance.date.split('T')[0]);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className="px-6 py-2.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                                                    >
                                                        Accéder
                                                    </button>
                                                    <button onClick={() => deleteSeance(seance.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                {/* ─── ZONE 6 : MODALE D'AJOUT DE SÉANCE ─── */}
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-500" onClick={() => { setIsAdding(false); reset(); }}/>
                        <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col max-h-[92vh] rounded-[3rem] animate-in zoom-in-95 duration-300 border border-slate-200 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Nouvelle Séance</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                                {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setIsAdding(false); reset(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                                {Object.keys(errors).length > 0 && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Erreurs de validation</p>
                                        <ul className="list-disc list-inside text-[10px] text-red-500 font-bold">
                                            {Object.entries(errors).map(([key, val]) => (
                                                <li key={key}>{val}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <form id="session-form" onSubmit={submit} className="space-y-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2 text-slate-400">
                                            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black">01</span>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Configuration des Horaires</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 relative">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Début</label>
                                                <input type="time" className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:border-blue-500 transition-all text-center" value={data.debut} onChange={e => setData('debut', e.target.value)} required />
                                                {errors.debut && <p className="text-[10px] text-red-500 font-bold">{errors.debut}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fin</label>
                                                <input type="time" className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:border-blue-500 transition-all text-center" value={data.fin} onChange={e => setData('fin', e.target.value)} required />
                                                {errors.fin && <p className="text-[10px] text-red-500 font-bold">{errors.fin}</p>}
                                            </div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black border-4 border-white shadow-lg">{sessionDuration}h</div>
                                        </div>

                                        <div className="space-y-2 px-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Site de formation (Optionnel pour distanciel)</label>
                                            <select 
                                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-xs font-black focus:border-blue-500 transition-all"
                                                value={data.site_id}
                                                onChange={e => setData('site_id', e.target.value)}
                                            >
                                                <option value="">-- Sans site physique --</option>
                                                {sites.map(s => (
                                                    <option key={s.id} value={s.id}>{s.nom} ({s.ville})</option>
                                                ))}
                                            </select>
                                            {errors.site_id && <p className="text-[10px] text-red-500 font-bold">{errors.site_id}</p>}
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-3xl border-2 transition-all ${allocatedHours === 0 ? 'bg-slate-50 border-slate-100' : allocatedHours > sessionDuration ? 'bg-red-50 border-red-200' : remainingTime > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Allocation</p>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${allocatedHours === 0 ? 'bg-slate-200 text-slate-600' : allocatedHours > sessionDuration ? 'bg-red-500 text-white' : remainingTime > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>{allocatedHours > sessionDuration ? 'Dépassement !' : remainingTime > 0 ? 'Incomplet' : 'Parfait'}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-500 ${allocatedHours > sessionDuration ? 'bg-red-500' : remainingTime === 0 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(100, (allocatedHours / sessionDuration) * 100)}%` }}/>
                                            </div>
                                            <div className="text-sm font-black tabular-nums">{allocatedHours}h / {sessionDuration}h</div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black">02</span>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Thèmes de la séance</h4>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {data.themes.map((theme, index) => (
                                                <div key={theme.plan_theme_id} className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${theme.checked ? 'border-blue-500 bg-blue-50/30' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`} onClick={() => {
                                                    const newThemes = [...data.themes];
                                                    const isNowChecked = !newThemes[index].checked;
                                                    newThemes[index].checked = isNowChecked;
                                                    
                                                    if (isNowChecked) {
                                                        const otherChecked = newThemes.filter((t, i) => i !== index && t.checked);
                                                        if (otherChecked.length === 0) {
                                                            newThemes[index].heures_planifiees = sessionDuration;
                                                        } else {
                                                            const alreadyAllocated = otherChecked.reduce((s, t) => s + t.heures_planifiees, 0);
                                                            newThemes[index].heures_planifiees = Math.max(0, sessionDuration - alreadyAllocated);
                                                        }
                                                    } else {
                                                        newThemes[index].heures_planifiees = 0;
                                                    }
                                                    setData('themes', newThemes);
                                                }}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-all ${theme.checked ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-transparent'}`}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs font-black truncate ${theme.checked ? 'text-blue-900' : 'text-slate-600'}`}>{theme.nom}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[9px] font-bold text-slate-400">Reste à planifier: {theme.reste}h</span>
                                                            </div>
                                                        </div>
                                                        {theme.checked && (
                                                            <div className="flex flex-col gap-4 items-end animate-in fade-in slide-in-from-right-2 duration-300" onClick={(e) => e.stopPropagation()}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative">
                                                                        <input 
                                                                            type="number" 
                                                                            step="0.5" 
                                                                            min="0.5"
                                                                            max={sessionDuration}
                                                                            className="w-20 bg-white border-2 border-blue-100 rounded-lg py-2 px-3 text-xs font-black text-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 text-center"
                                                                            value={theme.heures_planifiees}
                                                                            onChange={e => {
                                                                                const val = parseFloat(e.target.value) || 0;
                                                                                const newThemes = [...data.themes];
                                                                                newThemes[index].heures_planifiees = val;
                                                                                setData('themes', newThemes);
                                                                            }}
                                                                        />
                                                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-300">h</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="w-full">
                                                                    <select
                                                                        className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl py-2 px-4 text-[10px] font-black text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 appearance-none"
                                                                        value={theme.formateur_id}
                                                                        onChange={e => {
                                                                            const newThemes = [...data.themes];
                                                                            newThemes[index].formateur_id = e.target.value;
                                                                            setData('themes', newThemes);
                                                                        }}
                                                                        required
                                                                    >
                                                                        <option value="">Affecter un animateur...</option>
                                                                        {/* Priorité aux animateurs déjà liés au thème */}
                                                                        {theme.animateurs?.length > 0 ? (
                                                                            <optgroup label="Animateurs du thème">
                                                                                {theme.animateurs.map((f: any) => (
                                                                                    <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>
                                                                                ))}
                                                                            </optgroup>
                                                                        ) : (
                                                                            <optgroup label="Tous les formateurs">
                                                                                {formateurs.map((f: any) => (
                                                                                    <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>
                                                                                ))}
                                                                            </optgroup>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Section : Récurrence */}
                                    <div className="space-y-6 pb-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black">03</span>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Options de Récurrence</h4>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setData('recurrence', { ...data.recurrence, active: !data.recurrence.active })}
                                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                                    data.recurrence.active 
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}
                                            >
                                                {data.recurrence.active ? 'Activée' : 'Désactivée'}
                                            </button>
                                        </div>

                                        {data.recurrence.active && (
                                            <div className="animate-in slide-in-from-top-4 duration-300 space-y-6 bg-slate-50 p-7 rounded-[2.5rem] border border-slate-100">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Fréquence</label>
                                                        <div className="flex p-1 bg-white border-2 border-slate-100 rounded-xl">
                                                            <button 
                                                                type="button"
                                                                onClick={() => setData('recurrence', { ...data.recurrence, type: 'quotidien' })}
                                                                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${data.recurrence.type === 'quotidien' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                                                            >
                                                                Quotidien
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => setData('recurrence', { ...data.recurrence, type: 'hebdomadaire' })}
                                                                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${data.recurrence.type === 'hebdomadaire' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                                                            >
                                                                Hebdo
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Date de fin</label>
                                                        <input 
                                                            type="date" 
                                                            className="w-full bg-white border-2 border-slate-100 rounded-xl py-3 px-4 text-xs font-black focus:border-blue-500 transition-all"
                                                            value={data.recurrence.date_fin}
                                                            onChange={e => setData('recurrence', { ...data.recurrence, date_fin: e.target.value })}
                                                            min={selectedDate}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Sauter les jours :</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setData('recurrence', { ...data.recurrence, skip_saturday: !data.recurrence.skip_saturday })}
                                                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${data.recurrence.skip_saturday ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${data.recurrence.skip_saturday ? 'bg-amber-500 text-white' : 'bg-slate-100'}`}>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Samedi</span>
                                                            </div>
                                                        </button>

                                                        <button 
                                                            type="button"
                                                            onClick={() => setData('recurrence', { ...data.recurrence, skip_sunday: !data.recurrence.skip_sunday })}
                                                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${data.recurrence.skip_sunday ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${data.recurrence.skip_sunday ? 'bg-red-500 text-white' : 'bg-slate-100'}`}>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Dimanche</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="p-8 border-t border-slate-100 bg-slate-50/30 sticky bottom-0 z-10">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => { setIsAdding(false); reset(); }} className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">Annuler</button>
                                    <button form="session-form" type="submit" disabled={processing || !isDurationValid} className="flex-[2] py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all disabled:opacity-50">Confirmer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bouton d'ajout flottant */}
            {!isLocked && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all z-20 group"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Ajouter des séances
                    </div>
                </button>
            )}
        </AuthenticatedLayout>
    );
}
