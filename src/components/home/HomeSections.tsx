import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, BadgeCheck, BookOpenCheck, Coffee, DoorOpen, Handshake, Landmark, Lightbulb,
  MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, UsersRound, Wifi,
} from 'lucide-react';
import { Hero } from './Hero';
import { Reveal } from '@/components/animation/Reveal';
import { CountUp } from '@/components/animation/CountUp';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { LawyerCard } from '@/components/cards/LawyerCard';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { PlanCard } from '@/components/cards/PlanCard';
import { RoomCard } from '@/components/cards/RoomCard';
import { EventCard } from '@/components/cards/EventCard';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { TestimonialSlider } from '@/components/interactive/TestimonialSlider';
import { services } from '@/lib/data/services';
import { lawyers } from '@/lib/data/lawyers';
import { articles } from '@/lib/data/articles';
import { faqs } from '@/lib/data/faqs';
import { plans } from '@/lib/data/plans';
import { rooms } from '@/lib/data/rooms';
import { events } from '@/lib/data/events';
import { SITE, ROOM_RATE, QUICK_FACTS } from '@/lib/constants';

const why = [
  [Coffee, 'کافه، نه سالن انتظار', 'فضای گرم با قهوه تخصصی؛ جایی که گفت‌وگوی حقوقی به‌جای راهروی دادگاه، پشت میز چوبی شکل می‌گیرد.'],
  [DoorOpen, 'دفتر، بدون اجاره دفتر', 'اتاق‌های مشاوره مجهز و عایق صدا برای ملاقات با موکل؛ رایگان برای اعضا، ساعتی ۵۰۰ هزار تومان برای مهمانان.'],
  [Lightbulb, 'تبادل دانش واقعی', 'نشست تحلیل آرا، کارگاه لایحه‌نویسی و میزگرد تخصصی؛ هر هفته دست‌کم یک برنامه علمی.'],
  [Handshake, 'شبکه همکاری', 'پیدا کردن همکار پرونده، وکیل شهر دیگر یا کارشناس، فقط با یک گفت‌وگو در کافه.'],
  [UsersRound, 'ارجاع مراجعان', 'مراجعان خانه وکلا بر اساس تخصص به وکلای عضو ارجاع داده می‌شوند.'],
  [ShieldCheck, 'محرمانگی حرفه‌ای', 'اتاق‌های بدون دوربین، عایق صوتی و کارکنانی متعهد به رازداری حرفه‌ای.'],
];

const amenities = [
  [Wifi, 'اینترنت اختصاصی پرسرعت'],
  [BookOpenCheck, 'کتابخانه و بانک آرای قضایی'],
  [Landmark, 'نزدیکی به دادگستری و مراجع قضایی'],
  [BadgeCheck, 'پذیرش و منشی حرفه‌ای'],
  [Coffee, 'قهوه تخصصی با تخفیف اعضا'],
  [Sparkles, 'پارکینگ مهمان و اتاق انتظار موکل'],
];

export function HomeSections() {
  return <>
    <Hero />

    {/* آمار */}
    <section id="stats" className="relative z-20 -mt-8">
      <div className="container-shell">
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_FACTS.map((fact, index) => (
              <div key={fact.label} className="relative p-6 text-center lg:p-8">
                {index > 0 && <i className="absolute right-0 top-1/4 hidden h-1/2 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent lg:block" />}
                <strong className="block text-3xl font-black text-navy-900 lg:text-4xl"><CountUp end={fact.value} suffix={fact.suffix} /></strong>
                <span className="mt-2 block text-xs text-gray-500">{fact.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    {/* معرفی */}
    <section className="section-space overflow-hidden">
      <div className="container-shell grid items-center gap-14 lg:grid-cols-2">
        <Reveal direction="right" className="relative">
          <div className="relative mr-4 aspect-[5/4] overflow-hidden rounded-[2rem] bg-coffee-900">
            <Image src="/images/cafe/coffee-and-case.jpg" alt="قهوه و پرونده روی میز کافه وکلا" fill sizes="(max-width:1024px) 100vw,50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/60 to-transparent" />
          </div>
          <div className="absolute -bottom-6 right-0 rounded-2xl border border-white bg-white p-5 shadow-soft">
            <strong className="block text-2xl font-black text-navy-900">۱۴ ساعت</strong>
            <span className="text-[11px] text-gray-500">باز، هر روز هفته</span>
          </div>
          <div className="legal-pattern absolute -left-8 -top-8 -z-10 size-40 rounded-3xl" />
        </Reveal>
        <Reveal direction="left">
          <SectionTitle
            eyebrow="خانه وکلا چیست؟"
            title={<>نه دفتر، نه کافه؛<br /><span className="text-gold-500">خانهٔ حرفه‌ای وکلا</span></>}
            description="جایی که وکیل بعد از جلسه دادگاه می‌نشیند، قهوه‌اش را می‌نوشد، با همکارش درباره یک استدلال بحث می‌کند و یک ساعت بعد، در اتاق مجاور با موکلش جلسه رسمی دارد."
          />
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {['کافه و سالن گفت‌وگو', 'شش اتاق مشاوره مجهز', 'کتابخانه و سالن مطالعه', 'سالن نشست‌های علمی'].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm font-bold text-navy-900">
                <i className="grid size-6 place-items-center rounded-full bg-gold-500/15 text-gold-500"><Sparkles size={13} /></i>{item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/about/" variant="outline" arrow>داستان خانه وکلا</Button>
            <Button href="/membership/#plans">عضویت</Button>
          </div>
        </Reveal>
      </div>
    </section>

    {/* امکانات */}
    <section className="section-space bg-white">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle eyebrow="امکانات خانه" title={<>هرچه یک وکیل<br /><span className="text-gold-500">به آن نیاز دارد</span></>} description="از یک فنجان قهوه تا اتاق داوری هشت‌نفره؛ همه زیر یک سقف." />
          <Link href="/services/" className="flex items-center gap-2 text-sm font-black text-navy-900 hover:text-gold-500">همه امکانات <ArrowLeft size={16} /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => <Reveal key={service.slug} delay={index * .05}><ServiceCard service={service} index={index} /></Reveal>)}
        </div>
      </div>
    </section>

    {/* اتاق‌های مشاوره + تعرفه */}
    <section className="section-space bg-navy-950 text-white">
      <div className="container-shell">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <SectionTitle light eyebrow="اتاق‌های مشاوره" title={<>دفتر فیزیکی ندارید؟<br /><span className="gold-text">اینجا دفتر شماست</span></>} description="اتاق‌های عایق صدا با پذیرایی و پذیرش حرفه‌ای؛ موکل شما وارد یک فضای شایسته می‌شود، نه یک کافی‌شاپ شلوغ." />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-5">
              <span className="text-[11px] text-white/60">اعضای خانه وکلا</span>
              <strong className="mt-2 block text-2xl font-black text-gold-300">{ROOM_RATE.memberPrice}</strong>
              <small className="mt-1 block text-[10px] leading-5 text-white/45">{ROOM_RATE.memberNote}</small>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="text-[11px] text-white/60">وکلای غیرعضو</span>
              <strong className="mt-2 block text-2xl font-black text-white">{ROOM_RATE.guestPrice}</strong>
              <small className="mt-1 block text-[10px] leading-5 text-white/45">{ROOM_RATE.unit} · {ROOM_RATE.guestNote}</small>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rooms.slice(0, 3).map((room, index) => <Reveal key={room.slug} delay={index * .06}><RoomCard room={room} /></Reveal>)}
        </div>
        <div className="mt-10 text-center"><Button href="/rooms/" variant="light" arrow>مشاهده همه فضاها و رزرو</Button></div>
      </div>
    </section>

    {/* چرا خانه وکلا */}
    <section className="section-space">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="چرا اینجا؟" title={<>وکالت، کار تنهایی نیست</>} description="خانه وکلا برای این ساخته شد که دانش، تجربه و فضای حرفه‌ای میان وکلا به اشتراک گذاشته شود." />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {why.map(([Icon, title, text], index) => {
            const I = Icon as typeof Coffee;
            return <Reveal key={title as string} delay={index * .05}>
              <article className="h-full rounded-3xl border border-gray-100 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:shadow-soft">
                <span className="grid size-12 place-items-center rounded-2xl bg-coffee-100 text-coffee-700"><I size={23} /></span>
                <h3 className="mt-5 font-black text-navy-900">{title as string}</h3>
                <p className="mt-2 text-xs leading-7 text-gray-500">{text as string}</p>
              </article>
            </Reveal>;
          })}
        </div>
      </div>
    </section>

    {/* پلن‌های عضویت */}
    <section className="section-space bg-white">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="عضویت" title={<>عضو شوید،<br /><span className="text-gold-500">خانه را خانهٔ خود کنید</span></>} description="سه سطح عضویت متناسب با مسیر حرفه‌ای شما؛ از کارآموزی تا دفتر مجازی کامل." />
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => <Reveal key={plan.slug} delay={index * .07}><PlanCard plan={plan} /></Reveal>)}
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">امکان پرداخت سه‌ماهه و سالانه با تخفیف · عضویت پس از احراز پروانه وکالت فعال می‌شود.</p>
      </div>
    </section>

    {/* رویدادها */}
    <section className="section-space bg-ivory">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle eyebrow="تقویم علمی" title={<>هر هفته یک بهانه<br /><span className="text-gold-500">برای یاد گرفتن</span></>} description="نشست تحلیل آرا، کارگاه مهارتی و میزگرد تخصصی؛ رایگان برای اعضا." />
          <Link href="/events/" className="flex items-center gap-2 text-sm font-black text-navy-900 hover:text-gold-500">تقویم کامل <ArrowLeft size={16} /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event, index) => <Reveal key={event.slug} delay={index * .05}><EventCard event={event} /></Reveal>)}
        </div>
      </div>
    </section>

    {/* امکانات جانبی نواری */}
    <section className="bg-coffee-900 py-14 text-white">
      <div className="container-shell grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map(([Icon, label]) => {
          const I = Icon as typeof Wifi;
          return <span key={label as string} className="flex items-center gap-3 text-sm text-white/75">
            <i className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-gold-400"><I size={19} /></i>{label as string}
          </span>;
        })}
      </div>
    </section>

    {/* وکلای عضو */}
    <section className="section-space">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle eyebrow="اعضای خانه" title={<>وکلایی که اینجا<br /><span className="text-gold-500">قهوه می‌نوشند</span></>} description="مراجعان می‌توانند بر اساس تخصص، وکیل عضو مناسب پرونده خود را انتخاب کنند." />
          <Link href="/lawyers/" className="flex items-center gap-2 text-sm font-black text-navy-900 hover:text-gold-500">فهرست اعضا <ArrowLeft size={16} /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.slice(0, 3).map((lawyer, index) => <Reveal key={lawyer.slug} delay={index * .06}><LawyerCard lawyer={lawyer} /></Reveal>)}
        </div>
      </div>
    </section>

    {/* تجربه اعضا */}
    <section className="section-space bg-white">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="روایت اعضا" title="اینجا چه می‌گذرد؟" />
        <div className="mt-12"><TestimonialSlider /></div>
      </div>
    </section>

    {/* دانش‌نامه */}
    <section className="section-space bg-ivory">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle eyebrow="دانش‌نامه" title={<>نوشته‌های اعضای<br /><span className="text-gold-500">خانه وکلا</span></>} />
          <Link href="/articles/" className="flex items-center gap-2 text-sm font-black text-navy-900 hover:text-gold-500">همه مقالات <ArrowLeft size={16} /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => <Reveal key={article.slug} delay={index * .06}><ArticleCard article={article} index={index} /></Reveal>)}
        </div>
      </div>
    </section>

    {/* پرسش‌ها */}
    <section className="section-space">
      <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <SectionTitle eyebrow="پرسش‌های پرتکرار" title={<>هرچه درباره خانه وکلا<br /><span className="text-gold-500">باید بدانید</span></>} description="پاسخ کوتاه به رایج‌ترین پرسش‌های وکلا و مراجعان درباره عضویت، اتاق‌ها و رویدادها." />
        <FaqAccordion items={faqs.slice(0, 6)} />
      </div>
    </section>

    {/* CTA */}
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
      <div className="persian-pattern absolute inset-0 opacity-30" />
      <div className="container-shell relative grid items-center gap-10 lg:grid-cols-[1.3fr_.7fr]">
        <div>
          <span className="eyebrow mb-4">یک قهوه مهمان ما باشید</span>
          <h2 className="display-title">پیش از عضویت، یک بار بیایید و بنشینید</h2>
          <p className="mt-5 max-w-xl leading-[2] text-white/60">
            فضا را ببینید، با اعضا گفت‌وگو کنید و اتاق‌ها را از نزدیک بررسی کنید. اولین قهوه مهمان خانه وکلا است.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/membership/#join">رزرو بازدید و عضویت</Button>
            <Button href={SITE.whatsappHref} variant="light" >گفت‌وگو در واتساپ</Button>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <a href={SITE.phoneHref} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-gold-500/50"><Phone className="text-gold-500" size={18} /><span dir="ltr">{SITE.phone}</span></a>
          <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><MapPin className="shrink-0 text-gold-500" size={18} />{SITE.address}</span>
          <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><MessageCircle className="shrink-0 text-gold-500" size={18} />{SITE.workHours}</span>
        </div>
      </div>
    </section>
  </>;
}
