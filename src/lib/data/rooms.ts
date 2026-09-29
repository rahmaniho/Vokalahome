import type { Room } from '@/types';
import { ROOM_RATE } from '@/lib/constants';

const member = ROOM_RATE.memberPrice;
const guest = `${ROOM_RATE.guestPrice} / ساعت`;

export const rooms: Room[] = [
  {
    slug: 'moshavere-1',
    name: 'اتاق مشاورهٔ «دادنامه»',
    capacity: '۳ نفر',
    seats: 3,
    area: '۱۲ متر',
    vibe: 'خلوت و آرام',
    description:
      'اتاقی کوچک و کاملاً عایق صدا برای گفت‌وگوی دونفره با موکل؛ مناسب پرونده‌های خانواده و موضوعات حساس که محرمانگی حرف اول را می‌زند.',
    equipment: ['عایق صوتی کامل', 'میز مشاوره و سه صندلی', 'پذیرایی چای و قهوه', 'نور طبیعی و گیاه'],
    memberPrice: member,
    guestPrice: guest,
    guestRate: ROOM_RATE.guestPriceRaw,
    icon: 'DoorClosed',
    image: '/images/gallery/room-consultation.jpg',
  },
  {
    slug: 'moshavere-2',
    name: 'اتاق مشاورهٔ «استیناف»',
    capacity: '۴ نفر',
    seats: 4,
    area: '۱۶ متر',
    vibe: 'رسمی',
    description:
      'اتاق رسمی با میز جلسه و نمای کتابخانه؛ برای جلساتی که موکل، شریک یا کارشناس هم حضور دارند و تصویر حرفه‌ای دفتر اهمیت دارد.',
    equipment: ['میز جلسهٔ چهارنفره', 'وایت‌برد', 'پریز و شارژر رومیزی', 'خدمات منشی و پذیرایی'],
    memberPrice: member,
    guestPrice: guest,
    guestRate: ROOM_RATE.guestPriceRaw,
    icon: 'Briefcase',
    image: '/images/gallery/room-consultation.jpg',
  },
  {
    slug: 'davari',
    name: 'اتاق داوری و سازش',
    capacity: '۸ نفر',
    seats: 8,
    area: '۲۸ متر',
    vibe: 'جلسات چندجانبه',
    description:
      'فضایی طراحی‌شده برای جلسات داوری، سازش و مذاکرهٔ قرارداد؛ با چیدمان بی‌طرف، ضبط صورت‌جلسه و اتاق انتظار مجزا برای طرفین.',
    equipment: ['میز داوری هشت‌نفره', 'اتاق انتظار مجزا', 'امکان تنظیم صورت‌جلسه', 'پرینتر و اسکنر'],
    memberPrice: member,
    guestPrice: guest,
    guestRate: ROOM_RATE.guestPriceRaw,
    icon: 'Scale',
    image: '/images/gallery/room-arbitration.jpg',
  },
  {
    slug: 'online',
    name: 'اتاق جلسهٔ آنلاین',
    capacity: '۲ نفر',
    seats: 2,
    area: '۸ متر',
    vibe: 'دیجیتال',
    description:
      'استودیوی کوچک برای دادرسی الکترونیک، جلسهٔ ویدیویی با موکل خارج از شهر و ضبط ویدیوهای آموزشی؛ با نور و صدای کنترل‌شده.',
    equipment: ['وب‌کم و میکروفن حرفه‌ای', 'نورپردازی ثابت', 'اینترنت اختصاصی پرسرعت', 'پس‌زمینهٔ رسمی'],
    memberPrice: member,
    guestPrice: guest,
    guestRate: ROOM_RATE.guestPriceRaw,
    icon: 'Video',
    image: '/images/gallery/room-consultation.jpg',
  },
  {
    slug: 'salon',
    name: 'سالن نشست علمی',
    capacity: '۴۵ نفر',
    seats: 45,
    area: '۹۰ متر',
    vibe: 'رویداد',
    description:
      'سالن چندمنظوره برای نشست‌های علمی، کارگاه‌های تخصصی و مراسم کانون؛ با ویدیوپروژکتور، سیستم صوت و امکان پخش زنده.',
    equipment: ['ویدیوپروژکتور و پرده', 'سیستم صوتی و میکروفن', 'امکان پخش زنده', 'پذیرایی میان‌وعده'],
    memberPrice: 'با هماهنگی دبیرخانه',
    guestPrice: 'بر اساس نوع رویداد',
    guestRate: null,
    icon: 'Presentation',
    image: '/images/gallery/event-hall.jpg',
  },
  {
    slug: 'motaleh',
    name: 'سالن مطالعه و لوایح',
    capacity: '۱۴ نفر',
    seats: 14,
    area: '۴۰ متر',
    vibe: 'سکوت مطلق',
    description:
      'میزهای تک‌نفره برای نوشتن لایحه، مطالعهٔ پرونده و تحقیق؛ در کنار کتابخانهٔ حقوقی و دسترسی به بانک آرای قضایی.',
    equipment: ['میز تک‌نفره با چراغ مطالعه', 'کتابخانهٔ حقوقی', 'دسترسی به بانک آرا', 'ناحیهٔ سکوت'],
    memberPrice: member,
    guestPrice: 'ساعتی ۱۵۰٬۰۰۰ تومان',
    guestRate: ROOM_RATE.studyGuestRaw,
    icon: 'BookOpenCheck',
    image: '/images/gallery/study-hall.jpg',
  },
];

export const getRoom = (slug: string) => rooms.find((item) => item.slug === slug);
