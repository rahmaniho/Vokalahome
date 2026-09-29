/**
 * منبع واحد حقیقت برای آدرس‌ها.
 * ---------------------------------------------------------------------------
 * سایت امروز روی GitHub Pages و در زیرمسیر /Vokalahome/ منتشر می‌شود.
 * فردا که دامنه اختصاصی فعال شود کافی است دو متغیر محیطی زیر تغییر کنند و
 * حتی یک خط از کد صفحات دست نخورد:
 *
 *   NEXT_PUBLIC_SITE_URL=https://vokalahome.com
 *   NEXT_PUBLIC_BASE_PATH=
 *
 * قاعده طلایی پروژه: هیچ‌جا آدرس مطلق ننویسید. همیشه از withBase/absoluteUrl.
 */

/** ریشه انتشار بدون اسلش پایانی — مثال: https://rahmaniho.github.io */
const RAW_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://rahmaniho.github.io';

/** زیرمسیر انتشار با اسلش ابتدایی و بدون اسلش پایانی — مثال: /Vokalahome */
const RAW_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Vokalahome';

const trimEnd = (value: string) => value.replace(/\/+$/, '');
const trimStart = (value: string) => value.replace(/^\/+/, '');

/** مبدأ سایت، بدون اسلش پایانی. */
export const SITE_ORIGIN = trimEnd(RAW_ORIGIN);

/** زیرمسیر (basePath) نرمال‌شده: یا رشته خالی، یا چیزی مثل «/Vokalahome». */
export const BASE_PATH = RAW_BASE && RAW_BASE !== '/' ? `/${trimStart(trimEnd(RAW_BASE))}` : '';

/** آدرس کامل ریشه سایت بدون اسلش پایانی — مثال: https://rahmaniho.github.io/Vokalahome */
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

/**
 * مسیر داخلی را با زیرمسیر انتشار ترکیب می‌کند.
 * فقط برای چیزهایی لازم است که Next خودش basePath را به آن‌ها اضافه نمی‌کند:
 * محتوای فایل manifest، service worker، JSON-LD، لینک‌های داخل HTML خام و ... .
 * برای `<Link href>` و `<Image src>` نیازی به این تابع نیست؛ Next خودکار انجام می‌دهد.
 */
export function withBase(path = '/'): string {
  if (/^(https?:)?\/\//.test(path) || /^(mailto|tel|data|blob):/.test(path)) return path;
  const normalized = path === '/' ? '/' : `/${trimStart(path)}`;
  return `${BASE_PATH}${normalized}` || '/';
}

/** آدرس مطلق و کنونیکال یک مسیر داخلی. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path === '/' ? '/' : `/${trimStart(path)}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * کنونیکال استاندارد پروژه: همیشه با اسلش پایانی (چون trailingSlash روشن است)
 * تا GitHub Pages و موتورهای جستجو نسخه تکراری نبینند.
 */
export function canonicalUrl(path = '/'): string {
  const absolute = absoluteUrl(path);
  if (absolute.includes('#') || absolute.includes('?')) return absolute;
  return absolute.endsWith('/') ? absolute : `${absolute}/`;
}
