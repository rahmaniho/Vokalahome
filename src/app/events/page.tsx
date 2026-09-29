import type { Metadata } from 'next';
import { CalendarPlus, Lightbulb, Mic, Users } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { EventsExplorer } from '@/components/events/EventsExplorer';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { events } from '@/lib/data/events';
import { buildMetadata } from '@/lib/seo';
import { toFa } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'رویدادها و نشست‌های علمی | تقویم کامل',
  description:
    'تقویم نشست‌های علمی، کارگاه‌های عملی و میزگردهای تخصصی خانه وکلا قزوین با نمایش ظرفیت باقی‌مانده، سرفصل برنامه و ثبت‌نام.',
  path: '/events/',
  keywords: ['نشست علمی حقوقی', 'کارگاه وکالت', 'رویداد حقوقی قزوین', 'میزگرد تخصصی'],
});

export default function EventsPage() {
  const totalSeats = events.reduce((sum, event) => sum + event.capacity, 0);
  const freeCount = events.filter((event) => event.isFree).length;

  return (
    <>
      <PageHero
        eyebrow="تقویم رویدادها"
        title={
          <>
            هر هفته دست‌کم
            <br />
            <span className="text-gold-400">یک برنامهٔ علمی</span>
          </>
        }
        description="نشست تحلیل آرا، کارگاه لایحه‌نویسی، میزگرد تخصصی و دورهمی‌های حرفه‌ای؛ برای اعضا رایگان یا با تخفیف."
        crumbs={[{ label: 'رویدادها', href: '/events/' }]}
      >
        <dl className="flex flex-wrap gap-6">
          {[
            [`${toFa(events.length)}`, 'رویداد پیش‌رو'],
            [`${toFa(totalSeats)}`, 'ظرفیت کل'],
            [`${toFa(freeCount)}`, 'برنامهٔ رایگان'],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd>
                <b className="block text-2xl font-black text-gold-400">{value}</b>
                <span className="mt-1 block text-[11px] text-white/45">{label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="section-space">
        <div className="container-shell">
          <EventsExplorer />
        </div>
      </section>

      {/* پیشنهاد موضوع */}
      <section className="section-space bg-surface-2">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <SectionTitle
              eyebrow="برای اعضا"
              title={
                <>
                  خودتان
                  <br />
                  <span className="text-gold-500">ارائه‌دهنده شوید</span>
                </>
              }
              description="اعضای خانه وکلا می‌توانند موضوع نشست پیشنهاد دهند. پس از بررسی دبیرخانهٔ علمی، تاریخ، سالن، اطلاع‌رسانی و پذیرایی بر عهدهٔ ماست."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact/" variant="gold" arrow>
                پیشنهاد موضوع نشست
              </Button>
              <Button href="/membership/" variant="outline">
                عضویت در خانه وکلا
              </Button>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              [Mic, 'سالن مجهز', 'ویدیوپروژکتور، سیستم صوتی و امکان پخش زنده'],
              [Users, 'مخاطب آماده', 'اطلاع‌رسانی به بیش از ۱۸۰ عضو خانه'],
              [CalendarPlus, 'هماهنگی کامل', 'ثبت‌نام، پذیرایی و صدور گواهی با ماست'],
              [Lightbulb, 'بدون هزینه', 'برگزاری برای اعضا کاملاً رایگان است'],
            ].map(([Icon, title, text]) => {
              const IconComponent = Icon as typeof Mic;
              return (
                <li key={title as string} className="rounded-2xl border border-line bg-surface p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-gold-500/12 text-gold-600 dark:text-gold-400">
                    <IconComponent size={18} aria-hidden />
                  </span>
                  <b className="mt-3.5 block text-xs font-black text-ink">{title as string}</b>
                  <p className="mt-1.5 text-[11px] leading-[1.9] text-ink-muted">{text as string}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* پرسش‌ها */}
      <section className="section-space">
        <div className="container-shell mx-auto max-w-3xl">
          <SectionTitle center eyebrow="پرسش‌های پرتکرار" title="دربارهٔ رویدادها" className="mb-10" />
          <FaqAccordion category="رویدادها" />
        </div>
      </section>
    </>
  );
}
