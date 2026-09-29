import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Coffee,
  DoorOpen,
  HelpCircle,
  Home,
  Newspaper,
  Phone,
  UserPlus,
} from 'lucide-react';

import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { SITE } from '@/lib/constants';
import { withBase } from '@/lib/site';

/**
 * صفحهٔ ۴۰۴.
 *
 * چرا این صفحه روی GitHub Pages مهم‌تر از حالت عادی است؟
 * GitHub Pages هیچ ریدایرکت سمت سرور ندارد. هر آدرس اشتباه، هر لینک قدیمیِ
 * ایندکس‌شده و هر تایپوی کاربر مستقیم به همین فایل می‌رسد
 * (`out/404.html` که در زمان build ساخته می‌شود). پس این صفحه بن‌بست نیست؛
 * باید کاربر را در حداکثر یک کلیک به مقصدش برساند.
 *
 * هدر و فوتر از `app/layout.tsx` به‌صورت خودکار اینجا هم رندر می‌شوند،
 * بنابراین منوی کامل سایت روی صفحهٔ ۴۰۴ در دسترس است.
 */

const DESTINATIONS = [
  {
    href: '/services/',
    icon: Coffee,
    title: 'خدمات خانه وکلا',
    text: 'کافه تخصصی، اتاق مشاوره، کتابخانه و ارجاع موکل',
  },
  {
    href: '/membership/',
    icon: UserPlus,
    title: 'عضویت و تعرفه‌ها',
    text: 'سه طرح ماهانه، فصلی و سالانه با مقایسهٔ کامل مزایا',
  },
  {
    href: '/consultation/',
    icon: DoorOpen,
    title: 'رزرو اتاق مشاوره',
    text: 'تقویم شمسی، انتخاب ساعت و برآورد هزینه پیش از ثبت درخواست',
  },
  {
    href: '/events/',
    icon: CalendarDays,
    title: 'رویدادها و نشست‌ها',
    text: 'کارگاه‌ها، میزگردها و نشست‌های علمی با ظرفیت باقی‌مانده',
  },
  {
    href: '/blog/',
    icon: Newspaper,
    title: 'مطالب حقوقی',
    text: 'خلاصهٔ پرونده، نکات کاربردی و اخبار حقوقی',
  },
  {
    href: '/faq/',
    icon: HelpCircle,
    title: 'پرسش‌های پرتکرار',
    text: 'پاسخ کوتاه به رایج‌ترین سؤال‌های اعضا و مراجعان',
  },
] as const;

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="خطای ۴۰۴"
        title="این صفحه پیدا نشد"
        description="ممکن است نشانی را اشتباه وارد کرده باشید، یا صفحه جابه‌جا شده باشد. از میان مسیرهای زیر ادامه دهید — همه‌شان یک کلیک فاصله دارند."
        crumbs={[{ label: 'صفحهٔ یافت‌نشده' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/" variant="gold" arrow>
            <Home size={17} aria-hidden />
            بازگشت به صفحهٔ نخست
          </Button>
          <Button href="/contact/" variant="light">
            <Phone size={17} aria-hidden />
            تماس با ما
          </Button>
        </div>
      </PageHero>

      <section className="section-space bg-surface">
        <div className="container-shell">
          <h2 className="text-lg font-black text-ink sm:text-xl">شاید دنبال یکی از این‌ها بودید</h2>
          <p className="mt-2 text-sm leading-[2] text-ink-muted">
            فهرست کامل صفحات در{' '}
            <a
              href={withBase('/sitemap.xml')}
              className="font-bold text-navy-700 underline underline-offset-4 dark:text-gold-400"
            >
              نقشهٔ سایت
            </a>{' '}
            موجود است.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map(({ href, icon: Icon, title, text }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="surface-card group flex h-full flex-col gap-3 p-6 transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-navy-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                    <Icon size={20} aria-hidden />
                  </span>
                  <strong className="text-base font-black text-ink">{title}</strong>
                  <span className="text-[13px] leading-[1.95] text-ink-muted">{text}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-bold text-navy-700 dark:text-gold-400">
                    مشاهده
                    <ArrowLeft
                      size={15}
                      aria-hidden
                      className="transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transform-none"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* راه ارتباطی مستقیم: اگر هیچ‌کدام از مسیرهای بالا جواب نداد. */}
          <div className="surface-card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong className="block text-base font-black text-ink">هنوز آنچه می‌خواستید را پیدا نکردید؟</strong>
              <span className="mt-1 block text-[13px] leading-[1.95] text-ink-muted">
                دبیرخانه همه‌روزه {SITE.workHours} پاسخ‌گوست.
              </span>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button href={SITE.phoneHref} variant="navy">
                <Phone size={16} aria-hidden />
                {SITE.phone}
              </Button>
              <Button href={SITE.whatsappHref} variant="outline">
                واتساپ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
