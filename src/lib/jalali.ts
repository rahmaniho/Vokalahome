import { toGregorian } from 'jalaali-js';

// این پروژه از قبل برای ویجت تقویم رزرو (BookingWidget) به «jalaali-js» وابسته
// است؛ به‌جای پیاده‌سازی دوبارهٔ الگوریتم تبدیل تاریخ، همان کتابخانه را برای
// ساخت تاریخ ISO در JSON-LD مقالات هم استفاده می‌کنیم (تک منبع حقیقت).

const MONTHS: Record<string, number> = {
  فروردین: 1,
  اردیبهشت: 2,
  خرداد: 3,
  تیر: 4,
  مرداد: 5,
  شهریور: 6,
  مهر: 7,
  آبان: 8,
  آذر: 9,
  دی: 10,
  بهمن: 11,
  اسفند: 12,
};

const persianDigits: Record<string, string> = {
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

function toEnglishDigits(value: string) {
  return value.replace(/[۰-۹]/g, (ch) => persianDigits[ch] ?? ch);
}

/**
 * رشتهٔ فارسیِ «۱۸ شهریور ۱۴۰۴» را به تاریخ ISO میلادی (YYYY-MM-DD) تبدیل می‌کند.
 * اگر رشته قابل‌تشخیص نباشد، undefined برمی‌گرداند تا فراخوان تصمیم بگیرد.
 */
export function persianDateToISO(value: string): string | undefined {
  const parts = toEnglishDigits(value.trim()).split(/\s+/);
  if (parts.length !== 3) return undefined;
  const [dayStr, monthName, yearStr] = parts;
  const day = Number(dayStr);
  const year = Number(yearStr);
  const month = MONTHS[monthName];
  if (!month || Number.isNaN(day) || Number.isNaN(year)) return undefined;
  try {
    const { gy, gm, gd } = toGregorian(year, month, day);
    const mm = String(gm).padStart(2, '0');
    const dd = String(gd).padStart(2, '0');
    return `${gy}-${mm}-${dd}`;
  } catch {
    return undefined;
  }
}
