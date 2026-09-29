import type { Metadata } from 'next';
import { RedirectStub } from '@/components/layout/RedirectStub';
import { articles, getArticle } from '@/lib/data/articles';
import { canonicalUrl } from '@/lib/site';

/** همان اسلاگ‌های وبلاگ، تا هر لینک قدیمی ایندکس‌شده هم صفحهٔ انتقال داشته باشد. */
export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  return {
    title: article ? `انتقال به ${article.title}` : 'انتقال به وبلاگ',
    robots: { index: false, follow: true },
    alternates: { canonical: canonicalUrl(`/blog/${params.slug}/`) },
  };
}

export default function ArticleRedirectPage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  return <RedirectStub to={`/blog/${params.slug}/`} label={article ? `«${article.title}»` : 'وبلاگ'} />;
}
