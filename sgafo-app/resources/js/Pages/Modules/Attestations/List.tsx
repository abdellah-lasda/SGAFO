import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award, CheckCircle, Clock, FileText, ChevronRight,
    AlertTriangle, Sparkles, Building2, Search, ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanAttestationSummary {
    id: number;
    titre: string;
    entite: string;
    date_debut: string;
    date_fin: string;
    participants_count: number;
    animateurs_count: number;
    generated_count: number;
    total_expected: number;
    is_completed: boolean;
}

interface Props {
    plans: PlanAttestationSummary[];
}

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

export default function AttestationsList({ plans }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPlans = plans.filter(p =>
        p.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.entite.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPlans = plans.length;
    const completedPlans = plans.filter(p => p.is_completed).length;
    const totalGenerated = plans.reduce((acc, curr) => acc + curr.generated_count, 0);
    const totalExpected = plans.reduce((acc, curr) => acc + curr.total_expected, 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.visit(route('dashboard'))}>
                        Tableau de bord
                    </span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-semibold">Attestations</span>
                </div>
            }
        >
            <Head title="Gestion des Attestations" />

            <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Suivi des Attestations</h1>
                                    <p className="text-sm text-slate-400 font-medium mt-0.5">Pilotez la génération des attestations pour toutes les formations validées</p>
                                </div>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Rechercher une formation..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 relative z-10">Formations validées</p>
                            <p className="text-3xl font-black text-slate-900 relative z-10">{totalPlans}</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 relative z-10">Générations terminées</p>
                            <p className="text-3xl font-black text-emerald-600 relative z-10">{completedPlans} <span className="text-slate-300 font-medium text-sm">/ {totalPlans}</span></p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 relative z-10">Total Certificats générés</p>
                            <p className="text-3xl font-black text-indigo-600 relative z-10">{totalGenerated} <span className="text-slate-300 font-medium text-sm">/ {totalExpected}</span></p>
                        </div>
                    </div>

                    {/* Table list */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900">Formations & Attestations</h3>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                {filteredPlans.length} formation{filteredPlans.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {filteredPlans.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-400">Aucune formation validée trouvée.</p>
                                <p className="text-xs text-slate-300 mt-1">Seules les formations validées techniquement et publiées sont disponibles pour les attestations.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation / Établissement</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Dates</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Bénéficiaires</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut Attestations</th>
                                            <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredPlans.map((plan) => (
                                            <tr key={plan.id} className="hover:bg-slate-50/40 transition-colors group">
                                                <td className="py-5 px-6">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{plan.titre}</p>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                                                            <Building2 className="w-3.5 h-3.5" />
                                                            <span>{plan.entite}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 hidden md:table-cell">
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                                                        <span>{plan.date_debut}</span>
                                                        <span className="text-slate-300">→</span>
                                                        <span>{plan.date_fin}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className="text-sm font-bold text-slate-800">{plan.participants_count + plan.animateurs_count}</span>
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                            ({plan.participants_count} Part. / {plan.animateurs_count} Anim.)
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                            plan.is_completed
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : plan.generated_count > 0
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                            {plan.is_completed ? (
                                                                <>
                                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                                    Terminé
                                                                </>
                                                            ) : plan.generated_count > 0 ? (
                                                                <>
                                                                    <Sparkles className="w-3.5 h-3.5" />
                                                                    En cours
                                                                </>
                                                            ) : 'Non généré'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">
                                                            {plan.generated_count} / {plan.total_expected} envoyées
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <Link
                                                        href={route('admin.attestations.index', plan.id)}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                                    >
                                                        Gérer
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
