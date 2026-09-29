import type { BillingCycle, MembershipPlan } from '@/types';

/**
 * پلن‌های عضویت.
 * قیمت پایه «ماهانه» است؛ دوره‌های بلندتر با تخفیف از همین عدد محاسبه می‌شوند
 * تا هیچ‌وقت دو عدد ناهماهنگ در سایت نداشته باشیم.
 */
export const plans: MembershipPlan[] = [
  {
    slug: 'karamouz',
    name: 'عضویت کارآموزی',
    audience: 'کارآموزان وکالت و دانشجویان ارشد حقوق',
    monthlyPrice: 990_000,
    priceNote: 'تومان',
    roomHours: '۴ ساعت اتاق مشاوره در ماه',
    freeRoomHours: 4,
    badge: 'شروع مسیر',
    features: [
      'دسترسی نامحدود به سالن مطالعه و میزهای اشتراکی',
      'یک نوشیدنی در هر حضور، مهمان خانه وکلا',
      'حضور رایگان در نشست‌های علمی ماهانه',
      'دسترسی به کتابخانهٔ حقوقی و آرشیو آرای وحدت رویه',
      'امکان معرفی به وکلای باتجربه برای کارآموزی عملی',
    ],
    excluded: ['پروفایل عمومی در فهرست وکلای عضو', 'ارجاع مستقیم مراجعان'],
  },
  {
    slug: 'vakil',
    name: 'عضویت وکالت',
    audience: 'وکلای پایه یک و پایه دو دادگستری',
    monthlyPrice: 2_400_000,
    priceNote: 'تومان',
    roomHours: '۱۲ ساعت اتاق مشاوره در ماه، رایگان',
    freeRoomHours: 12,
    highlight: true,
    badge: 'محبوب‌ترین',
    features: [
      'رزرو رایگان اتاق‌های مشاوره تا سقف ۱۲ ساعت در ماه',
      'نشانی حرفه‌ای خانه وکلا برای معرفی به موکل',
      'پروفایل اختصاصی در فهرست وکلای عضو',
      'ارجاع مراجعان متناسب با تخصص شما',
      'پذیرایی اختصاصی جلسات و خدمات منشی',
      'عضویت در گروه تخصصی تبادل تجربه و پرونده',
    ],
    excluded: ['اتاق اختصاصی ثابت'],
  },
  {
    slug: 'daftar',
    name: 'عضویت دفتر مجازی',
    audience: 'وکلای بدون دفتر فیزیکی و تیم‌های حقوقی کوچک',
    monthlyPrice: 4_900_000,
    priceNote: 'تومان',
    roomHours: '۴۰ ساعت اتاق مشاوره در ماه، رایگان',
    freeRoomHours: 40,
    badge: 'کامل‌ترین',
    features: [
      'تمام مزایای عضویت وکالت',
      'میز ثابت اختصاصی با کمد شخصی و قفل',
      'ثبت نشانی و دریافت مکاتبات پستی به نام شما',
      'منشی پاسخ‌گوی تماس‌ها در ساعات کاری',
      'اولویت رزرو سالن جلسات و اتاق داوری',
      'امکان برگزاری دو رویداد تخصصی در سال به نام شما',
    ],
  },
];

/** تعریف دوره‌های پرداخت و تخفیف هرکدام. */
export const BILLING_CYCLES: Record<
  BillingCycle,
  { label: string; months: number; discount: number; note: string; badge?: string }
> = {
  monthly: { label: 'ماهانه', months: 1, discount: 0, note: 'پرداخت هر ماه · لغو در هر زمان' },
  quarterly: { label: 'سه‌ماهه', months: 3, discount: 0.1, note: 'پرداخت هر سه ماه', badge: '۱۰٪ تخفیف' },
  yearly: { label: 'سالانه', months: 12, discount: 0.2, note: 'پرداخت یک‌جا برای یک سال', badge: '۲۰٪ تخفیف' },
};

/**
 * قیمت یک پلن در یک دورهٔ مشخص.
 * مبلغ به نزدیک‌ترین ۱۰٬۰۰۰ تومان گرد می‌شود تا عدد نهایی تمیز بماند.
 */
export function planPrice(plan: MembershipPlan, cycle: BillingCycle) {
  const { months, discount } = BILLING_CYCLES[cycle];
  const gross = plan.monthlyPrice * months;
  const total = Math.round((gross * (1 - discount)) / 10_000) * 10_000;
  return {
    total,
    /** معادل ماهانهٔ همین پرداخت، برای مقایسهٔ منصفانه */
    perMonth: Math.round(total / months / 10_000) * 10_000,
    saved: gross - total,
    months,
  };
}

export const getPlan = (slug: string) => plans.find((item) => item.slug === slug);

export const membershipSteps = [
  ['۱', 'ثبت درخواست', 'فرم عضویت را تکمیل کنید و پلن مورد نظر را انتخاب کنید.'],
  ['۲', 'احراز پروانه', 'تصویر پروانهٔ وکالت یا کارنامهٔ کارآموزی بررسی و تأیید می‌شود.'],
  ['۳', 'گفت‌وگوی آشنایی', 'یک قهوه در خانه وکلا؛ فضا، قواعد و امکانات را با هم مرور می‌کنیم.'],
  ['۴', 'فعال‌سازی عضویت', 'کارت عضویت، پنل رزرو اتاق و پروفایل عمومی شما فعال می‌شود.'],
] as const;

/**
 * سطرهای جدول مقایسهٔ پلن‌ها.
 * مقدار می‌تواند متن باشد یا boolean (تیک/ضربدر).
 */
export const PLAN_COMPARISON: { group: string; rows: { feature: string; values: (string | boolean)[] }[] }[] = [
  {
    group: 'فضا و اتاق',
    rows: [
      { feature: 'سالن مطالعه و میز اشتراکی', values: [true, true, true] },
      { feature: 'ساعت رایگان اتاق مشاوره در ماه', values: ['۴ ساعت', '۱۲ ساعت', '۴۰ ساعت'] },
      { feature: 'میز ثابت اختصاصی با کمد', values: [false, false, true] },
      { feature: 'اولویت رزرو سالن جلسات', values: [false, false, true] },
      { feature: 'اتاق داوری و سازش', values: [false, true, true] },
    ],
  },
  {
    group: 'حرفه‌ای و بازاریابی',
    rows: [
      { feature: 'پروفایل عمومی در فهرست وکلا', values: [false, true, true] },
      { feature: 'ارجاع مراجعان بر اساس تخصص', values: [false, true, true] },
      { feature: 'نشانی حرفه‌ای برای معرفی به موکل', values: [false, true, true] },
      { feature: 'ثبت نشانی پستی و دریافت مکاتبات', values: [false, false, true] },
      { feature: 'منشی پاسخ‌گوی تماس‌ها', values: [false, false, true] },
    ],
  },
  {
    group: 'دانش و شبکه',
    rows: [
      { feature: 'حضور در نشست‌های علمی', values: ['رایگان', 'رایگان', 'رایگان'] },
      { feature: 'کارگاه‌های تخصصی', values: ['۵۰٪ تخفیف', 'رایگان', 'رایگان'] },
      { feature: 'کتابخانه و بانک آرای قضایی', values: [true, true, true] },
      { feature: 'گروه تخصصی تبادل پرونده', values: [false, true, true] },
      { feature: 'برگزاری رویداد به نام خودتان', values: [false, false, '۲ بار در سال'] },
    ],
  },
  {
    group: 'کافه',
    rows: [
      { feature: 'تخفیف منوی کافه', values: ['۱۵٪', '۲۵٪', '۳۵٪'] },
      { feature: 'نوشیدنی مهمان در هر حضور', values: [true, true, true] },
      { feature: 'پذیرایی اختصاصی جلسات', values: [false, true, true] },
    ],
  },
];
