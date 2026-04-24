import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
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
    // Initialiser les présences avec les données existantes ou par défaut (présent)
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
        // Si on change vers présent, on reset la justification
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

            <div className="max-w-4xl mx-auto space-y-6 pb-24">
                {/* Session Info Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Feuille d'émargement numérique</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            {format(new Date(seance.date), 'EEEE d MMMM yyyy', { locale: fr })} · {seance.debut} - {seance.fin}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            {participants.length} Participants
                        </div>
                    </div>
                </div>

                {/* Search Bar Placeholder */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Rechercher un participant..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                {/* Participants List */}
                <div className="space-y-4">
                    {participants.map((participant, index) => {
                        const pres = data.presences[index];
                        return (
                            <div key={participant.id} className={`bg-white rounded-2xl border transition-all duration-300 ${
                                pres.statut === 'absent' ? 'border-red-200 shadow-lg shadow-red-500/5' : 
                                pres.statut === 'retard' ? 'border-amber-200 shadow-lg shadow-amber-500/5' : 
                                'border-slate-200 hover:border-blue-300'
                            }`}>
                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black border transition-colors ${
                                            pres.statut === 'présent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            pres.statut === 'absent' ? 'bg-red-50 text-red-600 border-red-100' :
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {participant.prenom[0]}{participant.nom[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{participant.prenom} {participant.nom}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                {participant.instituts?.[0]?.nom || 'Sans institut'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Attendance Toggles */}
                                    <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                                        <button 
                                            onClick={() => updateStatus(index, 'présent')}
                                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                pres.statut === 'présent' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Présent
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(index, 'absent')}
                                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                pres.statut === 'absent' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Absent
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(index, 'retard')}
                                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                pres.statut === 'retard' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            Retard
                                        </button>
                                    </div>
                                </div>

                                {/* Justification Panel (Conditionally Visible) */}
                                {(pres.statut === 'absent' || pres.statut === 'retard') && (
                                    <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Justification reçue ?</label>
                                                <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                                                    <button 
                                                        onClick={() => updateJustification(index, true)}
                                                        className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${pres.est_justifie ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        Oui
                                                    </button>
                                                    <button 
                                                        onClick={() => updateJustification(index, false)}
                                                        className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${!pres.est_justifie ? 'bg-slate-200 text-slate-700 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        Non
                                                    </button>
                                                </div>
                                            </div>
                                            {pres.est_justifie && (
                                                <textarea 
                                                    value={pres.motif || ''}
                                                    onChange={(e) => updateMotif(index, e.target.value)}
                                                    placeholder="Motif de la justification..."
                                                    className="w-full bg-white border-slate-200 rounded-lg text-[11px] font-medium p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                                    rows={2}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-200 z-30 lg:pl-72">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <p className="hidden sm:block text-xs text-slate-400 font-medium">
                        Dernière sauvegarde automatique : {format(new Date(), 'HH:mm')}
                    </p>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={() => handleSubmit(false)}
                            disabled={processing}
                            className="flex-1 sm:flex-none px-6 py-4 bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Enregistrer (Brouillon)
                        </button>
                        <button 
                            onClick={() => handleSubmit(true)}
                            disabled={processing}
                            className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                        >
                            Clôturer la séance
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
