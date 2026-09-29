// این اسکریپت پیش از هر build اجرا می‌شود (npm run prebuild) و
// public/manifest.webmanifest را از روی site.config.mjs می‌سازد.
//
// چرا به‌جای app/manifest.ts (قابلیت رسمی Next.js)؟
// در Next.js 14.2.x با output:'export' + basePath، تگ <link rel="manifest">
// که خودِ Next به‌صورت خودکار از app/manifest.ts می‌سازد، basePath را اعمال
// نمی‌کند (باگ مشابه باگ next/image بدون optimize که در همین پروژه پیدا و
// رفع شد). راه‌حل قابل‌اتکا: فایل استاتیک واقعی در public/ + <link> دستی
// در layout.tsx که هر دو از asset()/site.config.mjs پیروی می‌کنند.
import { writeFileSync } from 'node:fs';
import { BASE_PATH } from '../site.config.mjs';

// همیشه basePath واقعی (تولید/GitHub Pages) را می‌سازیم؛ در dev هم مرورگر با
// همین basePath از next.config.mjs هماهنگ می‌شود اگر NEXT_PUBLIC_FORCE_BASE_PATH نخواهید خاموشش کنید.
const base = BASE_PATH || '';

const manifest = {
  name: 'خانه وکلا | باشگاه تخصصی و کافه حقوقی وکلا',
  short_name: 'خانه وکلا',
  description: 'کافه و باشگاه تخصصی وکلا در قزوین؛ عضویت، اتاق‌های مشاوره و نشست‌های علمی.',
  start_url: `${base}/`,
  scope: `${base}/`,
  display: 'standalone',
  orientation: 'portrait-primary',
  background_color: '#F5F6F8',
  theme_color: '#0B1F3A',
  dir: 'rtl',
  lang: 'fa-IR',
  categories: ['business', 'lifestyle', 'food'],
  icons: [
    { src: `${base}/favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    { src: `${base}/icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `${base}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: `${base}/icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};

writeFileSync(new URL('../public/manifest.webmanifest', import.meta.url), JSON.stringify(manifest, null, 2));
console.log('✔ public/manifest.webmanifest generated with basePath =', JSON.stringify(base));
