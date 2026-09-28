import type { Metadata } from 'next';
import Image from 'next/image';
import { BadgeCheck, BookOpen, Coffee, Eye, HeartHandshake, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animation/Reveal';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = { title: 'درباره خانه وکلا', description: 'داستان، ارزش‌ها و فضای خانه وکلا؛ باشگاه تخصصی و کافه حقوقی وکلا در قزوین.' };

const timeline = [
  ['۱۴۰۱', 'یک میز در گوشه کافه', 'چند وکیل هر پنجشنبه دور یک میز جمع می‌شدند تا پرونده‌ها و تجربه‌ها را مرور کنند.'],
  ['۱۴۰۲', 'تولد خانه وکلا', 'فضای اختصاصی با کافه، کتابخانه و دو اتاق مشاوره افتتاح شد.'],
  ['۱۴۰۳', 'اتاق‌های حرفه‌ای', 'شش اتاق مشاوره، اتاق داوری و سالن نشست به مجموعه اضافه شد.'],
  ['۱۴۰۵', 'یک شبکه حقوقی', '۱۸۰+ عضو، تقویم علمی هفتگی و سامانه ارجاع مراجعان.'],
];

const values = [
  [Scale, 'همکاری به‌جای رقابت', 'اینجا وکلا رقیب هم نیستند؛ مکمل یکدیگرند و پرونده‌ها را به هم ارجاع می‌دهند.'],
  [Eye, 'شفافیت در تعرفه', 'هزینه عضویت و اتاق‌ها روشن اعلام می‌شود؛ بدون هزینه پنهان.'],
  [ShieldCheck, 'محرمانگی', 'اتاق‌های عایق صوتی، بدون دوربین و کارکنانی متعهد به رازداری حرفه‌ای.'],
  [HeartHandshake, 'احترام حرفه‌ای', 'از کارآموز سال اول تا وکیل سی‌ساله، همه در این خانه جای برابر دارند.'],
  [BookOpen, 'یادگیری مستمر', 'تقویم علمی هفتگی و کتابخانه‌ای که هر ماه به‌روز می‌شود.'],
  [Coffee, 'کیفیت میزبانی', 'قهوه خوب، نور گرم و صندلی راحت؛ چون فکر کردن به فضا نیاز دارد.'],
];

export default function AboutPage() {
  return <>
    <PageHero
      eyebrow="درباره ما"
      current="درباره خانه وکلا"
      title={<>خانه‌ای که وکلا<br /><span className="gold-text">آن را ساختند</span></>}
      description="خانه وکلا از یک نیاز ساده متولد شد: وکیل به جایی نیاز دارد که هم بنشیند و فکر کند، هم با همکارانش گفت‌وگو کند و هم با موکلش جلسه‌ای شایسته داشته باشد."
    />

    <section className="section-space">
      <div className="container-shell grid items-center gap-14 lg:grid-cols-2">
        <Reveal direction="right">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
            <Image src="/images/hero/lawyers-cafe.jpg" alt="فضای کافه خانه وکلا" fill className="object-cover" sizes="(max-width:1024px) 100vw,50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
            <span className="absolute bottom-5 right-5 rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-navy-900">{SITE.shortAddress}</span>
          </div>
        </Reveal>
        <Reveal direction="left">
          <SectionTitle eyebrow="داستان ما" title={<>وکالت، حرفه‌ای است که<br /><span className="text-gold-500">در گفت‌وگو پخته می‌شود</span></>} />
          <p className="mt-6 leading-[2.1] text-gray-600">
            بسیاری از وکلا، به‌ویژه در سال‌های نخست، بدون دفتر کار می‌کنند؛ جلسه با موکل در کافی‌شاپ شلوغ برگزار می‌شود و پرسش‌های حرفه‌ای بی‌پاسخ می‌ماند.
            خانه وکلا پاسخ همین وضعیت است: یک کافه تخصصی، شش اتاق مشاوره مجهز، کتابخانه‌ای به‌روز و تقویمی از نشست‌های علمی.
          </p>
          <p className="mt-4 leading-[2.1] text-gray-600">
            اینجا می‌توانید عضو شوید و از اتاق‌ها به‌صورت رایگان استفاده کنید، یا به‌عنوان مهمان ساعتی ۵۰۰٬۰۰۰ تومان اتاق بگیرید. مراجعان هم می‌توانند
            از طریق خانه وکلا به وکیل متخصص حوزه خود برسند.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/membership/#plans">پلن‌های عضویت</Button>
            <Button href="/rooms/" variant="outline" arrow>اتاق‌های مشاوره</Button>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="section-space bg-white">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="مسیر ما" title="از یک میز تا یک خانه" />
        <div className="relative mt-14 grid gap-5 lg:grid-cols-4">
          <i className="absolute right-[8%] top-7 hidden w-[84%] border-t border-dashed border-gold-500/40 lg:block" />
          {timeline.map(([year, title, text], index) => (
            <Reveal key={year} delay={index * .08}>
              <article className="relative h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="relative z-10 inline-grid h-14 min-w-14 place-items-center rounded-2xl bg-navy-900 px-3 font-black text-gold-400">{year}</span>
                <h3 className="mt-5 font-black text-navy-900">{title}</h3>
                <p className="mt-2 text-xs leading-7 text-gray-500">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section-space">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="قواعد خانه" title={<>ارزش‌هایی که این خانه<br /><span className="text-gold-500">بر آن‌ها بنا شده</span></>} />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {values.map(([Icon, title, text], i) => {
            const I = Icon as typeof Scale;
            return <Reveal key={title as string} delay={i * .05}>
              <article className="h-full rounded-3xl border border-gray-100 bg-white p-7">
                <I className="text-gold-500" size={27} />
                <h3 className="mt-5 font-black text-navy-900">{title as string}</h3>
                <p className="mt-2 text-xs leading-7 text-gray-500">{text as string}</p>
              </article>
            </Reveal>;
          })}
        </div>
      </div>
    </section>

    <section className="section-space bg-navy-950 text-white">
      <div className="container-shell grid items-center gap-14 lg:grid-cols-[.75fr_1.25fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image src="/images/lawyers/manager-portrait.jpg" alt={`تصویر پیشنهادی ${SITE.manager}`} fill className="object-cover object-top" sizes="(max-width:1024px) 100vw,35vw" />
          <span className="absolute bottom-4 right-4 rounded-lg bg-navy-950/80 px-3 py-2 text-[9px] text-white/60">تصویر پیشنهادی — نیازمند تأیید</span>
        </div>
        <div>
          <span className="eyebrow">مؤسس خانه</span>
          <h2 className="mt-4 text-4xl font-black">{SITE.manager}</h2>
          <p className="mt-3 text-gold-400">{SITE.managerTitle}</p>
          <p className="mt-7 leading-[2] text-white/60">
            «سال‌ها دیدم همکارانی که تازه پروانه گرفته‌اند، جایی برای نشستن ندارند. خانه وکلا را ساختیم تا هیچ وکیلی مجبور نباشد جلسه موکلش را در راهرو برگزار کند.»
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {['عضو کانون وکلای قزوین', 'بنیان‌گذار خانه وکلا', '[مدرک و گرایش تحصیلی]', '۱۴+ سال تجربه حرفه‌ای'].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-white/70"><BadgeCheck size={17} className="text-gold-500" />{item}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/lawyers/ali-keshavarz-najafi/" variant="light">مشاهده پروفایل</Button>
            <Button href="/membership/#join">رزرو بازدید از خانه</Button>
          </div>
        </div>
      </div>
    </section>

    <section className="section-space bg-white">
      <div className="container-shell">
        <SectionTitle eyebrow="مجوزها" title="اطلاعات قانونی، شفاف و قابل بررسی" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {['پروانه کسب و فعالیت مجموعه', 'گواهی عضویت کانون وکلا', '[مجوز بهداشتی کافه]'].map((item, i) => (
            <div key={item} className="flex items-center gap-4 rounded-2xl border border-dashed border-gray-200 p-5">
              <span className="grid size-12 place-items-center rounded-xl bg-gold-500/10 text-gold-500">{i < 2 ? <BadgeCheck /> : <Sparkles />}</span>
              <div><b className="text-sm text-navy-900">{item}</b><small className="mt-1 block text-[10px] text-gray-400">[تصویر و شماره مدرک]</small></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>;
}
