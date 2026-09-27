import Link from 'next/link';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link href="/" aria-label="خانه وکیل - صفحه نخست" className="group flex items-center gap-3">
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[14px] border border-gold-500/50 bg-gold-500 text-navy-950 shadow-gold">
        <Scale size={23} strokeWidth={1.8} />
        <span className="absolute inset-y-0 -right-8 w-5 rotate-12 bg-white/60 blur-sm group-hover:animate-shimmer" />
      </span>
      {!compact && <span className="flex flex-col leading-none">
        <strong className={cn('text-xl font-black tracking-[-.04em]', light ? 'text-white' : 'text-navy-900')}>خانه وکیل</strong>
        <small className={cn('mt-1.5 text-[9px] font-medium tracking-[.14em]', light ? 'text-white/50' : 'text-gray-500')}>مؤسسه حقوقی و داوری</small>
      </span>}
    </Link>
  );
}
