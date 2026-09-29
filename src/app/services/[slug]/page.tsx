import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, Clock3, Coins, Scale } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { getService, services } from '@/lib/data/services';
import { articles } from '@/lib/data/articles';
import { buildMetadata } from '@/lib/seo';
import { toFa } from '@/lib/utils';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return buildMetadata({ title: 'خدمت یافت نشد', description: '', path: '/services/', noIndex: true });

  return buildMetadata({
    title: `${service.title} | خدمات خانه وکلا`,
    description: service.description,
    path: `/services/${service.slug}/`,
    keywords: [service.shortTitle, ...service.subservices.slice(0, 4)],
  });
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`خدمات · ${service.shortTitle}`}
        title={
          <>
            {service.title}
            <br />
            <span className="text-gold-400">در خانه وکلا</span>
          </>
        }
        description={service.description}
        crumbs={[
          { label: 'خدمات', href: '/services/' },
          { label: service.shortTitle, href: `/services/${service.slug}/` },
        ]}
      />

      {/* معرفی + جعبهٔ کناری */}
      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <article className="min-w-0">
            <SectionTitle eyebrow="معرفی" title="این بخش چگونه کار می‌کند؟" />
            <div className="prose-fa mt-6">
              <p>{service.longDescription}</p>
            </div>

            <h2 className="mt-12 text-xl font-black text-ink sm:text-2xl">آنچه در این بخش دارید</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.subservices.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-sm font-bold text-ink"
                >
                  <Check className="shrink-0 text-emerald-600" size={18} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside className="h-fit rounded-3xl bg-navy-900 p-6 text-white lg:sticky lg:top-24">
            <Scale className="text-gold-500" aria-hidden />
            <h2 className="mt-4 text-lg font-black">استفاده از این بخش</h2>
            <p className="mt-3 text-xs leading-[1.95] text-white/55">
              اعضا رایگان یا با تخفیف استفاده می‌کنند؛ مهمانان بر اساس تعرفهٔ اعلام‌شده.
            </p>

            <dl className="my-5 space-y-3 border-y border-white/10 py-5 text-xs">
              <div className="flex items-center gap-2">
                <Clock3 className="shrink-0 text-gold-500" size={16} aria-hidden />
                <dt className="sr-only">زمان‌بندی</dt>
                <dd>{service.duration}</dd>
              </div>
              <div className="flex items-start gap-2">
                <Coins className="mt-0.5 shrink-0 text-gold-500" size={16} aria-hidden />
                <dt className="sr-only">تعرفه</dt>
                <dd className="leading-[1.85]">{service.fee}</dd>
              </div>
            </dl>

            <Button href="/membership/" className="w-full">
              عضویت در خانه
            </Button>
            <Button href="/consultation/" variant="light" className="mt-2.5 w-full">
              رزرو و هماهنگی
            </Button>
          </aside>
        </div>
      </section>

      {/* پیش‌نیاز و گام‌ها */}
      <section className="section-space bg-surface-2">
        <div className="container-shell grid gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionTitle eyebrow="پیش‌نیازها" title="برای استفاده لازم است" />
            <ul className="mt-8 space-y-3">
              {service.documents.map((item, index) => (
                <li key={item} className="flex items-center gap-4 rounded-2xl bg-surface p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold-500/12 text-xs font-black text-gold-600 dark:text-gold-400">
                    {toFa(String(index + 1).padStart(2, '0'))}
                  </span>
                  <span className="text-sm font-bold text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle eyebrow="گام‌به‌گام" title="نحوهٔ استفاده" />
            <ol className="mt-8">
              {service.steps.map((item, index) => (
                <li key={item} className="relative flex gap-4 pb-8 last:pb-0">
                  {index < service.steps.length - 1 && (
                    <i aria-hidden className="absolute right-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-gold-500/25" />
                  )}
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-black text-gold-400 dark:bg-navy-800">
                    {toFa(index + 1)}
                  </span>
                  <div className="pt-2">
                    <h3 className="text-sm font-black text-ink">{item}</h3>
                    <p className="mt-2 text-xs leading-[1.95] text-ink-muted">
                      در این مرحله همکاران پذیرش خانه وکلا همراه شما هستند.
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* خدمات دیگر */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle eyebrow="ادامه بدهید" title="خدمات دیگر خانه" />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((item, index) => (
              <li key={item.slug}>
                <ServiceCard service={item} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* مطالب مرتبط */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle eyebrow="مطالعهٔ بیشتر" title="مطالب مرتبط و کاربردی" />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
