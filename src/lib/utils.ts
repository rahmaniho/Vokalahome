import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OPENING_HOURS, WEEKDAY_NAMES_FA } from './constants';

/** ادغام امن کلاس‌های Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** تبدیل ارقام لاتین به فارسی. */
export function toFa(value: string | number) {
  return String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)]);
}

/** تبدیل ارقام فارسی/عربی به لاتین — برای اعتبارسنجی ورودی کاربر. */
export function toEn(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

/** جداکننده هزارگان فارسی: 500000 → «۵۰۰٬۰۰۰». */
export function formatToman(amount: number) {
  return toFa(amount.toLocaleString('en-US').replace(/,/g, '٬'));
}

/** کد پیگیری ۸ رقمی برای رزرو و عضویت. */
export function generateTrackingCode() {
  return Math.floor(10_000_000 + Math.random() * 90_000_000).toString();
}

/** ساخت متن سلاگ‌مانند برای id سرفصل‌ها (سازگار با فارسی). */
export function slugifyHeading(text: string, index: number) {
  const base = text
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return base ? `${base}-${index}` : `heading-${index}`;
}

export type OpenState = {
  isOpen: boolean;
  /** پیام کوتاه فارسی برای نمایش کنار نشانگر. */
  label: string;
  /** ساعت باز/بسته شدن امروز. */
  todayRange: string;
  weekdayName: string;
};

/**
 * وضعیت باز/بسته بودن را از روی ساعت محلی مرورگر حساب می‌کند.
 * چون سایت استاتیک است، این محاسبه فقط سمت کلاینت (بعد از mount) انجام می‌شود
 * تا HTML سرور و کلاینت اختلاف پیدا نکنند.
 */
export function getOpenState(now = new Date()): OpenState {
  const day = now.getDay();
  const { open, close } = OPENING_HOURS[day];
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isOpen = minutes >= open * 60 && minutes < close * 60;
  const weekdayName = WEEKDAY_NAMES_FA[day];
  const todayRange = `${toFa(open)}:۰۰ تا ${toFa(close)}:۰۰`;

  let label: string;
  if (isOpen) {
    const remaining = close * 60 - minutes;
    label = remaining <= 60 ? `تا ${toFa(remaining)} دقیقه دیگر باز است` : `هم‌اکنون باز است · تا ${toFa(close)}:۰۰`;
  } else if (minutes < open * 60) {
    label = `امروز از ساعت ${toFa(open)}:۰۰ باز می‌شود`;
  } else {
    const tomorrow = OPENING_HOURS[(day + 1) % 7];
    label = `اکنون بسته است · فردا ${toFa(tomorrow.open)}:۰۰`;
  }

  return { isOpen, label, todayRange, weekdayName };
}

/** ساخت لینک واتساپ با پیام آماده. */
export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
