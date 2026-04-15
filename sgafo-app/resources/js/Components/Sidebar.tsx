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
                            href={route('modules.entites.index')}
                            className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${route().current('modules.entites.*') ? activeClass : inactiveClass}`}
                        >
                            <svg className="mr-3 h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Catalogue national
                        </Link>
                        {/* <Link
                            href="#"
                            className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${inactiveClass}`}
                        >
                            <svg className="mr-3 h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Calendrier
                        </Link> */}
                    </div>
                </div>

                {/* Modules Processus */}
                {(isCDC || isRF) && (
                    <div>
                        <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Planification</h3>
                        <div className="space-y-1.5">
                            <Link href="#" className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                                Plans massifs
                            </Link>
                            <Link href="#" className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Sessions
                            </Link>
                        </div>
                    </div>
                )}

                {/* Administration */}
                {isAdmin && (
                    <div>
                        <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Admin</h3>
                        <div className="space-y-1.5">
                            <Link href={route('admin.users.index')} className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${route().current('admin.users.*') ? activeClass : inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Utilisateurs
                            </Link>
                            <Link href="#" className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Configuration
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* User Profile Mini (Modernized) */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-lg ring-2 ring-slate-800 group-hover:ring-slate-700 transition-all">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user.prenom} {user.nom}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                            {typeof roles[0] === 'object' ? (roles[0] as any).libelle || (roles[0] as any).code : roles[0]}
                        </p>
                    </div>
                    <svg className="w-4 h-4 text-slate-600 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </aside>
    );
}
