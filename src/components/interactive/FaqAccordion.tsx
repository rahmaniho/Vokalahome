'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { FAQItem } from '@/types';

export function FaqAccordion({ items, withFilters = false }: { items: FAQItem[]; withFilters?: boolean }) {
  const categories = ['همه', ...Array.from(new Set(items.map(item => item.category)))];
  const [category, setCategory] = useState('همه');
  const [open, setOpen] = useState(0);
  const filtered = useMemo(() => category === 'همه' ? items : items.filter(item => item.category === category), [items, category]);
  return <div>
    {withFilters && <div className="mb-8 flex flex-wrap gap-2">{categories.map(cat => <button key={cat} onClick={() => { setCategory(cat); setOpen(0); }} className={`rounded-xl px-4 py-2 text-xs font-bold transition ${category === cat ? 'bg-navy-900 text-white' : 'border border-gray-200 bg-white text-gray-500 hover:border-gold-500'}`}>{cat}</button>)}</div>}
    <div className="space-y-3">{filtered.map((item, index) => { const active = open === index; return <div key={item.question} className={`overflow-hidden rounded-2xl border bg-white transition ${active ? 'border-gold-500 shadow-[0_12px_40px_rgba(11,19,43,.06)]' : 'border-gray-100'}`}><button className="flex w-full items-center justify-between gap-4 p-5 text-right sm:p-6" onClick={() => setOpen(active ? -1 : index)} aria-expanded={active}><span className="font-extrabold text-navy-900">{item.question}</span><span className={`grid size-8 shrink-0 place-items-center rounded-lg bg-gold-500/10 text-gold-500 transition ${active ? 'rotate-45' : ''}`}><Plus size={18}/></span></button><AnimatePresence initial={false}>{active && <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><div className="border-t border-gray-100 px-5 pb-6 pt-4 text-sm leading-[2] text-gray-500 sm:px-6">{item.answer}<div className="mt-4 text-[10px] font-bold text-gold-500">پاسخ از تیم حقوقی خانه وکلا · ۲ دقیقه مطالعه</div></div></motion.div>}</AnimatePresence></div>})}</div>
  </div>;
}
