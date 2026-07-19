'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: ReactNode;
    error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const checkboxId = id || props.name;

        return (
            <div className="flex items-start gap-3">
                <input
                    ref={ref}
                    type="checkbox"
                    id={checkboxId}
                    className={cn(
                        'mt-0.5 h-5 w-5 rounded border-slate-300 text-teal-600',
                        'focus:ring-2 focus:ring-teal-500 focus:ring-offset-0',
                        'cursor-pointer transition-colors',
                        error && 'border-red-500',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    {...props}
                />
                <div>
                    <label htmlFor={checkboxId} className="text-sm text-slate-700 cursor-pointer">
                        {label}
                    </label>
                    {error && (
                        <p className="mt-1 text-sm text-red-500" role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
