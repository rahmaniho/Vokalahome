import type { Metadata } from 'next';
import { CalendarDays, GraduationCap, Mic2, Users } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animation/Reveal';
import { EventCard } from '@/components/cards/EventCard';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { events } from '@/lib/data/events';
import { faqs } from '@/lib/data/faqs';

export const metadata: Metadata = {
  title: 'رویدادها و نشست‌های علمی',
  description: 'تقویم نشست‌های علمی، کارگاه‌ها و میزگردهای تخصصی خانه وکلا؛ رایگان برای اعضا.',
};

const formats = [
  [Mic2, 'نشست علمی', 'ارائه یک موضوع تخصصی توسط سخنران مهمان و پرسش و پاسخ آزاد.'],
  [GraduationCap, 'کارگاه عملی', 'تمرین روی نمونه پرونده واقعی با ظرفیت محدود و بازخورد فردی.'],
  [Users, 'میزگرد', 'گفت‌وگوی چند وکیل با دیدگاه‌های متفاوت درباره یک مسئله روز.'],
  [CalendarDays, 'دورهمی ماهانه', 'روایت پنج‌دقیقه‌ای تجربه‌ها، کنار قهوه؛ ساده‌ترین راه شبکه‌سازی.'],
];

export default function EventsPage() {
  return <>
    <PageHero
      eyebrow="تقویم علمی"
      current="رویدادها"
      title={<>تبادل دانش حقوقی،<br /><span className="gold-text">هر هفته در خانه وکلا</span></>}
      description="نشست‌ها و کارگاه‌های تخصصی برای به‌روز ماندن و آموختن از تجربه همکاران؛ اعضا رایگان یا با تخفیف شرکت می‌کنند."
    />

    <section className="section-space">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="قالب برنامه‌ها" title="چهار نوع برنامه، یک هدف" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {formats.map(([Icon, title, text], index) => {
            const I = Icon as typeof Mic2;
            return <Reveal key={title as string} delay={index * .06}>
              <article className="h-full rounded-3xl border border-gray-100 bg-white p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-coffee-100 text-coffee-700"><I size={22} /></span>
                <h3 className="mt-5 font-black text-navy-900">{title as string}</h3>
                <p className="mt-2 text-xs leading-7 text-gray-500">{text as string}</p>
              </article>
            </Reveal>;
          })}
        </div>
      </div>
    </section>

    <section className="section-space bg-white">
      <div className="container-shell">
        <SectionTitle eyebrow="برنامه‌های پیش رو" title={<>تقویم رویدادهای<br /><span className="text-gold-500">فصل جاری</span></>} description="ظرفیت برخی برنامه‌ها محدود است؛ ثبت‌نام زودهنگام توصیه می‌شود." />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event, index) => <Reveal key={event.slug} delay={index * .05}><EventCard event={event} /></Reveal>)}
        </div>
      </div>
    </section>

    <section className="section-space bg-navy-950 text-white">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <span className="eyebrow mb-4">فراخوان ارائه</span>
          <h2 className="display-title">تجربه‌ای دارید که ارزش گفتن دارد؟</h2>
          <p className="mt-5 max-w-xl leading-[2] text-white/60">
            اعضای خانه وکلا می‌توانند موضوع نشست پیشنهاد دهند. پس از بررسی دبیرخانه علمی، سالن، تجهیزات و اطلاع‌رسانی برنامه بر عهده ماست.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button href="/contact/">ارسال پیشنهاد نشست</Button>
          <Button href="/membership/#plans" variant="light" arrow>عضویت و شرکت رایگان</Button>
        </div>
      </div>
    </section>

    <section className="section-space">
      <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <SectionTitle eyebrow="پرسش‌های رویداد" title="درباره ثبت‌نام و حضور" />
        <FaqAccordion items={faqs.filter((item) => item.category === 'رویدادها' || item.category === 'کافه')} />
      </div>
    </section>
  </>;
}
