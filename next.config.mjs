/**
 * پیکربندی Next.js برای انتشار کاملاً استاتیک روی GitHub Pages.
 *
 * زیرمسیر انتشار از متغیر محیطی خوانده می‌شود تا مهاجرت به دامنه اختصاصی
 * در آینده فقط یک تغییر پیکربندی باشد، نه بازنویسی کد:
 *
 *   # امروز (GitHub Pages، زیرمسیر)
 *   NEXT_PUBLIC_BASE_PATH=/Vokalahome
 *   NEXT_PUBLIC_SITE_ORIGIN=https://rahmaniho.github.io
 *
 *   # فردا (دامنه اختصاصی، ریشه)
 *   NEXT_PUBLIC_BASE_PATH=
 *   NEXT_PUBLIC_SITE_ORIGIN=https://vokalahome.com
 */

const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Vokalahome';
const basePath = rawBase && rawBase !== '/' ? `/${rawBase.replace(/^\/+|\/+$/g, '')}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ۱) خروجی کاملاً استاتیک؛ هیچ کد سمت سروری اجرا نمی‌شود.
  output: 'export',

  // ۲) بهینه‌ساز تصویر Next به سرور نیاز دارد، پس خاموش است.
  //    بهینه‌سازی به‌جای آن در زمان build با اسکریپت scripts/optimize-images.mjs انجام می‌شود.
  images: { unoptimized: true },

  // ۳) زیرمسیر انتشار. Next خودش این را به <Link>، <Image> و همه asset‌ها اضافه می‌کند.
  basePath,
  assetPrefix: basePath || undefined,

  // ۴) هر صفحه به‌صورت پوشه/index.html تولید می‌شود تا روی GitHub Pages
  //    (که rewrite ندارد) بدون ۴۰۴ کار کند.
  trailingSlash: true,

  // ۵) کاهش حجم باندل: ایمپورت آیکون‌ها به‌صورت ماژولار tree-shake می‌شود.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // ۶) حذف console.log در نسخه production (به‌جز خطا و هشدار).
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
