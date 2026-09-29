/**
 * مرحلهٔ پس از build — روی پوشهٔ خروجی `out/` کار می‌کند.
 *
 *   out/.nojekyll     جلوگیری از پردازش Jekyll در GitHub Pages
 *                     (بدون آن، پوشهٔ _next/ نادیده گرفته می‌شود و سایت بی‌استایل می‌ماند)
 *   out/sitemap.xml   از روی صفحاتی که واقعاً تولید شده‌اند
 *   out/rss.xml       فید وبلاگ
 *   out/sw.js         Service Worker با فهرست precache واقعی
 *   بررسی سلامت       هشدار برای لینک‌های مطلقی که زیرمسیر را نادیده گرفته‌اند
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'out');

if (!existsSync(OUT)) {
  console.error('✗ پوشهٔ out/ پیدا نشد. اول `next build` را اجرا کنید.');
  process.exit(1);
}

const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Vokalahome';
const BASE = rawBase && rawBase !== '/' ? `/${rawBase.replace(/^\/+|\/+$/g, '')}` : '';
const ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://rahmaniho.github.io').replace(/\/+$/, '');
const SITE_URL = `${ORIGIN}${BASE}`;

/* ─────────────────────────────── ابزارهای کمکی ─────────────────────────────── */

const walk = (dir, list = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
};

const allFiles = walk(OUT);
const toUrlPath = (absolute) => '/' + relative(OUT, absolute).split(sep).join('/');

/* ─────────────────────────────────  .nojekyll ───────────────────────────────── */

writeFileSync(join(OUT, '.nojekyll'), '');
console.log('✓ out/.nojekyll');

/* ───────────────────────────────── sitemap.xml ─────────────────────────────────
   از روی فایل‌های index.html واقعی ساخته می‌شود، نه یک فهرست دستی؛
   پس هیچ صفحه‌ای جا نمی‌ماند و هیچ آدرس مرده‌ای هم وارد نمی‌شود. */

const PRIORITY = [
  [/^\/$/, 1.0, 'weekly'],
  [/^\/(membership|rooms)\/$/, 0.95, 'weekly'],
  [/^\/(services|events|blog)\/$/, 0.9, 'weekly'],
  [/^\/(about|contact|gallery|lawyers)\/$/, 0.8, 'monthly'],
  [/^\/(services|events)\//, 0.75, 'monthly'],
  [/^\/blog\//, 0.7, 'monthly'],
  [/^\/(faq|consultation)\/$/, 0.7, 'monthly'],
  [/^\/lawyers\//, 0.6, 'monthly'],
  [/^\/(privacy|terms|disclaimer|style-guide)\/$/, 0.3, 'yearly'],
];

const rank = (path) => {
  for (const [pattern, priority, changefreq] of PRIORITY) {
    if (pattern.test(path)) return { priority, changefreq };
  }
  return { priority: 0.5, changefreq: 'monthly' };
};

const today = new Date().toISOString().slice(0, 10);

const pages = allFiles
  .filter((file) => file.endsWith(`${sep}index.html`))
  .map((file) => toUrlPath(file).replace(/index\.html$/, ''))
  // صفحهٔ ۴۰۴ و صفحات noindex نباید در نقشهٔ سایت باشند.
  .filter((path) => !path.startsWith('/404'))
  .sort();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((path) => {
    const { priority, changefreq } = rank(path);
    return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

writeFileSync(join(OUT, 'sitemap.xml'), sitemap);
console.log(`✓ out/sitemap.xml (${pages.length} آدرس)`);

/* ────────────────────────────────── rss.xml ──────────────────────────────────
   فید وبلاگ از همان دادهٔ مقالات ساخته می‌شود. چون دادهٔ مقالات TypeScript است،
   اینجا از فایل JSON که در زمان build کنار خروجی نوشته شده استفاده می‌کنیم. */

const feedDataPath = join(OUT, 'feed-data.json');
let feedItems = [];
if (existsSync(feedDataPath)) {
  try {
    feedItems = JSON.parse(readFileSync(feedDataPath, 'utf8'));
  } catch {
    console.warn('⚠ feed-data.json خوانده نشد؛ فید بدون آیتم ساخته می‌شود.');
  }
}

const escapeXml = (value = '') =>
  String(value).replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>وبلاگ حقوقی خانه وکلا</title>
    <link>${SITE_URL}/blog/</link>
    <description>یادداشت‌ها، خلاصهٔ آرا و نکات کاربردی برای وکلا و مراجعان — خانه وکلا، قزوین.</description>
    <language>fa-IR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${feedItems
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${SITE_URL}/blog/${item.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${item.slug}/</guid>
      <description>${escapeXml(item.excerpt)}</description>
      <category>${escapeXml(item.category)}</category>
      <author>${escapeXml(item.author)}</author>
      ${item.pubDate ? `<pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>` : ''}
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;

writeFileSync(join(OUT, 'rss.xml'), rss);
console.log(`✓ out/rss.xml (${feedItems.length} مطلب)`);

// feed-data.json عمداً حذف نمی‌شود: حجمش ناچیز است و اگر کسی `npm run postbuild`
// را جداگانه اجرا کند، فید دوباره از روی همان ساخته می‌شود و خالی نمی‌ماند.
if (feedItems.length === 0) {
  console.warn('⚠ feed-data.json خالی یا ناموجود بود؛ rss.xml بدون آیتم ساخته شد. (اول `npm run build` را کامل اجرا کنید)');
}

/* ───────────────────────────────────  sw.js  ───────────────────────────────────
   Service Worker با فهرست precache از فایل‌های واقعی build.
   نسخهٔ کش از هش محتوای فایل‌های precache می‌آید، پس هر deploy که چیزی
   تغییر کرده باشد کش را به‌درستی باطل می‌کند و اگر چیزی عوض نشده، نمی‌کند. */

// دارایی‌های ثابتِ پوستهٔ اپ که همیشه پیش‌کش می‌شوند.
const shellPaths = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
].filter((path) => existsSync(join(OUT, path === '/' ? 'index.html' : path.replace(/^\//, ''))));

// فونت‌ها: کوچک، حیاتی برای رندر فارسی و تغییرناپذیر.
const fontPaths = allFiles.filter((file) => /\.(woff2)$/.test(file)).map(toUrlPath);

// CSS ساخته‌شده توسط Next (همیشه کوچک و ضروری).
const cssPaths = allFiles.filter((file) => /_next[\\/]static[\\/]css[\\/].+\.css$/.test(file)).map(toUrlPath);

const precache = [...new Set([...shellPaths, ...fontPaths, ...cssPaths])].map((path) => `${BASE}${path}`);

const version = createHash('sha1')
  .update(
    precache
      .map((path) => {
        const local = join(OUT, path.slice(BASE.length) === '/' ? 'index.html' : path.slice(BASE.length));
        try {
          return `${path}:${statSync(local).size}`;
        } catch {
          return path;
        }
      })
      .join('|'),
  )
  .digest('hex')
  .slice(0, 10);

const sw = `/*
 * Service Worker «خانه وکلا»
 * ساخته‌شده به‌صورت خودکار با scripts/postbuild.mjs — این فایل را دستی ویرایش نکنید.
 *
 * راهبردهای کش:
 *   • ناوبری (صفحات HTML) → network-first، بازگشت به کش، در نهایت offline.html
 *   • دارایی‌های هش‌دار Next و فونت‌ها → cache-first (محتوایشان هرگز تغییر نمی‌کند)
 *   • تصاویر → stale-while-revalidate با سقف تعداد
 *   • هر چیز دیگر → از شبکه، بدون کش
 *
 * دامنهٔ اثر (scope) به‌صورت خودکار «${BASE}/» است، چون فایل دقیقاً همان‌جا سرو می‌شود.
 */
const VERSION = '${version}';
const BASE = '${BASE}';
const SHELL_CACHE = 'vokalahome-shell-' + VERSION;
const PAGE_CACHE = 'vokalahome-pages-' + VERSION;
const ASSET_CACHE = 'vokalahome-assets-' + VERSION;
const IMAGE_CACHE = 'vokalahome-images-' + VERSION;
const OFFLINE_URL = BASE + '/offline.html';
const MAX_PAGES = 40;
const MAX_IMAGES = 60;

const PRECACHE = ${JSON.stringify(precache, null, 2)};

/* ───────────────────────────── نصب ───────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // addAll اتمیک است: اگر یک فایل ۴۰۴ بدهد کل نصب شکست می‌خورد،
      // پس تک‌تک اضافه می‌کنیم و خطاها را نادیده می‌گیریم.
      .then((cache) => Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

/* ───────────────────────────── فعال‌سازی ───────────────────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('vokalahome-') && !key.endsWith(VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/* ───────────────────── محدودکردن اندازهٔ کش ───────────────────── */
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= max) return;
  await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)));
}

/* ───────────────────────────── راهبردها ───────────────────────────── */
async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
      trim(PAGE_CACHE, MAX_PAGES);
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const shell = await caches.open(SHELL_CACHE);
    return (await shell.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
        if (max) trim(cacheName, max);
      }
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

/* ───────────────────────────── مسیریابی ───────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // فقط GET و فقط هم‌مبدأ؛ بقیه دست‌نخورده از شبکه می‌روند.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // خارج از زیرمسیر پروژه دخالت نکن (مهم روی *.github.io که چند پروژه دارد).
  if (BASE && !url.pathname.startsWith(BASE + '/') && url.pathname !== BASE) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // دارایی‌های هش‌دار Next و فونت‌ها: نام فایل با محتوا عوض می‌شود، پس امن است.
  if (url.pathname.includes('/_next/static/') || /\\.(woff2?|ttf|otf)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (/\\.(png|jpe?g|webp|avif|gif|svg|ico)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, MAX_IMAGES));
    return;
  }

  if (/\\.(json|xml|txt|webmanifest)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});

/* ─────────── پیام از صفحه: «نسخهٔ جدید را همین حالا فعال کن» ─────────── */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
`;

writeFileSync(join(OUT, 'sw.js'), sw);
console.log(`✓ out/sw.js (نسخه ${version}، ${precache.length} فایل پیش‌کش)`);

/* ──────────────────────── بررسی سلامت زیرمسیر ──────────────────────── */

const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const problems = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const page = toUrlPath(file);

  // لینک یا asset مطلقی که زیرمسیر را ندارد → روی GitHub Pages ۴۰۴ می‌دهد.
  if (BASE) {
    const pattern = new RegExp(`(?:href|src)="/(?!${BASE.slice(1)}/)(?!/)([^"]*)"`, 'g');
    for (const match of html.matchAll(pattern)) {
      const value = match[1];
      if (!value || value.startsWith('#')) continue;
      problems.push(`${page} → /${value}`);
    }
  }

  // کنونیکالی که هنوز به دامنهٔ فعال‌نشده اشاره می‌کند.
  if (/rel="canonical"[^>]*href="https:\/\/vokalahome\.com/.test(html)) {
    problems.push(`${page} → canonical روی دامنهٔ غیرفعال`);
  }
}

if (problems.length) {
  console.warn(`\n⚠ ${problems.length} مسیر مطلق بدون زیرمسیر پیدا شد:`);
  for (const problem of problems.slice(0, 15)) console.warn('   ', problem);
  if (problems.length > 15) console.warn(`    … و ${problems.length - 15} مورد دیگر`);
} else {
  console.log('✓ بررسی زیرمسیر: همهٔ مسیرهای مطلق درست هستند');
}

/* ─────────────────────────────── جمع‌بندی ─────────────────────────────── */

// allFiles پیش از حذف feed-data.json ساخته شده بود؛ فایل‌های حذف‌شده را نادیده بگیر.
const totalBytes = allFiles.reduce((sum, file) => (existsSync(file) ? sum + statSync(file).size : sum), 0);
console.log(`\nخروجی آماده است: ${htmlFiles.length} صفحهٔ HTML، ${(totalBytes / 1024 / 1024).toFixed(2)} مگابایت`);
console.log(`آدرس انتشار: ${SITE_URL}/`);
