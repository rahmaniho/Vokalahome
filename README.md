<div align="center">

# خانه وکلا — Vokala House

**باشگاه تخصصی و کافهٔ حقوقی وکلا · قزوین**

سایت کاملاً استاتیک، فارسی و راست‌چین · بهینه برای موبایل · قابل نصب به‌صورت PWA

[**مشاهدهٔ سایت →**](https://rahmaniho.github.io/Vokalahome/)

</div>

---

## فهرست

- [این سایت چیست](#این-سایت-چیست)
- [تصمیم‌های بنیادی](#تصمیمهای-بنیادی)
- [شروع سریع](#شروع-سریع)
- [ساختار پروژه](#ساختار-پروژه)
- [زیرمسیر `/Vokalahome/` — قانون طلایی](#زیرمسیر-vokalahome--قانون-طلایی)
- [انتشار](#انتشار)
- [ویرایش محتوا](#ویرایش-محتوا)
- [کارایی](#کارایی)
- [مستندات تکمیلی](#مستندات-تکمیلی)

---

## این سایت چیست

خانه وکلا فضایی در قزوین است که سه کار هم‌زمان انجام می‌دهد: کافهٔ تخصصی، باشگاه حرفه‌ای وکلا، و
مجموعه‌ای از اتاق‌های مشاورهٔ آبرومند برای جلسه با موکل. این مخزن، ویترین دیجیتال آن است.

| موضوع | اعضا | غیراعضا |
| --- | --- | --- |
| اتاق مشاوره | رایگان، در سقف ساعتی پلن | ساعتی ۵۰۰٬۰۰۰ تومان |
| نشست‌های علمی | رایگان یا با تخفیف | از ۳۰۰٬۰۰۰ تومان |
| کافه و سالن مطالعه | دسترسی نامحدود + تخفیف منو | ورود آزاد، منوی عادی |

**ساعت کار:** شنبه تا پنجشنبه ۸ تا ۲۲ · جمعه ۱۴ تا ۲۲
**نشانی:** قزوین، خیابان خیام جنوبی

---

## تصمیم‌های بنیادی

هر تصمیم زیر یک محدودیت واقعی را حل می‌کند، نه سلیقه:

| تصمیم | چرا |
| --- | --- |
| **Next.js با `output: 'export'`** | خروجی، HTML خام است. GitHub Pages هیچ Node‌ای اجرا نمی‌کند، پس رندر سمت سرور از ابتدا منتفی بود. در عوض App Router، تقسیم خودکار باندل و `next/font` را نگه داشتیم. |
| **بدون کتابخانهٔ انیمیشن** | `framer-motion` به‌تنهایی ~۳۴KB به باندل اضافه می‌کرد و چون بالای صفحه بود مستقیم LCP را خراب می‌کرد. جایگزین: CSS transition + `IntersectionObserver` + `requestAnimationFrame`. |
| **فونت خودمیزبان (Vazirmatn)** | CDN یعنی یک دامنهٔ سوم روی مسیر بحرانی و شکستن حالت آفلاین PWA. فایل متغیر است: یک فایل ۴۶KB برای همهٔ وزن‌های ۱۰۰ تا ۹۰۰. |
| **`<picture>` دست‌ساز به‌جای `next/image`** | در حالت export بهینه‌ساز Next خاموش است. اسکریپت build خودمان AVIF/WebP در سه عرض + یک LQIP درون‌خطی می‌سازد. |
| **QR بدون کتابخانه** | کدگذار QR در `src/lib/qr.ts` حدود ۶KB است؛ `qrcode` بیش از ۴۰KB. صحت خروجی با رمزگشایی دوطرفه آزموده شده. |
| **Zod فقط در صفحات فرم** | اعتبارسنجی سمت کلاینت خواستهٔ صریح پروژه بود. Zod تنها در chunkهای فرم بارگذاری می‌شود، نه در باندل مشترک. |
| **Service Worker به‌جای CDN** | وقتی دامنهٔ سوم ممنوع است، کش مرورگر تنها لایهٔ شتاب‌دهندهٔ باقی‌مانده است. |

---

## شروع سریع

```bash
npm install
npm run dev        # http://localhost:3000/Vokalahome/
```

### دستورهای اصلی

| دستور | کار |
| --- | --- |
| `npm run dev` | سرور توسعه (خودش prebuild را اجرا می‌کند) |
| `npm run build` | خروجی استاتیک کامل در `out/` |
| `npm run preview` | سرو کردن `out/` با شبیه‌سازی زیرمسیر GitHub Pages روی `:4173` |
| `npm run check` | TypeScript + ESLint |
| `npm run images` | ساخت دوبارهٔ همهٔ نسخه‌های AVIF/WebP |
| `npm run brand` | ساخت دوبارهٔ لوگو، آیکون‌های PWA و `og-image` از `src/lib/brand.ts` |
| `npm run format` | Prettier |

> `build` خودش `prebuild` و `postbuild` را اجرا می‌کند (قلاب‌های استاندارد npm) — لازم نیست جدا صدایشان بزنید.

### زنجیرهٔ build

```
prebuild   → manifest.webmanifest · robots.txt · offline.html · نسخه‌های AVIF/WebP
next build → ۵۱ صفحهٔ استاتیک در out/
postbuild  → .nojekyll · sitemap.xml · rss.xml · sw.js · لینت خروجی HTML
```

`postbuild` یک بازرس هم هست: اگر جایی مسیر مطلقِ بدون زیرمسیر یا canonical اشتباه جا مانده باشد،
همان‌جا هشدار می‌دهد. بی‌صدا رد نمی‌شود.

---

## ساختار پروژه

```
src/
├── app/                    مسیرها (App Router) — هر پوشه یک URL
│   ├── layout.tsx          فونت، تم، هدر/فوتر، JSON-LD سراسری
│   ├── page.tsx            صفحهٔ نخست
│   ├── not-found.tsx       → out/404.html  (مهم: تنها «ریدایرکت» ممکن روی GH Pages)
│   ├── feed-data.json/     Route Handler موقت که داده‌های RSS را به postbuild می‌رساند
│   └── …                   membership, consultation, events, blog, gallery, …
│
├── components/
│   ├── ui/                 سیستم طراحی: Button, Card, Badge, Input, Modal, Alert, Logo…
│   ├── layout/             Header, Footer, PageHero, QuickContact, MapEmbed
│   ├── cards/              کارت‌های خدمت، اتاق، مقاله، رویداد، وکیل
│   ├── interactive/        بخش‌های کلاینتی: آکاردئون، اسلایدر، «الان بازیم؟»
│   ├── consultation/       تقویم شمسی + ویجت رزرو
│   ├── membership/         مقایسهٔ پلن‌ها، فرم، کارت عضویت با QR
│   └── …                   events, blog, gallery, forms, pwa
│
├── lib/
│   ├── site.ts             ⚠️ منبع واحد آدرس‌ها — withBase / absoluteUrl / canonicalUrl
│   ├── constants.ts        تماس، ساعت کار، منو، تعرفه‌ها
│   ├── brand.ts            مسیرهای SVG لوگو + پالت (مشترک با اسکریپت build)
│   ├── seo.tsx             buildMetadata + همهٔ اسکیماهای JSON-LD
│   ├── validation.ts       اسکیماهای Zod + ضدهرزنامه
│   ├── qr.ts               کدگذار QR بدون وابستگی
│   └── data/               📝 همهٔ محتوا اینجاست
│
├── fonts/                  Vazirmatn (OFL 1.1)
└── types/                  تعریف نوع‌های محتوا

scripts/                    prebuild · postbuild · optimize-images · generate-brand-assets · serve-out
docs/                       مستندات (پایین را ببینید)
public/images/              تصاویر منبع؛ نسخه‌های بهینه در build ساخته می‌شوند
```

---

## زیرمسیر `/Vokalahome/` — قانون طلایی

سایت روی `rahmaniho.github.io/Vokalahome/` منتشر می‌شود، نه روی ریشهٔ دامنه. این یک نکتهٔ
تزئینی نیست؛ رایج‌ترین علت «سایت بدون استایل» روی GitHub Pages همین است.

> ### هرگز مسیر مطلق ننویسید.
>
> ```tsx
> ❌ <img src="/images/logo.png" />
> ❌ fetch('/data/events.json')
>
> ✅ <Link href="/events/" />              // Next خودش زیرمسیر را اضافه می‌کند
> ✅ <img src={withBase('/images/logo.png')} />   // برای HTML خام و فایل‌های استاتیک
> ```

`withBase()` از `src/lib/site.ts` می‌آید. هر جا Next خودش basePath را اضافه **نمی‌کند** — محتوای
manifest، service worker، JSON-LD، لینک‌های داخل رشته — از آن استفاده کنید.

اگر یادتان رفت، `postbuild` در پایان build سرتان داد می‌زند.

---

## انتشار

انتشار خودکار است. هر push روی `main` این مراحل را اجرا می‌کند:

```
typecheck → lint → build → upload → deploy
```

پیکربندی در [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### تنظیم یک‌باره در مخزن

**Settings → Pages → Build and deployment → Source = GitHub Actions**

همین. نه شاخهٔ `gh-pages` لازم است، نه پوشهٔ `/docs`.

### پیش از اولین انتشار

- [ ] فهرست کامل را در [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) ببینید

---

## ویرایش محتوا

بیشتر تغییرها فقط یک فایل داده است — نیازی به دست‌زدن به کامپوننت‌ها نیست:

| می‌خواهید… | فایل |
| --- | --- |
| شماره، نشانی، ساعت کار، شبکه‌های اجتماعی | `src/lib/constants.ts` |
| افزودن مقالهٔ جدید | `src/lib/data/articles.ts` |
| افزودن رویداد | `src/lib/data/events.ts` |
| تغییر قیمت یا مزایای پلن | `src/lib/data/plans.ts` |
| اتاق‌ها و تعرفه‌ها | `src/lib/data/rooms.ts` |
| پروفایل وکلای عضو | `src/lib/data/lawyers.ts` |
| عکس‌های گالری | `src/lib/data/gallery.ts` + فایل در `public/images/gallery/` |
| پرسش‌های پرتکرار | `src/lib/data/faqs.ts` |
| نظرات و لوگوی همکاران | `src/lib/data/testimonials.ts` · `src/lib/data/partners.ts` |

TypeScript در زمان build بررسی می‌کند که چیزی جا نیفتاده باشد. `sitemap.xml`، `rss.xml`،
JSON-LD و صفحات جزئیات همگی خودکار از همین داده‌ها ساخته می‌شوند.

### افزودن تصویر

۱. فایل اصلی (JPG/PNG با کیفیت بالا) را در `public/images/<دسته>/` بگذارید
۲. `npm run images` را اجرا کنید — نسخه‌های AVIF/WebP در سه عرض ساخته می‌شود
۳. با `<Picture src="/images/<دسته>/<نام>.jpg" alt="…" />` استفاده کنید

نسخه‌های تولیدشده در `.gitignore` هستند و در هر build دوباره ساخته می‌شوند.

---

## کارایی

| شاخص | مقدار |
| --- | --- |
| JS اولین بارگذاری (صفحهٔ نخست) | **۱۱۳ کیلوبایت** خام · ~۳۶KB فشرده |
| باندل مشترک همهٔ صفحات | ۸۷٫۵ کیلوبایت |
| CSS | ۶۱ کیلوبایت خام · ۱۲KB فشرده |
| فونت روی مسیر بحرانی | ۴۶ کیلوبایت (یک فایل) |
| صفحات پیش‌رندرشده | ۵۱ |

گزارش کامل با روش اندازه‌گیری و مقایسهٔ پیش/پس: [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md)

### بودجهٔ کارایی

| منبع | سقف |
| --- | --- |
| JS اولین بارگذاری هر صفحه | ۱۵۰KB خام |
| باندل مشترک | ۱۰۰KB خام |
| CSS | ۷۰KB خام |
| تصویر LCP | ۱۰۰KB (AVIF) |
| فونت preload شده | ۵۰KB |

اگر PR‌ای از این سقف‌ها عبور کرد، در خلاصهٔ Actions دیده می‌شود.

---

## مستندات تکمیلی

| سند | موضوع |
| --- | --- |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | انتشار، عیب‌یابی، بازگشت به نسخهٔ قبل |
| [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) | چک‌لیست کامل آزمون پیش و پس از انتشار |
| [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md) | گزارش Lighthouse، پیش و پس، روش اندازه‌گیری |
| [`docs/BRAND.md`](docs/BRAND.md) | لوگو، رنگ، فونت، حریم امن، قواعد استفاده |
| [`docs/CUSTOM-DOMAIN.md`](docs/CUSTOM-DOMAIN.md) | راهنمای دامنهٔ اختصاصی (فقط مستند — اجرا نشده) |
| [`docs/BACKEND-INTEGRATION.md`](docs/BACKEND-INTEGRATION.md) | Formspree، Supabase، درگاه پرداخت در آینده |
| [`docs/SEO-NOTES.md`](docs/SEO-NOTES.md) | نکات سئو مخصوص زیرمسیر GitHub Pages |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | نقشهٔ راه با اولویت‌بندی |
| [`docs/TASKS.md`](docs/TASKS.md) | چک‌لیست کامل ۱۴ حوزهٔ کاری و وضعیت هرکدام |

صفحهٔ زندهٔ سیستم طراحی: [`/style-guide/`](https://rahmaniho.github.io/Vokalahome/style-guide/)

---

## پروانه

کد: استفادهٔ داخلی خانه وکلا.
فونت Vazirmatn: SIL Open Font License 1.1 — متن کامل در `src/fonts/LICENSE-Vazirmatn.txt`.
