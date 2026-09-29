import type { Metadata } from 'next';
import { BadgeCheck, BookOpen, Coffee, Eye, HeartHandshake, Scale, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/animation/Reveal';
import { TestimonialSlider } from '@/components/interactive/TestimonialSlider';
import { credentials, partners } from '@/lib/data/partners';
import { SITE } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'دربارهٔ خانه وکلا | داستان، ارزش‌ها و مجوزها',
  description:
    'داستان شکل‌گیری خانه وکلا، ارزش‌های حاکم بر این خانه، معرفی مؤسس و اطلاعات قانونی و مجوزهای مجموعه در قزوین.',
  path: '/about/',
  keywords: ['درباره خانه وکلا', 'باشگاه وکلا قزوین', 'کافه حقوقی', 'مؤسس خانه وکلا'],
});

const TIMELINE = [
  ['۱۴۰۱', 'یک میز در گوشهٔ کافه', 'چند وکیل هر پنجشنبه دور یک میز جمع می‌شدند تا پرونده‌ها و تجربه‌ها را مرور کنند.'],
  ['۱۴۰۲', 'تولد خانه وکلا', 'فضای اختصاصی با کافه، کتابخانه و دو اتاق مشاوره افتتاح شد.'],
  ['۱۴۰۳', 'اتاق‌های حرفه‌ای', 'شش اتاق مشاوره، اتاق داوری و سالن نشست به مجموعه اضافه شد.'],
  ['۱۴۰۵', 'یک شبکهٔ حقوقی', 'بیش از ۱۸۰ عضو، تقویم علمی هفتگی و سامانهٔ ارجاع مراجعان.'],
] as const;

const VALUES = [
  [Scale, 'همکاری به‌جای رقابت', 'اینجا وکلا رقیب هم نیستند؛ مکمل یکدیگرند و پرونده‌ها را به هم ارجاع می‌دهند.'],
  [Eye, 'شفافیت در تعرفه', 'هزینهٔ عضویت و اتاق‌ها روشن اعلام می‌شود؛ بدون هزینهٔ پنهان.'],
  [ShieldCheck, 'محرمانگی', 'اتاق‌های عایق صوتی، بدون دوربین و کارکنانی متعهد به رازداری حرفه‌ای.'],
  [HeartHandshake, 'احترام حرفه‌ای', 'از کارآموز سال اول تا وکیل سی‌ساله، همه در این خانه جای برابر دارند.'],
  [BookOpen, 'یادگیری مستمر', 'تقویم علمی هفتگی و کتابخانه‌ای که هر ماه به‌روز می‌شود.'],
  [Coffee, 'کیفیت میزبانی', 'قهوهٔ خوب، نور گرم و صندلی راحت؛ چون فکر کردن به فضا نیاز دارد.'],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="دربارهٔ ما"
        title={
          <>
            خانه‌ای که وکلا
            <br />
            <span className="text-gold-400">آن را ساختند</span>
          </>
        }
        description="خانه وکلا از یک نیاز ساده متولد شد: وکیل به جایی نیاز دارد که هم بنشیند و فکر کند، هم با همکارانش گفت‌وگو کند و هم با موکلش جلسه‌ای شایسته داشته باشد."
        crumbs={[{ label: 'دربارهٔ ما', href: '/about/' }]}
      />

      {/* داستان */}
      <section className="section-space">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-line shadow-soft">
              <Picture
                src="/images/hero/lawyers-cafe.jpg"
                alt="فضای کافه و سالن اصلی خانه وکلا"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="aspect-[5/4]"
              />
            </div>
            <span className="absolute bottom-5 right-5 rounded-xl bg-surface/95 px-4 py-2 text-xs font-bold text-ink backdrop-blur">
              {SITE.shortAddress}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <SectionTitle
              eyebrow="داستان ما"
              title={
                <>
                  وکالت، حرفه‌ای است که
                  <br />
                  <span className="text-gold-500">در گفت‌وگو پخته می‌شود</span>
                </>
              }
            />
            <div className="prose-fa mt-6">
              <p>
                بسیاری از وکلا، به‌ویژه در سال‌های نخست، بدون دفتر کار می‌کنند؛ جلسه با موکل در کافی‌شاپ شلوغ برگزار
                می‌شود و پرسش‌های حرفه‌ای بی‌پاسخ می‌ماند. خانه وکلا پاسخ همین وضعیت است: یک کافهٔ تخصصی، شش اتاق
                مشاورهٔ مجهز، کتابخانه‌ای به‌روز و تقویمی از نشست‌های علمی.
              </p>
              <p>
                اینجا می‌توانید عضو شوید و از اتاق‌ها به‌صورت رایگان استفاده کنید، یا به‌عنوان مهمان ساعتی ۵۰۰٬۰۰۰
                تومان اتاق بگیرید. مراجعان هم می‌توانند از طریق خانه وکلا به وکیل متخصص حوزهٔ خود برسند.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/membership/">پلن‌های عضویت</Button>
              <Button href="/rooms/" variant="outline" arrow>
                اتاق‌های مشاوره
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* مسیر */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle center eyebrow="مسیر ما" title="از یک میز تا یک خانه" />

          <ol className="relative mt-14 grid gap-5 lg:grid-cols-4">
            <i
              aria-hidden
              className="absolute right-[8%] top-7 hidden w-[84%] border-t border-dashed border-gold-500/40 lg:block"
            />
            {TIMELINE.map(([year, title, text], index) => (
              <Reveal as="li" key={year} delay={index * 80}>
                <article className="relative h-full rounded-3xl border border-line bg-surface p-6">
                  <span className="relative z-10 inline-grid h-14 min-w-14 place-items-center rounded-2xl bg-navy-900 px-3 font-black text-gold-400 dark:bg-navy-800">
                    {year}
                  </span>
                  <h3 className="mt-5 text-base font-black text-ink">{title}</h3>
                  <p className="mt-2 text-xs leading-[1.95] text-ink-muted">{text}</p>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ارزش‌ها */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="قواعد خانه"
            title={
              <>
                ارزش‌هایی که این خانه
                <br />
                <span className="text-gold-500">بر آن‌ها بنا شده</span>
              </>
            }
          />

          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(([Icon, title, text], index) => {
              const IconComponent = Icon as typeof Scale;
              return (
                <Reveal as="li" key={title as string} delay={index * 50}>
                  <article className="h-full rounded-3xl border border-line bg-surface p-6 transition hover:border-gold-500/40 hover:shadow-soft">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gold-500/12 text-gold-600 dark:text-gold-400">
                      <IconComponent size={22} strokeWidth={1.7} aria-hidden />
                    </span>
                    <h3 className="mt-5 text-base font-black text-ink">{title as string}</h3>
                    <p className="mt-2 text-xs leading-[1.95] text-ink-muted">{text as string}</p>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* مؤسس */}
      <section className="section-space noise persian-pattern bg-navy-950 text-white">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
            <Picture
              src="/images/lawyers/manager-portrait.jpg"
              alt={`تصویر ${SITE.manager}`}
              sizes="(max-width: 1024px) 100vw, 360px"
              className="aspect-[4/5]"
              imgClassName="object-top"
            />
            <span className="absolute bottom-4 right-4 rounded-lg bg-navy-950/80 px-3 py-2 text-[9px] text-white/60 backdrop-blur">
              تصویر پیشنهادی — نیازمند تأیید
            </span>
          </div>

          <div>
            <span className="eyebrow">مؤسس خانه</span>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">{SITE.manager}</h2>
            <p className="mt-3 text-sm text-gold-400">{SITE.managerTitle}</p>

            <blockquote className="mt-7 border-r-2 border-gold-500/50 pr-5 text-sm leading-[2.1] text-white/60 sm:text-base">
              «سال‌ها دیدم همکارانی که تازه پروانه گرفته‌اند، جایی برای نشستن ندارند. خانه وکلا را ساختیم تا هیچ وکیلی
              مجبور نباشد جلسهٔ موکلش را در راهرو برگزار کند.»
            </blockquote>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {['عضو کانون وکلای قزوین', 'بنیان‌گذار خانه وکلا', '[مدرک و گرایش تحصیلی]', '۱۴+ سال تجربهٔ حرفه‌ای'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                    <BadgeCheck size={17} className="shrink-0 text-gold-500" aria-hidden />
                    {item}
                  </li>
                ),
              )}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/lawyers/ali-keshavarz-najafi/" variant="light">
                مشاهدهٔ پروفایل
              </Button>
              <Button href="/contact/">هماهنگی بازدید از خانه</Button>
            </div>
          </div>
        </div>
      </section>

      {/* نظرات */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle center eyebrow="بازخورد اعضا" title="اعضا چه می‌گویند" className="mb-11" />
          <TestimonialSlider />
        </div>
      </section>

      {/* مجوزها و همکاران */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle
            eyebrow="مجوزها و همکاران"
            title="اطلاعات قانونی، شفاف و قابل بررسی"
            description="شماره و تصویر مدارک پیش از انتشار نهایی سایت توسط مدیر مجموعه تکمیل می‌شود."
          />

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {credentials.map((item) => (
              <li key={item.id} className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold-500/12 text-gold-600 dark:text-gold-400">
                  <BadgeCheck size={22} aria-hidden />
                </span>
                <div className="min-w-0">
                  <b className="block text-sm font-black text-ink">{item.title}</b>
                  <small className="mt-1 block text-[11px] leading-6 text-ink-muted">{item.detail}</small>
                  <small className="mt-1 block text-[10px] text-ink-faint">
                    صادرکننده: {item.issuer}
                    {item.number && ` · شمارهٔ ${item.number}`}
                  </small>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-line pt-10">
            <p className="mb-6 text-center text-xs font-bold text-ink-faint">همکاران علمی و صنفی</p>
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {partners.map((partner) => (
                <li
                  key={partner.id}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-center transition hover:border-gold-500/40"
                >
                  <b className="block text-xs font-black text-ink">{partner.name}</b>
                  <small className="mt-0.5 block text-[9px] text-ink-faint">{partner.kind}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
