import { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { AppNotification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';


interface Props {
    notifications: AppNotification[];
}

export default function NotificationCenter({ notifications }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id: string) => {
        router.post(route('modules.notifications.mark-as-read', id), {}, {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        router.post(route('modules.notifications.mark-all-as-read'), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-all relative ${
                    isOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                            >
                                Tout lire
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400">Aucune nouvelle notification</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer relative"
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            router.visit(notification.data.action_url);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                                                notification.data.type === 'soumission' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                notification.data.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                notification.data.type === 'danger' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                                {notification.data.type === 'soumission' && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                )}
                                                {notification.data.type === 'success' && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                )}
                                                {notification.data.type === 'danger' && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {notification.data.type === 'soumission' ? 'Soumission' : 
                                                         notification.data.type === 'success' ? 'Validation' : 'Rejet'}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-300">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-700 line-clamp-2 leading-relaxed">
                                                    {notification.data.message}
                                                </p>
                                                {notification.data.plan_titre && (
                                                    <p className="text-[10px] text-slate-400 mt-1 italic line-clamp-1">
                                                        Plan: {notification.data.plan_titre}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-50 border-top border-slate-100 text-center">
                        <Link 
                            href="#"
                            className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                        >
                            Voir toutes les notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
