import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  Coffee,
  DoorOpen,
  Handshake,
  Landmark,
  Lightbulb,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wifi,
} from 'lucide-react';
import { Hero } from './Hero';
import { Reveal } from '@/components/animation/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Picture } from '@/components/ui/Picture';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { RoomCard } from '@/components/cards/RoomCard';
import { EventCard } from '@/components/cards/EventCard';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { TestimonialSlider } from '@/components/interactive/TestimonialSlider';
import { services } from '@/lib/data/services';
import { articles } from '@/lib/data/articles';
import { rooms } from '@/lib/data/rooms';
import { events } from '@/lib/data/events';
import { plans, planPrice } from '@/lib/data/plans';
import { partners, credentials } from '@/lib/data/partners';
import { averageRating } from '@/lib/data/testimonials';
import { SITE } from '@/lib/constants';
import { formatToman, toFa } from '@/lib/utils';

const WHY = [
  [Coffee, 'کافه، نه سالن انتظار', 'فضای گرم با قهوهٔ تخصصی؛ جایی که گفت‌وگوی حقوقی به‌جای راهروی دادگاه، پشت میز چوبی شکل می‌گیرد.'],
  [DoorOpen, 'دفتر، بدون اجارهٔ دفتر', 'اتاق‌های مشاورهٔ مجهز و عایق صدا برای ملاقات با موکل؛ رایگان برای اعضا، ساعتی ۵۰۰ هزار تومان برای مهمانان.'],
  [Lightbulb, 'تبادل دانش واقعی', 'نشست تحلیل آرا، کارگاه لایحه‌نویسی و میزگرد تخصصی؛ هر هفته دست‌کم یک برنامهٔ علمی.'],
  [Handshake, 'شبکهٔ همکاری', 'پیدا کردن همکار پرونده، وکیل شهر دیگر یا کارشناس، فقط با یک گفت‌وگو در کافه.'],
  [UsersRound, 'ارجاع مراجعان', 'مراجعان خانه وکلا بر اساس تخصص به وکلای عضو ارجاع داده می‌شوند.'],
  [ShieldCheck, 'محرمانگی حرفه‌ای', 'اتاق‌های بدون دوربین، عایق صوتی و کارکنانی متعهد به رازداری حرفه‌ای.'],
] as const;

const AMENITIES = [
  [Wifi, 'اینترنت اختصاصی پرسرعت'],
  [BookOpenCheck, 'کتابخانه و بانک آرای قضایی'],
  [Landmark, 'نزدیکی به دادگستری و مراجع قضایی'],
  [BadgeCheck, 'پذیرش و منشی حرفه‌ای'],
  [Coffee, 'قهوهٔ تخصصی با تخفیف اعضا'],
  [Sparkles, 'پارکینگ مهمان و اتاق انتظار موکل'],
] as const;

/**
 * تمام بخش‌های صفحهٔ نخست.
 *
 * همهٔ این بخش‌ها سرور-کامپوننت‌اند جز سه مورد تعاملی (نشانگر ساعت کاری،
 * آکاردئون پرسش‌ها و اسلایدر نظرات). نتیجه: HTML کامل در همان پاسخ اول
 * می‌رسد و جاوااسکریپت فقط برای همان سه تکه بارگذاری می‌شود.
 */
export function HomeSections() {
  return (
    <>
      <Hero />

      {/* ───────── چرا خانه وکلا ───────── */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="چرا خانه وکلا؟"
            title={
              <>
                نه دفتر، نه کافه؛
                <br />
                <span className="text-gold-500">خانهٔ حرفه‌ای وکلا</span>
              </>
            }
            description="جایی که وکیل بعد از جلسهٔ دادگاه می‌نشیند، قهوه‌اش را می‌نوشد، با همکارش دربارهٔ یک استدلال بحث می‌کند و یک ساعت بعد در اتاق مجاور با موکلش جلسهٔ رسمی دارد."
          />

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WHY.map(([Icon, title, text], index) => (
              <Reveal as="li" key={title} delay={index * 60}>
                <div className="h-full rounded-3xl border border-line bg-surface p-6 transition hover:border-gold-500/40 hover:shadow-soft">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gold-500/12 text-gold-600 dark:text-gold-400">
                    <Icon size={22} strokeWidth={1.7} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-black text-ink">{title}</h3>
                  <p className="mt-2.5 text-sm leading-[1.95] text-ink-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── معرفی + امکانات ───────── */}
      <section className="section-space bg-surface-2">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-line shadow-soft">
              <Picture
                src="/images/gallery/cafe-bar.jpg"
                alt="بار قهوه و میزهای گفت‌وگو در سالن اصلی خانه وکلا"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="aspect-[5/4]"
              />
            </div>
            <div className="absolute -bottom-5 right-4 rounded-2xl border border-line bg-surface p-5 shadow-lift">
              <strong className="block text-2xl font-black text-ink">۱۴ ساعت</strong>
              <span className="text-[11px] text-ink-faint">باز، هر روز هفته</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <SectionTitle
              eyebrow="امکانات خانه"
              title={
                <>
                  هرچه یک وکیل
                  <br />
                  <span className="text-gold-500">به آن نیاز دارد</span>
                </>
              }
              description="از یک فنجان قهوه تا اتاق داوری هشت‌نفره؛ همه زیر یک سقف و در چند قدمی دادگستری."
            />

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {AMENITIES.map(([Icon, label]) => (
                <li key={label} className="flex items-center gap-2.5 text-sm font-bold text-ink">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold-500/12 text-gold-600 dark:text-gold-400">
                    <Icon size={15} aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/about/" variant="outline" arrow>
                داستان خانه وکلا
              </Button>
              <Button href="/gallery/" variant="ghost">
                گالری و تور مجازی
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── خدمات ───────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionTitle
              eyebrow="خدمات"
              title={
                <>
                  شش خدمت اصلی،
                  <br />
                  <span className="text-gold-500">یک تجربهٔ یکپارچه</span>
                </>
              }
            />
            <Link
              href="/services/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-ink transition hover:text-gold-600"
            >
              همهٔ خدمات
              <ArrowLeft size={16} aria-hidden />
            </Link>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal as="li" key={service.slug} delay={index * 50}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── اتاق‌های مشاوره ───────── */}
      <section className="section-space noise persian-pattern bg-navy-950 text-white">
        <div className="container-shell">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <SectionTitle
              light
              eyebrow="اتاق‌های مشاوره"
              title={
                <>
                  دفتر فیزیکی ندارید؟
                  <br />
                  <span className="text-gold-400">اینجا دفتر شماست</span>
                </>
              }
              description="اتاق‌های عایق صدا با پذیرایی و پذیرش حرفه‌ای؛ موکل شما وارد یک فضای شایسته می‌شود، نه یک کافی‌شاپ شلوغ."
            />
            <div className="rounded-3xl border border-white/12 bg-white/5 p-6">
              <p className="text-xs text-white/50">تعرفهٔ اتاق مشاوره</p>
              <div className="mt-3 flex items-baseline gap-2">
                <b className="text-3xl font-black text-gold-400">رایگان</b>
                <span className="text-xs text-white/55">برای اعضا</span>
              </div>
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-6 text-white/55">
                وکلای مهمان: ساعتی <b className="text-white">{formatToman(500_000)} تومان</b> شامل پذیرایی و خدمات منشی.
              </p>
            </div>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rooms.slice(0, 3).map((room, index) => (
              <Reveal as="li" key={room.slug} delay={index * 60}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/rooms/" variant="gold" arrow>
              دیدن همهٔ شش اتاق
            </Button>
            <Button href="/consultation/" variant="light">
              رزرو آنلاین اتاق
            </Button>
          </div>
        </div>
      </section>

      {/* ───────── عضویت ───────── */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="عضویت"
            title={
              <>
                عضو شوید،
                <br />
                <span className="text-gold-500">خانه‌تان را تحویل بگیرید</span>
              </>
            }
            description="سه پلن ساده متناسب با مرحلهٔ حرفه‌ای شما؛ بدون قرارداد بلندمدت اجباری و بدون هزینهٔ پنهان."
          />

          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan, index) => {
              const price = planPrice(plan, 'monthly');
              return (
                <Reveal as="li" key={plan.slug} delay={index * 70}>
                  <article
                    className={`relative flex h-full flex-col rounded-3xl border p-6 transition ${
                      plan.highlight
                        ? 'border-gold-500 bg-surface shadow-lift'
                        : 'border-line bg-surface hover:border-gold-500/40'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 right-6">
                        <Badge tone={plan.highlight ? 'gold' : 'neutral'} className="shadow-sm">
                          {plan.badge}
                        </Badge>
                      </span>
                    )}
                    <h3 className="text-lg font-black text-ink">{plan.name}</h3>
                    <p className="mt-1.5 text-xs leading-6 text-ink-faint">{plan.audience}</p>
                    <div className="my-5 flex items-end gap-1.5 border-y border-line py-5">
                      <b className="text-3xl font-black leading-none text-ink">{formatToman(price.total)}</b>
                      <span className="pb-0.5 text-xs text-ink-muted">تومان / ماه</span>
                    </div>
                    <p className="text-xs font-bold text-gold-700 dark:text-gold-400">{plan.roomHours}</p>
                    <ul className="mt-4 flex-1 space-y-2">
                      {plan.features.slice(0, 4).map((feature) => (
                        <li key={feature} className="flex gap-2 text-xs leading-[1.9] text-ink-muted">
                          <BadgeCheck size={14} className="mt-1 shrink-0 text-emerald-600" aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/membership/"
                      className={`mt-6 flex min-h-12 items-center justify-center rounded-xl text-sm font-black transition ${
                        plan.highlight
                          ? 'bg-gold-500 text-navy-900 hover:bg-gold-400'
                          : 'border border-line text-ink hover:border-gold-500 hover:text-gold-600'
                      }`}
                    >
                      جزئیات و عضویت
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───────── رویدادها ───────── */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionTitle
              eyebrow="رویدادهای پیش‌رو"
              title={
                <>
                  هر هفته دست‌کم
                  <br />
                  <span className="text-gold-500">یک برنامهٔ علمی</span>
                </>
              }
            />
            <Link
              href="/events/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-ink transition hover:text-gold-600"
            >
              تقویم کامل رویدادها
              <ArrowLeft size={16} aria-hidden />
            </Link>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event, index) => (
              <Reveal as="li" key={event.slug} delay={index * 60}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── اعتماد: نظرات + آمار ───────── */}
      <section className="section-space noise bg-navy-900 text-white">
        <div className="container-shell">
          <SectionTitle
            center
            light
            eyebrow={`رضایت اعضا · میانگین ${toFa(averageRating)} از ۵`}
            title="اعضا چه می‌گویند"
            description="نظرات زیر نمونه‌اند و پیش از انتشار نهایی با بازخورد واقعی اعضا جایگزین می‌شوند."
          />
          <div className="mt-11">
            <TestimonialSlider light />
          </div>

          {/* همکاران و اعتبارنامه‌ها */}
          <div className="mt-16 border-t border-white/10 pt-12">
            <p className="mb-7 text-center text-xs font-bold text-white/40">با همکاری و تأیید</p>
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {partners.map((partner) => (
                <li
                  key={partner.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-gold-500/40"
                >
                  <b className="block text-xs font-black text-white/85">{partner.short}</b>
                  <small className="mt-0.5 block text-[9px] text-white/35">{partner.kind}</small>
                </li>
              ))}
            </ul>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {credentials.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
                  <b className="block text-xs font-black text-gold-400">{item.title}</b>
                  <p className="mt-2 text-[11px] leading-[1.9] text-white/50">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── وبلاگ ───────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionTitle
              eyebrow="وبلاگ حقوقی"
              title={
                <>
                  دانش حقوقی،
                  <br />
                  <span className="text-gold-500">به زبان قابل فهم</span>
                </>
              }
            />
            <Link
              href="/blog/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-ink transition hover:text-gold-600"
            >
              همهٔ مطالب
              <ArrowLeft size={16} aria-hidden />
            </Link>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article, index) => (
              <Reveal as="li" key={article.slug} delay={index * 60}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── پرسش‌های پرتکرار ───────── */}
      <section className="section-space bg-surface-2">
        <div className="container-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionTitle
              eyebrow="پرسش‌های پرتکرار"
              title={
                <>
                  هر چیزی که
                  <br />
                  <span className="text-gold-500">می‌خواهید بدانید</span>
                </>
              }
              description="اگر پاسخ پرسشتان را پیدا نکردید، مستقیم با ما تماس بگیرید."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={SITE.phoneHref} variant="navy">
                <Phone size={16} aria-hidden />
                تماس تلفنی
              </Button>
              <Button href={SITE.whatsappHref} variant="outline">
                <MessageCircle size={16} aria-hidden />
                واتساپ
              </Button>
            </div>
          </div>
          <FaqAccordion limit={6} />
        </div>
      </section>

      {/* ───────── فراخوان پایانی ───────── */}
      <section className="section-space">
        <div className="container-shell">
          <div className="noise persian-pattern relative overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gold-500/15 blur-[90px]" />
            <div className="relative mx-auto max-w-2xl">
              <span className="eyebrow mb-5 justify-center">یک قهوه، یک گفت‌وگو</span>
              <h2 className="text-2xl font-black leading-[1.5] sm:text-4xl">
                بیایید از نزدیک ببینید
                <br />
                <span className="text-gold-400">اولین قهوه مهمان ما</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-[2.05] text-white/60">
                بدون تعهد و بدون هزینه؛ سری بزنید، فضا را ببینید و اگر پسندیدید عضو شوید.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/contact/" variant="gold" size="lg" arrow>
                  هماهنگی بازدید
                </Button>
                <Button href="/membership/" variant="light" size="lg">
                  مشاهدهٔ پلن‌های عضویت
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
