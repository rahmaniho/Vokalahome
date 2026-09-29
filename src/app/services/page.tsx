import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { ServicesCatalog } from '@/components/interactive/Catalogs';
import { services } from '@/lib/data/services';
import { buildMetadata } from '@/lib/seo';
import { toFa } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'خدمات و امکانات خانه وکلا',
  description:
    'کافهٔ تخصصی، اتاق‌های مشاوره، عضویت، نشست‌های علمی، ارجاع مراجعان و کتابخانهٔ حقوقی؛ شش خدمت اصلی خانه وکلا در قزوین.',
  path: '/services/',
  keywords: ['خدمات خانه وکلا', 'کافه حقوقی', 'کتابخانه حقوقی قزوین', 'ارجاع مراجعان'],
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="خدمات"
        title={
          <>
            هرچه یک وکیل لازم دارد،
            <br />
            <span className="text-gold-400">زیر یک سقف</span>
          </>
        }
        description="از کافه و کتابخانه تا اتاق داوری و سالن نشست؛ در صفحهٔ هر بخش، جزئیات، شرایط و تعرفهٔ استفاده را توضیح داده‌ایم."
        crumbs={[{ label: 'خدمات', href: '/services/' }]}
      >
        <Button href="/membership/" variant="gold" arrow>
          عضویت و دسترسی کامل
        </Button>
      </PageHero>

      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            eyebrow={`${toFa(services.length)} خدمت اصلی`}
            title="بخش موردنظر خود را پیدا کنید"
            description="جستجو کنید یا همهٔ امکانات خانه وکلا را مرور کنید."
            className="mb-9"
          />
          <ServicesCatalog />
        </div>
      </section>
    </>
  );
}
