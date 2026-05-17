import { SVGAttributes } from 'react';

interface LogoProps extends SVGAttributes<HTMLDivElement> {
    variant?: 'light' | 'dark' | 'brand' | 'sidebar';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
}

export default function Logo({ variant = 'brand', size = 'md', showText = true, className = '', ...props }: LogoProps) {
    const iconSizeClasses = {
        sm: 'w-6 h-6 rounded-md',
        md: 'w-9 h-9 rounded-xl',
        lg: 'w-12 h-12 rounded-xl',
        xl: 'w-16 h-16 rounded-2xl'
    };

    const textClasses = {
        light: 'text-white',
        dark: 'text-slate-900',
        brand: 'text-slate-900',
        sidebar: 'text-white'
    };

    const bgClasses = {
        light: 'bg-white/20 text-white backdrop-blur-md shadow-inner',
        dark: 'bg-slate-900 text-white shadow-lg shadow-slate-900/20',
        brand: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30',
        sidebar: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30'
    };

    return (
        <div className={`flex items-center gap-3 ${className}`} {...props}>
            <div className={`${iconSizeClasses[size]} flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 duration-300 ${bgClasses[variant]}`}>
                <svg className="w-[65%] h-[65%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
            </div>
            {showText && (
                <span className={`font-black tracking-tighter uppercase ${textClasses[variant]} ${size === 'xl' ? 'text-5xl' : size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-lg'}`}>
                    SGAFO
                </span>
            )}
        </div>
    );
}
