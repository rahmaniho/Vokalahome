import type { Metadata } from 'next';
import Image from 'next/image';
import { Check, Coffee, Printer, ShieldCheck, Sparkles, UserCheck, Wifi } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animation/Reveal';
import { RoomCard } from '@/components/cards/RoomCard';
import { ConsultationCards } from '@/components/consultation/ConsultationCards';
import { BookingWidget } from '@/components/consultation/BookingWidget';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { rooms } from '@/lib/data/rooms';
import { faqs } from '@/lib/data/faqs';
import { ROOM_RATE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'اتاق‌های مشاوره',
  description: 'اتاق‌های مشاوره خانه وکلا برای ملاقات با موکل؛ برای اعضا رایگان و برای وکلای غیرعضو ساعتی ۵۰۰ هزار تومان.',
};

const included = [
  [UserCheck, 'استقبال و راهنمایی موکل توسط پذیرش'],
  [Coffee, 'پذیرایی چای، قهوه و آب معدنی'],
  [Wifi, 'اینترنت اختصاصی پرسرعت'],
  [Printer, 'پرینت، اسکن و کپی مدارک جلسه'],
  [ShieldCheck, 'عایق صوتی و بدون دوربین داخلی'],
  [Sparkles, 'آماده‌سازی و مرتب‌سازی اتاق پیش از هر جلسه'],
];

export default function RoomsPage() {
  return <>
    <PageHero
      eyebrow="فضاهای حرفه‌ای"
      current="اتاق‌های مشاوره"
      title={<>جلسه با موکل،<br /><span className="gold-text">در فضایی شایسته</span></>}
      description="شش فضای متفاوت برای مشاوره خصوصی، داوری، جلسه آنلاین و نگارش لایحه. اگر دفتر فیزیکی ندارید، اینجا دفتر شماست."
    />

    {/* تعرفه */}
    <section className="section-space">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="right">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
            <Image src="/images/rooms/consultation-room.jpg" alt="اتاق مشاوره خانه وکلا" fill sizes="(max-width:1024px) 100vw,50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
          </div>
        </Reveal>
        <Reveal direction="left">
          <SectionTitle eyebrow="تعرفه شفاف" title={<>اعضا رایگان،<br /><span className="text-gold-500">مهمان‌ها ساعتی ۵۰۰ هزار تومان</span></>} description="بدون هزینه پنهان؛ تعرفه اعلام‌شده شامل تمام خدمات جانبی جلسه است." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border-2 border-gold-500 bg-gold-500/5 p-6">
              <span className="text-xs font-bold text-gray-500">اعضای خانه وکلا</span>
              <strong className="mt-3 block text-3xl font-black text-navy-900">{ROOM_RATE.memberPrice}</strong>
              <p className="mt-2 text-[11px] leading-6 text-gray-500">{ROOM_RATE.memberNote}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <span className="text-xs font-bold text-gray-500">وکلای غیرعضو</span>
              <strong className="mt-3 block text-3xl font-black text-navy-900">۵۰۰٬۰۰۰<small className="mr-1 text-xs font-bold text-gray-400">تومان / ساعت</small></strong>
              <p className="mt-2 text-[11px] leading-6 text-gray-500">{ROOM_RATE.guestNote}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#booking">رزرو اتاق</Button>
            <Button href="/membership/#plans" variant="outline" arrow>مقایسه با هزینه عضویت</Button>
          </div>
        </Reveal>
      </div>
    </section>

    {/* لیست اتاق‌ها */}
    <section className="section-space bg-white">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="فضاها" title="فضای متناسب با جلسه خود را انتخاب کنید" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => <Reveal key={room.slug} delay={index * .05}><RoomCard room={room} /></Reveal>)}
        </div>
      </div>
    </section>

    {/* خدمات شامل رزرو */}
    <section className="section-space bg-navy-950 text-white">
      <div className="container-shell">
        <SectionTitle light align="center" eyebrow="شامل هر رزرو" title="بدون هزینه اضافه" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map(([Icon, label]) => {
            const I = Icon as typeof Wifi;
            return <span key={label as string} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/75">
              <i className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-400"><I size={18} /></i>{label as string}
            </span>;
          })}
        </div>
      </div>
    </section>

    {/* انواع رزرو */}
    <section className="section-space">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="نوع رزرو" title="چه نوع جلسه‌ای در پیش دارید؟" />
        <div className="mt-12"><ConsultationCards /></div>
      </div>
    </section>

    {/* تقویم رزرو */}
    <section id="booking" className="section-space bg-[#F0F1F4]">
      <div className="container-shell">
        <SectionTitle eyebrow="تقویم رزرو" title={<>روز و ساعت اتاق را<br /><span className="text-gold-500">انتخاب کنید</span></>} description="بازه‌ها نیم‌ساعته‌اند و از ۸ صبح تا ۲۲ نمایش داده می‌شوند. تأیید نهایی پس از تماس پذیرش انجام می‌شود." />
        <div className="mt-10"><BookingWidget /></div>
      </div>
    </section>

    <section className="section-space">
      <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <SectionTitle eyebrow="پرسش‌های رزرو" title="قواعد استفاده از اتاق‌ها" />
        <FaqAccordion items={faqs.filter((item) => item.category === 'اتاق مشاوره')} />
      </div>
    </section>
  </>;
}
