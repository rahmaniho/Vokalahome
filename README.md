# خانه وکلا

وب‌سایت رسمی **خانه وکلا** — کافه و باشگاه تخصصی وکلا در قزوین (خیابان خیام
جنوبی). یک وب‌سایت کاملاً استاتیک، سریع، راست‌چین و موبایل‌محور که روی
**GitHub Pages** میزبانی می‌شود، بدون هیچ سرور یا دیتابیس اختصاصی.

🔗 نسخهٔ زنده: **https://rahmaniho.github.io/Vokalahome/**

---

## فهرست
- [استک فنی](#استک-فنی)
- [اجرای محلی](#اجرای-محلی)
- [ساختار پروژه](#ساختار-پروژه)
- [الگوی basePath (خیلی مهم)](#الگوی-basepath-خیلی-مهم)
- [استقرار (Deploy)](#استقرار-deploy)
- [قبل از انتشار عمومی — چک‌لیست جایگزینی اطلاعات](#قبل-از-انتشار-عمومی--چکلیست-جایگزینی-اطلاعات)
- [PWA](#pwa)
- [سئو](#سئو)
- [دسترس‌پذیری و عملکرد](#دسترسپذیری-و-عملکرد)
- [فرم‌ها و دادهٔ پویا](#فرمها-و-دادهی-پویا)
- [راهنمای برند](#راهنمای-برند)
- [مستندات بیشتر](#مستندات-بیشتر)

---

## استک فنی

- **Next.js 14** با `output: 'export'` (خروجی کاملاً استاتیک، سازگار با GitHub Pages)
- **TypeScript** + **Tailwind CSS**
- **Framer Motion** برای انیمیشن، **Lenis** برای اسکرول نرم
- **jalaali-js** برای تقویم شمسی (ویجت رزرو اتاق)
- فونت **Vazirmatn** به‌صورت self-hosted (`@fontsource-variable/vazirmatn`) — بدون درخواست به CDN خارجی
- بدون سرور، بدون دیتابیس؛ پویایی از طریق Formspree (فعلاً) یا Supabase (اختیاری، آینده)

## اجرای محلی

```bash
npm install
npm run dev
```

سپس روی `http://localhost:3000` باز کنید (در حالت dev، basePath غیرفعال است تا
توسعه راحت‌تر باشد؛ در build نهایی به‌صورت خودکار `/Vokalahome` اضافه می‌شود).

```bash
npm run lint        # ESLint
npm run typecheck   # بررسی نوع TypeScript
npm run build        # ساخت خروجی استاتیک در ./out
```

برای پیش‌نمایش دقیق خروجی نهایی (با basePath واقعی، مثل GitHub Pages):

```bash
npm run build
npx serve out -p 8080
# سپس http://localhost:8080/Vokalahome/ را باز کنید
```

## ساختار پروژه

```
src/
  app/                    مسیرها (App Router) — هر پوشه یک صفحه
    articles/[slug]/      صفحهٔ جزئیات مقاله (پویا، از src/lib/data/articles.ts)
    lawyers/[slug]/       پروفایل وکیل عضو
    services/[slug]/      جزئیات هر امکان/خدمت
    gallery/              گالری + تور مجازی ۳۶۰
    style-guide/          دیزاین سیستم زنده (رنگ‌ها، تایپوگرافی، کامپوننت‌ها)
    robots.ts, sitemap.ts, rss.xml/   مسیرهای ویژهٔ سئو (Next Metadata Routes)
  components/
    ui/                   کامپوننت‌های پایه: Button, Card, Badge, Input, Modal, Alert, Breadcrumb...
    layout/                Header, Footer, PageHero, FloatingMenu, ServiceWorkerRegister
    home/, cards/, interactive/, consultation/, forms/   کامپوننت‌های اختصاصی هر بخش
  lib/
    basePath.ts           توابع asset()/absoluteUrl() — همیشه برای ساخت مسیر فایل/لینک استفاده شوند
    constants.ts           اطلاعات تماس/ساعات کاری/تعرفه (SITE, ROOM_RATE, NAV_ITEMS, ...)
    jalali.ts               تبدیل تاریخ شمسی → ISO میلادی (برای JSON-LD)
    data/                   «دیتابیس» استاتیک سایت (مقالات، وکلا، رویدادها، اتاق‌ها، پلن‌ها، گالری، FAQ)
site.config.mjs           تک منبع حقیقت برای basePath و آدرس سایت
scripts/generate-manifest.mjs   ساخت خودکار public/manifest.webmanifest قبل از هر build
public/
  sw.js, offline.html      Service Worker و صفحهٔ آفلاین (PWA)
docs/                       راهنماهای تکمیلی (نقشه راه، دامنه اختصاصی، Supabase/Formspree، PWA، گزارش Lighthouse)
```

## الگوی basePath (خیلی مهم)

چون سایت زیرمسیر `/Vokalahome/` روی GitHub Pages منتشر می‌شود، **هیچ‌گاه مسیر
مطلق دستی ننویسید** (مثل `<img src="/images/x.jpg">` یا `href="/manifest.webmanifest"`).
همیشه از `asset()` استفاده کنید:

```ts
import { asset } from '@/lib/basePath';
<img src={asset('/images/hero/lawyers-cafe.webp')} />
```

برای لینک‌های داخلی از کامپوننت `next/link` استفاده کنید (basePath را
Next.js خودکار اضافه می‌کند)؛ فقط برای مقادیر خام (مثل JSON-LD یا canonical)
از `absoluteUrl()` استفاده کنید که یک URL کاملاً مطلق (با دامنه) می‌سازد.

این پروژه یک‌بار به‌خاطر نادیده‌گرفتن همین قاعده چند باگ ۴۰۴ واقعی روی سایت
زنده داشت (تصویر هیرو، favicon، manifest) — جزئیات در `docs/LIGHTHOUSE_REPORT.md`.

## استقرار (Deploy)

استقرار کاملاً خودکار است. با هر `push` به شاخهٔ `main`، فایل
`.github/workflows/deploy-gh-pages.yml` این مراحل را انجام می‌دهد:
lint → typecheck → build → آپلود `out/` به GitHub Pages.

برای استقرار دستی: از تب **Actions** مخزن، workflow را با دکمهٔ
**Run workflow** (`workflow_dispatch`) اجرا کنید.

> فقط از همین یک workflow استفاده کنید. اگر GitHub پیشنهاد «Configure Pages»
> یا الگوی پیش‌فرض Next.js را داد، آن را اضافه نکنید — دو workflow هم‌زمان
> باعث رقابت/انتشار ناقص می‌شود.

برای انتقال به دامنهٔ اختصاصی در آینده، به `docs/CUSTOM_DOMAIN.md` مراجعه کنید.

## قبل از انتشار عمومی — چک‌لیست جایگزینی اطلاعات

محتوای فعلی سایت شامل چند مقدار **نمونه/جای‌نگه‌دار** است که باید پیش از
انتشار نهایی با اطلاعات واقعی جایگزین شوند. همه در **یک فایل** متمرکزند:

📄 `src/lib/constants.ts`

| فیلد | مقدار فعلی (نمونه) | باید جایگزین شود با |
|---|---|---|
| `phone` / `phoneHref` | `۰۲۸-۳۳۲۲۲۲۲۲` | شمارهٔ ثابت واقعی خانه وکلا |
| `mobile` / `whatsappHref` | `۰۹۱۲-۳۴۵-۶۷۸۹` | شمارهٔ واتساپ واقعی |
| `email` | `info@vokalahome.com` | ایمیل رسمی |
| `address` / `shortAddress` | فقط نام خیابان، بدون پلاک | نشانی کامل با پلاک |
| `formspreeEndpoint` | `.../f/YOUR_FORM_ID` | آدرس واقعی فرم Formspree (راهنما: `docs/SUPABASE_FORMSPREE.md`) |
| `instagram` / `linkedin` | لینک خالی/جای‌نگه‌دار | آدرس واقعی صفحات |
| `QUICK_FACTS` (تعداد اعضا/اتاق‌ها/نشست‌ها) | اعداد نمونه | آمار واقعی خانه وکلا |

همچنین:
- **تصاویر**: `public/images/hero`, `public/images/cafe`, `public/images/lawyers`, `public/images/rooms`, `public/images/gallery` با عکس‌های نمونه/تولیدی پر شده‌اند؛ باید با عکاسی واقعی از فضا و وکلا جایگزین شوند.
- **تور ۳۶۰ درجه** (صفحهٔ گالری): پانوراماهای نمونه استفاده شده؛ برای فضای واقعی باید با دوربین ۳۶۰ عکاسی و در `src/lib/data/gallery.ts` جایگزین شود.
- **پروفایل وکلا** (`src/lib/data/lawyers.ts`): بیوگرافی، تخصص، تحصیلات و تصویر باید با اطلاعات واقعی و رضایت هر وکیل عضو تکمیل شود.
- **متون حقوقی** (`/privacy`, `/terms`, `/disclaimer`): پیش‌نویس اولیه‌اند؛ باید توسط یکی از وکلای عضو خانه وکلا بازبینی و تأیید نهایی شوند.

## PWA

سایت قابل نصب است (Add to Home Screen) و آفلاین محدود کار می‌کند. جزئیات کامل
(راهبرد کش، آپدیت نسخه، تست نصب‌پذیری) در `docs/PWA_GUIDE.md`.

## سئو

- متادیتای کامل per-page (`generateMetadata`)، `canonical` مطلق روی هر صفحه
- `sitemap.xml` و `robots.txt` به‌صورت خودکار از `src/app/sitemap.ts` / `src/app/robots.ts`
- JSON-LD: `LocalBusiness`+`CafeOrCoffeeShop` (سراسری)، `Article` (هر مقاله، با تاریخ ISO واقعی)، `BreadcrumbList` (صفحات چندسطحی)، `FAQPage`
- RSS: `/rss.xml` برای دانش‌نامه/وبلاگ
- URLهای خوانا و انسانی (`/services/consultation-rooms/` نه `/p?id=3`)

## دسترس‌پذیری و عملکرد

آخرین اجرای Lighthouse: **Accessibility 100، Best Practices 100، SEO 100**.
گزارش کامل قبل/بعد با توضیح متدولوژی در `docs/LIGHTHOUSE_REPORT.md`.

## فرم‌ها و دادهٔ پویا

همهٔ فرم‌ها (تماس، رزرو اتاق، عضویت، پرسش) از طریق Formspree ارسال می‌شوند.
راهنمای کامل اتصال Formspree و مهاجرت اختیاری به Supabase (برای داشبورد
عضویت یا ظرفیت زندهٔ رویداد) در `docs/SUPABASE_FORMSPREE.md`.

## راهنمای برند

| عنصر | مقدار |
|---|---|
| رنگ سرمه‌ای اصلی | `#0B1F3A` (`navy-900` در Tailwind) |
| رنگ طلایی برند | `#C9A227` (`gold-500`) — روی زمینهٔ تیره/دکمه‌ها؛ برای متن روی زمینهٔ روشن از سایه‌های تیره‌تر (`#7A611A`/`#96791D`) استفاده شده تا کنتراست WCAG رعایت شود |
| خاکستری روشن | `#F5F6F8` (`ivory`) |
| فونت | Vazirmatn Variable |
| لوگو | SVG مینیمال (خانه + ترازوی عدالت + فنجان قهوه)، در `public/favicon.svg` |

نمونهٔ زنده و کامل تمام رنگ‌ها/تایپوگرافی/کامپوننت‌ها: صفحهٔ
[`/style-guide`](https://rahmaniho.github.io/Vokalahome/style-guide/).

## مستندات بیشتر

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — وضعیت فعلی الزامات و اولویت کارهای باقی‌مانده
- [`docs/CUSTOM_DOMAIN.md`](docs/CUSTOM_DOMAIN.md) — راهنمای اتصال دامنهٔ اختصاصی
- [`docs/SUPABASE_FORMSPREE.md`](docs/SUPABASE_FORMSPREE.md) — اتصال فرم‌ها و دادهٔ پویا
- [`docs/PWA_GUIDE.md`](docs/PWA_GUIDE.md) — جزئیات Service Worker و نصب‌پذیری
- [`docs/LIGHTHOUSE_REPORT.md`](docs/LIGHTHOUSE_REPORT.md) — گزارش کامل عملکرد/سئو/دسترس‌پذیری
