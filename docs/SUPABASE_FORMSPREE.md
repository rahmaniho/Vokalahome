# راهنمای اتصال فرم‌ها (Formspree) و دادهٔ کلاینت‌ساید (Supabase)

این پروژه هیچ سرور/بک‌اند اختصاصی ندارد (فقط GitHub Pages استاتیک)، پس تمام
پویایی از طریق سرویس‌های خارجیِ کلاینت‌ساید تأمین می‌شود.

## ۱. Formspree (فعلاً استفاده‌شده برای همهٔ فرم‌ها)

فرم‌های تماس، رزرو اتاق، عضویت و پرسش در FAQ همگی به یک نقطهٔ مرکزی وصل‌اند:

```ts
// src/lib/constants.ts
formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
```

### راه‌اندازی
1. در [formspree.io](https://formspree.io) ثبت‌نام کنید و یک فرم جدید بسازید.
2. `YOUR_FORM_ID` را در `constants.ts` با شناسهٔ واقعی فرم جایگزین کنید.
3. اگر می‌خواهید فرم‌های مختلف (تماس/رزرو/عضویت) به فرم‌های جداگانه در Formspree بروند، برای هرکدام یک endpoint بسازید و به‌جای فیلد مشترک `formspreeEndpoint`، در هر کامپوننت فرم مقدار مخصوص را پاس دهید (کد فعلی این ساختار را با یک پرامتر اضافه به‌سادگی می‌پذیرد).
4. تا وقتی `YOUR_FORM_ID` جایگزین نشده، کد به‌صورت خودکار درخواست ارسال نمی‌کند (`if(!SITE.formspreeEndpoint.includes('YOUR_FORM_ID'))`) — یعنی فرم‌ها در محیط توسعه خطا نمی‌دهند، فقط واقعاً چیزی ارسال نمی‌شود.

## ۲. Supabase (گزینهٔ جایگزین/تکمیلی برای آینده)

برای قابلیت‌هایی که Formspree پاسخگو نیست (مثل داشبورد عضویت، شمارش ظرفیت
رویداد به‌صورت زنده، یا ذخیرهٔ وضعیت رزرو)، Supabase گزینهٔ پیشنهادی است چون
کاملاً کلاینت‌ساید قابل استفاده است (بدون نیاز به سرور Node).

### نکتهٔ امنیتی مهم
چون این سایت استاتیک است، هر کلیدی که در کد قرار بگیرد در مرورگر کاربر قابل
مشاهده است. **فقط از `anon` (public) key استفاده کنید، هرگز از `service_role`
key.** امنیت واقعی باید با **Row Level Security (RLS)** در سمت Supabase تأمین
شود (نه با مخفی‌کردن کلید).

### راه‌اندازی پیشنهادی
1. پروژه در [supabase.com](https://supabase.com) بسازید.
2. جدول‌های موردنیاز را بسازید، مثلاً:
   - `bookings` (رزرو اتاق): `id, name, phone, room, date, time_slot, status, created_at`
   - `memberships` (درخواست عضویت): `id, name, phone, plan, bar_license_number, status, created_at`
   - `event_registrations`: `id, event_slug, name, phone, created_at`
3. **RLS را فعال کنید** و فقط `INSERT` عمومی (بدون `SELECT`/`UPDATE`/`DELETE` عمومی) را برای کاربران ناشناس مجاز کنید؛ خواندن/مدیریت داده فقط از پنل ادمین Supabase یا با کاربر احراز‌هویت‌شدهٔ داخلی انجام شود.
4. کتابخانهٔ کلاینت را نصب کنید: `npm install @supabase/supabase-js`
5. در `.env.local` (که در گیت commit نمی‌شود؛ `.env.example` را الگو بگیرید):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxx
   ```
6. چون خروجی `next build` استاتیک است، این دو متغیر باید **در زمان build** (نه runtime) در دسترس باشند — یعنی هم در محیط لوکال (`.env.local`) و هم به‌صورت GitHub Actions Secret در `deploy-gh-pages.yml` تعریف شوند:
   ```yaml
   - name: Build static export
     run: npm run build
     env:
       NODE_ENV: production
       NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
       NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
   ```
7. یک کلاینت مشترک بسازید (`src/lib/supabase.ts`) و در فرم‌ها به‌جای/علاوه‌بر `fetch` به Formspree، `supabase.from('bookings').insert(...)` را صدا بزنید.

### تصمیم فعلی پروژه
در نسخهٔ حاضر فقط Formspree متصل است (ساده‌تر، بدون نیاز به جدول/RLS). اتصال
Supabase به‌عنوان گام بعدیِ اولویت متوسط در `docs/ROADMAP.md` ثبت شده و
معماری فعلی (توابع جدا برای هر فرم، عدم وابستگی سخت به یک سرویس) اجازه می‌دهد
بدون بازنویسی، این تغییر بعداً اعمال شود.
