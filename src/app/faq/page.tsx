import type { Metadata } from 'next';
import { HelpCircle, MessageSquareText } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { FaqAccordion } from '@/components/interactive/FaqAccordion';
import { ContactForm } from '@/components/forms/ContactForm';
import { faqs } from '@/lib/data/faqs';
import { buildMetadata, faqSchema, JsonLd } from '@/lib/seo';
import { toFa } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'پرسش‌های پرتکرار | عضویت، اتاق مشاوره، رویدادها',
  description:
    'پاسخ پرسش‌های پرتکرار دربارهٔ عضویت در خانه وکلا، رزرو و تعرفهٔ اتاق‌های مشاوره، نشست‌های علمی و خدمات کافه.',
  path: '/faq/',
  keywords: ['پرسش متداول خانه وکلا', 'تعرفه اتاق مشاوره', 'شرایط عضویت وکلا'],
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        eyebrow="پرسش و پاسخ"
        title={
          <>
            پاسخ کوتاه برای
            <br />
            <span className="text-gold-400">پرسش‌های مهم شما</span>
          </>
        }
        description={`${toFa(faqs.length)} پرسش پرتکرار، دسته‌بندی‌شده. پاسخ‌ها عمومی‌اند و برای تصمیم نهایی، شرایط و مدارک هر پرونده باید جداگانه بررسی شود.`}
        crumbs={[{ label: 'پرسش‌های پرتکرار', href: '/faq/' }]}
      />

      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
          <aside>
            <div className="rounded-3xl bg-navy-900 p-7 text-white lg:sticky lg:top-24">
              <HelpCircle className="text-gold-500" size={30} aria-hidden />
              <h2 className="mt-5 text-lg font-black">پاسخ خود را پیدا نکردید؟</h2>
              <p className="mt-3 text-xs leading-[1.95] text-white/55">
                پرسش خود را ارسال کنید یا برای بررسی اختصاصی، وقت مشاوره بگیرید.
              </p>
              <a
                href="#ask"
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-gold-400 transition hover:text-gold-300"
              >
                <MessageSquareText size={17} aria-hidden />
                پرسیدن سؤال
              </a>
            </div>
          </aside>

          <div>
            <FaqAccordion />
          </div>
        </div>
      </section>

      <section id="ask" className="section-space scroll-mt-24 bg-surface-2">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <SectionTitle
            eyebrow="پرسش شما"
            title={
              <>
                پرسش خود را
                <br />
                <span className="text-gold-500">برای ما بنویسید</span>
              </>
            }
            description="برای حفظ حریم خصوصی، نام اشخاص، شمارهٔ پرونده یا اطلاعات بسیار حساس را در فرم عمومی وارد نکنید."
          />
          <ContactForm kind="question" />
        </div>
      </section>
    </>
  );
}
