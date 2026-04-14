import { Link } from '@inertiajs/react';
import { User } from '@/types';

interface SidebarProps {
    user: User;
}

export default function Sidebar({ user }: SidebarProps) {
    const roles = user.roles || [];
    const isFormateur = roles.includes('FORMATEUR');
    const isCDC = roles.includes('CDC');
    const isRF = roles.includes('RF');
    const isDR = roles.includes('DR');
    const isAdmin = roles.includes('ADMIN');

    // Helper for active styling (simplified for UI demo)
    const activeClass = "bg-ofppt-600 text-white";
    const inactiveClass = "text-gray-400 hover:bg-gray-800 hover:text-white";

    return (
        <aside className="w-64 bg-[#111827] text-white flex flex-col h-full shadow-2xl font-sans">
            <div className="h-20 flex items-center px-6">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-ofppt-600 to-ofppt-400 flex items-center justify-center text-sm shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    SGAFO
                </span>
            </div>

            <div className="px-4 mb-6">
                <button className="w-full flex items-center justify-between px-4 py-2.5 bg-ofppt-600 hover:bg-ofppt-500 text-white text-sm font-semibold rounded-full transition-all shadow-md">
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nouveau
                    </span>
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide pb-4">
                
                {/* Section Principale */}
                <div className="space-y-1.5">
                    <Link
                        href={route('dashboard')}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${activeClass}`}
                    >
                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Tableau de bord
                    </Link>
                    <Link
                        href="#"
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}
                    >
                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendrier
                    </Link>
                </div>

                {/* Formateurs */}
                {isFormateur && (
                    <div>
                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Mon Espace
                        </p>
                        <div className="space-y-1.5">
                            <Link href="#" className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Parcours Participant
                            </Link>
                            <Link href="#" className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                Parcours Animateur
                            </Link>
                        </div>
                    </div>
                )}

                {/* Processus Métier (CDC / RF) */}
                {(isCDC || isRF || isDR) && (
                    <div>
                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Modules
                        </p>
                        <div className="space-y-1.5">
                            <Link href="#" className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                Idées de formations
                            </Link>
                            <Link href="#" className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                Plans massifs
                            </Link>
                            <Link href="#" className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Groupes & Sessions
                            </Link>
                        </div>
                    </div>
                )}

                {/* Administration */}
                {isAdmin && (
                    <div>
                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Administration
                        </p>
                        <div className="space-y-1.5">
                            <Link href={route('admin.users.index')} className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${route().current('admin.users.*') ? activeClass : inactiveClass}`}>
                                <svg className="mr-3 h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Utilisateurs
                            </Link>
                            <Link href="#" className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Domaines & Secteurs
                            </Link>
                            <Link href="#" className={`flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${inactiveClass}`}>
                                <svg className="mr-3 h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                Répartition (DRs)
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* User Profile Mini */}
            <div className="p-4 mx-2 mb-4 bg-gray-800 rounded-2xl flex items-center shadow-lg cursor-pointer hover:bg-gray-700 transition">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ofppt-700 to-ofppt-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                    </div>
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{user.prenom} {user.nom}</p>
                    <p className="text-xs text-ofppt-400 truncate">{user.primary_role}</p>
                </div>
            </div>
        </aside>
    );
}
