'use client';

import { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

function Wrapper({
  label,
  error,
  hint,
  required,
  id,
  className,
  children,
}: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span className="text-gold-600 dark:text-gold-400" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <span id={`${id}-error`} className="form-error" role="alert">
          <AlertCircle size={13} aria-hidden />
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className="form-hint">
            {hint}
          </span>
        )
      )}
    </div>
  );
}

type InputProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'>;

/** ورودی متنی با برچسب، راهنما و پیام خطای دسترس‌پذیر. */
export function Input({ label, error, hint, required, className, ...rest }: InputProps) {
  const id = useId();
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} id={id} className={className}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn('form-control', error && 'form-control-error')}
        {...rest}
      />
    </Wrapper>
  );
}

type TextareaProps = BaseProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id'>;

export function Textarea({ label, error, hint, required, className, rows = 4, ...rest }: TextareaProps) {
  const id = useId();
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} id={id} className={className}>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn('form-control resize-none', error && 'form-control-error')}
        {...rest}
      />
    </Wrapper>
  );
}

type SelectProps = BaseProps & {
  options: readonly { value: string; label: string }[];
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'>;

export function Select({ label, error, hint, required, className, options, ...rest }: SelectProps) {
  const id = useId();
  return (
    <Wrapper label={label} error={error} hint={hint} required={required} id={id} className={className}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn('form-control', error && 'form-control-error')}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

/** چک‌باکس با هدف لمسی ۴۴px. */
export function Checkbox({
  label,
  error,
  className,
  ...rest
}: { label: React.ReactNode; error?: string; className?: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className'
>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1.5 text-sm leading-[1.9] text-ink-muted">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          className="mt-1 size-[18px] shrink-0 cursor-pointer accent-gold-500"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <span className="form-error" role="alert">
          <AlertCircle size={13} aria-hidden />
          {error}
        </span>
      )}
    </div>
  );
}
