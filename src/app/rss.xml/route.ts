import { articles } from '@/lib/data/articles';
import { SITE } from '@/lib/constants';
import { SITE_URL } from '@/lib/basePath';

// در output:'export' باید صراحتاً استاتیک اعلام شود تا در build به فایل rss.xml تبدیل شود.
export const dynamic = 'force-static';

// نگاشت ساده‌ی نام ماه‌های شمسی برای تبدیل تاریخ نمایشی به تاریخ RFC-822 (تقریبی، فقط برای pubDate فید)
const JALALI_MONTHS: Record<string, number> = {
  فروردین: 0, اردیبهشت: 1, خرداد: 2, تیر: 3, مرداد: 4, شهریور: 5,
  مهر: 6, آبان: 7, آذر: 8, دی: 9, بهمن: 10, اسفند: 11,
};

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function approximateDate(jalaliDate: string): Date {
  // مثال ورودی: «۱۸ شهریور ۱۴۰۴» — تبدیل ارقام فارسی به انگلیسی و استخراج ماه
  const fa2en = jalaliDate.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  const monthName = Object.keys(JALALI_MONTHS).find((m) => fa2en.includes(m));
  const monthIndex = monthName ? JALALI_MONTHS[monthName] : 0;
  const yearMatch = fa2en.match(/1[34]\d{2}/);
  const jYear = yearMatch ? parseInt(yearMatch[0], 10) : 1404;
  // تخمین سادهٔ گریگوری: هر سال شمسی تقریباً ۲۱ مارس شروع می‌شود
  const approxGregorianYear = jYear + 621;
  return new Date(Date.UTC(approxGregorianYear, (monthIndex + 2) % 12, 15));
}

export async function GET() {
  const items = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/articles/${article.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${article.slug}/</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <author>${escapeXml(article.author)}</author>
      <category>${escapeXml(article.category)}</category>
      <pubDate>${approximateDate(article.date).toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.legalName)}</title>
    <link>${SITE_URL}/</link>
    <description>دانش‌نامه حقوقی خانه وکلا؛ خلاصه آرا، نکات کاربردی و اخبار حقوقی.</description>
    <language>fa-IR</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
