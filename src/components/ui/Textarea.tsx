'use client';

import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        const textareaId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        'w-full px-3.5 py-2.5 rounded-xl border border-transparent transition-all duration-300 resize-y min-h-[60px] text-[13px] font-medium',
                        'bg-slate-100/70 hover:bg-slate-100 text-slate-900 placeholder-slate-400',
                        'focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : '',
                        'disabled:bg-slate-100 disabled:cursor-not-allowed',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-slate-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
