'use client';

import { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** عرض بیشینه */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' } as const;

/**
 * پنجرهٔ مودال دسترس‌پذیر — بدون هیچ کتابخانه‌ای.
 * شامل: بستن با Escape، قفل اسکرول صفحه، حبس فوکوس و بازگرداندن فوکوس.
 */
export function Modal({ open, onClose, title, children, size = 'md', className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const focusables = useCallback(() => {
    if (!panelRef.current) return [] as HTMLElement[];
    return Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }, []);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    // فوکوس اولیه روی خود پنل تا صفحه‌خوان عنوان را بخواند.
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus();
    };
  }, [open, onClose, focusables]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="بستن"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default bg-navy-950/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative w-full animate-scale-in rounded-t-4xl border border-line bg-surface shadow-lift outline-none sm:rounded-3xl',
          SIZES[size],
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 className="text-base font-black text-ink sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره"
            className="tap-target rounded-xl text-ink-muted transition hover:bg-surface-3 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
