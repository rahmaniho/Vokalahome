import type { Metadata } from 'next';
import { Rss, ScrollText } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { articles, articleCategories } from '@/lib/data/articles';
import { buildMetadata } from '@/lib/seo';
import { withBase } from '@/lib/site';
import { toFa } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'وبلاگ حقوقی | خلاصهٔ پرونده، نکات کاربردی و اخبار حقوقی',
  description:
    'مطالب حقوقی خانه وکلا: چک‌لیست قراردادها، نکات ملکی، راهنمای مشاورهٔ خانواده و تحلیل رویهٔ قضایی — به زبان ساده و قابل استفاده.',
  path: '/blog/',
  keywords: ['وبلاگ حقوقی', 'مقاله حقوقی', 'نکات قرارداد', 'مشاوره حقوقی قزوین'],
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="وبلاگ حقوقی"
        title={
          <>
            دانش حقوقی،
            <br />
            <span className="text-gold-400">به زبان قابل فهم</span>
          </>
        }
        description="خلاصهٔ پرونده‌ها، نکات کاربردی و اخبار حقوقی؛ نوشته‌هایی که هم برای همکار وکیل مفید است و هم برای موکل قابل فهم."
        crumbs={[{ label: 'وبلاگ', href: '/blog/' }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-white/55">
            <ScrollText size={15} className="text-gold-400" aria-hidden />
            {toFa(articles.length)} مطلب در {toFa(articleCategories.length - 1)} دسته
          </span>
          <a
            href={withBase('/rss.xml')}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-bold text-white transition hover:border-gold-400 hover:text-gold-400"
          >
            <Rss size={14} aria-hidden />
            فید RSS
          </a>
        </div>
      </PageHero>

      <section className="section-space">
        <div className="container-shell">
          <BlogExplorer />
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container-shell mx-auto max-w-3xl">
          <Alert tone="warning" title="یادآوری مهم">
            مطالب این وبلاگ عمومی و آموزشی‌اند و جایگزین مشاورهٔ حقوقی موردی نیستند. هر پرونده جزئیات خاص خود را دارد؛
            پیش از هر تصمیم، با وکیل مشورت کنید.
          </Alert>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/contact/" variant="gold" arrow>
              پرسش حقوقی خود را بپرسید
            </Button>
            <Button href="/consultation/" variant="outline">
              رزرو وقت مشاوره
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
