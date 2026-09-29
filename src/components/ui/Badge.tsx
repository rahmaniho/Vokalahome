import { cn } from '@/lib/utils';

export const BADGE_TONES = {
  gold: 'bg-gold-500/15 text-gold-700 dark:text-gold-300 ring-gold-500/30',
  navy: 'bg-navy-900/10 text-navy-900 dark:bg-white/10 dark:text-white ring-navy-900/15 dark:ring-white/20',
  success: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 ring-emerald-500/25',
  warning: 'bg-amber-500/14 text-amber-700 dark:text-amber-300 ring-amber-500/25',
  danger: 'bg-red-500/12 text-red-700 dark:text-red-300 ring-red-500/25',
  neutral: 'bg-surface-3 text-ink-muted ring-line',
  coffee: 'bg-coffee-500/12 text-coffee-700 dark:text-coffee-300 ring-coffee-500/25',
} as const;

type BadgeProps = {
  children: React.ReactNode;
  tone?: keyof typeof BADGE_TONES;
  /** نقطهٔ رنگی کوچک ابتدای نشان */
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

/** نشان کوچک برای برچسب دسته‌بندی، وضعیت و قیمت. */
export function Badge({ children, tone = 'neutral', dot = false, icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold leading-5 ring-1 ring-inset',
        BADGE_TONES[tone],
        className,
      )}
    >
      {dot && <i aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />}
      {icon}
      {children}
    </span>
  );
}
