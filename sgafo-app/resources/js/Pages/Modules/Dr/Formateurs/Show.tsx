import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    User as UserIcon, 
    Building2, 
    Calendar, 
    TrendingUp, 
    Award, 
    Clock, 
    ArrowLeft, 
    Briefcase,
    Mail,
    CheckCircle2
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface Props {
    formateur: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        instituts: Array<{ nom: string, region: { nom: string } }>;
        secteurs: Array<{ nom: string }>;
        roles: Array<{ nom: string }>;
    };
    stats: {
        attendance_rate: number;
        qcm_average: number;
        feedback_average: number;
    };
    history: any[];
}

export default function Show({ formateur, stats, history }: Props) {
    
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 text-sm">
                    <Link href={route('dr.formateurs.index')} className="text-slate-400 hover:text-emerald-600 transition-colors font-bold">Annuaire</Link>
                    <span className="text-slate-300">/</span>
                    <span className="font-black text-slate-900 uppercase tracking-widest text-[11px]">{formateur.prenom} {formateur.nom}</span>
                </div>
            }
        >
            <Head title={`Profil - ${formateur.prenom} ${formateur.nom}`} />

            <div className="max-w-[1200px] mx-auto p-6 space-y-8 pb-32">
                
                {/* Profile Header */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-60"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
                        <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
                            <UserIcon className="w-16 h-16" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h1 className="text-4xl font-black text-slate-900">{formateur.prenom} {formateur.nom}</h1>
                                <div className="flex justify-center md:justify-start gap-2">
                                    {formateur.roles.map((role, idx) => (
                                        <span key={idx} className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {role.nom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-500 font-bold text-sm">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <Mail className="w-4 h-4 text-emerald-500" />
                                    {formateur.email}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <Building2 className="w-4 h-4 text-emerald-500" />
                                    {formateur.instituts[0]?.nom}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <Briefcase className="w-4 h-4 text-emerald-500" />
                                    {formateur.secteurs[0]?.nom || 'Secteur non défini'}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    Statut: <span className="text-emerald-600">Actif</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Assiduité */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Assiduité</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900">{stats.attendance_rate}%</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Présence globale</p>
                        </div>
                    </div>

                    {/* QCM */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Performance QCM</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900">{stats.qcm_average.toFixed(1)}/100</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Moyenne de réussite</p>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Qualité (Feedback)</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900">{stats.feedback_average.toFixed(1)}/5</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Satisfaction stagiaires</p>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 italic">Historique des Sessions</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Les 10 dernières séances suivies par le formateur</p>
                        </div>
                        <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] bg-white">
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Plan de formation</th>
                                    <th className="px-8 py-5">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-600">
                                                {new Date(item.seance.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">{item.seance.plan.entite.titre}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{item.seance.plan.entite.reference}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                item.statut === 'présent' ? 'bg-emerald-50 text-emerald-600' :
                                                item.statut === 'retard' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                                {item.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                                            Aucun historique disponible pour ce formateur.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
