/**
 * فایل‌های استاتیکی که *قبل* از build ساخته می‌شوند و باید در پوشهٔ public باشند
 * تا Next آن‌ها را عیناً به خروجی کپی کند.
 *
 *   public/manifest.webmanifest   → مانیفست PWA با scope و start_url زیرمسیر
 *   public/robots.txt             → با آدرس درست sitemap
 *   public/offline.html           → صفحهٔ آفلاین، HTML خالص و مستقل از Next
 *
 * همهٔ مسیرها از متغیر محیطی NEXT_PUBLIC_BASE_PATH می‌آیند، پس با تغییر
 * زیرمسیر (یا مهاجرت به دامنهٔ اختصاصی) به‌صورت خودکار درست می‌مانند.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Vokalahome';
const BASE = rawBase && rawBase !== '/' ? `/${rawBase.replace(/^\/+|\/+$/g, '')}` : '';
const ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://rahmaniho.github.io').replace(/\/+$/, '');
const SITE_URL = `${ORIGIN}${BASE}`;

const write = (relative, content) => {
  const target = resolve(root, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
  console.log('✓', relative);
};

/* ───────────────────────────── manifest.webmanifest ───────────────────────────── */

const manifest = {
  name: 'خانه وکلا — باشگاه تخصصی و کافهٔ حقوقی وکلا',
  short_name: 'خانه وکلا',
  description:
    'کافه و باشگاه تخصصی وکلا در قزوین: اتاق‌های مشاوره، نشست‌های علمی، عضویت حرفه‌ای و کتابخانهٔ حقوقی.',
  lang: 'fa-IR',
  dir: 'rtl',
  // نکتهٔ کلیدی GitHub Pages: هر دو مقدار باید زیرمسیر انتشار باشند،
  // وگرنه نصب PWA در ریشهٔ دامنه شکست می‌خورد.
  start_url: `${BASE}/`,
  scope: `${BASE}/`,
  id: `${BASE}/`,
  display: 'standalone',
  display_override: ['standalone', 'minimal-ui'],
  orientation: 'portrait-primary',
  background_color: '#0B1F3A',
  theme_color: '#0B1F3A',
  categories: ['business', 'productivity', 'education'],
  icons: [
    { src: `${BASE}/icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `${BASE}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: `${BASE}/icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    {
      name: 'رزرو اتاق مشاوره',
      short_name: 'رزرو اتاق',
      url: `${BASE}/rooms/`,
      icons: [{ src: `${BASE}/icons/icon-192.png`, sizes: '192x192' }],
    },
    {
      name: 'پلن‌های عضویت',
      short_name: 'عضویت',
      url: `${BASE}/membership/`,
      icons: [{ src: `${BASE}/icons/icon-192.png`, sizes: '192x192' }],
    },
    {
      name: 'تقویم رویدادها',
      short_name: 'رویدادها',
      url: `${BASE}/events/`,
      icons: [{ src: `${BASE}/icons/icon-192.png`, sizes: '192x192' }],
    },
  ],
};

write('public/manifest.webmanifest', JSON.stringify(manifest, null, 2));

/* ──────────────────────────────── robots.txt ──────────────────────────────── */

write(
  'public/robots.txt',
  `# خانه وکلا — ${SITE_URL}
User-agent: *
Allow: /

# صفحهٔ آفلاین PWA نباید ایندکس شود
Disallow: ${BASE}/offline.html

Sitemap: ${SITE_URL}/sitemap.xml
`,
);

/* ──────────────────────────────── offline.html ────────────────────────────────
   HTML کاملاً مستقل: نه به فونت خارجی وابسته است، نه به CSS یا JS پروژه.
   وقتی کاربر آفلاین است و صفحه در کش نیست، Service Worker همین را نشان می‌دهد. */

write(
  'public/offline.html',
  `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#0B1F3A">
<title>اتصال اینترنت برقرار نیست | خانه وکلا</title>
<link rel="icon" href="${BASE}/favicon.svg" type="image/svg+xml">
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100dvh; display: grid; place-items: center; padding: 24px;
    background: #0B1F3A;
    background-image:
      radial-gradient(circle at 18% 12%, rgba(201,162,39,.16), transparent 55%),
      radial-gradient(circle at 82% 88%, rgba(123,75,42,.18), transparent 55%);
    color: #ECF0F7;
    font-family: Vazirmatn, Tahoma, system-ui, sans-serif;
    text-align: center;
  }
  .box { max-width: 460px; }
  .mark {
    width: 84px; height: 84px; margin: 0 auto 26px; display: grid; place-items: center;
    border-radius: 22px; background: #C9A227; color: #0B1F3A;
  }
  h1 { margin: 0 0 12px; font-size: 26px; font-weight: 900; letter-spacing: -.02em; }
  p { margin: 0 0 10px; font-size: 14px; line-height: 2; color: rgba(236,240,247,.62); }
  .actions { display: flex; flex-direction: column; gap: 10px; margin-top: 26px; }
  a, button {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 48px; padding: 0 22px; border-radius: 13px;
    font: inherit; font-size: 14px; font-weight: 800; text-decoration: none; cursor: pointer;
    transition: .2s;
  }
  .primary { background: #C9A227; color: #0B1F3A; border: 0; }
  .primary:hover { background: #D8B84E; }
  .ghost { background: rgba(255,255,255,.07); color: #ECF0F7; border: 1px solid rgba(255,255,255,.16); }
  .ghost:hover { background: rgba(255,255,255,.13); }
  .cached { margin-top: 30px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.1); }
  .cached strong { display: block; margin-bottom: 12px; font-size: 12px; color: #C9A227; letter-spacing: .06em; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
  .chips a { min-height: 40px; padding: 0 14px; font-size: 12px; font-weight: 700;
             background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); color: rgba(236,240,247,.8); }
  .note { margin-top: 22px; font-size: 11px; color: rgba(236,240,247,.4); }
  @media (min-width: 420px) { .actions { flex-direction: row; justify-content: center; } }
</style>
</head>
<body>
  <main class="box">
    <div class="mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor"
           stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 27.5 32 6l27 21.5"/><path d="M12.5 28.5V57h39V28.5"/><path d="M10 57h44"/>
        <path d="M32 28v4.2"/><path d="M18.5 32.2h27"/>
        <path d="M14.6 32.2q3.9 7.4 7.8 0"/><path d="M42.1 32.2q3.9 7.4 7.8 0"/>
        <path d="M24.6 41.6h14.2v5.6a7.1 7.1 0 0 1-14.2 0z"/><path d="M38.8 43.2h2.3a3.3 3.3 0 0 1 0 6.6h-2.3"/>
      </svg>
    </div>

    <h1>فعلاً آفلاین هستید</h1>
    <p>اتصال اینترنت شما قطع شده و این صفحه در حافظهٔ مرورگر ذخیره نشده بود.</p>
    <p>صفحاتی که قبلاً باز کرده‌اید همچنان بدون اینترنت در دسترس‌اند.</p>

    <div class="actions">
      <button class="primary" onclick="location.reload()">تلاش دوباره</button>
      <a class="ghost" href="${BASE}/">صفحهٔ نخست</a>
    </div>

    <div class="cached">
      <strong>دسترسی سریع</strong>
      <div class="chips">
        <a href="${BASE}/rooms/">اتاق‌های مشاوره</a>
        <a href="${BASE}/membership/">عضویت</a>
        <a href="${BASE}/events/">رویدادها</a>
        <a href="${BASE}/contact/">تماس</a>
      </div>
    </div>

    <p class="note">خانه وکلا · قزوین، خیابان خیام جنوبی · ۰۲۸-۳۳۲۲۲۲۲۲</p>
  </main>

  <script>
    // به‌محض برگشت اینترنت، خودکار دوباره تلاش کن.
    addEventListener('online', function () { location.reload(); });
  </script>
</body>
</html>
`,
);

console.log('\nفایل‌های استاتیک پیش از build آماده شد.  basePath =', BASE || '(ریشه)');
