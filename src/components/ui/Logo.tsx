import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" aria-label="خانه وکلا - صفحه نخست" className="group flex items-center gap-3">
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[14px] border border-gold-500/50 bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950 shadow-gold">
        {/* فنجان قهوه + ترازوی عدالت */}
        <svg viewBox="0 0 32 32" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 13h16v5a8 8 0 0 1-8 8h0a8 8 0 0 1-8-8v-5Z" />
          <path d="M22 15h2.5a3.5 3.5 0 0 1 0 7H22" />
          <path d="M14 3v7M10.5 6.5h7" />
          <path d="M5 29h22" />
        </svg>
        <span className="absolute inset-y-0 -right-8 w-5 rotate-12 bg-white/60 blur-sm group-hover:animate-shimmer" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <strong className={cn('text-xl font-black tracking-[-.04em]', light ? 'text-white' : 'text-navy-900')}>خانه وکلا</strong>
          <small className={cn('mt-1.5 text-[9px] font-medium tracking-[.14em]', light ? 'text-white/50' : 'text-gray-500')}>
            باشگاه تخصصی و کافه وکلا
          </small>
        </span>
      )}
    </Link>
  );
}
