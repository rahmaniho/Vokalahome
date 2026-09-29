import type { Metadata } from 'next';
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { MapEmbed } from '@/components/layout/MapEmbed';
import { ContactForm } from '@/components/forms/ContactForm';
import { OpenNow } from '@/components/interactive/OpenNow';
import { SITE } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'تماس با خانه وکلا | نشانی، تلفن و ساعات کاری',
  description:
    'نشانی خانه وکلا در قزوین (خیابان خیام جنوبی)، تلفن مستقیم، واتساپ، ایمیل، ساعات کاری ۸ تا ۲۲ و فرم تماس آنلاین.',
  path: '/contact/',
  keywords: ['تماس خانه وکلا', 'آدرس کافه حقوقی قزوین', 'شماره تماس وکیل قزوین'],
});

export default function ContactPage() {
  const cards = [
    { Icon: MapPin, title: 'نشانی خانه وکلا', value: SITE.address, href: '#map', external: false },
    { Icon: Phone, title: 'تلفن مستقیم', value: SITE.phone, href: SITE.phoneHref, external: false },
    { Icon: MessageCircle, title: 'واتساپ', value: SITE.mobile, href: SITE.whatsappHref, external: true },
    { Icon: Mail, title: 'پست الکترونیک', value: SITE.email, href: `mailto:${SITE.email}`, external: false },
  ];

  return (
    <>
      <PageHero
        eyebrow="در ارتباط باشیم"
        title={
          <>
            نزدیک و پاسخ‌گو،
            <br />
            <span className="text-gold-400">وقتی به ما نیاز دارید</span>
          </>
        }
        description="برای بازدید از فضا، عضویت، رزرو اتاق یا هماهنگی رویداد از راه‌های زیر با ما در تماس باشید."
        crumbs={[{ label: 'تماس با ما', href: '/contact/' }]}
      >
        <OpenNow />
      </PageHero>

      {/* راه‌های تماس */}
      <section className="section-space">
        <div className="container-shell">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ Icon, title, value, href, external }) => (
              <li key={title}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-soft"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-navy-900 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-navy-900 dark:bg-navy-800">
                    <Icon size={21} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-sm font-black text-ink">{title}</h2>
                  <p className="mt-2 text-xs leading-6 text-ink-muted" dir={title === 'نشانی خانه وکلا' ? 'rtl' : 'auto'}>
                    {value}
                  </p>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-gold-500/10 p-4 text-xs text-ink">
            <Clock3 className="shrink-0 text-gold-600" size={18} aria-hidden />
            <b>ساعات پاسخ‌گویی:</b> {SITE.workHours}
          </p>
        </div>
      </section>

      {/* فرم + نقشه */}
      <section className="section-space bg-surface-2">
        <div className="container-shell grid gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionTitle
              eyebrow="ارسال پیام"
              title={
                <>
                  موضوع خود را
                  <br />
                  <span className="text-gold-500">کوتاه برای ما بنویسید</span>
                </>
              }
              description="این فرم برای ارتباط اولیه است. برای رزرو اتاق از صفحهٔ رزرو و برای عضویت از فرم عضویت استفاده کنید."
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div id="map" className="scroll-mt-24">
            <SectionTitle eyebrow="موقعیت" title="خیابان خیام جنوبی، قزوین" />
            <MapEmbed className="mt-8" />
          </div>
        </div>
      </section>
    </>
  );
}
