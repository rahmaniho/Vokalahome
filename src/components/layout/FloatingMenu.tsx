'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, HelpCircle, Menu, MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { SITE } from '@/lib/constants';

const items = [
  { label: 'واتساپ', href: SITE.whatsappHref, Icon: MessageCircle, color: 'bg-emerald-500' },
  { label: 'تماس فوری', href: SITE.phoneHref, Icon: Phone, color: 'bg-gold-500 text-navy-950' },
  { label: 'رزرو مشاوره', href: '/consultation/', Icon: CalendarDays, color: 'bg-navy-800' },
  { label: 'پرسش و پاسخ', href: '/faq/', Icon: HelpCircle, color: 'bg-navy-800' },
];

export function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return <div className="fixed bottom-5 left-4 z-40 flex flex-col items-start gap-2 sm:bottom-7 sm:left-7">
    <AnimatePresence>{open && <div className="flex flex-col gap-2">{items.map(({label,href,Icon,color}, index) => <motion.div key={label} initial={{ opacity:0, y:15, scale:.8 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:.8 }} transition={{ delay: index*.04 }} className="group flex items-center gap-2"><span className="pointer-events-none translate-x-2 rounded-lg bg-navy-950 px-2.5 py-1.5 text-[10px] text-white opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100">{label}</span>{href.startsWith('/') ? <Link href={href} aria-label={label} className={`grid size-11 place-items-center rounded-xl text-white shadow-lg ${color}`}><Icon size={18}/></Link> : <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={label} className={`grid size-11 place-items-center rounded-xl text-white shadow-lg ${color}`}><Icon size={18}/></a>}</motion.div>)}<motion.div initial={{opacity:0}} animate={{opacity:1}} className="group flex items-center gap-2"><span className="translate-x-2 rounded-lg bg-navy-950 px-2.5 py-1.5 text-[10px] text-white opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">بازگشت به بالا</span><button onClick={scrollTop} aria-label="بازگشت به بالا" className="grid size-11 place-items-center rounded-xl bg-navy-800 text-white shadow-lg"><ArrowUp size={18}/></button></motion.div></div>}</AnimatePresence>
    <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="دسترسی سریع" className="grid size-14 place-items-center rounded-2xl bg-gold-500 text-navy-950 shadow-gold transition hover:bg-gold-300"><Menu className={`transition duration-300 ${open ? 'rotate-[135deg]' : ''}`} /></button>
  </div>;
}
