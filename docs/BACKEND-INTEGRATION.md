# اتصال به سرویس‌های بیرونی

> همهٔ گزینه‌های این سند **اختیاری** هستند. سایت بدون هیچ‌کدامشان کامل کار می‌کند.
> هیچ‌کدام هم پیاده‌سازی نشده — کد آماده است و فقط منتظر کلید و آدرس است.

---

## چرا اصلاً به چیزی نیاز داریم

GitHub Pages فقط فایل استاتیک سرو می‌کند. هیچ کد سمت سروری اجرا نمی‌شود. پس برای هر
کاری که «حافظه» لازم دارد — ذخیرهٔ یک فرم، ورود کاربر، تأیید پرداخت — باید سراغ یک
سرویس بیرونی برویم که مستقیم از مرورگر کاربر صدا زده شود.

معماری فعلی برای همین آماده شده: همهٔ فرم‌ها از یک تابع رد می‌شوند.

---

## ۱. وضعیت فعلی: fallback واتساپ

### چطور کار می‌کند

همهٔ فرم‌ها `submitForm()` از `src/lib/submit.ts` را صدا می‌زنند:

```ts
export async function submitForm(kind, values): Promise<SubmitResult>
```

و سه حالت ممکن است برگرداند:

| حالت | معنی | کاربر چه می‌بیند |
| --- | --- | --- |
| `sent` | با موفقیت به سرویس رسید | پیام موفقیت |
| `fallback` | سرویسی تنظیم نشده یا شبکه قطع بود | دکمهٔ «ارسال از طریق واتساپ» با متن آماده |
| `error` | سرویس خطا برگرداند | پیام خطا + امکان تلاش دوباره |

**نکتهٔ طراحی:** فرم هیچ‌وقت بن‌بست نمی‌شود. اگر Formspree پیکربندی نشده باشد،
پیام کامل و قالب‌بندی‌شده در واتساپ باز می‌شود:

```
*درخواست عضویت*

نام: علی رضایی
شمارهٔ همراه: ۰۹۱۲۳۴۵۶۷۸۹
پلن: وکالت
دورهٔ پرداخت: سالانه
کد پیگیری: VH-05-8K2M1

— ارسال‌شده از سایت خانه وکلا
```

اطلاعات هیچ‌وقت گم نمی‌شود — بدترین حالت، رسیدنش از یک کانال دیگر است.

### اعتبارسنجی و ضدهرزنامه

پیش از هر ارسال، سه لایه اعمال می‌شود (`src/lib/validation.ts`):

| لایه | روش |
| --- | --- |
| اعتبارسنجی نوع و قالب | اسکیمای Zod برای هر فرم |
| تلهٔ ربات | فیلد مخفی `_gotcha` — انسان پرش نمی‌کند |
| سنجش زمان | ارسال زیر ۳ ثانیه از باز شدن فرم رد می‌شود |

> این‌ها سد نفوذناپذیر نیستند — روی سایت استاتیک چیزی نمی‌تواند باشد. ولی ۹۹٪ اسپم
> خودکار را می‌گیرند. لایهٔ جدی بعدی، reCAPTCHA خود Formspree است.

---

## ۲. Formspree — ساده‌ترین قدم بعدی

**مناسب برای:** رساندن فرم‌ها به ایمیل بدون هیچ کدنویسی.
**زمان لازم:** ۱۰ دقیقه · **هزینه:** رایگان تا ۵۰ ارسال در ماه

### راه‌اندازی

1. ثبت‌نام در [formspree.io](https://formspree.io/)
2. `New Form` → نام: «فرم‌های سایت خانه وکلا» → ایمیل مقصد را وارد کنید
3. آدرس فرم را کپی کنید: `https://formspree.io/f/xxxxxxxx`
4. در مخزن گیت‌هاب:
   `Settings` → `Secrets and variables` → `Actions` → تب **Variables** →
   `New repository variable`
   - Name: `FORMSPREE_ENDPOINT`
   - Value: آدرسی که کپی کردید
5. یک push بزنید (یا Workflow را دستی اجرا کنید)

تمام. `isFormspreeConfigured` خودکار `true` می‌شود و فرم‌ها مستقیم ارسال می‌شوند.

> **چرا Variable و نه Secret؟** این آدرس در HTML سایت دیده می‌شود، پس رازی نیست.
> Secret گذاشتنش فقط کار را سخت می‌کند بدون آنکه چیزی امن‌تر شود.

### برای توسعهٔ محلی

```bash
# .env.local
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

### تنظیمات پیشنهادی در پنل Formspree

| تنظیم | مقدار | چرا |
| --- | --- | --- |
| reCAPTCHA | روشن | لایهٔ جدی ضداسپم |
| Email notifications | روشن | اطلاع فوری |
| Autoresponse | روشن | «درخواست شما دریافت شد» برای کاربر |
| Allowed domains | `rahmaniho.github.io` | جلوگیری از سوءاستفاده از فرم شما در سایت دیگر |

### محدودیت‌ها

| محدودیت | راه‌حل |
| --- | --- |
| ۵۰ ارسال در ماه (رایگان) | ارتقا به پلن ۱۰ دلاری، یا رفتن سراغ Supabase |
| فقط ایمیل، بدون پایگاه داده | برای جست‌وجو و گزارش، Supabase لازم است |
| بدون احراز هویت | برای داشبورد عضو، Supabase لازم است |

---

## ۳. Supabase — وقتی پایگاه داده لازم شد

**مناسب برای:** ذخیرهٔ درخواست‌ها، داشبورد عضو، ظرفیت زندهٔ رویدادها.
**زمان لازم:** ۲ تا ۳ ساعت · **هزینه:** رایگان تا ۵۰۰MB و ۵۰٬۰۰۰ کاربر فعال ماهانه

### چرا Supabase و نه چیز دیگر

- REST API مستقیم از مرورگر — بدون نیاز به سرور واسط
- Row Level Security یعنی می‌شود یک کلید عمومی در HTML گذاشت بدون نگرانی
- PostgreSQL واقعی است، نه یک انبارهٔ کلید-مقدار
- احراز هویت، ذخیره‌سازی فایل و Realtime در همان بسته

### ۳٫۱ نصب

```bash
npm install @supabase/supabase-js
```

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

/**
 * کلید anon عمداً عمومی است. امنیت واقعی از Row Level Security می‌آید،
 * نه از پنهان کردن کلید. هر سیاستی که در پایگاه داده ننویسید، وجود ندارد.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

### ۳٫۲ جدول‌ها

```sql
-- درخواست‌های عضویت
create table membership_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz      default now(),
  tracking_code text unique not null,
  name          text not null,
  phone         text not null,
  email         text,
  role          text not null,           -- وکیل / کارآموز / حقوق‌دان
  license_number text,
  specialty     text,
  plan          text not null,           -- کارآموزی / وکالت / دفتر مجازی
  cycle         text not null,           -- ماهانه / فصلی / سالانه
  note          text,
  status        text default 'pending'   -- pending / approved / rejected
);

-- درخواست‌های رزرو اتاق
create table booking_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz      default now(),
  tracking_code text unique not null,
  name          text not null,
  phone         text not null,
  room_slug     text not null,
  booking_date  date not null,           -- تاریخ میلادی؛ تبدیل شمسی سمت کلاینت
  start_time    time not null,
  hours         int  not null,
  guests        int,
  is_member     boolean default false,
  estimated_price int,
  note          text,
  status        text default 'pending'
);

-- ثبت‌نام رویدادها
create table event_registrations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz      default now(),
  event_slug    text not null,
  name          text not null,
  phone         text not null,
  email         text,
  status        text default 'registered'
);
```

### ۳٫۳ سیاست‌های امنیتی (مهم‌ترین بخش)

```sql
alter table membership_requests enable row level security;
alter table booking_requests    enable row level security;
alter table event_registrations enable row level security;

-- هر بازدیدکننده‌ای می‌تواند درخواست ثبت کند…
create policy "ثبت درخواست عضویت برای همه"
  on membership_requests for insert to anon with check (true);

create policy "ثبت درخواست رزرو برای همه"
  on booking_requests for insert to anon with check (true);

create policy "ثبت‌نام رویداد برای همه"
  on event_registrations for insert to anon with check (true);

-- …ولی هیچ‌کس نمی‌تواند چیزی بخواند.
-- عمداً هیچ policy‌ای برای select ننوشته‌ایم: با RLS روشن، نبود سیاست
-- یعنی ممنوع. مدیریت از طریق داشبورد خود Supabase انجام می‌شود.
```

> ⚠️ اگر `enable row level security` را فراموش کنید، هر کسی با کلید anon می‌تواند کل
> جدول را بخواند. این تنها خطای جدی ممکن در این مسیر است.

### ۳٫۴ اتصال به کد موجود

فقط `submitForm()` را در `src/lib/submit.ts` گسترش دهید:

```ts
export async function submitForm(kind, values): Promise<SubmitResult> {
  const whatsappUrl = whatsappLink(SITE.whatsappNumber, buildWhatsappMessage(kind, values));

  // ۱. تلاش با Supabase
  if (isSupabaseConfigured) {
    const table = TABLE_BY_KIND[kind];
    if (table) {
      const { error } = await supabase.from(table).insert(toRow(kind, values));
      if (!error) return { status: 'sent' };
      console.error('[supabase]', error.message);
      // خطا خورد؟ ادامه بده به Formspree — داده را از دست نمی‌دهیم
    }
  }

  // ۲. تلاش با Formspree
  if (isFormspreeConfigured) { /* …کد فعلی… */ }

  // ۳. واتساپ
  return { status: 'fallback', whatsappUrl };
}
```

هیچ کامپوننت فرمی عوض نمی‌شود. همه همان `submitForm()` را صدا می‌زنند.

### ۳٫۵ ظرفیت زندهٔ رویدادها

امروز ظرفیت باقی‌مانده از داده‌های ثابت `src/lib/data/events.ts` می‌آید. با Supabase
می‌شود آن را زنده کرد:

```ts
'use client';
// در EventsExplorer
const { count } = await supabase
  .from('event_registrations')
  .select('*', { count: 'exact', head: true })
  .eq('event_slug', slug);

const remaining = event.capacity - (count ?? 0);
```

با `head: true` هیچ ردیفی منتقل نمی‌شود، فقط عدد.

> برای این کار به یک policy مخصوص `select` با `count` نیاز دارید که فقط شمارش را
> اجازه دهد. جزئیات در مستندات Supabase.

### ۳٫۶ داشبورد عضو (اختیاری)

```ts
// ورود با کد یک‌بارمصرف پیامکی/ایمیلی — بدون رمز عبور
await supabase.auth.signInWithOtp({ phone: '+98912…' });
```

مسیر پیشنهادی: `/dashboard/` با نمایش وضعیت عضویت، رزروهای گذشته و کارت دیجیتال.

> کارت عضویت با QR **همین حالا** کار می‌کند و به هیچ سروری نیاز ندارد. کد در
> `src/lib/qr.ts` و `src/components/membership/MembershipCard.tsx`.

### ۳٫۷ متغیرهای محیطی

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi…
```

و در Workflow:

```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ vars.SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ vars.SUPABASE_ANON_KEY }}
```

---

## ۴. گزینه‌های سبک‌تر

### Google Forms

**مناسب برای:** شروع سریع بدون هیچ حساب توسعه‌دهنده.

فرم را در Google Forms بسازید، لینکش را در دکمهٔ «درخواست عضویت» بگذارید. پاسخ‌ها در
Google Sheets جمع می‌شوند.

| مزیت | عیب |
| --- | --- |
| رایگان و نامحدود | ظاهرش با سایت هماهنگ نیست |
| بدون کد | کاربر از سایت خارج می‌شود |
| خروجی Sheets | اعتبارسنجی فارسی ضعیف |

### GitHub Issues به‌عنوان صندوق ورودی

**مناسب برای:** تیم فنی که همین‌جا کار می‌کند.

```
https://github.com/rahmaniho/Vokalahome/issues/new?template=membership.yml
```

با Issue Forms (فایل `.github/ISSUE_TEMPLATE/membership.yml`) می‌شود فرم ساختاریافته
ساخت. مزیت: اعلان، برچسب، تخصیص و تاریخچه — همه رایگان.

**عیب جدی:** همهٔ درخواست‌ها عمومی می‌شوند. برای اطلاعات شخصی موکلان **مناسب نیست**.

### Telegram Bot

**مناسب برای:** اطلاع فوری روی موبایل مدیر.

```ts
await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' }),
});
```

> ⚠️ توکن ربات در HTML دیده می‌شود. هرکسی می‌تواند با آن پیام بفرستد. فقط برای کانال
> اعلان غیرحساس مناسب است، نه به‌عنوان راه اصلی.

---

## ۵. درگاه پرداخت — طرح آینده

### وضعیت فعلی: عمداً بدون پرداخت

تصمیم پروژه این است که فعلاً هیچ درگاهی وصل نشود. به‌جایش:

- دکمهٔ «تماس برای رزرو» و «درخواست عضویت»
- هزینه **پیش از ارسال فرم** به‌صورت شفاف محاسبه و نمایش داده می‌شود
- تأیید نهایی از طریق تماس یا واتساپ

منطق قیمت‌گذاری همین حالا کامل است و در `src/components/consultation/BookingWidget.tsx`
اجرا می‌شود:

```
عضو:  min(ساعت، سقف رایگان پلن) رایگان + مازاد × تعرفهٔ مهمان
مهمان: ساعت × تعرفهٔ مهمان
```

### چرا درگاه ایرانی مستقیم روی سایت استاتیک نمی‌شود

همهٔ درگاه‌های ایرانی (زرین‌پال، ای‌دی‌پی، پی‌پینگ، IDPay) یک الگو دارند:

```
۱. سایت → درخواست پرداخت با کلید محرمانه → درگاه   ← کلید محرمانه!
۲. کاربر به صفحهٔ بانک می‌رود
۳. بانک → callback به سایت
۴. سایت → تأیید تراکنش با کلید محرمانه → درگاه     ← دوباره!
```

گام‌های ۱ و ۴ **حتماً** باید سمت سرور باشند. اگر کلید محرمانه را در جاوااسکریپت
بگذارید، هرکسی می‌تواند تراکنش جعلی تأیید کند. این یک محدودیت امنیتی است، نه فنی —
هیچ راه دور زدنی ندارد.

### سه راه واقعی، به‌ترتیب سادگی

**الف) Supabase Edge Function** — ساده‌ترین

```ts
// supabase/functions/payment/index.ts — روی سرور Supabase اجرا می‌شود
Deno.serve(async (req) => {
  const { amount, description } = await req.json();
  const res = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: Deno.env.get('ZARINPAL_MERCHANT_ID'),  // امن: سمت سرور
      amount, description,
      callback_url: 'https://vokalahome.ir/payment/verify/',
    }),
  });
  return new Response(await res.text(), { headers: { 'Content-Type': 'application/json' } });
});
```

سایت استاتیک می‌ماند؛ فقط یک تابع بیرونی اضافه می‌شود.

**ب) Cloudflare Workers** — رایگان تا ۱۰۰٬۰۰۰ درخواست روزانه، همان الگو.

**ج) مهاجرت به Vercel/Netlify** — `output: 'export'` را بردارید و API Route بنویسید.
بیشترین کنترل، ولی دیگر GitHub Pages نیستید.

### آنچه در هر سه حالت باید در این پروژه اضافه شود

| کار | فایل |
| --- | --- |
| صفحهٔ بازگشت از درگاه | `src/app/payment/verify/page.tsx` |
| نمایش وضعیت تراکنش | همان صفحه، با خواندن query string |
| ذخیرهٔ سفارش پیش از هدایت | جدول `orders` در Supabase |
| رسید و کد رهگیری | ایمیل یا نمایش در صفحه |

معماری فعلی برای این آماده است: کد پیگیری (`generateTrackingCode()`) و محاسبهٔ قیمت
همین حالا وجود دارند.

---

## ۶. حریم خصوصی و انطباق

با اتصال هر سرویس، این‌ها را به‌روز کنید:

- [ ] `src/app/privacy/page.tsx` — نام سرویس، نوع داده، مدت نگهداری
- [ ] چک‌باکس رضایت در فرم‌ها (همین حالا هست، متنش را بازبینی کنید)
- [ ] محل نگهداری داده (Formspree و Supabase هر دو خارج از ایران)
- [ ] روش حذف داده به درخواست کاربر

سایت **هیچ کوکی‌ای نمی‌گذارد** و هیچ ابزار تحلیلی ندارد. تنها چیزی که در مرورگر
ذخیره می‌شود، `localStorage` برای انتخاب تم روشن/تاریک است. اگر روزی Analytics اضافه
کردید، بنر رضایت لازم می‌شود.

---

## ۷. جدول تصمیم

| نیاز شما | راه‌حل | زمان |
| --- | --- | --- |
| فرم‌ها به ایمیل برسند | Formspree | ۱۰ دقیقه |
| اعلان فوری روی موبایل | Telegram Bot | ۳۰ دقیقه |
| ذخیره و جست‌وجوی درخواست‌ها | Supabase | ۲ ساعت |
| ظرفیت زندهٔ رویدادها | Supabase | +۱ ساعت |
| داشبورد عضو | Supabase Auth | +۴ ساعت |
| پرداخت آنلاین | Supabase Edge Function | +۸ ساعت |
| هیچ‌کدام | همین الان کار می‌کند | ۰ |
