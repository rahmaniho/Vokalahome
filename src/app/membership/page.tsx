import type { Metadata } from 'next';
import { BadgeCheck, Coffee, DoorOpen, HelpCircle, Sparkles, UsersRound } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/animation/Reveal';
import { PlanCard } from '@/components/cards/PlanCard';
import { ContactForm } from '@/components/forms/ContactForm';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { plans, membershipSteps } from '@/lib/data/plans';
import { faqs } from '@/lib/data/faqs';

export const metadata: Metadata = {
  title: 'عضویت در خانه وکلا',
  description: 'پلن‌های عضویت خانه وکلا برای کارآموزان، وکلای دادگستری و وکلای بدون دفتر فیزیکی؛ اتاق مشاوره رایگان، ارجاع موکل و نشست‌های علمی.',
};

const benefits = [
  [DoorOpen, 'ساعت رایگان اتاق مشاوره', 'بسته به پلن، تا ۴۰ ساعت در ماه اتاق خصوصی برای جلسه با موکل، بدون هیچ هزینه‌ای.'],
  [UsersRound, 'ارجاع مراجعان', 'مراجعانی که به خانه وکلا مراجعه می‌کنند، متناسب با تخصص به اعضا ارجاع داده می‌شوند.'],
  [Coffee, 'کافه و فضای کار', 'دسترسی نامحدود به کافه، میزهای اشتراکی، سالن مطالعه و کتابخانه حقوقی.'],
  [Sparkles, 'رویدادهای علمی', 'حضور رایگان یا با تخفیف در نشست‌ها، کارگاه‌ها و میزگردهای تخصصی.'],
  [BadgeCheck, 'پروفایل عمومی', 'صفحه اختصاصی شما در فهرست وکلای عضو، قابل جستجو برای مراجعان.'],
  [HelpCircle, 'پشتیبانی اداری', 'پذیرش، منشی، پرینت و اسکن، پذیرایی جلسات و دریافت مکاتبات.'],
];

export default function MembershipPage() {
  return <>
    <PageHero
      eyebrow="عضویت"
      current="عضویت"
      title={<>عضو شوید و<br /><span className="gold-text">اینجا را دفتر خود بدانید</span></>}
      description="عضویت در خانه وکلا یعنی یک نشانی حرفه‌ای، اتاق مشاوره رایگان، شبکه‌ای از همکاران و برنامه‌ای منظم برای یادگیری."
    />

    <section className="section-space">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="مزایای عضویت" title="عضویت دقیقاً چه چیزی به شما می‌دهد؟" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map(([Icon, title, text], index) => {
            const I = Icon as typeof Coffee;
            return <Reveal key={title as string} delay={index * .05}>
              <article className="h-full rounded-3xl border border-gray-100 bg-white p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold-500/10 text-gold-600"><I size={23} /></span>
                <h3 className="mt-5 font-black text-navy-900">{title as string}</h3>
                <p className="mt-2 text-xs leading-7 text-gray-500">{text as string}</p>
              </article>
            </Reveal>;
          })}
        </div>
      </div>
    </section>

    <section id="plans" className="section-space bg-white">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="پلن‌ها و تعرفه" title={<>سه سطح عضویت،<br /><span className="text-gold-500">یک خانه مشترک</span></>} description="پرداخت سه‌ماهه ۱۰٪ و پرداخت سالانه ۲۰٪ تخفیف دارد." />
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => <Reveal key={plan.slug} delay={index * .07}><PlanCard plan={plan} /></Reveal>)}
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-gold-500/30 bg-gold-500/5 p-6 text-center text-sm leading-8 text-navy-900">
          وکیل غیرعضو هستید؟ استفاده از اتاق‌های مشاوره برای شما هم ممکن است؛ تعرفه هر ساعت <b>۵۰۰٬۰۰۰ تومان</b> است و شامل پذیرایی و خدمات پذیرش می‌شود.
        </div>
      </div>
    </section>

    <section className="section-space">
      <div className="container-shell">
        <SectionTitle align="center" eyebrow="مسیر عضویت" title="از فرم تا کارت عضویت، چهار قدم" />
        <div className="relative mt-14 grid gap-5 lg:grid-cols-4">
          <i className="absolute right-[8%] top-7 hidden w-[84%] border-t border-dashed border-gold-500/40 lg:block" />
          {membershipSteps.map(([num, title, text], index) => (
            <Reveal key={title} delay={index * .08}>
              <article className="relative h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="relative z-10 inline-grid size-14 place-items-center rounded-2xl bg-navy-900 text-xl font-black text-gold-400">{num}</span>
                <h3 className="mt-5 font-black text-navy-900">{title}</h3>
                <p className="mt-2 text-xs leading-7 text-gray-500">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section id="join" className="section-space bg-[#F0F1F4]">
      <div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
        <SectionTitle eyebrow="فرم عضویت" title={<>درخواست عضویت یا<br /><span className="text-gold-500">رزرو بازدید</span></>} description="فرم را تکمیل کنید؛ دبیرخانه ظرف یک روز کاری برای احراز پروانه و هماهنگی جلسه آشنایی تماس می‌گیرد. اولین قهوه مهمان ما." />
        <ContactForm kind="membership" />
      </div>
    </section>

    <section className="section-space">
      <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <SectionTitle eyebrow="پرسش‌های عضویت" title="پیش از عضویت بخوانید" />
        <FaqAccordion items={faqs.filter((item) => item.category === 'عضویت' || item.category === 'اتاق مشاوره')} />
      </div>
    </section>
  </>;
}
