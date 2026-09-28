import type { Metadata } from 'next';
import { CalendarDays, CheckCircle2, MessageSquareText, PhoneCall } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { BookingWidget } from '@/components/consultation/BookingWidget';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LawyerCard } from '@/components/cards/LawyerCard';
import { Reveal } from '@/components/animation/Reveal';
import { lawyers } from '@/lib/data/lawyers';

export const metadata: Metadata = {
  title: 'مشاوره حقوقی برای مراجعان',
  description: 'ثبت درخواست مشاوره حقوقی در خانه وکلا؛ موضوع شما به وکیل عضو متخصص همان حوزه ارجاع می‌شود.',
};

const steps = [
  [MessageSquareText, 'ثبت موضوع', 'موضوع پرونده را کوتاه بنویسید تا حوزه تخصصی آن مشخص شود.'],
  [CalendarDays, 'انتخاب زمان', 'روز و ساعت مناسب را از تقویم خانه وکلا انتخاب کنید.'],
  [CheckCircle2, 'انتخاب وکیل', 'دبیرخانه، وکیل عضو متخصص همان حوزه را به شما معرفی می‌کند.'],
  [PhoneCall, 'جلسه حضوری', 'جلسه در یکی از اتاق‌های مشاوره خانه، با پذیرایی و آرامش کامل برگزار می‌شود.'],
];

export default function ConsultationPage() {
  return <>
    <PageHero
      eyebrow="ویژه مراجعان"
      current="مشاوره حقوقی"
      title={<>موضوع خود را بگویید،<br /><span className="gold-text">وکیل مناسب را معرفی می‌کنیم</span></>}
      description="خانه وکلا محل حضور ده‌ها وکیل با تخصص‌های متفاوت است. درخواست شما بررسی و به وکیل عضو متناسب با موضوع پرونده ارجاع داده می‌شود."
    />

    <section className="bg-white py-14">
      <div className="container-shell">
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map(([Icon, title, text], index) => {
            const I = Icon as typeof CalendarDays;
            return <div key={title as string} className="relative text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-navy-900 text-gold-500"><I size={23} /></span>
              <span className="mt-4 block text-[9px] font-black text-gold-500">مرحله {index + 1}</span>
              <h2 className="mt-1 text-sm font-black text-navy-900">{title as string}</h2>
              <p className="mt-2 text-[11px] leading-6 text-gray-500">{text as string}</p>
            </div>;
          })}
        </div>
      </div>
    </section>

    <section id="booking" className="section-space bg-[#F0F1F4]">
      <div className="container-shell">
        <SectionTitle eyebrow="ثبت درخواست" title={<>زمان جلسه مشاوره را<br /><span className="text-gold-500">انتخاب کنید</span></>} description="ثبت فرم به معنی رزرو اولیه است؛ پس از تماس پذیرش، نام وکیل و زمان قطعی اعلام می‌شود." />
        <div className="mt-10"><BookingWidget /></div>
      </div>
    </section>

    <section className="section-space">
      <div className="container-shell">
        <SectionTitle eyebrow="وکلای عضو" title="با تخصص‌های موجود آشنا شوید" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {lawyers.slice(0, 3).map((lawyer, index) => <Reveal key={lawyer.slug} delay={index * .06}><LawyerCard lawyer={lawyer} /></Reveal>)}
        </div>
      </div>
    </section>
  </>;
}
