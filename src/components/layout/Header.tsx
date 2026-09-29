'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { NAV_ITEMS, SECONDARY_NAV, SITE } from '@/lib/constants';
import { services } from '@/lib/data/services';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MenuToggle } from '@/components/ui/MenuToggle';
import { OpenNow } from '@/components/interactive/OpenNow';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  // هدر روی صفحهٔ نخست شفاف شروع می‌شود و بعد از اسکرول جامد می‌شود.
  useEffect(() => {
    const update = () => setScrolled(!isHome || window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isHome]);

  // با تغییر مسیر، منوی موبایل بسته شود.
  useEffect(() => setMenuOpen(false), [pathname]);

  // قفل اسکرول پشت منوی تمام‌صفحه.
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onEscape = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onEscape);
    };
  }, [menuOpen]);

  /** روی صفحهٔ نخست و بالای صفحه، متن هدر سفید است. */
  const onDark = isHome && !scrolled;

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-[background-color,box-shadow,backdrop-filter] duration-300',
          menuOpen
            ? 'bg-transparent'
            : scrolled
              ? 'bg-surface/92 shadow-[0_6px_28px_rgb(11_31_58_/_.08)] backdrop-blur-xl'
              : 'bg-transparent',
        )}
      >
        {/* ——— نوار بالایی: اطلاعات تماس (فقط دسکتاپ، فقط بالای صفحهٔ نخست) ——— */}
        <div
          className={cn(
            'hidden overflow-hidden border-b border-white/10 transition-[max-height,opacity] duration-300 lg:block',
            scrolled || menuOpen ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100',
          )}
        >
          <div className="container-shell flex h-10 items-center justify-between text-[11px] text-white/70">
            <div className="flex items-center gap-5">
              <a href={SITE.phoneHref} className="flex items-center gap-1.5 transition hover:text-gold-300">
                <Phone size={13} aria-hidden />
                <span dir="ltr">{SITE.phone}</span>
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 transition hover:text-gold-300">
                <Mail size={13} aria-hidden />
                {SITE.email}
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} aria-hidden />
                {SITE.shortAddress}
              </span>
            </div>
            <OpenNow light />
          </div>
        </div>

        {/* ——— نوار اصلی ——— */}
        <div className="container-shell flex h-[76px] items-center justify-between gap-3">
          <Logo light={onDark || menuOpen} />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="منوی اصلی">
            {NAV_ITEMS.map((item) =>
              'hasMega' in item && item.hasMega ? (
                <div className="group relative" key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 rounded-lg px-3 py-3 text-sm font-bold transition',
                      onDark ? 'text-white/85 hover:text-gold-300' : 'text-ink hover:text-gold-600',
                      isActive(item.href) && (onDark ? 'text-gold-300' : 'text-gold-600'),
                    )}
                  >
                    {item.label}
                    <ChevronDown size={14} aria-hidden className="transition group-hover:rotate-180" />
                  </Link>
                  {/* مگا منوی خدمات */}
                  <div className="invisible absolute right-0 top-full w-[560px] translate-y-3 rounded-3xl border border-line bg-surface p-3 opacity-0 shadow-lift transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="grid grid-cols-2 gap-1">
                      {services.map((service, index) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}/`}
                          className="group/item flex gap-3 rounded-2xl p-3 transition hover:bg-gold-500/10"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-navy-900 text-[11px] font-black text-gold-400 dark:bg-navy-800">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0">
                            <b className="block text-sm text-ink transition group-hover/item:text-gold-600">
                              {service.title}
                            </b>
                            <small className="mt-0.5 line-clamp-1 block text-[11px] text-ink-faint">
                              {service.description}
                            </small>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'relative rounded-lg px-3 py-3 text-sm font-bold transition',
                    'after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-right after:scale-x-0 after:bg-gold-500 after:transition-transform hover:after:scale-x-100',
                    onDark ? 'text-white/85 hover:text-gold-300' : 'text-ink hover:text-gold-600',
                    isActive(item.href) && 'after:scale-x-100',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle light={onDark || menuOpen} />
            <div className="hidden xl:block">
              <Button href="/membership/" size="sm" className="px-5">
                عضویت در خانه
              </Button>
            </div>
            <MenuToggle
              open={menuOpen}
              onToggle={() => setMenuOpen((value) => !value)}
              light={onDark || menuOpen}
              controls="mobile-menu"
            />
          </div>
        </div>
      </header>

      {/* ═══════════════ منوی موبایل ═══════════════ */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 animate-slide-in-right overflow-y-auto bg-navy-900 text-white xl:hidden"
        >
          {/* ارتفاع نوار هدر خالی می‌ماند تا دکمهٔ همبرگر (که در هدر ثابت است) روی منو دیده شود. */}
          <div className="h-[76px]" aria-hidden />

          <div className="container-shell pb-10">
            <nav aria-label="منوی موبایل" className="mt-4">
              {NAV_ITEMS.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  style={{ animationDelay: `${40 + index * 35}ms` }}
                  className={cn(
                    'flex min-h-[56px] animate-fade-up items-center justify-between border-b border-white/10 py-3 text-lg font-bold transition',
                    isActive(item.href) ? 'text-gold-400' : 'text-white hover:text-gold-300',
                  )}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-gold-500/70">۰{index + 1}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex flex-wrap gap-2">
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-xl border border-white/12 px-3.5 text-xs font-bold text-white/70 transition hover:border-gold-500 hover:text-gold-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-7 grid gap-3">
              <Button href="/membership/" className="w-full">
                عضویت در خانه وکلا
              </Button>
              <Button href="/consultation/#booking" variant="light" className="w-full">
                رزرو اتاق مشاوره
              </Button>
            </div>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-white/60">
              <OpenNow light />
              <a href={SITE.phoneHref} className="flex min-h-11 items-center gap-2.5 hover:text-gold-300">
                <Phone size={16} className="text-gold-500" aria-hidden />
                <span dir="ltr">{SITE.phone}</span>
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin size={16} className="text-gold-500" aria-hidden />
                {SITE.address}
              </span>
              <span className="flex items-center gap-2.5">
                <Clock3 size={16} className="text-gold-500" aria-hidden />
                {SITE.workHours}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
