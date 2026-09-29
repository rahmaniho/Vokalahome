import type { GalleryItem } from '@/types';

/**
 * گالری تصاویر خانه وکلا.
 *
 * ⚠️ تصاویر فعلی «تصویرسازی مفهومی» از فضای خانه وکلا هستند و باید پیش از
 * انتشار نهایی با عکس‌های واقعی محل جایگزین شوند. برای جایگزینی:
 *   ۱. فایل JPG را با همان نام در public/images/gallery/ بگذارید
 *   ۲. `npm run images` را اجرا کنید تا نسخه‌های WebP/AVIF ساخته شود
 */
export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'سالن اصلی کافه',
    category: 'کافه',
    src: '/images/gallery/cafe-main.jpg',
    width: 1376,
    height: 768,
    description: 'میزهای چوبی، نور گرم و قفسه‌های کتاب حقوقی؛ جایی که بیشتر گفت‌وگوهای خانه اینجا شکل می‌گیرد.',
  },
  {
    id: 'g2',
    title: 'بار قهوهٔ تخصصی',
    category: 'کافه',
    src: '/images/gallery/cafe-bar.jpg',
    width: 1408,
    height: 768,
    description: 'اسپرسوساز برنجی و منوی تخصصی؛ برای اعضا با تخفیف دائمی.',
  },
  {
    id: 'g3',
    title: 'اتاق مشاورهٔ «دادنامه»',
    category: 'اتاق مشاوره',
    src: '/images/gallery/room-consultation.jpg',
    width: 1376,
    height: 768,
    description: 'اتاق سه‌نفرهٔ عایق صدا با میز گرد؛ مناسب گفت‌وگوهای حساس و محرمانه.',
  },
  {
    id: 'g4',
    title: 'اتاق داوری و سازش',
    category: 'اتاق مشاوره',
    src: '/images/gallery/room-arbitration.jpg',
    width: 1408,
    height: 768,
    description: 'میز هشت‌نفره با چیدمان بی‌طرف، وایت‌برد و اتاق انتظار مجزا برای طرفین.',
  },
  {
    id: 'g5',
    title: 'کتابخانهٔ حقوقی',
    category: 'کتابخانه',
    src: '/images/gallery/library.jpg',
    width: 1408,
    height: 768,
    description: 'مجموعه قوانین، کتب تخصصی و آرشیو آرای وحدت رویه، به‌همراه میزهای مطالعه.',
  },
  {
    id: 'g6',
    title: 'سالن مطالعه و لوایح',
    category: 'کتابخانه',
    src: '/images/gallery/study-hall.jpg',
    width: 1408,
    height: 768,
    description: 'میزهای تک‌نفره با پارتیشن و چراغ مطالعه؛ ناحیهٔ سکوت مطلق برای نوشتن لایحه.',
  },
  {
    id: 'g7',
    title: 'سالن نشست علمی',
    category: 'رویداد',
    src: '/images/gallery/event-hall.jpg',
    width: 1408,
    height: 768,
    description: 'ظرفیت ۴۵ نفر، ویدیوپروژکتور، سیستم صوتی و امکان پخش زنده.',
  },
];

export const GALLERY_CATEGORIES = ['همه', 'کافه', 'اتاق مشاوره', 'کتابخانه', 'رویداد'] as const;

/**
 * صحنه‌های تور مجازی ۳۶۰ درجه.
 * تصاویر باید «equirectangular» با نسبت دقیق ۲:۱ باشند.
 */
export const panoramas = [
  {
    id: 'cafe',
    title: 'سالن کافه و کتابخانه',
    src: '/images/panorama/tour-cafe.jpg',
    description: 'نمای ۳۶۰ درجه از سالن اصلی: بار قهوه، میزهای گفت‌وگو، قفسه‌های کتاب و ورودی اتاق‌های مشاوره.',
  },
] as const;
