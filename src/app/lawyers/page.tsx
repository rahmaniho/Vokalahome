import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Alert } from '@/components/ui/Alert';
import { LawyersCatalog } from '@/components/interactive/Catalogs';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'وکلای عضو خانه وکلا',
  description:
    'فهرست وکلای عضو خانه وکلا قزوین به تفکیک حوزهٔ تخصصی؛ مراجعان می‌توانند وکیل متناسب با موضوع پروندهٔ خود را انتخاب کنند.',
  path: '/lawyers/',
  keywords: ['وکیل قزوین', 'وکلای عضو', 'وکیل خانواده قزوین', 'وکیل ملکی قزوین'],
});

export default function LawyersPage() {
  return (
    <>
      <PageHero
        eyebrow="اعضای خانه"
        title={
          <>
            وکلایی که اینجا
            <br />
            <span className="text-gold-400">قهوه می‌نوشند</span>
          </>
        }
        description="اعضای خانه وکلا با تخصص‌های متفاوت؛ مراجعان می‌توانند وکیل متناسب با موضوع پروندهٔ خود را انتخاب کنند و جلسه را در اتاق‌های خانه برگزار کنند."
        crumbs={[{ label: 'وکلای عضو', href: '/lawyers/' }]}
      />

      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            eyebrow="فهرست اعضا"
            title="وکیل مناسب حوزهٔ خود را پیدا کنید"
            description="با انتخاب حوزهٔ تخصصی، فهرست فیلتر می‌شود."
            className="mb-8"
          />

          <Alert tone="warning" className="mb-8">
            پروفایل‌های نشان‌دار «در انتظار تکمیل» نمونه‌اند و اطلاعات واقعی آن‌ها پس از تکمیل توسط خود عضو و تأیید
            دبیرخانه منتشر می‌شود.
          </Alert>

          <LawyersCatalog />
        </div>
      </section>
    </>
  );
}
