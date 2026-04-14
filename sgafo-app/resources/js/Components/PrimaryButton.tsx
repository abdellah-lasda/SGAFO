import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent bg-ofppt-600 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-ofppt-700 focus:bg-ofppt-700 focus:outline-none focus:ring-2 focus:ring-ofppt-500 focus:ring-offset-2 active:bg-ofppt-800 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
