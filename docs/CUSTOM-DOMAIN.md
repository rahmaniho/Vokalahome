# راهنمای دامنهٔ اختصاصی

> ### 📋 این سند فقط راهنماست — هیچ‌کدام از مراحل زیر اجرا نشده است.
>
> هیچ دامنه‌ای خریداری، منتقل یا تنظیم نشده. هیچ رکورد DNS ساخته نشده. سایت امروز روی
> `https://rahmaniho.github.io/Vokalahome/` است و همان‌جا می‌ماند تا وقتی شما تصمیم
> بگیرید. این سند زمانی به‌کار می‌آید که آن روز برسد.

---

## چرا کد از همین حالا آماده است

کل پروژه آدرس‌ها را از **یک فایل** می‌گیرد: `src/lib/site.ts`

```ts
const RAW_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://rahmaniho.github.io';
const RAW_BASE   = process.env.NEXT_PUBLIC_BASE_PATH   ?? '/Vokalahome';

export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;
```

و هیچ‌جای دیگری آدرس مطلق نوشته نشده. `canonical`، `og:url`، نقشهٔ سایت، فید RSS،
JSON-LD، دامنهٔ Service Worker و `scope` فایل manifest — همه از همین دو متغیر مشتق
می‌شوند.

**یعنی مهاجرت = تغییر دو متغیر محیطی. صفر خط تغییر در کد صفحات.**

---

## مراحل

### گام ۱ — خرید دامنه

| ثبت‌کننده | مناسب برای | نکته |
| --- | --- | --- |
| [ایرنیک](https://www.nic.ir/) | `.ir` | نیاز به احراز هویت ایرانی |
| ایران‌سرور، پارس‌پک، های‌وب | `.ir` و بین‌المللی | پشتیبانی فارسی |
| [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) | `.com` | قیمت تمام‌شده، DNS رایگان و سریع |
| [Namecheap](https://www.namecheap.com/) | `.com` | رایج و ساده |

پیشنهاد نام: `vokalahome.ir` · `khanevokala.ir` · `vokalahome.com`

> برای کسب‌وکار محلی قزوین، دامنهٔ `.ir` هم اعتماد بیشتری می‌سازد و هم در جست‌وجوی
> محلی ایران اندکی مزیت دارد.

---

### گام ۲ — رکوردهای DNS

در پنل ثبت‌کننده یا سرویس DNS، این رکوردها را بسازید.

**برای دامنهٔ اصلی (`vokalahome.ir`) — چهار رکورد `A`:**

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | ۳۶۰۰ |
| A | `@` | `185.199.109.153` | ۳۶۰۰ |
| A | `@` | `185.199.110.153` | ۳۶۰۰ |
| A | `@` | `185.199.111.153` | ۳۶۰۰ |

هر چهارتا را بسازید — GitHub برای تحمل خطا از همه استفاده می‌کند.

**اگر IPv6 پشتیبانی می‌شود، چهار رکورد `AAAA` هم اضافه کنید:**

| Type | Name | Value |
| --- | --- | --- |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

**برای زیردامنهٔ `www` — یک رکورد `CNAME`:**

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `rahmaniho.github.io.` |

> ⚠️ نقطهٔ انتهایی `rahmaniho.github.io.` در بعضی پنل‌ها لازم است. اگر پنل شما خودش
> اضافه می‌کند، دوباره ننویسید.

**IPهای رسمی را همیشه از منبع اصلی بررسی کنید:**
[GitHub Docs — Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

### گام ۳ — انتشار DNS را بررسی کنید

قبل از گام بعدی، صبر کنید تا DNS منتشر شود (۱۰ دقیقه تا ۲۴ ساعت، معمولاً زیر یک ساعت):

```bash
dig +short vokalahome.ir
# باید همان چهار IP بالا را برگرداند

dig +short www.vokalahome.ir
# باید rahmaniho.github.io را برگرداند
```

یا آنلاین: [dnschecker.org](https://dnschecker.org/)

---

### گام ۴ — معرفی دامنه به GitHub

`Settings` → `Pages` → `Custom domain` → `vokalahome.ir` → `Save`

GitHub خودکار:
- فایل `CNAME` را در ریشهٔ مخزن می‌سازد
- صحت DNS را بررسی می‌کند
- گواهی Let's Encrypt صادر می‌کند (تا یک ساعت طول می‌کشد)

سپس **`Enforce HTTPS`** را تیک بزنید. تا وقتی گواهی صادر نشده این گزینه غیرفعال است —
صبر کنید، خودش فعال می‌شود.

> ⚠️ فایل `CNAME` که GitHub می‌سازد در ریشهٔ مخزن است، ولی build ما پوشهٔ `out/` را
> منتشر می‌کند. باید مطمئن شوید این فایل در خروجی هم هست. پایین را ببینید.

---

### گام ۵ — تغییر پیکربندی پروژه

**۵٫۱ — در `.github/workflows/deploy.yml`:**

```yaml
env:
  NEXT_PUBLIC_SITE_ORIGIN: https://vokalahome.ir   # ← عوض شد
  NEXT_PUBLIC_BASE_PATH: ''                        # ← خالی: دیگر زیرمسیری نیست
```

**۵٫۲ — فایل `CNAME` را وارد خروجی کنید.** ساده‌ترین راه:

```bash
echo "vokalahome.ir" > public/CNAME
```

هرچه در `public/` باشد بدون تغییر به `out/` کپی می‌شود.

**۵٫۳ — در `.env.example` مقادیر جدید را مستند کنید** (برای توسعهٔ محلی).

**۵٫۴ — commit و push.** Workflow اجرا می‌شود و سایت روی دامنهٔ جدید بالا می‌آید.

---

### گام ۶ — بررسی

```bash
# باید ۲۰۰ بدهند
curl -I https://vokalahome.ir/
curl -I https://www.vokalahome.ir/           # GitHub خودش به بدون www می‌برد

# مسیرهای عمیق
curl -I https://vokalahome.ir/membership/
curl -I https://vokalahome.ir/blog/contract-before-signing/

# canonical باید روی دامنهٔ جدید باشد و بدون /Vokalahome/
curl -s https://vokalahome.ir/ | grep -o '<link rel="canonical"[^>]*>'

# نقشهٔ سایت، فید و manifest
curl -s https://vokalahome.ir/sitemap.xml | head -5
curl -s https://vokalahome.ir/robots.txt          # حالا واقعاً خوانده می‌شود
curl -s https://vokalahome.ir/manifest.webmanifest | grep scope
```

چک‌لیست چشمی:

- [ ] استایل و تصاویر بارگذاری می‌شوند (یعنی مسیرها درست‌اند)
- [ ] قفل HTTPS در نوار آدرس
- [ ] آدرس قدیمی `rahmaniho.github.io/Vokalahome/` به دامنهٔ جدید می‌رود
- [ ] PWA هنوز نصب می‌شود (`scope` عوض شده، پس نصب قبلی جداست)
- [ ] فرم‌ها کار می‌کنند
- [ ] `404` روی یک مسیر اشتباه، صفحهٔ سفارشی را نشان می‌دهد

---

### گام ۷ — کارهای سئو پس از مهاجرت

**در همان روز:**

1. **Search Console** → افزودن property جدید، این بار از نوع **Domain** (نه URL prefix)
2. **Change of Address** → از `rahmaniho.github.io/Vokalahome/` به `vokalahome.ir`
   (در تنظیمات property قدیمی)
3. ثبت دوبارهٔ نقشهٔ سایت: `https://vokalahome.ir/sitemap.xml`
4. `URL Inspection` روی صفحهٔ نخست → `Request Indexing`

**در هفتهٔ اول:**

5. به‌روزرسانی آدرس در **Google Business Profile**
6. به‌روزرسانی بیو شبکه‌های اجتماعی و امضای ایمیل
7. اطلاع به سایت‌هایی که به ما لینک داده‌اند
8. پایش «Coverage» در Search Console برای خطاهای ۴۰۴

**در سه ماه اول:**

9. property قدیمی را حذف نکنید — برای پایش انتقال لازم است
10. رتبه‌ها معمولاً ۲ تا ۶ هفته نوسان دارند؛ این طبیعی است

---

## زیردامنه به‌جای دامنهٔ اصلی

اگر دامنهٔ اصلی جای دیگری استفاده می‌شود و فقط `club.vokalahome.ir` را می‌خواهید:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `club` | `rahmaniho.github.io.` |

بقیهٔ مراحل یکسان است. `NEXT_PUBLIC_SITE_ORIGIN` را روی `https://club.vokalahome.ir`
بگذارید.

زیردامنه از رکورد `A` ساده‌تر است، چون اگر GitHub روزی IPهایش را عوض کند خودکار
به‌روز می‌شود.

---

## عیب‌یابی

### «Domain does not resolve to the GitHub Pages server»

DNS هنوز منتشر نشده یا رکوردها اشتباه‌اند.

```bash
dig +short vokalahome.ir
```

اگر چیزی جز آن چهار IP برگشت، رکوردها را بازبینی کنید. به‌خصوص مطمئن شوید رکورد `A`
قدیمی از پارکینگ دامنه حذف شده باشد.

### گواهی HTTPS صادر نمی‌شود

- بیش از ۲۴ ساعت گذشته؟ در `Settings → Pages` دامنه را حذف و دوباره اضافه کنید.
- رکورد `CAA` روی دامنه دارید؟ باید Let's Encrypt را مجاز کند:
  ```
  CAA  @  0 issue "letsencrypt.org"
  ```

### سایت بالا می‌آید ولی بدون استایل

`NEXT_PUBLIC_BASE_PATH` را خالی نکرده‌اید. HTML هنوز دنبال `/Vokalahome/_next/…` می‌گردد
که روی دامنهٔ جدید وجود ندارد.

```bash
curl -s https://vokalahome.ir/ | grep -o '/Vokalahome/[^"]*' | head
# باید هیچی برنگرداند
```

### فایل `CNAME` پس از هر انتشار پاک می‌شود

چون build پوشهٔ `out/` را جایگزین می‌کند و `CNAME` در ریشهٔ مخزن بود. رفع: فایل را در
`public/CNAME` بگذارید (گام ۵٫۲).

### بازدیدکنندگان نسخهٔ قدیمی را می‌بینند

Service Worker قدیمی با scope `/Vokalahome/` هنوز روی دستگاهشان ثبت است. چون دامنه
عوض شده، origin هم عوض شده و SW قدیمی روی دامنهٔ جدید اثری ندارد. برای کسانی که هنوز
آدرس قدیمی را باز می‌کنند، GitHub خودش به دامنهٔ جدید ریدایرکت می‌کند.

---

## هزینه

| مورد | هزینهٔ سالانه |
| --- | --- |
| دامنهٔ `.ir` | ۵۰٬۰۰۰ تا ۱۵۰٬۰۰۰ تومان |
| دامنهٔ `.com` | ۱۲ تا ۱۵ دلار |
| میزبانی GitHub Pages | **رایگان** |
| گواهی SSL | **رایگان** (Let's Encrypt) |
| پهنای باند | **رایگان** (تا ۱۰۰GB ماهانه) |

تنها هزینهٔ واقعی، خود دامنه است.

---

## وقتی روزی به سرور واقعی نیاز شد

اگر بعدها پرداخت آنلاین، پنل کاربری یا پایگاه دادهٔ اختصاصی خواستید، این ساختار مانع
نیست:

| گزینه | مناسب برای | تغییر لازم |
| --- | --- | --- |
| همین + Supabase | داشبورد عضو، ذخیرهٔ فرم‌ها | فقط افزودن کلاینت — هیچ تغییری در میزبانی |
| Vercel / Netlify | نیاز به SSR یا API route | حذف `output: 'export'`، همان کد |
| VPS + Node | کنترل کامل | `next start` به‌جای export |

`output: 'export'` یک در یک‌طرفه نیست — هر وقت خواستید برش می‌دارید و همان کد روی سرور
اجرا می‌شود. جزئیات در [`BACKEND-INTEGRATION.md`](BACKEND-INTEGRATION.md).
