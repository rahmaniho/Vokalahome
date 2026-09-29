import Link from 'next/link';
import { ArrowLeft, CalendarCheck, Coffee, MapPin, Scale, Sparkles } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import { OpenNow } from '@/components/interactive/OpenNow';
import { SITE, QUICK_FACTS } from '@/lib/constants';
import { CountUp } from '@/components/animation/CountUp';
import { toFa } from '@/lib/utils';

/**
 * بخش قهرمان صفحهٔ نخست.
 *
 * این کامپوننت عمداً **سرور-کامپوننت** است: هیچ جاوااسکریپتی برای رندر اولیه
 * لازم ندارد. نسخهٔ قبلی با framer-motion حدود ۳۴ کیلوبایت به باندل اضافه
 * می‌کرد و چون بالای صفحه بود، مستقیم روی LCP اثر منفی داشت. حالا:
 *   • تصویر با `priority` و AVIF/WebP بارگذاری می‌شود (LCP سریع‌تر)
 *   • حرکت‌ها با CSS (`animate-fade-up`) انجام می‌شود
 *   • تنها بخش تعاملی، نشانگر «باز/بسته» است که کلاینت-کامپوننت کوچکی است
 */
export function Hero() {
  return (
    <section className="noise persian-pattern relative overflow-hidden bg-navy-900 pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-40">
      {/* لایه‌های نور — فقط CSS */}
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-20 size-[26rem] rounded-full bg-gold-500/12 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 size-80 rounded-full bg-coffee-500/15 blur-[100px]" />

      <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        {/* ستون متن */}
        <div className="animate-fade-up">
          <span className="eyebrow mb-5">
            <Sparkles size={13} aria-hidden />
            باشگاه تخصصی وکلا · قزوین
          </span>

          <h1 className="text-[2rem] font-black leading-[1.35] tracking-[-.035em] sm:text-5xl lg:text-[3.4rem]">
            جایی برای نشستن،
            <br />
            <span className="text-gold-400">اندیشیدن</span> و وکالت کردن
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-[2.1] text-white/65 sm:text-base">
            خانه وکلا کافه‌ای تخصصی و باشگاهی حرفه‌ای است؛ جایی که وکیل، کارآموز و موکل در فضایی آرام و آبرومند
            می‌نشینند، گفت‌وگو می‌کنند و پرونده پیش می‌برند. اتاق‌های مشاوره برای اعضا رایگان است.
          </p>

          {/* نشانگر وضعیت */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <OpenNow />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[11px] text-white/60">
              <MapPin size={13} aria-hidden className="text-gold-400" />
              {SITE.shortAddress}
            </span>
          </div>

          {/* اقدام‌های اصلی */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/membership/"
              className="group inline-flex min-h-14 items-center gap-2 rounded-xl bg-gold-500 px-7 text-sm font-black text-navy-900 shadow-gold transition hover:bg-gold-400"
            >
              عضویت در خانه وکلا
              <ArrowLeft size={17} aria-hidden className="transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/consultation/"
              className="inline-flex min-h-14 items-center gap-2 rounded-xl border border-white/22 bg-white/8 px-7 text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-navy-900"
            >
              <CalendarCheck size={17} aria-hidden />
              رزرو اتاق مشاوره
            </Link>
          </div>

          {/* آمار کوتاه */}
          <dl className="mt-11 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-7 sm:grid-cols-4">
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <b className="block text-2xl font-black leading-none text-gold-400">
                    <CountUp value={fact.value} />
                    {fact.suffix && <span className="text-lg">{fact.suffix}</span>}
                  </b>
                  <span className="mt-1.5 block text-[11px] leading-5 text-white/45">{fact.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ستون تصویر */}
        <div className="relative animate-fade-in lg:animate-fade-up">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-lift">
            <Picture
              src="/images/hero/lawyers-cafe.jpg"
              alt="فضای داخلی کافه و باشگاه خانه وکلا با میزهای چوبی و قفسه‌های کتاب حقوقی"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
              className="aspect-[4/3]"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/55 to-transparent" />
          </div>

          {/* کارت شناور تعرفه */}
          <div className="absolute -bottom-6 right-4 max-w-[15rem] rounded-2xl border border-white/12 bg-navy-950/85 p-4 shadow-lift backdrop-blur sm:right-6">
            <div className="flex items-center gap-2 text-gold-400">
              <Scale size={16} aria-hidden />
              <b className="text-xs font-black">اتاق مشاوره</b>
            </div>
            <p className="mt-2 text-[11px] leading-[1.9] text-white/60">
              برای اعضا <b className="text-white">رایگان</b> · برای وکلای مهمان ساعتی{' '}
              <b className="text-white">{toFa('۵۰۰٬۰۰۰')} تومان</b>
            </p>
          </div>

          {/* کارت شناور کافه */}
          <div className="absolute -top-5 left-4 hidden items-center gap-2 rounded-2xl border border-white/12 bg-navy-950/85 px-4 py-3 shadow-lift backdrop-blur sm:flex">
            <Coffee size={16} aria-hidden className="text-coffee-300" />
            <span className="text-[11px] font-bold text-white/80">قهوهٔ تخصصی</span>
          </div>
        </div>
      </div>
    </section>
  );
}
