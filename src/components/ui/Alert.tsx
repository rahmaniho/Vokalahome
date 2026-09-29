import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TONES = {
  info: {
    wrap: 'border-navy-500/25 bg-navy-500/[.07] text-navy-800 dark:text-navy-100',
    icon: 'text-navy-600 dark:text-navy-500',
    Icon: Info,
  },
  success: {
    wrap: 'border-emerald-500/30 bg-emerald-500/[.08] text-emerald-900 dark:text-emerald-100',
    icon: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-amber-500/35 bg-amber-500/[.09] text-amber-900 dark:text-amber-100',
    icon: 'text-amber-600',
    Icon: AlertTriangle,
  },
  danger: {
    wrap: 'border-red-500/30 bg-red-500/[.08] text-red-900 dark:text-red-100',
    icon: 'text-red-600',
    Icon: XCircle,
  },
} as const;

type AlertProps = {
  tone?: keyof typeof TONES;
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

/** پیام وضعیت درون‌صفحه‌ای؛ برای خطای فرم، نکته و هشدار حقوقی. */
export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const { wrap, icon, Icon } = TONES[tone];
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-2xl border p-4', wrap, className)}
    >
      <Icon size={19} className={cn('mt-0.5 shrink-0', icon)} aria-hidden />
      <div className="min-w-0 text-sm leading-[1.95]">
        {title && <strong className="mb-1 block font-black">{title}</strong>}
        {children}
      </div>
    </div>
  );
}
