import { SITE_URL } from './site';

/** اطلاعات پایه کسب‌وکار. تنها جایی که باید برای به‌روزرسانی اطلاعات تماس ویرایش شود. */
export const SITE = {
  name: 'خانه وکلا',
  legalName: 'خانه وکلا | باشگاه تخصصی و کافه حقوقی وکلا',
  tagline: 'جایی برای نشستن، اندیشیدن و وکالت کردن',
  latin: 'VOKALA HOUSE · LAWYERS CLUB & LEGAL CAFÉ',
  manager: 'علی کشاورز نجفی',
  managerTitle: 'وکیل پایه یک دادگستری، مؤسس خانه وکلا',

  phone: '۰۲۸-۳۳۲۲۲۲۲۲',
  phoneHref: 'tel:+982833222222',
  phoneE164: '+982833222222',
  mobile: '۰۹۱۲-۳۴۵-۶۷۸۹',
  whatsappNumber: '989123456789',
  whatsappHref: 'https://wa.me/989123456789',
  email: 'info@vokalahome.com',

  address: 'قزوین، خیابان خیام جنوبی، ساختمان خانه وکلا',
  shortAddress: 'قزوین، خیابان خیام جنوبی',
  city: 'قزوین',
  /** مختصات تقریبی خیابان خیام جنوبی قزوین — پیش از انتشار نهایی با موقعیت دقیق جایگزین شود. */
  geo: { lat: 36.2688, lng: 50.0041 },

  workHours: 'هر روز ۸ صبح تا ۲۲ شب (جمعه‌ها ۱۴ تا ۲۲)',

  /** آدرس فعلی انتشار؛ از src/lib/site.ts می‌آید تا با زیرمسیر GitHub Pages هماهنگ بماند. */
  url: SITE_URL,
  /** دامنه اختصاصی آینده — فعلاً فقط برای مستندسازی. */
  futureDomain: 'https://vokalahome.com',

  /** برای فعال شدن ارسال واقعی فرم‌ها، شناسه فرم Formspree را اینجا بگذارید. */
  formspreeEndpoint: process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID',

  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/',
  telegram: 'https://t.me/',
} as const;

/** بررسی می‌کند سرویس فرم واقعاً پیکربندی شده است یا هنوز نمونه است. */
export const isFormspreeConfigured = !SITE.formspreeEndpoint.includes('YOUR_FORM_ID');

/** تعرفه پایهٔ اتاق‌های مشاوره (تومان). */
export const ROOM_RATE = {
  memberPrice: 'رایگان',
  memberNote: 'برای اعضای خانه وکلا، بر اساس سقف ساعتی پلن',
  guestPrice: '۵۰۰٬۰۰۰ تومان',
  guestPriceRaw: 500_000,
  studyGuestRaw: 150_000,
  unit: 'هر ساعت',
  guestNote: 'برای وکلای غیرعضو، شامل پذیرایی و خدمات منشی',
} as const;

/** ساعات کاری به تفکیک روز هفته (getDay جاوااسکریپت: ۰=یکشنبه … ۶=شنبه). */
export const OPENING_HOURS: Record<number, { open: number; close: number }> = {
  0: { open: 8, close: 22 }, // یکشنبه
  1: { open: 8, close: 22 }, // دوشنبه
  2: { open: 8, close: 22 }, // سه‌شنبه
  3: { open: 8, close: 22 }, // چهارشنبه
  4: { open: 8, close: 22 }, // پنجشنبه
  5: { open: 14, close: 22 }, // جمعه
  6: { open: 8, close: 22 }, // شنبه
};

export const WEEKDAY_NAMES_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'] as const;

/**
 * منوی اصلی — دقیقاً مطابق سند بازطراحی:
 * خانه، خدمات، عضویت، رزرو اتاق، رویدادها، وبلاگ، درباره ما، تماس
 */
export const NAV_ITEMS = [
  { label: 'خانه', href: '/' },
  { label: 'خدمات', href: '/services/', hasMega: true },
  { label: 'عضویت', href: '/membership/' },
  { label: 'رزرو اتاق', href: '/rooms/' },
  { label: 'رویدادها', href: '/events/' },
  { label: 'وبلاگ', href: '/blog/' },
  { label: 'درباره ما', href: '/about/' },
  { label: 'تماس', href: '/contact/' },
] as const;

/** لینک‌های فرعی که در منوی موبایل و فوتر نمایش داده می‌شوند. */
export const SECONDARY_NAV = [
  { label: 'گالری و تور مجازی', href: '/gallery/' },
  { label: 'وکلای عضو', href: '/lawyers/' },
  { label: 'پرسش‌های پرتکرار', href: '/faq/' },
  { label: 'راهنمای برند', href: '/style-guide/' },
] as const;

export const CONSULTATION_TYPES = [
  {
    id: 'member-room',
    title: 'رزرو اتاق برای اعضا',
    short: 'اعضا',
    subtitle: 'جلسه با موکل در اتاق اختصاصی، در چارچوب سقف ساعتی عضویت',
    duration: '۶۰ دقیقه',
    price: 'رایگان برای اعضا',
    popular: true,
  },
  {
    id: 'guest-room',
    title: 'رزرو اتاق برای وکلای مهمان',
    short: 'مهمان',
    subtitle: 'اتاق مشاوره حرفه‌ای برای وکلایی که دفتر فیزیکی ندارند',
    duration: 'ساعتی',
    price: '۵۰۰٬۰۰۰ تومان / ساعت',
    popular: false,
  },
  {
    id: 'client-consult',
    title: 'مشاوره حقوقی برای مراجعان',
    short: 'مراجعان',
    subtitle: 'اتصال به وکیل عضو متناسب با موضوع پرونده شما',
    duration: '۴۵ دقیقه',
    price: 'بر اساس تعرفه وکیل',
    popular: false,
  },
] as const;

export const QUICK_FACTS = [
  { value: 180, suffix: '+', label: 'وکیل و کارآموز عضو' },
  { value: 6, suffix: '', label: 'اتاق مشاوره مجهز' },
  { value: 42, suffix: '', label: 'نشست علمی در سال' },
  { value: 14, suffix: ' ساعت', label: 'ساعت فعالیت روزانه' },
] as const;
