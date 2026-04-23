import { Link } from '@inertiajs/react';
import { User } from '@/types';

interface SidebarProps {
    user: User;
}

export default function Sidebar({ user }: SidebarProps) {
    const roles = user.roles || [];
    const roleCodes = roles.map(r => typeof r === 'object' ? (r as any).code : r);
    
    const isFormateur = roleCodes.includes('FORMATEUR');
    const isCDC = roleCodes.includes('CDC');
    const isRF = roleCodes.includes('RF');
    const isDR = roleCodes.includes('DR');
    const isAdmin = roleCodes.includes('ADMIN');

    // Modern SaaS Palette
    const activeClass = "bg-blue-600 text-white shadow-lg shadow-blue-500/20";
    const inactiveClass = "text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200";

    return (
        <aside className="w-64 bg-[#0f172a] text-white flex flex-col h-full shadow-2xl font-sans border-r border-slate-800/50">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6">
                <span className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    SGAFO
                </span>
            </div>

            {/* Action Button Section (From Image) */}
            <div className="px-4 mb-8">
                <button className="w-full flex items-center justify-between px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-blue-600/20 group">
                    <span className="flex items-center gap-3">
                        <div className="bg-white/20 p-1 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        Nouveau
                    </span>
                    <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide pb-10">
                
                {/* Section Principale */}
                <div>
                    <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Principal</h3>
                    <div className="space-y-1.5">
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${route().current('dashboard') ? activeClass : inactiveClass}`}
                        >
                            <svg className="mr-3 h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Tableau de bord
                        </Link>
                        <Link
                            href={route('modules.catalogue.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${route().current('modules.catalogue.*') ? activeClass : inactiveClass}`}
                        >
                            <svg className="mr-3 h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Bibliothèque Nationale
                        </Link>
                    </div>
                </div>

                {/* Modules Processus */}
                {(isCDC || isRF) && (
                    <div>
                        <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Planification</h3>
                        <div className="space-y-1.5">
                            <Link
                                href={route('modules.entites.index')}
                                className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${route().current('modules.entites.*') ? activeClass : inactiveClass}`}
                            >
                                <svg className="mr-3 h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Mes Modèles
                            </Link>
                            <Link
                                href={route('modules.plans.index')}
                                className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${route().current('modules.plans.*') ? activeClass : inactiveClass}`}
                            >
                                    <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                                    Plans de formation
                                </Link>
                            {isRF && (
                                <Link
                                    href={route('modules.validations.index')}
                                    className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${route().current('modules.validations.*') ? activeClass : inactiveClass}`}
                                >
                                    <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Centre de Validation
                                </Link>
                            )}
                            {/* <Link href="#" className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Sessions
                            </Link> */}
                        </div>
                    </div>
                )}

                {/* Administration */}
                {isAdmin && (
                    <div>
                        <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Admin</h3>
                        <div className="space-y-1.5">
                            
                            <Link
                                href={route('modules.logistique.index')}className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${route().current('modules.logistique.*') ? activeClass : inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Logistique
                            </Link>
                            <Link href={route('admin.users.index')} className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${route().current('admin.users.*') ? activeClass : inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Utilisateurs
                            </Link>
                            <Link href={route('admin.instituts.index')} className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${route().current('admin.instituts.*') ? activeClass : inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                Établissements
                            </Link>
                            <Link href={route('admin.domaines.index')} className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${route().current('admin.domaines.*') || route().current('admin.cdcs.*') || route().current('admin.secteurs.*') || route().current('admin.metiers.*') ? activeClass : inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                                Spécialités
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* User Profile Mini (Modernized) */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group text-left">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-lg ring-2 ring-slate-800 group-hover:ring-slate-700 transition-all flex-shrink-0">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user.prenom} {user.nom}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                            {typeof roles[0] === 'object' ? (roles[0] as any).libelle || (roles[0] as any).code : roles[0]}
                        </p>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group text-left"
                    >
                        <div className="p-2 rounded-md group-hover:bg-red-500/10 group-hover:text-red-500 text-slate-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
