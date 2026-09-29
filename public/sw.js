/**
 * Service Worker — خانه وکلا
 * -------------------------------------------------------------------
 * این فایل به‌صورت خام (نه build‌شده) در public/ قرار دارد تا Next آن
 * را بدون تغییر در ریشهٔ خروجی کپی کند و مرورگر بتواند آن را دقیقاً از
 * scope فعلی (مثلاً /Vokalahome/sw.js) اجرا کند.
 *
 * راهبرد کش:
 *  - App Shell (صفحات HTML اصلی + آیکون‌ها + مانیفست): Cache First با به‌روزرسانی پس‌زمینه
 *  - فایل‌های استاتیک Next (_next/static/...): Cache First (اسم فایل‌ها hash دارد، تغییر نمی‌کنند)
 *  - ناوبری بین صفحات: Network First با بازگشت به کش و در نهایت offline.html
 *
 * برای انتشار نسخهٔ جدید سایت، فقط کافی است CACHE_VERSION را افزایش دهید
 * تا کش قبلی به‌طور خودکار باطل شود (به docs/PWA_GUIDE.md مراجعه کنید).
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `khane-vokala-${CACHE_VERSION}`;

// scope فعلی SW برابر basePath سایت است؛ از آن برای ساخت مسیر offline استفاده می‌کنیم
const SCOPE_PATH = new URL(self.registration ? self.registration.scope : self.location.href).pathname;
const OFFLINE_URL = `${SCOPE_PATH}offline.html`.replace(/\/+/g, '/');

const PRECACHE_URLS = [
  SCOPE_PATH,
  OFFLINE_URL,
  `${SCOPE_PATH}favicon.svg`.replace(/\/+/g, '/'),
  `${SCOPE_PATH}manifest.webmanifest`.replace(/\/+/g, '/'),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // فقط منابع هم‌مبدأ

  // ۱) ناوبری صفحات HTML: Network First + fallback به کش/آفلاین
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL)))
    );
    return;
  }

  // ۲) فایل‌های استاتیک با hash (تغییرناپذیر) و تصاویر: Cache First
  if (url.pathname.includes('/_next/static/') || request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  // ۳) بقیه درخواست‌ها: Network First ساده با کش پشتیبان
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
