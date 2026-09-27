import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

export function PageHero({ eyebrow, title, description, current }: { eyebrow: string; title: React.ReactNode; description: string; current: string }) {
  return <section className="noise persian-pattern relative overflow-hidden pb-20 pt-40 text-white lg:pb-24 lg:pt-48">
    <div className="absolute -left-16 top-20 size-72 rounded-full bg-gold-500/10 blur-[90px]"/><div className="absolute right-1/3 top-0 h-px w-1/3 gold-line"/>
    <div className="container-shell relative"><div className="mb-7 flex items-center gap-2 text-xs text-white/45"><Link href="/" aria-label="خانه"><Home size={14}/></Link><ChevronLeft size={12}/><span>{current}</span></div><span className="eyebrow mb-4">{eyebrow}</span><h1 className="max-w-3xl text-4xl font-black leading-[1.35] tracking-[-.04em] sm:text-5xl lg:text-6xl">{title}</h1><p className="mt-6 max-w-2xl leading-[2] text-white/60">{description}</p></div>
  </section>;
}
