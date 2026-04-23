import { useState, PropsWithChildren, ReactNode } from 'react';
import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage<PageProps>().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-screen bg-[#f8fafc] flex overflow-hidden">
            {/* Sidebar Component */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} h-full transition-all duration-300 overflow-hidden flex-shrink-0`}>
                <Sidebar user={user} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* Modern SaaS Top Bar (From Image) */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20 shadow-sm shadow-slate-200/50">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-50 rounded-md transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        {/* Breadcrumbs / Page Context */}
                        <nav className="flex items-center text-sm font-bold tracking-tight">
                            <span className="text-slate-400 mr-2">SGAFO</span>
                            <svg className="w-4 h-4 text-slate-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="text-slate-900">
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
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-[#f8fafc] space-y-8 pb-12">
                     {/* Padding wrapper for page content to align with image white-space */}
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
