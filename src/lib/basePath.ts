import { BASE_PATH, SITE_URL, IS_CUSTOM_DOMAIN } from '../../site.config.mjs';

/**
 * چرا این فایل لازم است؟
 * ------------------------------------------------------------------
 * next/image و <img> ساده، وقتی src به‌صورت رشتهٔ خام («/images/x.jpg»)
 * داده شود و images.unoptimized=true باشد، در Next 14 با output:'export'
 * پیشوند basePath را خودکار اضافه نمی‌کنند (باگ شناخته‌شدهٔ Next روی
 * تصاویر بدون بهینه‌سازی). در audit این پروژه، دقیقاً همین باگ باعث
 * ۴۰۴ شدن favicon، og-image و همهٔ تصاویر next/image روی نسخهٔ منتشر شده
 * در GitHub Pages بود.
 *
 * راه‌حل: همیشه مسیرهای استاتیک عمومی (public/) را از طریق asset()
 * بسازید، نه با رشتهٔ خام.
 */
export { BASE_PATH, SITE_URL, IS_CUSTOM_DOMAIN };

/** مسیر یک فایل داخل public/ را با پیشوند basePath درست می‌کند. مثال: asset('/images/hero/x.jpg') */
export function asset(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}

/** آدرس کامل و مطلق یک صفحه/فایل را برمی‌گرداند؛ برای canonical، og:url، JSON-LD و sitemap. */
export function absoluteUrl(path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  // از تکرار اسلش جلوگیری می‌کند وقتی path خودش با basePath شروع شده باشد
  return `${SITE_URL}${clean === '/' ? '/' : clean}`.replace(/([^:]\/)\/+/g, '$1');
}
