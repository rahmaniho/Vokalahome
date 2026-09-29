# انتشار روی GitHub Pages

راهنمای کامل: تنظیم اولیه، انتشار روزمره، عیب‌یابی، و بازگشت به نسخهٔ قبل.

---

## ۱. تنظیم یک‌باره

فقط یک کار در تنظیمات مخزن لازم است:

**`Settings` → `Pages` → `Build and deployment` → `Source` = `GitHub Actions`**

> ⚠️ اگر روی `Deploy from a branch` بماند، GitHub سعی می‌کند سایت را با Jekyll بسازد.
> نتیجه: پوشهٔ `_next/` نادیده گرفته می‌شود و سایت بدون هیچ استایل و جاوااسکریپتی بالا
> می‌آید. (فایل `.nojekyll` این را خنثی می‌کند، ولی حالت درست همان `GitHub Actions` است.)

HTTPS خودکار فعال است. کاری لازم نیست.

---

## ۲. انتشار روزمره

```bash
git add .
git commit -m "توضیح تغییر"
git push
```

تمام. Workflow خودکار اجرا می‌شود:

```
checkout → npm ci → کش تصاویر → typecheck → lint → build → upload → deploy
```

پیشرفت را در تب **Actions** ببینید. زمان معمول: **۲ تا ۳ دقیقه**
(با کش تصاویر گرم: حدود ۹۰ ثانیه).

### انتشار دستی بدون تغییر کد

تب **Actions** → `Deploy to GitHub Pages` → `Run workflow`

مفید وقتی متغیری در تنظیمات مخزن عوض کرده‌اید.

---

## ۳. آنچه Workflow انجام می‌دهد

فایل: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

| مرحله | کار | اگر شکست بخورد |
| --- | --- | --- |
| `npm ci` | نصب دقیق نسخه‌های `package-lock.json` | `package-lock.json` قدیمی است — `npm install` بزنید و commit کنید |
| کش تصاویر | بازیابی AVIF/WebP از build قبلی | فقط کند می‌شود، خراب نمی‌شود |
| `typecheck` | `tsc --noEmit` | خطای TypeScript — لاگ آخرین فایل را ببینید |
| `lint` | `next lint` | خطای ESLint |
| `build` | `prebuild → next build → postbuild` | پایین را ببینید |
| `upload-pages-artifact` | بسته‌بندی `out/` | معمولاً یعنی `out/` خالی است |
| `deploy-pages` | انتشار | معمولاً یعنی `Source` روی `GitHub Actions` نیست |

### متغیرهای محیطی

در خود Workflow تعریف شده‌اند:

```yaml
NEXT_PUBLIC_SITE_ORIGIN: https://rahmaniho.github.io
NEXT_PUBLIC_BASE_PATH: /Vokalahome
NEXT_PUBLIC_FORMSPREE_ENDPOINT: ${{ vars.FORMSPREE_ENDPOINT }}
```

`FORMSPREE_ENDPOINT` یک **Variable** (نه Secret) است؛ چون آدرس فرم عمومی است و در HTML
سایت دیده می‌شود. تنظیمش:
`Settings` → `Secrets and variables` → `Actions` → تب `Variables` → `New repository variable`

خالی بودنش مشکلی نیست: فرم‌ها خودکار روی واتساپ fallback می‌کنند.

---

## ۴. آزمون محلی پیش از push

```bash
npm run build
npm run preview     # http://localhost:4173/Vokalahome/
```

`scripts/serve-out.mjs` عمداً رفتار GitHub Pages را شبیه‌سازی می‌کند:

- همه چیز زیر `/Vokalahome/` سرو می‌شود — اگر لینکی زیرمسیر را جا انداخته باشد، همین‌جا می‌شکند
- مسیر ناموجود → `404.html` با کد ۴۰۴ واقعی
- `/` → ریدایرکت به `/Vokalahome/`

> `npx serve out` این کار را **نمی‌کند**. از ریشه سرو می‌کند، پس دقیقاً آن دسته باگی را که
> باید بگیریم پنهان می‌کند.

---

## ۵. عیب‌یابی

### سایت بالا می‌آید ولی بدون استایل و بدون تصویر

**علت:** GitHub Pages پوشه‌های شروع‌شده با `_` را نادیده می‌گیرد (قاعدهٔ Jekyll)، و
`_next/` دقیقاً همین است.

**بررسی:**
```bash
curl -I https://rahmaniho.github.io/Vokalahome/.nojekyll   # باید 200 بدهد
```

**رفع:** `postbuild` این فایل را می‌سازد و Workflow هم یک `touch` پشتیبان دارد. اگر باز
هم نبود، `Source` را روی `GitHub Actions` بگذارید.

---

### ۴۰۴ روی همهٔ صفحات جز خانه

**علت:** `trailingSlash` خاموش شده. GitHub Pages مسیر بدون اسلش را به فایل نگاشت نمی‌کند.

**رفع:** در `next.config.mjs` باید باشد:
```js
trailingSlash: true
```
و همهٔ لینک‌های داخلی با اسلش پایانی نوشته شوند: `/membership/` نه `/membership`.

---

### لینک‌ها به `rahmaniho.github.io/membership/` می‌روند (بدون `/Vokalahome/`)

**علت:** یک مسیر مطلق دستی جایی نوشته شده.

**بررسی:** `npm run build` خودش گزارش می‌دهد:
```
⚠ ۳ مسیر مطلق بدون زیرمسیر پیدا شد:
    out/about/index.html → /images/team.jpg
```

**رفع:** `withBase()` از `src/lib/site.ts`، یا اگر لینک صفحه است، `<Link>` نکس.

---

### تغییرات منتشر شد ولی مرورگر نسخهٔ قدیمی نشان می‌دهد

Service Worker صفحات را کش می‌کند. راهبردش network-first است، پس معمولاً خودش تازه
می‌شود. برای اجبار:

1. DevTools → Application → Service Workers → **Unregister**
2. Application → Storage → **Clear site data**
3. بارگذاری مجدد

برای کاربران عادی: نسخهٔ SW در هر build از روی هش فایل‌ها عوض می‌شود، پس SW جدید خودکار
جایگزین می‌شود و کش‌های قدیمی پاک می‌شوند.

---

### Workflow روی `npm ci` می‌شکند

```
npm ERR! `npm ci` can only install packages when your package.json and
package-lock.json are in sync
```

**رفع:**
```bash
npm install
git add package-lock.json
git commit -m "همگام‌سازی package-lock"
git push
```

---

### build محلی سبز است ولی در Actions قرمز

تقریباً همیشه یکی از این دوتاست:

- **حساسیت به بزرگی/کوچکی حروف.** مک و ویندوز فرق `Card.tsx` و `card.tsx` را نمی‌فهمند،
  اما Ubuntu می‌فهمد. مسیرهای `import` را دقیق بررسی کنید.
- **فایلی که commit نشده.** `git status` بزنید؛ شاید فایل جدید در `.gitignore` افتاده.

---

### تصاویر در Actions ساخته نمی‌شوند

`sharp` باینری بومی دارد. اگر روی Ubuntu نصب نشد، مرحلهٔ build شکست می‌خورد. رفع:

```bash
npm i -D sharp --include=optional
```

یا در Workflow پیش از build:
```yaml
- run: npm rebuild sharp
```

---

## ۶. بازگشت به نسخهٔ قبل

### راه سریع (بدون تغییر تاریخچه)

تب **Actions** → آخرین اجرای موفق قبلی → **Re-run all jobs**

سایت به همان نسخه برمی‌گردد بدون آنکه چیزی در git عوض شود.

### راه پایدار

```bash
git revert <commit-hash>
git push
```

Workflow خودکار اجرا می‌شود و نسخهٔ سالم را منتشر می‌کند.

> ⛔ از `git push --force` استفاده نکنید. تاریخچه را می‌شکند و در کار بقیه اختلال می‌اندازد.

---

## ۷. پایش پس از انتشار

| چه چیزی | کجا | هرچند وقت |
| --- | --- | --- |
| وضعیت انتشار | تب Actions | هر push |
| خطاهای خزش و ایندکس | [Google Search Console](https://search.google.com/search-console) | ماهانه |
| نمرهٔ کارایی | [PageSpeed Insights](https://pagespeed.web.dev/) | پس از هر تغییر بزرگ |
| لینک‌های شکسته | `npm run build` (لینتر خروجی) | هر build |
| رسیدن فرم‌ها | داشبورد Formspree | هفتگی |

### ثبت نقشهٔ سایت در Search Console

چون `robots.txt` روی زیرمسیر خوانده نمی‌شود، نقشهٔ سایت را **دستی** ثبت کنید:

Search Console → Sitemaps → افزودن:
```
https://rahmaniho.github.io/Vokalahome/sitemap.xml
```

جزئیات در [`SEO-NOTES.md`](SEO-NOTES.md).

---

## ۸. سقف‌های GitHub Pages

| محدودیت | مقدار | وضعیت ما |
| --- | --- | --- |
| حجم سایت | ۱ گیگابایت | ۱۶ مگابایت ✅ |
| پهنای باند ماهانه | ۱۰۰ گیگابایت (نرم) | خیلی دور ✅ |
| تعداد build در ساعت | ۱۰ | ✅ |
| زمان build | ۱۰ دقیقه | ~۲ دقیقه ✅ |
| حجم هر فایل | ۱۰۰ مگابایت | بیشینه ۲۷۱ کیلوبایت ✅ |

جای نفس کشیدن زیاد است. اگر روزی گالری خیلی بزرگ شد، تصاویر را به یک سرویس بیرونی
منتقل کنید — ولی فعلاً موضوعیت ندارد.
