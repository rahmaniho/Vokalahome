import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, Clock3, Quote, Tag, UserRound } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Picture } from '@/components/ui/Picture';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { ShareButtons } from '@/components/interactive/ShareButtons';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { articles, getArticle } from '@/lib/data/articles';
import { articleSchema, buildMetadata, JsonLd } from '@/lib/seo';
import { slugifyHeading } from '@/lib/utils';

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return buildMetadata({ title: 'مطلب یافت نشد', description: '', path: '/blog/', noIndex: true });

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}/`,
    image: article.image,
    keywords: [article.category, ...article.tags],
    type: 'article',
    publishedTime: article.isoDate,
  });
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  // شناسهٔ هر سرفصل یک‌بار ساخته می‌شود تا فهرست مطالب و خود تیترها هماهنگ بمانند.
  const sections = article.sections.map((section, index) => ({
    ...section,
    id: slugifyHeading(section.heading, index),
  }));
  const toc = sections.map((section) => ({ id: section.id, label: section.heading }));

  const related = articles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);
  const others =
    related.length > 0 ? related : articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={articleSchema({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          author: article.author,
          datePublished: article.isoDate,
          category: article.category,
          image: article.image,
        })}
      />

      <PageHero
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
        crumbs={[
          { label: 'وبلاگ', href: '/blog/' },
          { label: article.title, href: `/blog/${article.slug}/` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-5 text-xs text-white/55">
          <span className="flex items-center gap-1.5">
            <UserRound size={14} className="text-gold-400" aria-hidden />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-gold-400" aria-hidden />
            <time dateTime={article.isoDate}>{article.date}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 size={14} className="text-gold-400" aria-hidden />
            {article.readTime} مطالعه
          </span>
        </div>
      </PageHero>

      <article className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
          {/* متن مطلب */}
          <div className="min-w-0">
            {article.image && (
              <Picture
                src={article.image}
                alt=""
                sizes="(max-width: 1024px) 100vw, 720px"
                priority
                className="mb-10 rounded-[2rem] border border-line"
              />
            )}

            <div className="prose-fa">
              {sections.map((section) => (
                <section key={section.id}>
                  <h2 id={section.id} className="scroll-mt-28">
                    {section.heading}
                  </h2>

                  {section.blocks.map((block, index) => {
                    if (block.type === 'paragraph') return <p key={index}>{block.text}</p>;

                    if (block.type === 'list')
                      return (
                        <ul key={index}>
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      );

                    return (
                      <blockquote key={index}>
                        <Quote size={18} className="mb-2 text-gold-500" aria-hidden />
                        <p>{block.text}</p>
                        {block.source && <cite>{block.source}</cite>}
                      </blockquote>
                    );
                  })}
                </section>
              ))}
            </div>

            <Alert tone="warning" className="mt-10">
              این مطلب عمومی و آموزشی است و جایگزین مشاورهٔ حقوقی موردی نیست. برای تصمیم‌گیری دربارهٔ پروندهٔ خود حتماً
              با وکیل مشورت کنید.
            </Alert>

            {/* برچسب‌ها و اشتراک */}
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-7">
              <Tag size={15} className="text-ink-faint" aria-hidden />
              {article.tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-6">
              <ShareButtons title={article.title} path={`/blog/${article.slug}/`} />
            </div>
          </div>

          {/* ستون کناری */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <TableOfContents items={toc} />

            <div className="rounded-3xl border border-gold-500/25 bg-gold-500/[.06] p-6">
              <h2 className="text-sm font-black text-ink">پرسشی دربارهٔ همین موضوع دارید؟</h2>
              <p className="mt-2.5 text-xs leading-[1.95] text-ink-muted">
                وکلای عضو خانه وکلا در همهٔ حوزه‌های اصلی حقوقی آمادهٔ مشاوره‌اند.
              </p>
              <Button href="/consultation/" variant="gold" className="mt-5 w-full" arrow>
                رزرو وقت مشاوره
              </Button>
            </div>
          </aside>
        </div>
      </article>

      {/* مطالب مرتبط */}
      {others.length > 0 && (
        <section className="section-space bg-surface-2">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionTitle eyebrow="ادامه بدهید" title="مطالب مرتبط" />
              <Link
                href="/blog/"
                className="inline-flex min-h-11 items-center text-sm font-black text-ink transition hover:text-gold-600"
              >
                همهٔ مطالب
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <ArticleCard article={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
