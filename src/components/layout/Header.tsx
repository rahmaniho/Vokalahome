'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Clock3, Mail, Menu, Phone, X } from 'lucide-react';
import { NAV_ITEMS, SITE } from '@/lib/constants';
import { services } from '@/lib/data/services';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  const home = pathname === '/';
  const [scrolled, setScrolled] = useState(!home);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(!home || window.scrollY > 50);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [home]);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  const light = home && !scrolled;
  return <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 shadow-[0_8px_32px_rgba(11,19,43,.07)] backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className={`hidden overflow-hidden border-b transition-all duration-500 lg:block ${scrolled ? 'max-h-0 border-transparent opacity-0' : 'max-h-10 border-white/10 opacity-100'}`}>
        <div className="container-shell flex h-10 items-center justify-between text-[11px] text-white/65">
          <div className="flex items-center gap-5"><a href={SITE.phoneHref} className="flex items-center gap-1.5 hover:text-gold-300"><Phone size={13}/>{SITE.phone}</a><a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:text-gold-300"><Mail size={13}/>{SITE.email}</a></div>
          <span className="flex items-center gap-1.5"><Clock3 size={13}/>{SITE.workHours}</span>
        </div>
      </div>
      <div className="container-shell flex h-[76px] items-center justify-between lg:h-[84px]">
        <Logo light={light} />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
          {NAV_ITEMS.map((item) => item.label === 'خدمات حقوقی' ? (
            <div className="group relative" key={item.href}>
              <Link href={item.href} className={`flex items-center gap-1 rounded-lg px-3 py-3 text-sm font-bold transition ${light ? 'text-white/85 hover:text-gold-300' : 'text-navy-900 hover:text-gold-500'}`}>{item.label}<ChevronDown size={14} className="transition group-hover:rotate-180"/></Link>
              <div className="invisible absolute right-0 top-full w-[570px] translate-y-3 rounded-3xl border border-gray-100 bg-white p-3 opacity-0 shadow-2xl shadow-navy-950/10 transition duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-1">{services.map((service, index) => <Link key={service.slug} href={`/services/${service.slug}/`} className="group/item flex gap-3 rounded-2xl p-3.5 hover:bg-gold-500/10"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-navy-900 text-xs font-black text-gold-400">{String(index + 1).padStart(2, '0')}</span><span><b className="block text-sm text-navy-900 group-hover/item:text-gold-500">{service.title}</b><small className="mt-1 line-clamp-1 block text-[11px] text-gray-500">{service.description}</small></span></Link>)}</div>
              </div>
            </div>
          ) : <Link key={item.href} href={item.href} className={`relative rounded-lg px-3 py-3 text-sm font-bold transition after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-gold-500 after:transition-transform hover:after:scale-x-100 ${light ? 'text-white/85 hover:text-gold-300' : 'text-navy-900 hover:text-gold-500'} ${pathname === item.href ? 'after:scale-x-100' : ''}`}>{item.label}</Link>)}
        </nav>
        <div className="hidden lg:block"><Button href="/consultation/" className="min-h-11 px-5">درخواست مشاوره</Button></div>
        <button onClick={() => setOpen(true)} aria-label="بازکردن منو" className={`grid size-11 place-items-center rounded-xl border lg:hidden ${light ? 'border-white/20 text-white' : 'border-gray-200 text-navy-900'}`}><Menu /></button>
      </div>
    </header>
    <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[90] overflow-y-auto bg-navy-950 p-5 text-white lg:hidden" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: .35 }}>
      <div className="flex items-center justify-between"><Logo light/><button className="grid size-11 place-items-center rounded-xl border border-white/15" onClick={() => setOpen(false)} aria-label="بستن منو"><X/></button></div>
      <nav className="mt-14" aria-label="منوی موبایل">{NAV_ITEMS.map((item, index) => <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 + index * .06 }}><Link href={item.href} className="flex items-center justify-between border-b border-white/10 py-5 text-xl font-bold"><span>{item.label}</span><span className="font-mono text-xs text-gold-500">۰{index + 1}</span></Link></motion.div>)}</nav>
      <Button href="/consultation/" className="mt-10 w-full">رزرو مشاوره حقوقی</Button>
      <div className="mt-8 text-center text-sm text-white/50"><p>{SITE.shortAddress}</p><a href={SITE.phoneHref} className="mt-2 block text-gold-400" dir="ltr">{SITE.phone}</a></div>
    </motion.div>}</AnimatePresence>
  </>;
}
