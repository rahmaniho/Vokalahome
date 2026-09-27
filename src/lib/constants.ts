export const SITE = {
  name: 'خانه وکیل',
  legalName: 'مؤسسه حقوقی خانه وکیل',
  manager: 'علی کشاورز نجفی',
  managerTitle: 'وکیل پایه یک دادگستری، عضو کانون وکلای قزوین',
  licenseNumber: '[شماره پروانه وکالت]',
  phone: '۰۲۸-۳۳۲۲۲۲۲۲',
  phoneHref: 'tel:+982833222222',
  mobile: '۰۹۱۲-۳۴۵-۶۷۸۹',
  whatsappHref: 'https://wa.me/989123456789',
  email: 'info@khanevokala.com',
  address: 'قزوین، خیابان خیام جنوبی، [پلاک و واحد]',
  shortAddress: 'قزوین، خیابان خیام جنوبی',
  workHours: 'شنبه تا پنجشنبه، ۹ تا ۱۹',
  domain: 'https://khanevokala.com',
  formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
  instagram: '[لینک اینستاگرام]',
  linkedin: '[لینک لینکدین]',
} as const;

export const NAV_ITEMS = [
  { label: 'صفحه نخست', href: '/' },
  { label: 'درباره ما', href: '/about/' },
  { label: 'خدمات حقوقی', href: '/services/' },
  { label: 'وکلای ما', href: '/lawyers/' },
  { label: 'دانش‌نامه', href: '/articles/' },
  { label: 'تماس با ما', href: '/contact/' },
] as const;

export const CONSULTATION_TYPES = [
  { id: 'in-person', title: 'مشاوره حضوری', subtitle: 'گفت‌وگوی عمیق در دفتر مؤسسه', duration: '۶۰ دقیقه', price: '[تعرفه] تومان', popular: false },
  { id: 'phone', title: 'مشاوره تلفنی', subtitle: 'پاسخ دقیق، بدون نیاز به مراجعه', duration: '۳۰ دقیقه', price: '[تعرفه] تومان', popular: true },
  { id: 'online', title: 'مشاوره آنلاین', subtitle: 'جلسه تصویری امن و محرمانه', duration: '۴۵ دقیقه', price: '[تعرفه] تومان', popular: false },
] as const;
