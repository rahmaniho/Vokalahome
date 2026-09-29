export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  longDescription: string;
  duration: string;
  subservices: string[];
  documents: string[];
  steps: string[];
  fee: string;
};

export type Lawyer = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  tags: string[];
  experience: string;
  image?: string;
  bio: string;
  education: string[];
  /** پروفایل نمونه است و باید با اطلاعات واقعی جایگزین شود. */
  placeholder?: boolean;
};

/** بلوک محتوایی یک مطلب وبلاگ. */
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; source?: string };

export type ArticleSection = {
  heading: string;
  blocks: ArticleBlock[];
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  /** تاریخ نمایشی فارسی */
  date: string;
  /** تاریخ ISO برای sitemap، RSS و JSON-LD */
  isoDate: string;
  readTime: string;
  excerpt: string;
  author: string;
  image?: string;
  featured?: boolean;
  sections: ArticleSection[];
};

export type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

/** دورهٔ پرداخت عضویت. */
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export type MembershipPlan = {
  slug: string;
  name: string;
  audience: string;
  /** قیمت پایه ماهانه به تومان؛ قیمت سه‌ماهه و سالانه از روی آن با تخفیف حساب می‌شود. */
  monthlyPrice: number;
  priceNote: string;
  roomHours: string;
  /** سقف ساعت رایگان اتاق در ماه — برای ماشین‌حساب رزرو */
  freeRoomHours: number;
  highlight?: boolean;
  badge?: string;
  features: string[];
  excluded?: string[];
};

export type Room = {
  slug: string;
  name: string;
  capacity: string;
  /** ظرفیت عددی برای فیلتر و محاسبه */
  seats: number;
  area: string;
  vibe: string;
  description: string;
  equipment: string[];
  memberPrice: string;
  guestPrice: string;
  /** نرخ ساعتی مهمان به تومان؛ null یعنی «با هماهنگی» */
  guestRate: number | null;
  icon: string;
  image?: string;
};

export type EventCategory = 'نشست علمی' | 'کارگاه' | 'میزگرد' | 'دورهمی';

export type ClubEvent = {
  slug: string;
  title: string;
  type: EventCategory;
  /** تاریخ نمایشی فارسی */
  date: string;
  /** تاریخ شمسی به شکل YYYY/MM/DD برای نمایش در تقویم */
  jalaliDate: string;
  /** تاریخ و ساعت ISO برای JSON-LD */
  isoStart?: string;
  isoEnd?: string;
  time: string;
  speaker: string;
  speakerRole: string;
  /** ظرفیت کل و تعداد ثبت‌نام‌شده — به‌صورت دستی یا از Supabase به‌روز می‌شود */
  capacity: number;
  registered: number;
  fee: string;
  isFree: boolean;
  summary: string;
  /** سرفصل‌های برنامه */
  agenda?: { time: string; title: string }[];
  takeaways?: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** مخاطب: وکیل عضو یا مراجع */
  kind: 'وکیل عضو' | 'کارآموز' | 'مراجع';
};

export type GalleryItem = {
  id: string;
  title: string;
  category: 'کافه' | 'اتاق مشاوره' | 'کتابخانه' | 'رویداد';
  src: string;
  /** نسبت ابعاد برای رزرو فضا و جلوگیری از پرش چیدمان (CLS) */
  width: number;
  height: number;
  description: string;
};
