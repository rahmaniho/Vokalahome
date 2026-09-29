import Link from 'next/link';
import { cn } from '@/lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  /** اگر داده شود کل کارت لینک می‌شود (و هدف لمسی بزرگ‌تری می‌گیرد). */
  href?: string;
  /** جلوهٔ بالا آمدن هنگام هاور */
  interactive?: boolean;
  as?: 'div' | 'article' | 'li' | 'section';
};

/** ظرف پایهٔ محتوا در سیستم طراحی. */
export function Card({ children, className, href, interactive = false, as = 'div' }: CardProps) {
  const classes = cn(
    'relative overflow-hidden rounded-3xl border border-line bg-surface',
    interactive && 'transition duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, 'block focus-visible:outline-offset-2')}>
        {children}
      </Link>
    );
  }

  const Tag = as;
  return <Tag className={classes}>{children}</Tag>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5 sm:p-6', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-black leading-7 text-ink sm:text-lg', className)}>{children}</h3>;
}

export function CardText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('mt-2.5 text-sm leading-[1.95] text-ink-muted', className)}>{children}</p>;
}
