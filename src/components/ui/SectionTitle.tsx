import { cn } from '@/lib/utils';

type SectionTitleProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** چیدمان وسط‌چین */
  center?: boolean;
  /** روی پس‌زمینهٔ تیره */
  light?: boolean;
  className?: string;
  /** سطح تیتر برای سلسله‌مراتب درست HTML */
  as?: 'h2' | 'h3';
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
  light = false,
  className,
  as: Tag = 'h2',
}: SectionTitleProps) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center', className)}>
      {eyebrow && <span className={cn('eyebrow mb-3.5', center && 'justify-center')}>{eyebrow}</span>}
      <Tag className={cn('display-title', light ? 'text-white' : 'text-ink')}>{title}</Tag>
      {description && (
        <p className={cn('mt-4 text-sm leading-[2.05] sm:text-base', light ? 'text-white/65' : 'text-ink-muted')}>
          {description}
        </p>
      )}
    </div>
  );
}
