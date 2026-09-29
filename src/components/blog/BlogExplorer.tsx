'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, Search, Star, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Picture } from '@/components/ui/Picture';
import { articleCategories, articleSearchIndex, articles } from '@/lib/data/articles';
import { cn, toEn, toFa } from '@/lib/utils';

/** نرمال‌سازی برای جستجوی فارسی: یکسان‌سازی ی/ک، حذف اعراب و ارقام فارسی. */
function normalize(value: string) {
  return toEn(value)
    .replace(/[\u064A\u0649]/g, 'ی')
    .replace(/\u0643/g, 'ک')
    .replace(/[\u064B-\u065F\u0670\u200C]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * فهرست وبلاگ با جستجوی زندهٔ سمت کلاینت و فیلتر دسته.
 *
 * ایندکس جستجو در زمان build از `articleSearchIndex` ساخته می‌شود (متن کامل
 * مطالب)، پس جستجو بدون هیچ درخواست شبکه‌ای کار می‌کند — دقیقاً چیزی که یک
 * سایت استاتیک روی GitHub Pages نیاز دارد.
 *
 * `useDeferredValue` تایپ کردن را روان نگه می‌دارد: ورودی بلافاصله به‌روز
 * می‌شود ولی فیلتر سنگین با کمی تأخیر و بدون پرش اجرا می‌شود.
 */
export function BlogExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('همه');
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const needle = normalize(deferredQuery);
    return articles.filter((article) => {
      if (category !== 'همه' && article.category !== category) return false;
      if (!needle) return true;
      const entry = articleSearchIndex.find((item) => item.slug === article.slug);
      return normalize(entry?.haystack ?? `${article.title} ${article.excerpt}`).includes(needle);
    });
  }, [deferredQuery, category]);

  const featured = results.filter((article) => article.featured);
  const rest = results.filter((article) => !article.featured);

  return (
    <div>
      {/* جستجو */}
      <div className="mb-5">
        <label className="relative block">
          <span className="sr-only">جستجو در مطالب وبلاگ</span>
          <Search
            size={18}
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو در عنوان و متن مطالب…"
            className="form-control h-14 pr-12 text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="پاک کردن جستجو"
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-ink-faint transition hover:bg-surface-3 hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </label>
      </div>

      {/* دسته‌بندی */}
      <div role="tablist" aria-label="دستهٔ مطالب" className="mb-8 flex flex-wrap gap-2">
        {articleCategories.map((item) => {
          const active = category === item;
          return (
            <button
              key={item}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(item)}
              className={cn(
                'min-h-11 rounded-xl border px-4 text-xs font-bold transition',
                active
                  ? 'border-gold-500 bg-gold-500 text-navy-900'
                  : 'border-line bg-surface text-ink-muted hover:border-gold-500 hover:text-gold-600',
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <p className="mb-6 text-xs text-ink-faint" aria-live="polite">
        {results.length > 0
          ? `${toFa(results.length)} مطلب یافت شد`
          : 'مطلبی با این جستجو پیدا نشد. عبارت دیگری را امتحان کنید.'}
      </p>

      {/* مطالب ویژه */}
      {featured.length > 0 && (
        <ul className="mb-6 grid gap-5 lg:grid-cols-2">
          {featured.map((article) => (
            <li key={article.slug}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lift">
                {article.image && (
                  <Picture
                    src={article.image}
                    alt=""
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="aspect-[16/9]"
                    imgClassName="transition duration-500 group-hover:scale-[1.04]"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="gold" icon={<Star size={11} aria-hidden />}>
                      مطلب ویژه
                    </Badge>
                    <Badge tone="neutral">{article.category}</Badge>
                  </div>
                  <h3 className="mt-3.5 text-lg font-black leading-[1.75] text-ink transition group-hover:text-gold-600">
                    <Link href={`/blog/${article.slug}/`} className="after:absolute after:inset-0">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-[1.95] text-ink-muted">{article.excerpt}</p>
                  <ArticleMeta date={article.date} readTime={article.readTime} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {/* بقیهٔ مطالب */}
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((article) => (
          <li key={article.slug}>
            <article className="group relative flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lift">
              <Badge tone="neutral" className="self-start">
                {article.category}
              </Badge>
              <h3 className="mt-3.5 text-base font-black leading-[1.75] text-ink transition group-hover:text-gold-600">
                <Link href={`/blog/${article.slug}/`} className="after:absolute after:inset-0">
                  {article.title}
                </Link>
              </h3>
              <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-[1.95] text-ink-muted">{article.excerpt}</p>
              <ArticleMeta date={article.date} readTime={article.readTime} />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArticleMeta({ date, readTime }: { date: string; readTime: string }) {
  return (
    <div className="mt-5 flex items-center gap-4 border-t border-line pt-4 text-[11px] text-ink-faint">
      <span className="flex items-center gap-1.5">
        <CalendarDays size={13} aria-hidden />
        {date}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock size={13} aria-hidden />
        {readTime}
      </span>
    </div>
  );
}
