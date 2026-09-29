import { cn } from '@/lib/utils';

const styles = {
  gold: 'bg-gold-500/10 text-gold-500 border-gold-500/30',
  navy: 'bg-navy-900/5 text-navy-900 border-navy-900/15',
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
  warning: 'bg-amber-500/10 text-amber-700 border-amber-500/25',
  danger: 'bg-red-500/10 text-red-600 border-red-500/25',
  light: 'bg-white/10 text-white border-white/25',
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
};

/** نشان کوچک برای وضعیت، دسته‌بندی یا برچسب (مثل «محبوب‌ترین»، «رایگان برای اعضا») */
export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
