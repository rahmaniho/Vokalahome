'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, BriefcaseBusiness, ChevronDown, LockKeyhole, Scale, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const words = ['تصمیم‌های', 'حقوقی', 'مهم،', 'با', 'پشتوانه‌ای', 'مطمئن'];

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY,[0,800],[0,110]);
  return <section className="noise relative flex min-h-[820px] items-center overflow-hidden bg-navy-950 pb-20 pt-36 text-white lg:min-h-screen lg:pt-44">
    <motion.div className="absolute inset-0" style={{y}}><Image src="/images/hero/legal-office.jpg" alt="دفتر حقوقی با ترازوی عدالت" fill priority sizes="100vw" className="object-cover object-center opacity-55"/><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,13,30,.25),rgba(7,13,30,.78)_55%,rgba(7,13,30,.98))]"/><div className="hero-grid absolute inset-0"/></motion.div>
    <div className="absolute right-[8%] top-[18%] size-72 animate-float-slow rounded-full bg-gold-500/10 blur-[90px]"/><div className="absolute bottom-[10%] left-[5%] size-56 animate-float rounded-full bg-gold-500/10 blur-[70px]"/>
    <div className="container-shell relative z-10">
      <div className="max-w-3xl">
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.2}} className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/10 px-4 py-2 text-xs font-bold text-gold-300 backdrop-blur"><span className="relative flex size-2"><i className="absolute inline-flex size-full animate-ping rounded-full bg-gold-400 opacity-60"/><i className="relative inline-flex size-2 rounded-full bg-gold-400"/></span><Sparkles size={13}/> مؤسسه حقوقی و داوری در قزوین</motion.div>
        <h1 className="max-w-[800px] text-4xl font-black leading-[1.55] tracking-[-.055em] sm:text-5xl lg:text-[4.4rem] lg:leading-[1.35]">{words.map((word,index)=><motion.span key={word} className={`ml-[.25em] inline-block ${index===1||index===4?'gold-text':''}`} initial={{opacity:0,y:35,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0)'}} transition={{duration:.65,delay:.35+index*.09,ease:[.22,1,.36,1]}}>{word}</motion.span>)}</h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1,duration:.7}} className="mt-7 max-w-2xl text-base leading-[2.1] text-white/65 sm:text-lg">در «خانه وکیل»، پیچیدگی قانون را به یک مسیر روشن تبدیل می‌کنیم؛ با شنیدن دقیق، تحلیل مسئولانه و دفاعی که بر مستندات استوار است.</motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.15,duration:.7}} className="mt-9 flex flex-col gap-3 sm:flex-row"><Button href="/consultation/" className="sm:min-w-44">رزرو مشاوره</Button><Button href="/services/" variant="light" arrow className="sm:min-w-44">مشاهده خدمات</Button></motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.35}} className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/10 pt-6 text-xs text-white/60">{[[Scale,'وکیل پایه یک'],[Award,'۱۴ سال تجربه'],[LockKeyhole,'محرمانگی کامل']].map(([Icon,label])=>{const I=Icon as typeof Scale;return <span key={label as string} className="flex items-center gap-2"><I size={17} className="text-gold-400"/>{label as string}</span>})}</motion.div>
      </div>
      <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:1.2}} className="dark-glass absolute bottom-2 left-5 hidden animate-float rounded-2xl p-4 lg:flex lg:items-center lg:gap-4"><span className="grid size-11 place-items-center rounded-xl bg-gold-500 text-navy-950"><BriefcaseBusiness size={21}/></span><span><b className="block text-lg text-white">+۱۲۰۰</b><small className="text-[10px] text-white/50">پرونده و مشاوره حقوقی</small></span></motion.div>
    </div>
    <a href="#stats" aria-label="اسکرول به بخش بعد" className="absolute bottom-6 right-1/2 hidden translate-x-1/2 flex-col items-center gap-2 text-[9px] tracking-[.2em] text-white/35 lg:flex"><span className="h-10 w-6 rounded-full border border-white/20 p-1"><i className="mx-auto block size-1.5 animate-bounce rounded-full bg-gold-500"/></span><ChevronDown size={13}/></a>
    <span className="vertical-label absolute left-4 top-1/2 hidden -translate-y-1/2 text-[9px] tracking-[.3em] text-white/25 xl:block">KHANE VAKIL · LEGAL INSTITUTE</span>
  </section>;
}
