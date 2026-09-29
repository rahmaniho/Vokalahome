# سئوی فنی روی زیرمسیر GitHub Pages

میزبانی روی `rahmaniho.github.io/Vokalahome/` سه محدودیت واقعی دارد که باید بشناسید.
دو تا را دور زده‌ایم، یکی تنها با دامنهٔ اختصاصی حل می‌شود.

---

## ۱. ⚠️ `robots.txt` روی زیرمسیر خوانده نمی‌شود

### مسئله

طبق استاندارد، خزنده‌ها `robots.txt` را **فقط** از ریشهٔ دامنه می‌خوانند:

```
✅ https://rahmaniho.github.io/robots.txt          ← این را می‌خوانند (مال ما نیست)
❌ https://rahmaniho.github.io/Vokalahome/robots.txt ← این نادیده گرفته می‌شود
```

ریشهٔ `rahmaniho.github.io` متعلق به مخزن پروفایل کاربر است، نه این پروژه. پس عملاً
`robots.txt` ما بی‌اثر است — و خط `Sitemap:` داخلش هم همین‌طور.

### راه‌حل ما

سه لایه، تا هیچ‌چیز به `robots.txt` وابسته نماند:

**۱. کنترل ایندکس با متاتگ، نه robots.txt**

هر صفحه‌ای که نباید ایندکس شود، خودش می‌گوید:

```html
<meta name="robots" content="noindex, follow">
```

| صفحه | وضعیت | چرا |
| --- | --- | --- |
| `offline.html` | `noindex, nofollow` | صفحهٔ فنی PWA |
| `/style-guide/` | `noindex` | سند داخلی تیم |
| `/articles/*` | `noindex, follow` | ریدایرکت به `/blog/*` |
| پروفایل وکلای نمونه | `noindex` | تا داده‌های واقعی جایگزین شود |

در کد: `buildMetadata({ …, noIndex: true })` از `src/lib/seo.tsx`.

**۲. اعلام نقشهٔ سایت از داخل HTML**

در `<head>` هر صفحه:

```html
<link rel="sitemap" type="application/xml" href="/Vokalahome/sitemap.xml">
<link rel="alternate" type="application/rss+xml" href="/Vokalahome/rss.xml">
```

**۳. ثبت دستی در Search Console** ← مهم‌ترین قدم

```
Search Console → Sitemaps → https://rahmaniho.github.io/Vokalahome/sitemap.xml
```

این کار را یک‌بار انجام دهید. بعد از آن گوگل نقشه را مستقیم می‌خواند و به `robots.txt`
کاری ندارد.

> فایل `public/robots.txt` را نگه داشته‌ایم چون بی‌ضرر است و روز مهاجرت به دامنهٔ
> اختصاصی خودبه‌خود درست و فعال می‌شود.

---

## ۲. ⚠️ اشتراک دامنه با سایر پروژه‌ها

`rahmaniho.github.io` میزبان همهٔ مخزن‌های Pages این حساب است. یعنی:

- سیگنال‌های اعتبار دامنه بین پروژه‌ها مشترک است
- در Search Console باید **URL prefix** ثبت کنید، نه Domain property:
  ```
  https://rahmaniho.github.io/Vokalahome/
  ```
- امتیاز سئوی این سایت به‌طور کامل به خودش تعلق نمی‌گیرد

این را نمی‌شود دور زد. تنها راه حل، دامنهٔ اختصاصی است →
[`CUSTOM-DOMAIN.md`](CUSTOM-DOMAIN.md).

---

## ۳. ⚠️ بدون ریدایرکت سمت سرور

هیچ `301`ی در کار نیست. برای آدرس‌های قدیمی از **صفحهٔ واسط** استفاده می‌کنیم:

```html
<meta http-equiv="refresh" content="0; url=/Vokalahome/blog/">
<link rel="canonical" href="https://rahmaniho.github.io/Vokalahome/blog/">
<meta name="robots" content="noindex, follow">
```

سه‌تایی بالا با هم کار می‌کنند:

| تگ | برای چه |
| --- | --- |
| `http-equiv="refresh"` با `0` | کاربر بلافاصله منتقل می‌شود |
| `canonical` | به گوگل می‌گوید آدرس معتبر کدام است |
| `noindex, follow` | خود صفحهٔ واسط ایندکس نشود، ولی لینکش دنبال شود |

کامپوننت `RedirectStub` (در `src/components/layout/`) این کار را می‌کند. الان روی
مسیر `/articles/*` → `/blog/*` استفاده شده.

> گوگل ریدایرکت متا با تأخیر صفر را معادل ۳۰۱ می‌شمارد، ولی کندتر پردازش می‌کند.
> برای تعداد کم آدرس خوب است؛ برای انتقال گستردهٔ سایت، دامنهٔ اختصاصی لازم است.

---

## ۴. آنچه درست کار می‌کند

### متای کامل روی هر صفحه

همه از `buildMetadata()` در `src/lib/seo.tsx` می‌آیند — هیچ صفحه‌ای دستی متا نمی‌نویسد:

```tsx
export const metadata = buildMetadata({
  title: 'عضویت در خانه وکلا',
  description: '…',          // ۶۰ تا ۱۶۰ نویسه
  path: '/membership/',      // canonical و og:url از این ساخته می‌شوند
  image: '/images/…',        // اختیاری؛ پیش‌فرض og-image سراسری
});
```

خروجی: `title`، `description`، `canonical`، `og:*` کامل، `twitter:card`، `keywords`.

**بازرسی خروجی:** لینتر `postbuild` هر ۵۰ صفحه را بررسی می‌کند — نبود `canonical`،
`og:url`، `description`، یا وجود بیش از یک `<h1>` گزارش می‌شود.

### داده‌های ساختاریافته (JSON-LD)

| اسکیما | کجا | نکته |
| --- | --- | --- |
| `LocalBusiness` | `layout.tsx` (همهٔ صفحات) | نشانی، مختصات، ساعت کار، تعرفه |
| `WebSite` | `layout.tsx` | نام سایت و زبان |
| `Article` | صفحات بلاگ | نویسنده، تاریخ انتشار، دسته |
| `Event` | صفحات رویداد | تاریخ، مکان، ظرفیت |
| `FAQPage` | صفحهٔ پرسش‌ها | برای نمایش آکاردئونی در نتایج |
| `BreadcrumbList` | صفحات داخلی | مسیر راهنما در نتایج جست‌وجو |

ساعت کار مطابق واقعیت: شنبه تا پنجشنبه ۰۸:۰۰–۲۲:۰۰، جمعه ۱۴:۰۰–۲۲:۰۰.

**آزمون:** [Rich Results Test](https://search.google.com/test/rich-results)

### آدرس‌های خوانا

```
/blog/contract-before-signing/
/events/workshop-layehe/
/services/consultation-rooms/
/lawyers/ali-keshavarz-najafi/
```

انگلیسی، با خط تیره، بدون شناسهٔ عددی، بدون پارامتر. slugها در `src/lib/data/` تعریف
شده‌اند و **نباید پس از ایندکس شدن عوض شوند**. اگر مجبور شدید، یک `RedirectStub` روی
slug قدیمی بگذارید.

### نقشهٔ سایت با اولویت‌بندی

`postbuild` آن را از فایل‌های واقعی `out/` می‌سازد، پس هرگز از سایت عقب نمی‌ماند.

| مسیر | اولویت | بازهٔ به‌روزرسانی |
| --- | --- | --- |
| `/` | ۱٫۰۰ | هفتگی |
| `/membership/` · `/rooms/` | ۰٫۹۵ | هفتگی |
| `/services/` · `/events/` · `/blog/` | ۰٫۹۰ | هفتگی |
| `/about/` · `/contact/` · `/gallery/` · `/lawyers/` | ۰٫۸۰ | ماهانه |
| جزئیات خدمت و رویداد | ۰٫۷۵ | ماهانه |
| مطالب بلاگ | ۰٫۷۰ | ماهانه |
| صفحات حقوقی و style-guide | ۰٫۳۰ | سالانه |

### فید RSS

`/rss.xml` با ۶ مطلب، مرتب از جدید به قدیم. خط لولهٔ ساختش کمی غیرمعمول است و ارزش
توضیح دارد:

```
articles.ts (TypeScript)
   ↓  app/feed-data.json/route.ts  ← Route Handler با dynamic = 'force-static'
out/feed-data.json
   ↓  scripts/postbuild.mjs
out/rss.xml
```

**چرا این مسیر؟** داده‌ها در TypeScript هستند ولی `postbuild.mjs` یک اسکریپت خام Node
است و نمی‌تواند `.ts` را وارد کند. به‌جای دوباره‌نویسی داده‌ها (که همیشه از هم جدا
می‌افتند)، در زمان build یک JSON می‌نویسیم و همان را می‌خوانیم. یک منبع حقیقت باقی می‌ماند.

---

## ۵. چک‌لیست سئو پس از انتشار

- [ ] ثبت property از نوع **URL prefix** در Search Console:
      `https://rahmaniho.github.io/Vokalahome/`
- [ ] ثبت دستی نقشهٔ سایت (بخش ۱ را ببینید)
- [ ] `URL Inspection` روی صفحهٔ نخست → `Request Indexing`
- [ ] آزمون [Rich Results](https://search.google.com/test/rich-results) روی:
      صفحهٔ نخست (LocalBusiness) · یک مطلب بلاگ (Article) · یک رویداد (Event) · `/faq/` (FAQPage)
- [ ] آزمون [Mobile-Friendly](https://search.google.com/test/mobile-friendly)
- [ ] بررسی پیش‌نمایش اشتراک‌گذاری:
      [Facebook Debugger](https://developers.facebook.com/tools/debug/) ·
      [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] ثبت کسب‌وکار در **Google Business Profile** با همان نشانی و ساعت کار JSON-LD
- [ ] بررسی فید RSS در یک فیدخوان

---

## ۶. سئوی محلی (قزوین)

کسب‌وکار فیزیکی است، پس جست‌وجوی محلی مهم‌ترین کانال است:

- ✅ `LocalBusiness` با `geo` دقیق و `openingHoursSpecification` کامل
- ✅ `makesOffer` برای اتاق مشاوره (۵۰۰٬۰۰۰ ریال مهمان / رایگان برای عضو)
- ✅ نقشه به‌صورت facade — تا کاربر کلیک نکند هیچ درخواستی به دامنهٔ سوم نمی‌رود
      (هم سریع‌تر، هم بدون کوکی شخص ثالث)
- ✅ نشانی و تلفن یکسان در فوتر، صفحهٔ تماس و JSON-LD (سازگاری NAP)
- ⬜ **Google Business Profile** — باید دستی ثبت شود
- ⬜ ثبت در فهرست‌های محلی (کانون وکلای قزوین، اتحادیه‌های صنفی)

سازگاری NAP (Name / Address / Phone) بین سایت و Google Business Profile مهم‌ترین عامل
رتبهٔ محلی است. هر سه از `src/lib/constants.ts` می‌آیند، پس در خود سایت قطعاً یکسان‌اند.

---

## ۷. بعد از مهاجرت به دامنهٔ اختصاصی

آنچه خودکار درست می‌شود:

- ✅ `robots.txt` واقعاً خوانده می‌شود
- ✅ canonical و og:url همه روی دامنهٔ جدید (چون از `canonicalUrl()` می‌آیند)
- ✅ ریشهٔ دامنه مال ماست، پس اعتبار سئو مشترک نیست
- ✅ نقشهٔ سایت با آدرس جدید ساخته می‌شود

آنچه باید دستی انجام دهید:

- ⬜ property جدید در Search Console (این بار از نوع **Domain**)
- ⬜ ابزار **Change of Address** در Search Console
- ⬜ ثبت دوبارهٔ نقشهٔ سایت
- ⬜ به‌روزرسانی آدرس در Google Business Profile و شبکه‌های اجتماعی

مراحل کامل در [`CUSTOM-DOMAIN.md`](CUSTOM-DOMAIN.md).
