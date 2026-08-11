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
                        'w-full px-3 py-2 rounded-lg border transition-all duration-200 resize-y min-h-[80px] text-sm',
                        'bg-slate-50 hover:bg-white text-slate-900 placeholder-slate-400',
                        'focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-slate-300 hover:border-slate-400',
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
