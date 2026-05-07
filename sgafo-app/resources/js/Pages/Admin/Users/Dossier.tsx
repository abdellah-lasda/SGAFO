import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface UserProfile {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    statut: string;
    is_externe: boolean;
    roles: any[];
    regions: any[];
    instituts: any[];
    secteurs: any[];
    cdcs: any[];
}

interface Props {
    userProfile: UserProfile;
    stats: {
        participant: {
            plans_count: number;
            attendance_rate: number;
            avg_qcm: number;
            plans: any[];
        };
        animateur: {
            seances_count: number;
            hours_taught: number;
            avg_satisfaction: number;
            seances: any[];
        };
        gestionnaire: {
            created_count: number;
            validated_count: number;
            plans_created: any[];
            plans_validated: any[];
        };
    };
}

export default function Dossier({ userProfile, stats }: Props) {
    const isGestionnaire = userProfile.roles.some(r => ['CDC', 'RF', 'ADMIN'].includes(r.code));

    console.log(userProfile)

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('admin.users.index')} className="text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm">Utilisateurs</Link>
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    <span className="font-black text-slate-900 tracking-tight text-sm">Dossier Consolidé</span>
                </div>
            }
        >
            <Head title={`Dossier - ${userProfile.prenom} ${userProfile.nom}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 pb-20">
                
                {/* Profile Header Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-4xl font-black text-white shadow-inner">
                            {userProfile.prenom?.charAt(0)}{userProfile.nom?.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {userProfile.roles.map(role => (
                                    <span key={role.id} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                                        {role.libelle}
                                    </span>
                                ))}
                                {userProfile.is_externe && (
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/30">
                                        Externe
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                {userProfile.prenom} {userProfile.nom}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {userProfile.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    {userProfile.instituts.map(i => i.nom).join(', ') || 'Non rattaché'}
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-auto pt-4 md:pt-0">
                            <div className={`px-6 py-3 rounded-2xl text-center border-2 ${userProfile.statut === 'actif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-50">Statut Compte</div>
                                <div className="text-xl font-black uppercase tracking-widest">{userProfile.statut}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard 
                        title="Assiduité Globale" 
                        value={`${stats.participant.attendance_rate}%`} 
                        label="Taux de présence" 
                        color="blue"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <StatCard 
                        title="Réussite QCM" 
                        value={`${stats.participant.avg_qcm}%`} 
                        label="Moyenne des scores" 
                        color="emerald"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    />
                    {isGestionnaire ? (
                        <StatCard 
                            title="Pilotage" 
                            value={`${stats.gestionnaire.created_count + stats.gestionnaire.validated_count}`} 
                            label="Plans créés ou validés" 
                            color="violet"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                        />
                    ) : (
                        <StatCard 
                            title="Volume Animation" 
                            value={`${stats.animateur.hours_taught}h`} 
                            label="Heures dispensées" 
                            color="violet"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        />
                    )}
                    <StatCard 
                        title="Satisfaction" 
                        value={stats.animateur.avg_satisfaction.toFixed(1)} 
                        label="Note moyenne reçue" 
                        color="amber"
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Participant Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs text-center leading-8">P</span>
                                Parcours Participant
                            </h2>
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-black rounded-full border border-slate-200">
                                {stats.participant.plans_count} Formation(s)
                            </span>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                            {stats.participant.plans.length > 0 ? (
                                <table className="w-full">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {stats.participant.plans.map(plan => (
                                            <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-black text-slate-800">{plan.titre}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{plan.entite?.secteur?.nom}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${plan.statut === 'terminée' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                        {plan.statut}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center text-slate-400 font-bold italic">
                                    Aucune formation suivie.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Conditional Section for CDC / RF or Animator */}
                    {isGestionnaire ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs text-center leading-8">G</span>
                                    Gestion & Validation
                                </h2>
                                <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-black rounded-full border border-slate-200">
                                    {stats.gestionnaire.created_count + stats.gestionnaire.validated_count} Plan(s)
                                </span>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation gérée</th>
                                            <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {stats.gestionnaire.plans_created.map(plan => (
                                            <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-black text-slate-800">{plan.titre}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{plan.entite?.secteur?.nom}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-blue-50 text-blue-600 border-blue-100">Création</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {stats.gestionnaire.plans_validated.map(plan => (
                                            <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-black text-slate-800">{plan.titre}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{plan.entite?.secteur?.nom}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">Validation</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {stats.gestionnaire.plans_created.length === 0 && stats.gestionnaire.plans_validated.length === 0 && (
                                            <tr>
                                                <td colSpan={2} className="p-12 text-center text-slate-400 font-bold italic">Aucune activité de gestion.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs text-center leading-8">A</span>
                                    Activité Animateur
                                </h2>
                                <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-black rounded-full border border-slate-200">
                                    {stats.animateur.seances_count} Séance(s)
                                </span>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                                {stats.animateur.seances.length > 0 ? (
                                    <table className="w-full">
                                        <thead className="bg-slate-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan / Thème</th>
                                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Durée</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {stats.animateur.seances.map(seance => (
                                                <tr key={seance.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-black text-slate-800">{seance.plan?.titre}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 mt-1">{new Date(seance.date).toLocaleDateString()} - {seance.site?.nom || 'Sans site'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="text-sm font-black text-violet-600">{seance.pivot?.heures_planifiees}h</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-12 text-center text-slate-400 font-bold italic">
                                        Aucune séance animée.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, label, color, icon }: any) {
    const colors: any = {
        blue: 'bg-blue-600 shadow-blue-500/20',
        emerald: 'bg-emerald-600 shadow-emerald-500/20',
        violet: 'bg-violet-600 shadow-violet-500/20',
        amber: 'bg-amber-500 shadow-amber-500/20',
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50 group hover:border-blue-500 transition-all cursor-default">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</div>
                </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
            <div className="text-xs font-bold text-slate-400">{label}</div>
        </div>
    );
}
