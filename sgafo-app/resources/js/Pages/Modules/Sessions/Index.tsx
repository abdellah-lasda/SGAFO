import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PlanFormation } from '@/types/plan';
import { useState, useMemo } from 'react';

interface Props {
    plan: PlanFormation;
    seances: any[];
    themesStats: any[];
    sites: any[];
}

export default function Index({ plan, seances, themesStats, sites }: Props) {
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
    const [themeToPlan, setThemeToPlan] = useState<any>(null);

    const { data, setData, post, processing, reset, errors, transform } = useForm({
        date: selectedDate,
        debut: '08:30',
        fin: '12:30',
        site_id: plan.site_formation_id || '',
        themes: plan.themes.map(t => ({
            plan_theme_id: t.id,
            nom: t.nom,
            heures_planifiees: 0,
            checked: false
        }))
    });

    // Séances filtrées pour le jour sélectionné
    const dailySeances = seances.filter(s => s.date.split('T')[0] === selectedDate);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        transform((data) => ({
            ...data,
            date: selectedDate,
            themes: data.themes.filter(t => t.checked && t.heures_planifiees > 0)
        }));

        post(route('modules.plans.seances.store', plan.id), {
            onSuccess: () => {
                reset();
                setThemeToPlan(null);
                setIsAdding(false);
            }
        });
    };

    const deleteSeance = (id: number) => {
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
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">Planning</span>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    <span className="font-black text-slate-900">{plan.titre}</span>
                </div>
            }
        >
            <Head title="Gestion du Planning" />

            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
                
                {/* PARTIE 1 : SÉLECTEUR DE JOURNÉE (STYLE STEP 3) */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="space-y-1">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Étape d'Exécution — Gestion du Planning</h2>
                            <p className="text-xs text-slate-400 font-medium">Configurez les séances journée par journée.</p>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression Globale</p>
                                <p className="text-sm font-black text-blue-600">
                                    {Math.round((themesStats.reduce((s,t) => s + t.heures_planifiees, 0) / themesStats.reduce((s,t) => s + t.duree_totale, 0)) * 100)}% planifié
                                </p>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Choisir la journée à configurer</label>
                        <div className="relative">
                            <select
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-blue-100 text-blue-900 text-sm font-bold rounded-2xl focus:ring-blue-500 focus:border-blue-500 block p-5 appearance-none shadow-sm transition-all"
                            >
                                {formationDates.map((date, idx) => (
                                    <option key={date} value={date}>
                                        Jour {idx + 1} : {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-blue-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PARTIE 2 : PROGRAMME DE LA JOURNÉE (STYLE STEP 3 - RÉSULTATS) */}
                <div className="bg-blue-50/50 rounded-[2rem] border border-blue-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-blue-900 flex items-center gap-2 uppercase tracking-widest">
                            <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Programme du {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </h3>
                        <span className="bg-blue-100 text-blue-700 py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
                            {dailySeances.length} Séance(s)
                        </span>
                    </div>

                    {dailySeances.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-blue-100/50 border-dashed">
                            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest italic">Aucune séance planifiée pour cette journée</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dailySeances.map((seance) => (
                                <div key={seance.id} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex flex-col items-center justify-center">
                                            <span className="text-[8px] font-black uppercase leading-none opacity-80 mb-0.5">Time</span>
                                            <span className="text-xs font-black">{seance.debut.substring(0, 5)}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{seance.debut.substring(0, 5)} - {seance.fin.substring(0, 5)}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {seance.themes.map((t: any) => (
                                                    <span key={t.id} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                                        {t.nom} ({t.pivot.heures_planifiees}h)
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => deleteSeance(seance.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        title="Supprimer la séance"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PARTIE 3 : CATALOGUE DES THÈMES (STYLE STEP 4) */}
                <div>
                    <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest ml-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Catalogue des thèmes à planifier
                    </h3>

                    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Désignation du thème</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Prévu</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Déjà Planifié</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {themesStats.map((theme) => {
                                    const progress = (theme.heures_planifiees / theme.duree_totale) * 100;
                                    const isDone = theme.reste === 0;

                                    return (
                                        <tr key={theme.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></div>
                                                    <p className="text-sm font-black text-slate-900">{theme.nom}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center text-sm font-bold text-slate-500">{theme.duree_totale}h</td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`text-sm font-black ${isDone ? 'text-emerald-600' : 'text-blue-600'}`}>
                                                    {theme.heures_planifiees}h
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-700 ${isDone ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                                                            style={{ width: `${Math.min(100, progress)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${isDone ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {isDone ? 'Complet' : `${Math.round(progress)}%`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {!isDone ? (
                                                    <button 
                                                        onClick={() => openPlanningForTheme(theme)}
                                                        className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                                                    >
                                                        📅 Planifier
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2 text-emerald-500">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Planifié</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODALE D'AJOUT DE SÉANCE (REMPLACE LE FORMULAIRE SIDEBAR) */}
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 space-y-8 animate-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Nouvelle Séance</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Date : {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
                                </div>
                                <button onClick={() => { setIsAdding(false); reset(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Début (Heure exacte)</label>
                                        <input 
                                            type="time" 
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-center"
                                            value={data.debut}
                                            onChange={e => setData('debut', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fin (Heure exacte)</label>
                                        <input 
                                            type="time" 
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-center"
                                            value={data.fin}
                                            onChange={e => setData('fin', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thème(s) affecté(s)</label>
                                    <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {data.themes.map((theme, index) => (
                                            <div key={theme.plan_theme_id} className={`p-5 rounded-3xl border transition-all ${theme.checked ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-slate-50 opacity-40'}`}>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <div 
                                                        onClick={() => {
                                                            const newThemes = [...data.themes];
                                                            newThemes[index].checked = !newThemes[index].checked;
                                                            setData('themes', newThemes);
                                                        }}
                                                        className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 cursor-pointer transition-colors ${theme.checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                                                    >
                                                        {theme.checked && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <span className="text-xs font-black text-slate-900 flex-1">{theme.nom}</span>
                                                </div>
                                                {theme.checked && (
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="number" 
                                                            step="0.5" 
                                                            className="w-24 bg-white border-blue-100 rounded-xl py-2 px-4 text-xs font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                                                            value={theme.heures_planifiees}
                                                            onChange={e => {
                                                                const newThemes = [...data.themes];
                                                                newThemes[index].heures_planifiees = parseFloat(e.target.value) || 0;
                                                                setData('themes', newThemes);
                                                            }}
                                                        />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">heures dédiées</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/20 transition-all transform active:scale-[0.98] disabled:opacity-50"
                                >
                                    {processing ? 'Planification...' : 'Confirmer la séance'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
