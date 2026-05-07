import React, { useState } from 'react';

interface EmojiOption {
    value: number;
    emoji: string;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

const EMOJI_OPTIONS: EmojiOption[] = [
    { value: 1, emoji: '☹️', label: 'Insatisfait', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fca5a5' },
    { value: 2, emoji: '😐', label: 'Moyen',       color: '#f97316', bgColor: '#fff7ed', borderColor: '#fdba74' },
    { value: 3, emoji: '🙂', label: 'Satisfait',   color: '#22c55e', bgColor: '#f0fdf4', borderColor: '#86efac' },
    { value: 4, emoji: '😍', label: 'Très satisfait', color: '#8b5cf6', bgColor: '#faf5ff', borderColor: '#c4b5fd' },
];

interface EmojiRatingProps {
    value: number | null;
    onChange: (value: number) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function EmojiRating({ value, onChange, disabled = false, size = 'md' }: EmojiRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);

    const sizeClasses = {
        sm: { container: 'gap-2', emoji: 'text-3xl', label: 'text-xs', button: 'p-2 rounded-xl' },
        md: { container: 'gap-3', emoji: 'text-4xl', label: 'text-xs', button: 'p-3 rounded-2xl' },
        lg: { container: 'gap-4', emoji: 'text-5xl', label: 'text-sm', button: 'p-4 rounded-2xl' },
    };

    const sc = sizeClasses[size];
    const activeValue = hovered ?? value;

    return (
        <div className={`flex items-center justify-center ${sc.container}`}>
            {EMOJI_OPTIONS.map((option) => {
                const isActive = activeValue === option.value;
                const isSelected = value === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && onChange(option.value)}
                        onMouseEnter={() => !disabled && setHovered(option.value)}
                        onMouseLeave={() => setHovered(null)}
                        title={option.label}
                        style={isActive ? {
                            backgroundColor: option.bgColor,
                            borderColor: option.borderColor,
                            transform: 'scale(1.15)',
                        } : {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                        }}
                        className={`
                            ${sc.button} border-2 flex flex-col items-center gap-1
                            transition-all duration-200 ease-out cursor-pointer
                            focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${disabled ? 'cursor-default opacity-75' : 'hover:shadow-md'}
                            ${!isActive && !isSelected ? 'opacity-50 grayscale' : 'opacity-100'}
                        `}
                    >
                        <span
                            className={sc.emoji}
                            style={{
                                filter: isActive ? 'none' : 'grayscale(0.3)',
                                transition: 'all 0.2s ease-out',
                            }}
                        >
                            {option.emoji}
                        </span>
                        {isActive && (
                            <span
                                className={`${sc.label} font-semibold whitespace-nowrap`}
                                style={{ color: option.color }}
                            >
                                {option.label}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
