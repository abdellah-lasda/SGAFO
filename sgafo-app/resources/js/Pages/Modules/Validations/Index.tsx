import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PlanFormation } from '@/types/plan';
import { ValidationStats } from './Components/ValidationStats';
import { ValidationTable } from './Components/ValidationTable';

interface Props {
    plans: PlanFormation[];
    stats: {
        pending_count: number;
        validated_this_month: number;
        my_secteurs: string;
    };
    filters: {
        statut: string;
    };
}

export default function Index({ plans, stats, filters }: Props) {
    const handleFilterChange = (statut: string) => {
        router.get(route('modules.validations.index'), { statut }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header={<span>Centre de Validation</span>}>
            <Head title="Centre de Validation RF" />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Header Title & Description */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                            Espace de Validation
                        </h1>
                        <p className="text-sm text-slate-400 font-medium mt-1">Gérez et approuvez les plans de formation de vos secteurs d'expertise.</p>
                    </div>
                    
                    {/* Status Tabs */}
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 self-start">
                        <button
                            onClick={() => handleFilterChange('soumis')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                filters.statut === 'soumis'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            📦 À traiter
                        </button>
                        <button
                            onClick={() => handleFilterChange('planning')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                filters.statut === 'planning'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            📅 À Planifier
                        </button>
                        <button
                            onClick={() => handleFilterChange('historique')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                filters.statut === 'historique'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            🕒 Historique
                        </button>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <ValidationStats 
                    pending={stats.pending_count} 
                    validated={stats.validated_this_month} 
                    secteurs={stats.my_secteurs} 
                />

                {/* Table Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Liste des plans ({plans.length})
                        </h3>
                        <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">
                            Filtré par : {filters.statut === 'soumis' ? 'A traiter' : 'Historique complet'}
                        </div>
                    </div>
                    
                    <ValidationTable plans={plans} />
                </div>

                {/* Info Footer */}
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative group">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white tracking-tight">Besoin d'aide ?</h4>
                                <p className="text-xs text-slate-400 font-medium">Consultez le guide de validation pour connaître les critères de conformité du catalogue.</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-lg">
                            Voir le guide PDF
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
