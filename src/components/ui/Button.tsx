'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

        const variants = {
            primary: 'bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white shadow-lg hover:shadow-teal-900/20 focus:ring-teal-500',
            secondary: 'bg-slate-900 hover:bg-black text-white shadow-lg focus:ring-slate-500',
            outline: 'border-2 border-teal-600 text-teal-700 hover:bg-teal-50 focus:ring-teal-500',
            ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
            danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500',
            glow: 'relative bg-gradient-to-r from-teal-400 to-teal-600 text-white font-black shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] hover:scale-[1.02] border border-teal-300/30 transition-all',
            glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all',
        };

        const sizes = {
            sm: 'text-xs px-4 py-2 rounded-xl',
            md: 'text-sm px-6 py-3 rounded-2xl',
            lg: 'text-base px-8 py-4 rounded-2xl',
            xl: 'text-lg px-10 py-5 rounded-[1.5rem]',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </span>
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };

