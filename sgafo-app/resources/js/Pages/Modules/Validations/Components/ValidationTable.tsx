import { FC } from 'react';
import { Link } from '@inertiajs/react';
import { PlanFormation, STATUT_CONFIG, PlanStatut } from '@/types/plan';

interface TableProps {
    plans: PlanFormation[];
}

export const ValidationTable: FC<TableProps> = ({ plans }) => {
    if (plans.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-sm font-bold text-slate-400">Aucun plan à traiter pour le moment.</p>
                <p className="text-xs text-slate-300 mt-1">Vous avez validé tous les dossiers de vos secteurs. Félicitations !</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identité & Secteur</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan & Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Auteur</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                        {plans.map((plan) => {
                            const config = STATUT_CONFIG[plan.statut as PlanStatut];
                            const totalHeures = plan.themes?.reduce((sum, t) => sum + Number(t.duree_heures), 0) || 0;
                            const createdDate = new Date(plan.created_at);
                            const daysAgo = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));

                            return (
                                <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black text-slate-900 line-clamp-1 truncate block max-w-[200px]" title={plan.entite?.titre}>{plan.entite?.titre}</span>
                                            <span className="inline-flex w-fit px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider border border-blue-100/50">
                                                {plan.entite?.secteur?.nom}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700 line-clamp-1">{plan.titre}</span>
                                            <span className="text-[10px] text-slate-400 mt-1">
                                                Soumis le {new Date(plan.date_soumission || plan.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                                                {plan.createur?.prenom[0]}{plan.createur?.nom[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900">{plan.createur?.prenom} {plan.createur?.nom}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Créateur</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-700">{plan.site_formation?.nom || 'Non défini'}</span>
                                            <span className="text-[10px] text-slate-400">{plan.site_formation?.ville || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`w-fit px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${config.bg} ${config.color} border border-current opacity-70`}>
                                                {config.label}
                                            </span>
                                            {plan.statut === 'soumis' && (
                                                <span className={`text-[9px] font-bold ${daysAgo > 3 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                                                    ⌛ En attente : {daysAgo} jour(s)
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                                        {plan.statut === 'confirmé' && (
                                            <Link
                                                href={route('modules.validations.planning.index', plan.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-500 transition-all shadow-sm active:scale-95"
                                            >
                                                🗓️ Planifier
                                            </Link>
                                        )}
                                        <Link
                                            href={route('modules.validations.show', plan.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                                        >
                                            {plan.statut === 'soumis' ? 'Examiner' : 'Détails'}
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M5 12h16" /></svg>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
