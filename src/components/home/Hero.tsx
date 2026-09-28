'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Coffee, DoorOpen, Scale, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SITE, ROOM_RATE } from '@/lib/constants';

const words = ['خانه‌ای', 'برای', 'وکلا؛', 'قهوه،', 'گفت‌وگو', 'و', 'پرونده'];

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 110]);
  return <section className="noise relative flex min-h-[860px] items-center overflow-hidden bg-coffee-950 pb-24 pt-36 text-white lg:min-h-screen lg:pt-44">
    <motion.div className="absolute inset-0" style={{ y }}>
      <Image src="/images/hero/lawyers-cafe.jpg" alt="فضای کافه و باشگاه وکلا" fill priority sizes="100vw" className="object-cover object-center opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,16,10,.25),rgba(11,19,43,.82)_55%,rgba(7,13,30,.97))]" />
      <div className="hero-grid absolute inset-0" />
    </motion.div>
    <div className="absolute right-[8%] top-[18%] size-72 animate-float-slow rounded-full bg-gold-500/10 blur-[90px]" />
    <div className="absolute bottom-[10%] left-[5%] size-56 animate-float rounded-full bg-coffee-300/10 blur-[70px]" />

    <div className="container-shell relative z-10">
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/10 px-4 py-2 text-xs font-bold text-gold-300 backdrop-blur">
          <span className="relative flex size-2"><i className="absolute inline-flex size-full animate-ping rounded-full bg-gold-400 opacity-60" /><i className="relative inline-flex size-2 rounded-full bg-gold-400" /></span>
          <Sparkles size={13} /> باشگاه تخصصی و کافه وکلا · {SITE.shortAddress}
        </motion.div>

        <h1 className="max-w-[860px] text-4xl font-black leading-[1.5] tracking-[-.05em] sm:text-5xl lg:text-[4.1rem] lg:leading-[1.33]">
          {words.map((word, index) => (
            <motion.span key={word + index} className={`ml-[.25em] inline-block ${index === 3 || index === 6 ? 'gold-text' : ''}`} initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} transition={{ duration: .65, delay: .35 + index * .085, ease: [.22, 1, .36, 1] }}>{word}</motion.span>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: .7 }} className="mt-7 max-w-2xl text-base leading-[2.1] text-white/70 sm:text-lg">
          وکلا اینجا می‌نشینند، قهوه می‌نوشند و دانش حقوقی مبادله می‌کنند. اگر دفتر فیزیکی ندارید، اتاق‌های مشاوره خانه وکلا دفتر شماست:
          <b className="text-gold-300"> برای اعضا رایگان</b> و برای وکلای مهمان ساعتی <b className="text-gold-300">{ROOM_RATE.guestPrice}</b>.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: .7 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/membership/#plans" className="sm:min-w-48">عضویت در خانه وکلا</Button>
          <Button href="/rooms/" variant="light" arrow className="sm:min-w-48">رزرو اتاق مشاوره</Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }} className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/10 pt-6 text-xs text-white/60">
          {[[Coffee, 'کافه تخصصی، ۱۴ ساعت باز'], [DoorOpen, '۶ اتاق مشاوره مجهز'], [Users, '۱۸۰+ وکیل عضو'], [Scale, 'نشست علمی هفتگی']].map(([Icon, label]) => {
            const I = Icon as typeof Coffee;
            return <span key={label as string} className="flex items-center gap-2"><I size={17} className="text-gold-400" />{label as string}</span>;
          })}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="dark-glass absolute bottom-2 left-5 hidden w-64 animate-float rounded-2xl p-5 lg:block">
        <span className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-gold-500 text-navy-950"><DoorOpen size={21} /></span>
          <span><b className="block text-lg text-white">اتاق مشاوره</b><small className="text-[10px] text-white/50">امروز ۴ بازه خالی دارد</small></span>
        </span>
        <span className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px]">
          <span className="text-white/60">اعضا</span><b className="text-gold-300">رایگان</b>
        </span>
        <span className="mt-2 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px]">
          <span className="text-white/60">مهمان</span><b className="text-white">{ROOM_RATE.guestPrice}/ساعت</b>
        </span>
      </motion.div>
    </div>

    <a href="#stats" aria-label="اسکرول به بخش بعد" className="absolute bottom-6 right-1/2 hidden translate-x-1/2 flex-col items-center gap-2 text-[9px] tracking-[.2em] text-white/35 lg:flex">
      <span className="h-10 w-6 rounded-full border border-white/20 p-1"><i className="mx-auto block size-1.5 animate-bounce rounded-full bg-gold-500" /></span>
      <ChevronDown size={13} />
    </a>
    <span className="vertical-label absolute left-4 top-1/2 hidden -translate-y-1/2 text-[9px] tracking-[.3em] text-white/25 xl:block">{SITE.latin}</span>
  </section>;
}
