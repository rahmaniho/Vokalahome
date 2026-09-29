import { z } from 'zod';
import { toEn } from './utils';

/**
 * طرح‌های اعتبارسنجی فرم‌ها (Zod) — کاملاً سمت کلاینت.
 *
 * چون بک‌اندی نداریم، این لایه دو کار می‌کند:
 *   ۱. تجربهٔ کاربری: خطای فارسی، دقیق و نزدیک به همان فیلد
 *   ۲. بهداشت داده: چیزی که به Formspree/Supabase می‌رود تمیز و نرمال‌شده است
 *
 * ⚠️ اعتبارسنجی سمت کلاینت هرگز «امنیت» نیست؛ هر کسی می‌تواند دورش بزند.
 *    امنیت واقعی در سمت سرویس گیرنده (Formspree/Supabase RLS) اعمال می‌شود.
 *    توضیح کامل: docs/BACKEND-INTEGRATION.md
 */

/** شمارهٔ موبایل ایران — ارقام فارسی و پیش‌شماره‌های +98/0098 را هم می‌پذیرد. */
const iranMobile = z
  .string()
  .trim()
  .min(1, 'شمارهٔ همراه را وارد کنید')
  .transform((value) => toEn(value).replace(/[\s()-]/g, ''))
  .refine((value) => /^(?:\+?98|0)?9\d{9}$/.test(value), 'شمارهٔ همراه معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)')
  // همه چیز به شکل استاندارد 09xxxxxxxxx ذخیره می‌شود.
  .transform((value) => value.replace(/^(\+?98)/, '0').replace(/^0?9/, '09'));

const personName = z
  .string()
  .trim()
  .min(3, 'نام و نام خانوادگی را کامل بنویسید')
  .max(80, 'نام بیش از حد بلند است')
  .refine((value) => /[\u0600-\u06FFa-zA-Z]/.test(value), 'نام باید شامل حروف باشد');

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .refine((value) => value === '' || z.string().email().safeParse(value).success, 'ایمیل معتبر نیست')
  .optional()
  .or(z.literal(''));

/* ───────────────────────────── فرم تماس ───────────────────────────── */

export const contactSchema = z.object({
  name: personName,
  phone: iranMobile,
  email: optionalEmail,
  subject: z.string().trim().min(1, 'موضوع را انتخاب کنید'),
  message: z
    .string()
    .trim()
    .min(10, 'پیام باید دست‌کم ۱۰ نویسه باشد')
    .max(2000, 'پیام نباید بیش از ۲۰۰۰ نویسه باشد'),
  consent: z.literal(true, { errorMap: () => ({ message: 'برای ارسال، پذیرش قواعد لازم است' }) }),
});

export type ContactValues = z.infer<typeof contactSchema>;

/* ───────────────────────────── فرم عضویت ───────────────────────────── */

export const membershipSchema = z.object({
  name: personName,
  phone: iranMobile,
  email: optionalEmail,
  plan: z.string().min(1, 'یک پلن انتخاب کنید'),
  cycle: z.enum(['monthly', 'quarterly', 'yearly']),
  role: z.string().min(1, 'جایگاه حرفه‌ای را انتخاب کنید'),
  licenseNumber: z
    .string()
    .trim()
    .min(3, 'شمارهٔ پروانه یا کارنامه را وارد کنید')
    .max(30, 'شماره بیش از حد بلند است')
    .transform(toEn),
  specialty: z.string().trim().max(120).optional().or(z.literal('')),
  note: z.string().trim().max(1000, 'توضیح نباید بیش از ۱۰۰۰ نویسه باشد').optional().or(z.literal('')),
  consent: z.literal(true, { errorMap: () => ({ message: 'پذیرش قواعد خانه الزامی است' }) }),
});

export type MembershipValues = z.infer<typeof membershipSchema>;

/* ───────────────────────────── فرم رزرو اتاق ───────────────────────────── */

export const bookingSchema = z.object({
  name: personName,
  phone: iranMobile,
  room: z.string().min(1, 'یک فضا انتخاب کنید'),
  bookingType: z.enum(['member-room', 'guest-room', 'client-consult']),
  date: z.string().min(1, 'یک روز را از تقویم انتخاب کنید'),
  time: z.string().min(1, 'ساعت جلسه را انتخاب کنید'),
  hours: z.number().int().min(1, 'دست‌کم یک ساعت').max(8, 'بیشینه ۸ ساعت در هر رزرو'),
  guests: z.number().int().min(1).max(50),
  note: z.string().trim().max(600).optional().or(z.literal('')),
});

export type BookingValues = z.infer<typeof bookingSchema>;

/* ───────────────────────────── ابزار کمکی ───────────────────────────── */

/**
 * خطاهای Zod را به نقشهٔ ساده «نام فیلد → پیام» تبدیل می‌کند
 * تا کامپوننت فرم بتواند مستقیم زیر همان ورودی نمایشش دهد.
 */
export function collectErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_');
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

/**
 * حفاظت سادهٔ ضداسپم بدون CAPTCHA:
 *   • honeypot: فیلد مخفی که فقط ربات‌ها پرش می‌کنند
 *   • time-trap: فرمی که در کمتر از ۳ ثانیه پر شود تقریباً همیشه ربات است
 */
export const HONEYPOT_FIELD = '_gotcha';
export const MIN_FILL_SECONDS = 3;

export function isLikelyBot(formData: FormData, startedAt: number): boolean {
  if (String(formData.get(HONEYPOT_FIELD) ?? '').trim() !== '') return true;
  return (Date.now() - startedAt) / 1000 < MIN_FILL_SECONDS;
}
