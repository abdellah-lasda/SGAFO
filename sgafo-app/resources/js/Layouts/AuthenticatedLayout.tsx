import { useState, PropsWithChildren, ReactNode } from 'react';
import Sidebar from '@/Components/Sidebar';
import NotificationCenter from '@/Components/NotificationCenter';
import Toast from '@/Components/Toast';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    return (
        <div className="h-screen bg-[#f8fafc] flex overflow-hidden relative">
            <Toast />
            
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar Component */}
            <div className={`
                fixed md:relative inset-y-0 left-0 z-40
                ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0 md:w-0'}
                h-full transition-all duration-300 overflow-hidden flex-shrink-0
            `}>
                <div className="w-64 h-full">
                    <Sidebar user={user} onClose={() => window.innerWidth < 768 && setIsSidebarOpen(false)} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* Modern SaaS Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-20 shadow-sm shadow-slate-200/50">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-50 rounded-md transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        {/* Breadcrumbs / Page Context */}
                        <nav className="flex items-center text-xs md:text-sm font-bold tracking-tight truncate">
                            <span className="text-slate-400 mr-2 hidden sm:inline">SGAFO</span>
                            <svg className="w-4 h-4 text-slate-300 mr-2 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="text-slate-900 truncate max-w-[150px] sm:max-w-none">
                                {header || "Tableau de bord"}
                            </div>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-black text-slate-500 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Instance Production
                        </div>
                        <NotificationCenter notifications={user.notifications || []} />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#f8fafc] space-y-8 pb-12 w-full">
                     {/* Padding wrapper for page content */}
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
