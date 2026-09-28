export const SITE = {
  name: 'خانه وکلا',
  legalName: 'خانه وکلا | باشگاه تخصصی و کافه حقوقی وکلا',
  tagline: 'جایی برای نشستن، اندیشیدن و وکالت کردن',
  latin: 'VOKALA HOUSE · LAWYERS CLUB & LEGAL CAFÉ',
  manager: 'علی کشاورز نجفی',
  managerTitle: 'وکیل پایه یک دادگستری، مؤسس خانه وکلا',
  phone: '۰۲۸-۳۳۲۲۲۲۲۲',
  phoneHref: 'tel:+982833222222',
  mobile: '۰۹۱۲-۳۴۵-۶۷۸۹',
  whatsappHref: 'https://wa.me/989123456789',
  email: 'info@vokalahome.com',
  address: 'قزوین، خیابان خیام جنوبی، ساختمان خانه وکلا',
  shortAddress: 'قزوین، خیابان خیام جنوبی',
  workHours: 'هر روز ۸ صبح تا ۲۲ شب (جمعه‌ها ۱۴ تا ۲۲)',
  domain: 'https://vokalahome.com',
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/',
} as const;

/** تعرفه پایهٔ اتاق‌های مشاوره */
export const ROOM_RATE = {
  memberPrice: 'رایگان',
  memberNote: 'برای اعضای خانه وکلا، بر اساس سقف ساعتی پلن',
  guestPrice: '۵۰۰٬۰۰۰ تومان',
  guestPriceRaw: 500000,
  unit: 'هر ساعت',
  guestNote: 'برای وکلای غیرعضو، شامل پذیرایی و خدمات منشی',
} as const;

export const NAV_ITEMS = [
  { label: 'صفحه نخست', href: '/' },
  { label: 'درباره خانه', href: '/about/' },
  { label: 'امکانات', href: '/services/' },
  { label: 'عضویت', href: '/membership/' },
  { label: 'اتاق‌های مشاوره', href: '/rooms/' },
  { label: 'رویدادها', href: '/events/' },
  { label: 'وکلای عضو', href: '/lawyers/' },
  { label: 'دانش‌نامه', href: '/articles/' },
  { label: 'تماس', href: '/contact/' },
] as const;

export const CONSULTATION_TYPES = [
  {
    id: 'member-room',
    title: 'رزرو اتاق برای اعضا',
    subtitle: 'جلسه با موکل در اتاق اختصاصی، در چارچوب سقف ساعتی عضویت',
    duration: '۶۰ دقیقه',
    price: 'رایگان برای اعضا',
    popular: true,
  },
  {
    id: 'guest-room',
    title: 'رزرو اتاق برای وکلای مهمان',
    subtitle: 'اتاق مشاوره حرفه‌ای برای وکلایی که دفتر فیزیکی ندارند',
    duration: 'ساعتی',
    price: '۵۰۰٬۰۰۰ تومان / ساعت',
    popular: false,
  },
  {
    id: 'client-consult',
    title: 'مشاوره حقوقی برای مراجعان',
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
  { value: 14, suffix: 'ساعت', label: 'ساعت فعالیت روزانه' },
] as const;
