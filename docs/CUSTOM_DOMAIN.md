# راهنمای اتصال دامنهٔ اختصاصی (آینده)

این سایت اکنون روی زیرمسیر GitHub Pages منتشر می‌شود:
`https://rahmaniho.github.io/Vokalahome/`

اگر در آینده دامنهٔ اختصاصی (مثلاً `khanevokala.com`) خریداری شد، این پروژه
از قبل برای این انتقال آماده است — فقط سه تغییر لازم است، بدون بازنویسی کد:

## مراحل

1. **تنظیم DNS دامنه** نزد ثبت‌کنندهٔ دامنه:
   - برای دامنهٔ ریشه (apex، مثل `khanevokala.com`): چهار رکورد `A` به آی‌پی‌های GitHub Pages اضافه کنید:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - یا برای زیردامنه (مثل `www.khanevokala.com`): یک رکورد `CNAME` به `rahmaniho.github.io` بسازید.

2. **ساخت فایل `public/CNAME`** با محتوای دقیق دامنه (بدون `https://` و بدون `/`):
   ```
   khanevokala.com
   ```

3. **ویرایش `site.config.mjs`**:
   ```js
   export const IS_CUSTOM_DOMAIN = true;
   export const CUSTOM_DOMAIN_URL = 'https://khanevokala.com'; // با دامنهٔ واقعی جایگزین کنید
   ```

4. **Commit و push** — GitHub Actions به‌صورت خودکار build و publish می‌کند. با فعال‌شدن `IS_CUSTOM_DOMAIN`:
   - `BASE_PATH` خودکار خالی (`''`) می‌شود؛ همهٔ لینک‌ها/تصاویر/مانیفست از ریشهٔ دامنه سرو می‌شوند (نه `/Vokalahome/...`).
   - `SITE_URL`/canonical/OG/JSON-LD همه به‌طور خودکار به دامنهٔ جدید اشاره می‌کنند.
   - نیازی به تغییر دستی در هیچ فایل دیگری (صفحات، کامپوننت‌ها، دادهٔ SEO) نیست، چون همه از `site.config.mjs` می‌خوانند.

5. در تنظیمات مخزن گیت‌هاب (`Settings → Pages`)، بخش **Custom domain** را با همان دامنه پر کنید و گزینهٔ **Enforce HTTPS** را فعال کنید (بعد از صدور گواهی SSL توسط GitHub، معمولاً چند ساعت طول می‌کشد).

## نکات
- تا وقتی `IS_CUSTOM_DOMAIN=false` است، فایل `public/CNAME` نباید وجود داشته باشد (وگرنه GitHub Pages تلاش می‌کند به دامنه‌ای که هنوز DNS آن آماده نیست ریدایرکت کند).
- بعد از انتقال، لینک قدیمی `rahmaniho.github.io/Vokalahome/` به‌طور خودکار توسط GitHub Pages به دامنهٔ جدید ریدایرکت می‌شود (ریدایرکت در سطح GitHub Pages انجام می‌شود، نیازی به پیکربندی سمت پروژه نیست).
