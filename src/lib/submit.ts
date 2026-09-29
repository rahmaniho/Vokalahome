import { SITE, isFormspreeConfigured } from './constants';
import { whatsappLink } from './utils';

/**
 * لایهٔ ارسال فرم‌ها.
 *
 * معماری عمداً «افزونه‌پذیر» است: امروز Formspree، فردا Supabase یا هر چیز
 * دیگری، بدون تغییر در کامپوننت‌های فرم. راهنما: docs/BACKEND-INTEGRATION.md
 *
 * اگر هیچ سرویسی پیکربندی نشده باشد، فرم شکست نمی‌خورد؛ به حالت
 * «ارسال از طریق واتساپ» برمی‌گردد تا کاربر هیچ‌وقت به بن‌بست نخورد.
 */

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'fallback'; whatsappUrl: string }
  | { status: 'error'; message: string };

/** هر فرم یک عنوان انسانی دارد تا پیام واتساپ و ایمیل قابل فهم باشد. */
const FORM_TITLES: Record<string, string> = {
  contact: 'پیام از فرم تماس',
  question: 'پرسش حقوقی',
  membership: 'درخواست عضویت',
  booking: 'درخواست رزرو اتاق',
  event: 'ثبت‌نام رویداد',
};

const FIELD_LABELS: Record<string, string> = {
  name: 'نام',
  phone: 'شمارهٔ همراه',
  email: 'ایمیل',
  subject: 'موضوع',
  message: 'پیام',
  plan: 'پلن',
  cycle: 'دورهٔ پرداخت',
  role: 'جایگاه حرفه‌ای',
  licenseNumber: 'شمارهٔ پروانه',
  specialty: 'تخصص',
  room: 'فضا',
  bookingType: 'نوع رزرو',
  date: 'تاریخ',
  time: 'ساعت',
  hours: 'مدت (ساعت)',
  guests: 'تعداد مهمان',
  note: 'توضیح',
  trackingCode: 'کد پیگیری',
  estimatedPrice: 'برآورد هزینه',
  event: 'رویداد',
};

/** پیام خوانا برای واتساپ می‌سازد. */
export function buildWhatsappMessage(kind: string, values: Record<string, unknown>) {
  const lines = [`*${FORM_TITLES[kind] ?? 'پیام از سایت خانه وکلا'}*`, ''];
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === '' || key.startsWith('_')) continue;
    if (key === 'consent') continue;
    lines.push(`${FIELD_LABELS[key] ?? key}: ${value}`);
  }
  lines.push('', '— ارسال‌شده از سایت خانه وکلا');
  return lines.join('\n');
}

/**
 * ارسال داده‌های فرم.
 * @param kind شناسهٔ فرم، برای دسته‌بندی در سرویس مقصد
 * @param values مقادیر معتبرشده (خروجی Zod)
 */
export async function submitForm(kind: string, values: Record<string, unknown>): Promise<SubmitResult> {
  const whatsappUrl = whatsappLink(SITE.whatsappNumber, buildWhatsappMessage(kind, values));

  // هنوز سرویسی وصل نشده؟ کاربر را به واتساپ هدایت کن، نه به خطا.
  if (!isFormspreeConfigured) {
    return { status: 'fallback', whatsappUrl };
  }

  try {
    const response = await fetch(SITE.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `${FORM_TITLES[kind] ?? 'پیام سایت'} — خانه وکلا`,
        formKind: kind,
        ...values,
      }),
    });

    if (response.ok) return { status: 'sent' };

    // Formspree خطاهای اعتبارسنجی خودش را با ۴۲۲ برمی‌گرداند.
    const body = (await response.json().catch(() => null)) as { errors?: { message: string }[] } | null;
    const message = body?.errors?.[0]?.message ?? 'ارسال فرم با خطا مواجه شد.';
    return { status: 'error', message };
  } catch {
    // قطعی شبکه یا آفلاین بودن کاربر: مسیر جایگزین پیشنهاد می‌شود.
    return { status: 'fallback', whatsappUrl };
  }
}
