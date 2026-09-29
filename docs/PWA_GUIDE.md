# راهنمای PWA (Progressive Web App)

## اجزا
- `public/manifest.webmanifest` — **به‌صورت خودکار** توسط `scripts/generate-manifest.mjs` هنگام `npm run build` (از طریق hook استاندارد `prebuild`) از روی `site.config.mjs` ساخته می‌شود. این فایل را مستقیم ویرایش نکنید؛ چون هر build دوباره آن را می‌سازد و تغییرات دستی از بین می‌رود.
- `src/app/layout.tsx` — تگ `<link rel="manifest">` را با basePath درست به‌صورت دستی درج می‌کند (به دلیل یک باگ در Next.js 14.2.x که هنگام استفاده هم‌زمان از `output:'export'` و `basePath`، لینک خودکار manifest را بدون پیشوند basePath تولید می‌کند — برای جزئیت به کامنت بالای `scripts/generate-manifest.mjs` مراجعه کنید).
- `public/sw.js` — Service Worker خام (خارج از پایپ‌لاین build Next، مستقیم کپی می‌شود) با راهبرد Cache First برای App Shell/فایل‌های استاتیک و Network First برای ناوبری صفحات.
- `public/offline.html` — صفحهٔ بازگشتی وقتی کاربر آفلاین است و صفحهٔ درخواستی در کش نیست.
- `src/components/layout/ServiceWorkerRegister.tsx` — فقط در `production` (نه در `next dev`) service worker را ثبت می‌کند.

## انتشار نسخهٔ جدید
هر بار که محتوای صفحات یا فایل‌های استاتیک تغییر می‌کند و می‌خواهید کاربرانی
که نسخهٔ قبلی را کش کرده‌اند نسخهٔ جدید را ببینند، مقدار `CACHE_VERSION` در
`public/sw.js` را افزایش دهید (مثلاً `v1` → `v2`). این کار باعث می‌شود Service
Worker کش قدیمی را در فعال‌سازی نسخهٔ جدید پاک کند.

## تست نصب‌پذیری (Installability)
1. سایت را روی HTTPS واقعی باز کنید (GitHub Pages به‌صورت پیش‌فرض HTTPS دارد؛ در localhost با `http://localhost` هم Chrome معمولاً اجازه می‌دهد).
2. در Chrome DevTools → Application → Manifest، بررسی کنید:
   - `start_url` و `scope` باید `/Vokalahome/` باشند (نه `/`).
   - هیچ خطای «icon download error» ای نباید دیده شود.
3. در Application → Service Workers باید وضعیت «activated and is running» دیده شود.
4. دکمهٔ نصب (install) باید در نوار آدرس Chrome ظاهر شود.

## محدودیت‌های شناخته‌شده
- چون GitHub Pages هیچ هدر HTTP سفارشی (مثل `Cache-Control` دقیق یا Push
  notification server) را پشتیبانی نمی‌کند، اعلان Push واقعی (Web Push) در این
  معماری ممکن نیست؛ فقط کش آفلاین و نصب‌پذیری پشتیبانی می‌شود.
