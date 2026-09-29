import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LOGO_PATHS, LOGO_VIEWBOX } from '@/lib/brand';

/** فقط نشانه، بدون لینک — برای جاهایی که نشان جدا لازم است. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={cn('size-6', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

type LogoProps = {
  /** روی پس‌زمینه تیره؟ */
  light?: boolean;
  /** فقط نشانه، بدون لوگوتایپ */
  compact?: boolean;
  className?: string;
};

/** لوگوی کامل: نشانه + لوگوتایپ فارسی + خط توضیح لاتین. */
export function Logo({ light = false, compact = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="خانه وکلا — صفحه نخست"
      className={cn('group flex shrink-0 items-center gap-2.5', className)}
    >
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-gradient-to-br from-gold-400 to-gold-600 text-navy-900 shadow-gold">
        <LogoMark className="size-[26px]" />
        {/* برق ملایم روی نشانه هنگام هاور */}
        <span
          aria-hidden
          className="absolute inset-y-0 -right-8 w-5 rotate-12 bg-white/50 blur-sm group-hover:animate-shimmer"
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <strong className={cn('text-lg font-black tracking-[-.035em] sm:text-xl', light ? 'text-white' : 'text-ink')}>
            خانه وکلا
          </strong>
          <small
            className={cn(
              'mt-1.5 text-[8.5px] font-medium tracking-[.13em]',
              light ? 'text-white/55' : 'text-ink-faint',
            )}
          >
            باشگاه تخصصی و کافهٔ وکلا
          </small>
        </span>
      )}
    </Link>
  );
}
