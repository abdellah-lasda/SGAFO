import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Toast() {
    const { props } = usePage<PageProps>();
    const flash = props.flash || {};
    const [visible, setVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setVisible(false);
            setIsExiting(false);
        }, 500);
    };

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setIsExiting(false);
            setVisible(true);
            const timer = setTimeout(() => handleClose(), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setIsExiting(false);
            setVisible(true);
            const timer = setTimeout(() => handleClose(), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible) return null;

    return (
        <div className={`fixed top-10 right-10 z-[200] transition-all duration-500 ease-in-out transform ${
            isExiting ? 'translate-x-[150%] opacity-0 scale-90' : 'translate-x-0 opacity-100 scale-100'
        }`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.15)] min-w-[380px] max-w-md overflow-hidden relative group toast-fade-in-up">
                {/* Main Content Area */}
                <div className="flex items-center gap-4 p-5 pr-7">
                    {/* Side Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{message}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            À l'instant
                        </p>
                    </div>

                    <button 
                        onClick={handleClose}
                        className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar (Timer) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50">
                    <div 
                        className={`h-full transition-all linear ${
                            type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                        style={{ 
                            animation: 'toast-progress 5.1s linear forwards' 
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                
                .toast-fade-in-up {
                    animation: toast-slide-in 0.5s ease-out forwards;
                }

                @keyframes toast-slide-in {
                    from { transform: translateX(100%) scale(0.9); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
