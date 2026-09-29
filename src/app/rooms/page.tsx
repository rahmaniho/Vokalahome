import type { Metadata } from 'next';
import { Coffee, Printer, ShieldCheck, Sparkles, UserCheck, Wifi } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Reveal } from '@/components/animation/Reveal';
import { RoomCard } from '@/components/cards/RoomCard';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { rooms } from '@/lib/data/rooms';
import { ROOM_RATE } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';
import { formatToman, toFa } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'اتاق‌های مشاوره | رایگان برای اعضا، ساعتی ۵۰۰ هزار تومان برای مهمانان',
  description:
    'شش اتاق مشاورهٔ مجهز و عایق صدا در خانه وکلا قزوین برای ملاقات با موکل، جلسهٔ داوری، جلسهٔ آنلاین و نگارش لایحه. رزرو آنلاین با تقویم شمسی.',
  path: '/rooms/',
  keywords: ['اتاق مشاوره وکالت', 'اجاره اتاق جلسه قزوین', 'دفتر اشتراکی وکلا', 'اتاق داوری'],
});

const INCLUDED = [
  [UserCheck, 'استقبال و راهنمایی موکل توسط پذیرش'],
  [Coffee, 'پذیرایی چای، قهوه و آب معدنی'],
  [Wifi, 'اینترنت اختصاصی پرسرعت'],
  [Printer, 'پرینت، اسکن و کپی مدارک جلسه'],
  [ShieldCheck, 'عایق صوتی و بدون دوربین داخلی'],
  [Sparkles, 'آماده‌سازی و مرتب‌سازی اتاق پیش از هر جلسه'],
] as const;

export default function RoomsPage() {
  return (
    <>
      <PageHero
        eyebrow="فضاهای حرفه‌ای"
        title={
          <>
            جلسه با موکل،
            <br />
            <span className="text-gold-400">در فضایی شایسته</span>
          </>
        }
        description="شش فضای متفاوت برای مشاورهٔ خصوصی، داوری، جلسهٔ آنلاین و نگارش لایحه. اگر دفتر فیزیکی ندارید، اینجا دفتر شماست."
        crumbs={[{ label: 'رزرو اتاق', href: '/rooms/' }]}
      >
        <Button href="/consultation/#booking" variant="gold" arrow>
          رزرو آنلاین اتاق
        </Button>
      </PageHero>

      {/* تعرفه */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="تعرفه"
            title="شفاف، بدون هزینهٔ پنهان"
            description="تعرفه شامل همهٔ خدمات جانبی است؛ چیزی جداگانه از شما گرفته نمی‌شود."
          />

          <div className="mx-auto mt-11 grid max-w-3xl gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/[.06] p-7 text-center">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">اعضای خانه وکلا</span>
              <b className="mt-3 block text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {ROOM_RATE.memberPrice}
              </b>
              <p className="mt-3 text-xs leading-[1.9] text-ink-muted">{ROOM_RATE.memberNote}</p>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-7 text-center">
              <span className="text-xs font-bold text-ink-muted">وکلای مهمان</span>
              <b className="mt-3 block text-4xl font-black text-ink">{ROOM_RATE.guestPrice}</b>
              <span className="mt-1 block text-xs text-ink-faint">{ROOM_RATE.unit}</span>
              <p className="mt-3 text-xs leading-[1.9] text-ink-muted">{ROOM_RATE.guestNote}</p>
            </div>
          </div>

          <Alert tone="info" className="mx-auto mt-7 max-w-3xl">
            سالن مطالعه برای مهمانان با نرخ ویژهٔ {formatToman(ROOM_RATE.studyGuestRaw)} تومان در ساعت ارائه می‌شود و
            سالن نشست علمی بر اساس نوع برنامه با دبیرخانه هماهنگ می‌گردد.
          </Alert>
        </div>
      </section>

      {/* فهرست اتاق‌ها */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow={`${toFa(rooms.length)} فضای متفاوت`}
            title="اتاق مناسب هر نوع جلسه"
            description="از گفت‌وگوی دونفره تا نشست علمی چهل‌وپنج نفره."
          />

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, index) => (
              <Reveal as="li" key={room.slug} delay={index * 50}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* آنچه در تعرفه هست */}
      <section className="section-space noise persian-pattern bg-navy-950 text-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <SectionTitle
            light
            eyebrow="در تعرفه گنجانده شده"
            title={
              <>
                فقط اتاق نیست؛
                <br />
                <span className="text-gold-400">یک جلسهٔ آبرومند است</span>
              </>
            }
            description="موکل شما از لحظهٔ ورود تا خروج، با یک تجربهٔ حرفه‌ای روبه‌روست."
          />

          <ul className="grid gap-4 sm:grid-cols-2">
            {INCLUDED.map(([Icon, label]) => (
              <li key={label} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-400">
                  <Icon size={16} aria-hidden />
                </span>
                <span className="text-xs leading-[1.9] text-white/70">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* پرسش‌ها */}
      <section className="section-space">
        <div className="container-shell mx-auto max-w-3xl">
          <SectionTitle center eyebrow="پرسش‌های پرتکرار" title="دربارهٔ اتاق‌های مشاوره" className="mb-10" />
          <FaqAccordion category="اتاق مشاوره" />

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/consultation/#booking" variant="gold" arrow>
              رزرو اتاق
            </Button>
            <Button href="/gallery/" variant="outline">
              دیدن تصاویر و تور مجازی
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
