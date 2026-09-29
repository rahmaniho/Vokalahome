'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUp, BadgeCheck, DoorOpen, MessageCircle, Phone, Plus } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { cn, whatsappLink } from '@/lib/utils';

/**
 * دکمه‌های شناور تماس سریع.
 *
 * طراحی: دکمهٔ واتساپ همیشه دیده می‌شود (مهم‌ترین کانال ارتباطی در ایران)،
 * بقیهٔ میان‌برها پشت یک دکمهٔ «+» جمع شده‌اند تا محتوای موبایل را نپوشانند.
 * همهٔ اهداف لمسی ۴۴px یا بزرگ‌تر هستند.
 */
const ACTIONS = [
  {
    label: 'تماس تلفنی',
    href: SITE.phoneHref,
    Icon: Phone,
    className: 'bg-gold-500 text-navy-900',
  },
  {
    label: 'رزرو اتاق مشاوره',
    href: '/rooms/#booking',
    Icon: DoorOpen,
    className: 'bg-navy-800 text-white',
  },
  {
    label: 'عضویت در خانه',
    href: '/membership/#plans',
    Icon: BadgeCheck,
    className: 'bg-coffee-700 text-white',
  },
] as const;

export function QuickContact() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waHref = whatsappLink(
    SITE.whatsappNumber,
    'سلام؛ از سایت خانه وکلا پیام می‌دهم. می‌خواستم دربارهٔ ',
  );

  return (
    <div className="no-print fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2.5 sm:bottom-6 sm:left-6">
      {/* بازگشت به بالا */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="بازگشت به بالای صفحه"
          className="tap-target animate-fade-in rounded-xl border border-line bg-surface/90 text-ink-muted shadow-soft backdrop-blur transition hover:text-gold-600"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* میان‌برها */}
      {open &&
        ACTIONS.map(({ label, href, Icon, className }, index) => {
          const inner = (
            <>
              <span className="pointer-events-none whitespace-nowrap rounded-lg bg-navy-950 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                {label}
              </span>
              <span className={cn('tap-target rounded-xl shadow-soft transition hover:scale-105', className)}>
                <Icon size={19} aria-hidden />
              </span>
            </>
          );
          const shared = 'group flex animate-fade-up items-center gap-2';
          const style = { animationDelay: `${index * 45}ms` };

          return href.startsWith('/') ? (
            <Link key={label} href={href} aria-label={label} className={shared} style={style}>
              {inner}
            </Link>
          ) : (
            <a key={label} href={href} aria-label={label} className={shared} style={style}>
              {inner}
            </a>
          );
        })}

      <div className="flex items-center gap-2.5">
        {/* واتساپ — همیشه پیدا */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="گفت‌وگو در واتساپ"
          className="group flex items-center gap-2"
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600">
            <MessageCircle size={24} aria-hidden />
          </span>
        </a>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'بستن دسترسی سریع' : 'دسترسی سریع'}
          className="tap-target rounded-xl border border-line bg-surface/90 text-ink shadow-soft backdrop-blur transition hover:border-gold-500 hover:text-gold-600"
        >
          <Plus size={20} className={cn('transition duration-300', open && 'rotate-45')} aria-hidden />
        </button>
      </div>
    </div>
  );
}
