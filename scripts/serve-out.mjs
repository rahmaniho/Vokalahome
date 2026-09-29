/**
 * سرور پیش‌نمایش محلی برای پوشهٔ `out/`.
 *
 * چرا `npx serve` کافی نیست؟ چون سایت روی GitHub Pages زیر مسیر
 * `/Vokalahome/` منتشر می‌شود. اگر پیش‌نمایش را از ریشه سرو کنیم، همهٔ
 * مسیرهای دارای basePath می‌شکنند و دقیقاً همان باگی که می‌خواهیم بگیریم
 * دیده نمی‌شود. این سرور رفتار GitHub Pages را شبیه‌سازی می‌کند:
 *
 *   • همه چیز زیر BASE_PATH سرو می‌شود
 *   • درخواست ریشه به BASE_PATH ریدایرکت می‌شود
 *   • مسیر بدون پسوند → پوشه/index.html (معادل trailingSlash)
 *   • مسیر ناموجود → 404.html با کد ۴۰۴ واقعی
 *   • بدون هیچ وابستگی npm؛ فقط ماژول‌های خود Node
 *
 * اجرا:  npm run preview
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'out');
const PORT = Number(process.env.PORT ?? 4173);
const HOST = process.env.HOST ?? '0.0.0.0';

const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Vokalahome';
const BASE = rawBase && rawBase !== '/' ? `/${rawBase.replace(/^\/+|\/+$/g, '')}` : '';

if (!existsSync(OUT)) {
  console.error('✗ پوشهٔ out/ پیدا نشد. اول `npm run build` را اجرا کنید.');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

/** تبدیل مسیر URL به فایل روی دیسک، با جلوگیری از خروج از پوشهٔ out. */
function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const target = join(OUT, clean);
  if (!target.startsWith(OUT)) return null; // تلاش برای path traversal

  if (existsSync(target) && statSync(target).isFile()) return target;

  // مسیر پوشه‌ای → index.html داخل آن (معادل trailingSlash در GitHub Pages)
  const asIndex = join(target, 'index.html');
  if (existsSync(asIndex)) return asIndex;

  // مسیر بدون اسلش پایانی → همان پوشه
  const asHtml = `${target}.html`;
  if (existsSync(asHtml)) return asHtml;

  return null;
}

const server = createServer((request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  // ریشه → زیرمسیر انتشار
  if (BASE && (pathname === '/' || pathname === '')) {
    response.writeHead(302, { Location: `${BASE}/` });
    response.end();
    return;
  }

  // خارج از زیرمسیر انتشار: دقیقاً مثل GitHub Pages، ۴۰۴
  if (BASE && !pathname.startsWith(`${BASE}/`) && pathname !== BASE) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`خارج از زیرمسیر انتشار (${BASE}) است.`);
    return;
  }

  const relative = BASE ? pathname.slice(BASE.length) || '/' : pathname;
  const file = resolveFile(relative);

  if (!file) {
    // صفحهٔ ۴۰۴ سفارشی — همان چیزی که GitHub Pages نشان می‌دهد
    const notFound = join(OUT, '404.html');
    if (existsSync(notFound)) {
      response.writeHead(404, { 'Content-Type': MIME['.html'] });
      createReadStream(notFound).pipe(response);
      return;
    }
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('یافت نشد');
    return;
  }

  const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
  const immutable = file.includes(`${join('_next', 'static')}`);

  response.writeHead(200, {
    'Content-Type': type,
    'Content-Length': statSync(file).size,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  createReadStream(file).pipe(response);
});

server.listen(PORT, HOST, () => {
  console.log(`\n  پیش‌نمایش خروجی استاتیک`);
  console.log(`  ➜  http://localhost:${PORT}${BASE}/`);
  console.log(`  (شبیه‌سازی زیرمسیر GitHub Pages — Ctrl+C برای خروج)\n`);
});
