import { FC } from 'react';

interface StatsProps {
    pending: number;
    validated: number;
    secteurs: string;
}

export const ValidationStats: FC<StatsProps> = ({ pending, validated, secteurs }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat: Pending */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:border-amber-200 hover:shadow-md group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{pending}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En attente de validation</p>
            </div>

            {/* Stat: Validated this month */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{validated}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validés ce mois</p>
            </div>

            {/* Stat: Sectors */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1 truncate" title={secteurs}>{secteurs || 'Aucun'}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteurs supervisés</p>
            </div>
        </div>
    );
};
