import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck2, CreditCard, MessageCircle, Phone, ShieldCheck, Users } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Reveal } from '@/components/animation/Reveal';
import { BookingWidget } from '@/components/consultation/BookingWidget';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { CONSULTATION_TYPES, SITE } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'رزرو اتاق و مشاوره | تقویم شمسی و تأیید تلفنی',
  description:
    'رزرو آنلاین اتاق مشاوره و وقت مشاورهٔ حقوقی در خانه وکلا قزوین با تقویم شمسی، انتخاب بازهٔ زمانی و برآورد لحظه‌ای هزینه. تأیید نهایی با تماس یا واتساپ.',
  path: '/consultation/',
  keywords: ['رزرو اتاق مشاوره', 'وقت مشاوره حقوقی قزوین', 'تقویم شمسی رزرو', 'مشاوره وکیل'],
});

const STEPS = [
  { icon: CalendarCheck2, title: 'تاریخ و ساعت را انتخاب کنید', text: 'تقویم شمسی، تعطیلات رسمی و ساعات پرشده را نشان می‌دهد.' },
  { icon: Users, title: 'نوع رزرو را مشخص کنید', text: 'عضو، وکیل مهمان یا مراجع؛ هزینه بلافاصله محاسبه می‌شود.' },
  { icon: Phone, title: 'تأیید نهایی با تماس', text: 'دبیرخانه ظرف چند ساعت برای قطعی‌کردن رزرو با شما تماس می‌گیرد.' },
] as const;

export default function ConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="رزرو آنلاین"
        title={
          <>
            وقت خود را
            <br />
            <span className="text-gold-400">در چند ثانیه رزرو کنید</span>
          </>
        }
        description="تقویم شمسی، ساعات خالی و برآورد هزینه — همه در همین صفحه و بدون نیاز به تماس. تأیید نهایی با یک تماس کوتاه انجام می‌شود."
        crumbs={[{ label: 'رزرو اتاق و مشاوره', href: '/consultation/' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#booking" variant="gold" arrow>
            شروع رزرو
          </Button>
          <Button href={SITE.whatsappHref} variant="light">
            <MessageCircle size={16} aria-hidden />
            رزرو با واتساپ
          </Button>
        </div>
      </PageHero>

      {/* انواع رزرو */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="سه نوع رزرو"
            title="کدام‌یک شما هستید؟"
            description="هزینه و فرایند هر نوع رزرو متفاوت است؛ در فرم پایین همان را انتخاب کنید."
          />

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {CONSULTATION_TYPES.map((type, index) => (
              <Reveal as="li" key={type.id} delay={index * 70}>
                <article
                  className={`relative flex h-full flex-col rounded-3xl border p-6 transition ${
                    type.popular ? 'border-gold-500 bg-surface shadow-soft' : 'border-line bg-surface'
                  }`}
                >
                  {type.popular && (
                    <span className="absolute -top-3 right-6">
                      <Badge tone="gold">پرکاربردترین</Badge>
                    </span>
                  )}
                  <h3 className="text-base font-black text-ink">{type.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-[1.95] text-ink-muted">{type.subtitle}</p>
                  <dl className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
                    <div>
                      <dt className="text-[10px] text-ink-faint">مدت</dt>
                      <dd className="font-bold text-ink">{type.duration}</dd>
                    </div>
                    <div className="text-left">
                      <dt className="text-[10px] text-ink-faint">هزینه</dt>
                      <dd className="font-black text-gold-700 dark:text-gold-400">{type.price}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ویجت رزرو */}
      <section id="booking" className="section-space scroll-mt-24 bg-surface-2">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="فرم رزرو"
            title="تاریخ، ساعت و نوع رزرو"
            description="همهٔ محاسبات در مرورگر شما انجام می‌شود؛ هیچ پرداختی آنلاین انجام نمی‌گیرد."
            className="mb-11"
          />
          <BookingWidget />
        </div>
      </section>

      {/* مسیر رزرو */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle center eyebrow="فرایند" title="رزرو در سه گام" />

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 80}>
                <div className="relative h-full rounded-3xl border border-line bg-surface p-6">
                  <span className="absolute left-6 top-6 text-4xl font-black text-ink-faint/15" aria-hidden>
                    {['۱', '۲', '۳'][index]}
                  </span>
                  <span className="grid size-12 place-items-center rounded-2xl bg-navy-900 text-gold-400 dark:bg-navy-800">
                    <step.icon size={22} strokeWidth={1.7} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-black text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-[1.95] text-ink-muted">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Alert tone="info" title="دربارهٔ پرداخت" className="mx-auto mt-10 max-w-3xl">
            در این نسخه از سایت هیچ درگاه پرداختی فعال نیست و تسویه حضوری یا کارت‌به‌کارت انجام می‌شود. ساختار کد برای
            افزودن درگاه (زرین‌پال، IDPay یا مشابه) آماده است؛ راهنمای اتصال در{' '}
            <code className="rounded bg-surface-3 px-1.5 py-0.5 text-[11px]">docs/BACKEND-INTEGRATION.md</code> آمده است.
          </Alert>
        </div>
      </section>

      {/* اطمینان */}
      <section className="section-space noise persian-pattern bg-navy-950 text-white">
        <div className="container-shell grid gap-10 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'محرمانگی کامل', text: 'اتاق‌ها عایق صوتی و بدون دوربین داخلی‌اند و کارکنان به رازداری حرفه‌ای متعهدند.' },
            { icon: CreditCard, title: 'بدون پیش‌پرداخت', text: 'رزرو بدون هیچ پرداخت آنلاینی ثبت می‌شود؛ تسویه پس از تأیید و حضور انجام می‌شود.' },
            { icon: Phone, title: 'لغو رایگان', text: 'تا ۶ ساعت پیش از جلسه می‌توانید رزرو را بدون هزینه لغو یا جابه‌جا کنید.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-gold-500/15 text-gold-400">
                <item.icon size={20} aria-hidden />
              </span>
              <h3 className="mt-4 text-sm font-black text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-[1.95] text-white/55">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* پرسش‌ها */}
      <section className="section-space">
        <div className="container-shell mx-auto max-w-3xl">
          <SectionTitle center eyebrow="پرسش‌های پرتکرار" title="دربارهٔ رزرو و مشاوره" className="mb-10" />
          <FaqAccordion category="اتاق مشاوره" />
          <p className="mt-8 text-center text-sm text-ink-muted">
            پاسخ پرسشتان را پیدا نکردید؟{' '}
            <Link href="/contact/" className="font-bold text-gold-600 underline-offset-4 hover:underline dark:text-gold-400">
              با ما تماس بگیرید
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
