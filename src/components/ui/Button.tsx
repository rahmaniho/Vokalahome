import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * دکمهٔ پایهٔ سیستم طراحی.
 * همهٔ حالت‌ها حداقل ارتفاع ۴۴px دارند (هدف لمسی WCAG 2.5.5).
 */
export const BUTTON_VARIANTS = {
  gold: 'bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-gold',
  navy: 'bg-navy-900 text-white hover:bg-navy-800 shadow-soft dark:bg-white dark:text-navy-900 dark:hover:bg-mist-200',
  outline: 'border border-line bg-transparent text-ink hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400',
  light: 'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-navy-900',
  ghost: 'bg-transparent text-ink hover:bg-surface-3',
  danger: 'bg-red-600 text-white hover:bg-red-700',
} as const;

export const BUTTON_SIZES = {
  sm: 'min-h-11 px-4 text-xs',
  md: 'min-h-12 px-6 text-sm',
  lg: 'min-h-14 px-8 text-base',
} as const;

type Common = {
  children: React.ReactNode;
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  className?: string;
  /** پیکان «ادامه» در انتهای دکمه */
  arrow?: boolean;
};

type AsLink = Common & { href: string; onClick?: never; type?: never; disabled?: never };
type AsButton = Common & {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export function Button(props: AsLink | AsButton) {
  const { children, variant = 'gold', size = 'md', className, arrow = false } = props;

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-extrabold transition duration-300',
    'disabled:cursor-not-allowed disabled:opacity-45',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className,
  );

  const content = (
    <>
      {children}
      {arrow && <ArrowLeft size={17} strokeWidth={2} className="transition-transform group-hover:-translate-x-1" />}
    </>
  );

  if (props.href === undefined) {
    return (
      <button type={props.type ?? 'button'} onClick={props.onClick} disabled={props.disabled} className={classes}>
        {content}
      </button>
    );
  }

  const { href } = props;
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
