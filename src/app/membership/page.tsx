import type { Metadata } from 'next';
import { ArrowLeft, CalendarCheck, FileCheck2, Handshake, MessageCircle, Phone } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Reveal } from '@/components/animation/Reveal';
import { PlanExplorer } from '@/components/membership/PlanExplorer';
import { MembershipForm } from '@/components/membership/MembershipForm';
import { MembershipCard } from '@/components/membership/MembershipCard';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { membershipSteps } from '@/lib/data/plans';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = buildMetadata({
  title: 'عضویت در خانه وکلا | سه پلن ماهانه، سه‌ماهه و سالانه',
  description:
    'عضویت در باشگاه تخصصی خانه وکلا قزوین: پلن کارآموزی، وکالت و دفتر مجازی با ساعت رایگان اتاق مشاوره، کارت عضویت دیجیتال و دسترسی به نشست‌های علمی.',
  path: '/membership/',
  keywords: ['عضویت وکلا', 'باشگاه وکلا قزوین', 'کارت عضویت وکیل', 'دفتر مجازی وکالت'],
});

const STEP_ICONS = [FileCheck2, Handshake, CalendarCheck, CalendarCheck] as const;

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="عضویت"
        title={
          <>
            عضو شوید،
            <br />
            <span className="text-gold-400">خانه‌تان را تحویل بگیرید</span>
          </>
        }
        description="سه پلن ساده، متناسب با مرحلهٔ حرفه‌ای شما. بدون قرارداد بلندمدت اجباری، بدون هزینهٔ پنهان و با امکان ارتقا یا توقف در هر ماه."
        crumbs={[{ label: 'عضویت', href: '/membership/' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#plans" variant="gold" arrow>
            مقایسهٔ پلن‌ها
          </Button>
          <Button href="#apply" variant="light">
            ثبت درخواست عضویت
          </Button>
        </div>
      </PageHero>

      {/* پلن‌ها + جدول مقایسه */}
      <section id="plans" className="section-space scroll-mt-24">
        <div className="container-shell">
          <PlanExplorer />
        </div>
      </section>

      {/* مسیر عضویت */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="مسیر عضویت"
            title="از درخواست تا کارت عضویت، سه گام"
            description="کل فرایند معمولاً کمتر از یک هفته طول می‌کشد."
          />

          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {membershipSteps.map(([number, title, text], index) => {
              const Icon = STEP_ICONS[index] ?? FileCheck2;
              return (
                <Reveal as="li" key={title} delay={index * 80}>
                  <div className="relative h-full rounded-3xl border border-line bg-surface p-6">
                    <span className="absolute left-6 top-6 text-4xl font-black text-ink-faint/15" aria-hidden>
                      {number}
                    </span>
                    <span className="grid size-12 place-items-center rounded-2xl bg-navy-900 text-gold-400 dark:bg-navy-800">
                      <Icon size={22} strokeWidth={1.7} aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base font-black text-ink">{title}</h3>
                    <p className="mt-2.5 text-sm leading-[1.95] text-ink-muted">{text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* کارت دیجیتال */}
      <section className="section-space noise persian-pattern bg-navy-950 text-white">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1fr_.9fr]">
          <div>
            <SectionTitle
              light
              eyebrow="کارت عضویت دیجیتال"
              title={
                <>
                  کارت شما،
                  <br />
                  <span className="text-gold-400">همیشه در جیبتان</span>
                </>
              }
              description="پس از تأیید عضویت، کارت دیجیتال با کد QR اختصاصی برای شما صادر می‌شود. پذیرش خانه با یک اسکن، عضویت و سقف ساعت اتاق شما را می‌بیند."
            />

            <ul className="mt-7 space-y-3">
              {[
                'کد QR یکتا که به صفحهٔ اعتبارسنجی خانه وکلا اشاره می‌کند',
                'قابل ذخیره در گوشی یا چاپ روی کارت فیزیکی',
                'ساخت کاملاً سمت مرورگر؛ اطلاعات شما به هیچ سرویس خارجی ارسال نمی‌شود',
                'قابل ارتقا به اعتبارسنجی برخط پس از اتصال به Supabase',
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-[1.95] text-white/65">
                  <ArrowLeft size={15} className="mt-1.5 shrink-0 text-gold-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <MembershipCard
              data={{
                name: 'نام عضو نمونه',
                planName: 'عضویت وکالت',
                memberId: 'VH-05-10234',
                validUntil: '۳۱ شهریور ۱۴۰۵',
                role: 'وکیل پایه یک دادگستری',
              }}
            />
          </div>
        </div>
      </section>

      {/* فرم درخواست */}
      <section id="apply" className="section-space scroll-mt-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div>
            <SectionTitle
              eyebrow="ثبت درخواست"
              title="فرم عضویت"
              description="فرم را پر کنید؛ دبیرخانه ظرف یک روز کاری برای احراز پروانه و هماهنگی بازدید تماس می‌گیرد."
            />

            <Alert tone="info" className="mt-6">
              هیچ پرداخت آنلاینی در این مرحله انجام نمی‌شود. مبلغ عضویت پس از جلسهٔ آشنایی و تأیید، حضوری تسویه می‌شود.
            </Alert>

            <div className="mt-6 space-y-3">
              <a
                href={SITE.phoneHref}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-5 transition hover:border-gold-500"
              >
                <Phone size={18} className="text-gold-600" aria-hidden />
                <span className="min-w-0">
                  <b className="block text-xs font-black text-ink">تماس مستقیم</b>
                  <small className="text-[11px] text-ink-faint" dir="ltr">
                    {SITE.phone}
                  </small>
                </span>
              </a>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-5 transition hover:border-emerald-500"
              >
                <MessageCircle size={18} className="text-emerald-600" aria-hidden />
                <span className="min-w-0">
                  <b className="block text-xs font-black text-ink">گفت‌وگو در واتساپ</b>
                  <small className="text-[11px] text-ink-faint">پاسخ در ساعات کاری</small>
                </span>
              </a>
            </div>
          </div>

          <MembershipForm />
        </div>
      </section>

      {/* پرسش‌های عضویت */}
      <section className="section-space bg-surface-2">
        <div className="container-shell mx-auto max-w-3xl">
          <SectionTitle center eyebrow="پرسش‌های پرتکرار" title="دربارهٔ عضویت" className="mb-10" />
          <FaqAccordion category="عضویت" />
        </div>
      </section>
    </>
  );
}
