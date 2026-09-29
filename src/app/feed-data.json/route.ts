import { articles } from '@/lib/data/articles';

/**
 * دادهٔ خام فید RSS.
 *
 * چرا اینجا و نه مستقیم در اسکریپت postbuild؟ چون مطالب در TypeScript
 * تعریف شده‌اند و اسکریپت Node نمی‌تواند بدون کامپایل آن‌ها را بخواند.
 * این Route Handler در زمان build اجرا و به فایل `out/feed-data.json`
 * تبدیل می‌شود؛ سپس `scripts/postbuild.mjs` آن را می‌خواند، `rss.xml`
 * را می‌سازد و همین فایل موقت را پاک می‌کند.
 *
 * `force-static` الزامی است: در حالت `output: export` هیچ کد سمت سروری
 * اجرا نمی‌شود و همه چیز باید در زمان build ثابت شود.
 */
export const dynamic = 'force-static';

export function GET() {
  const items = articles
    // تازه‌ترین مطلب اول
    .slice()
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1))
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      pubDate: article.isoDate,
    }));

  return Response.json(items);
}
