import React, { useEffect } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    isDanger = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    // Fermer avec Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onCancel();
            if (e.key === 'Enter' && isOpen) onConfirm();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onCancel, onConfirm]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={onCancel}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" />

            {/* Dialog */}
            <div
                className="relative bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    isDanger ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                    {isDanger ? (
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-black text-slate-900 text-center mb-3">{title}</h3>
                <p className="text-sm text-slate-500 text-center leading-relaxed mb-8">{message}</p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                            isDanger
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>

                {/* Keyboard hint */}
                <p className="text-center text-[10px] text-slate-300 mt-4 font-medium">
                    Appuyez sur <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-400 font-mono">Enter</kbd> pour confirmer ou <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-400 font-mono">Esc</kbd> pour annuler
                </p>
            </div>
        </div>
    );
}
