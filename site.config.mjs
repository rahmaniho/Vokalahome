/**
 * تنظیمات پایه سایت — تک منبع حقیقت (Single Source of Truth)
 *
 * این فایل هم در next.config.mjs (زمان build) و هم در کد اپ (src/lib/constants.ts)
 * ایمپورت می‌شود تا basePath و آدرس سایت هرگز در دو جا به‌صورت جداگانه نوشته نشوند
 * و دچار ناهم‌خوانی (مثل باگ‌هایی که در این ویرایش رفع شد) نشوند.
 *
 * ⚠️ وقتی دامنه اختصاصی فعال شد (docs/CUSTOM_DOMAIN.md را ببینید):
 *   1) IS_CUSTOM_DOMAIN را true کنید
 *   2) CUSTOM_DOMAIN_URL را با دامنه واقعی پر کنید
 *   3) فایل public/CNAME را با همان دامنه بسازید
 * تا basePath به‌صورت خودکار خالی شود و همه لینک‌ها روی ریشه دامنه کار کنند.
 */

// آیا دامنه اختصاصی فعال شده؟ فعلاً false — فقط GitHub Pages زیرمسیر
export const IS_CUSTOM_DOMAIN = false;

// نام مخزن گیت‌هاب = زیرمسیر انتشار در GitHub Pages
export const REPO_BASE_PATH = '/Vokalahome';

// آدرس دامنه اختصاصی (در آینده) — فعلاً غیرفعال و بدون اقدام
export const CUSTOM_DOMAIN_URL = 'https://vokalahome.com';

// آدرس فعلی و واقعی GitHub Pages (مبنای canonical/og:url تا وقتی دامنه اختصاصی نیامده)
export const GITHUB_PAGES_URL = 'https://rahmaniho.github.io/Vokalahome';

export const BASE_PATH = IS_CUSTOM_DOMAIN ? '' : REPO_BASE_PATH;
export const SITE_URL = IS_CUSTOM_DOMAIN ? CUSTOM_DOMAIN_URL : GITHUB_PAGES_URL;
