'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/** مدال ساده و در دسترس (a11y): بستن با Esc، قفل اسکرول پس‌زمینه، فوکوس روی دکمهٔ بستن */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="بستن" onClick={onClose} className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" />
      <div className={cn('relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl', className)}>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="بستن پنجره"
          className="absolute left-4 top-4 grid size-9 place-items-center rounded-full bg-gray-100 text-navy-900 transition hover:bg-gold-500 hover:text-navy-950"
        >
          <X size={16} />
        </button>
        {title && <h3 className="mb-4 pl-10 text-lg font-black text-navy-900">{title}</h3>}
        {children}
      </div>
    </div>,
    document.body
  );
}
