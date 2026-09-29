import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const config = {
  info: { icon: Info, classes: 'border-sky-200 bg-sky-50 text-sky-900' },
  success: { icon: CheckCircle2, classes: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  warning: { icon: AlertTriangle, classes: 'border-amber-200 bg-amber-50 text-amber-900' },
  danger: { icon: XCircle, classes: 'border-red-200 bg-red-50 text-red-900' },
};

type AlertProps = {
  variant?: keyof typeof config;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/** پیام هشدار/وضعیت — برای فرم‌ها، توضیحات حقوقی و پیام‌های تأیید */
export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const { icon: Icon, classes } = config[variant];
  return (
    <div role="alert" className={cn('flex gap-3 rounded-2xl border p-4 text-xs leading-7', classes, className)}>
      <Icon className="mt-0.5 shrink-0" size={18} />
      <div>
        {title && <strong className="mb-1 block text-sm">{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}
