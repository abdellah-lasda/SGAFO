import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Participant {
    id: number;
    nom: string;
    prenom: string;
    instituts?: { nom: string }[];
}

interface Presence {
    participant_id: number;
    statut: 'présent' | 'absent' | 'retard';
    est_justifie: boolean;
    motif: string | null;
}

interface Props extends PageProps {
    seance: any;
    participants: Participant[];
}

export default function AttendanceSheet({ seance, participants }: Props) {
    const initialPresences = participants.map(p => {
        const existing = seance.presences.find((pr: any) => pr.participant_id === p.id);
        return {
            participant_id: p.id,
            statut: existing ? existing.statut : 'présent',
            est_justifie: existing ? !!existing.est_justifie : false,
            motif: existing ? existing.motif : '',
        };
    });

    const { data, setData, post, processing } = useForm({
        presences: initialPresences,
        is_closing: false,
    });

    const updateStatus = (index: number, status: 'présent' | 'absent' | 'retard') => {
        const newPresences = [...data.presences];
        newPresences[index].statut = status;
        if (status === 'présent') {
            newPresences[index].est_justifie = false;
            newPresences[index].motif = '';
        }
        setData('presences', newPresences);
    };

    const updateJustification = (index: number, val: boolean) => {
        const newPresences = [...data.presences];
        newPresences[index].est_justifie = val;
        setData('presences', newPresences);
    };

    const updateMotif = (index: number, val: string) => {
        const newPresences = [...data.presences];
        newPresences[index].motif = val;
        setData('presences', newPresences);
    };

    const handleSubmit = (isClosing = false) => {
        setData('is_closing', isClosing);
        post(route('modules.animateur.seances.submit-attendance', seance.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2">
                <Link href={route('modules.animateur.dashboard')} className="text-slate-400 hover:text-blue-600 transition-colors font-bold">Tableau de bord</Link>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                <span className="font-bold text-slate-900 text-xs truncate max-w-[200px]">{seance.plan.titre}</span>
            </div>
        }>
            <Head title="Feuille d'appel" />

            <div className="max-w-5xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Appel & Présences</h1>
                        <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">
                            {format(new Date(seance.date), 'EEEE d MMMM yyyy', { locale: fr })} · {seance.debut} - {seance.fin}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{participants.length} Participants</span>
                        </div>
                    </div>
                </div>

                {/* Main Table Layout */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Participant</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Etablissement</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Présence</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Justification & Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.presences.map((pres, index) => {
                                const participant = participants.find(p => p.id === pres.participant_id);
                                return (
                                    <tr key={pres.participant_id} className="group hover:bg-blue-50/20 transition-colors">
                                        {/* Colonne Participant */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] border transition-all ${
                                                    pres.statut === 'présent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    pres.statut === 'absent' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {participant?.prenom[0]}{participant?.nom[0]}
                                                </div>
                                                <p className="text-sm font-black text-slate-900 leading-tight">{participant?.prenom} {participant?.nom}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {participant?.instituts?.[0]?.nom || "OFPPT"}
                                             </span>
                                        </td>

                                        {/* Colonne Statut */}
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex items-center justify-center gap-1 bg-slate-100/50 p-1 rounded-xl w-fit mx-auto border border-slate-200/50">
                                                {[
                                                    { id: 'présent', label: 'P', full: 'Présent', color: 'text-emerald-600', active: 'bg-white shadow-sm text-emerald-600' },
                                                    { id: 'absent', label: 'A', full: 'Absent', color: 'text-red-600', active: 'bg-white shadow-sm text-red-600' },
                                                    { id: 'retard', label: 'R', full: 'Retard', color: 'text-amber-600', active: 'bg-white shadow-sm text-amber-600' }
                                                ].map(status => (
                                                    <button
                                                        key={status.id}
                                                        type="button"
                                                        title={status.full}
                                                        onClick={() => updateStatus(index, status.id as any)}
                                                        className={`w-8 h-8 rounded-lg text-[10px] font-black uppercase transition-all ${
                                                            pres.statut === status.id ? status.active : 'text-slate-400 hover:text-slate-600'
                                                        }`}
                                                    >
                                                        {status.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Colonne Justification */}
                                        <td className="px-8 py-6 min-w-[300px]">
                                            <div className="space-y-3">
                                                {(pres.statut === 'absent' || pres.statut === 'retard') ? (
                                                    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <label className="flex items-center gap-2 cursor-pointer group/toggle w-fit">
                                                            <div className="relative inline-flex items-center">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="sr-only peer"
                                                                    checked={pres.est_justifie}
                                                                    onChange={(e) => updateJustification(index, e.target.checked)}
                                                                />
                                                                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Justifié</span>
                                                        </label>
                                                        
                                                        <textarea 
                                                            value={pres.motif || ''}
                                                            onChange={(e) => updateMotif(index, e.target.value)}
                                                            placeholder="Note ou motif..."
                                                            className="w-full bg-slate-50 border-slate-200 rounded-xl text-[10px] font-medium p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all resize-none"
                                                            rows={2}
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Ok</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="mx-auto max-w-5xl left-6 right-6 lg:left-80 lg:right-10 ">
                <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl shadow-slate-900/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500">
                    <div className="flex items-center gap-4 pl-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dernière sauvegarde</p>
                            <p className="text-xs font-bold text-slate-700">{format(new Date(), 'HH:mm')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a 
                            href={route('modules.animateur.seances.print-sheet', seance.id)}
                            target="_blank"
                            title="Imprimer la feuille d'émargement manuelle"
                            className="px-6 py-4 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>🖨️</span>
                            <span className="hidden md:inline">Feuille d'Absences</span>
                        </a>
                        <a 
                            href={route('modules.animateur.seances.export-absences', seance.id)}
                            target="_blank"
                            className="px-6 py-4 bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>📄</span>
                            <span className="hidden md:inline">Rapport Absences</span>
                        </a>
                        <button 
                            onClick={() => handleSubmit(false)}
                            disabled={processing}
                            className="flex-1 sm:flex-none px-6 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            Enregistrer
                        </button>
                        <button 
                            onClick={() => handleSubmit(true)}
                            disabled={processing}
                            className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 border-b-4 border-blue-700 active:border-b-0"
                        >
                            Clôturer la séance
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
