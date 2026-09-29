'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

/** ورودی متنی استاندارد سیستم طراحی — حداقل ارتفاع ۴۴px برای اهداف لمسی */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full text-right">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-xs font-bold text-navy-900">
          {label}
          {props.required && <span className="text-[#7A611A]"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'min-h-11 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-gray-400',
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gold-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-[11px] text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-[11px] font-bold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full text-right">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-xs font-bold text-navy-900">
          {label}
          {props.required && <span className="text-[#7A611A]"> *</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={4}
        className={cn(
          'w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-gray-400',
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gold-500',
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-[11px] text-gray-500">{hint}</p>}
      {error && <p className="mt-1.5 text-[11px] font-bold text-red-500">{error}</p>}
    </div>
  );
});
