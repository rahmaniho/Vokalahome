export type GalleryCategory = 'cafe' | 'rooms' | 'library';

export type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategory;
};

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: 'cafe', label: 'کافه' },
  { id: 'rooms', label: 'اتاق مشاوره' },
  { id: 'library', label: 'کتابخانه' },
];

// همهٔ مسیرها نسبت به public/ هستند؛ در زمان رندر با asset() پیشوند basePath می‌گیرند.
export const galleryImages: GalleryImage[] = [
  { src: '/images/hero/lawyers-cafe.webp', alt: 'فضای نشیمن کافه خانه وکلا', category: 'cafe' },
  { src: '/images/gallery/cafe-interior.webp', alt: 'میزهای مطالعه و کار در کافه', category: 'cafe' },
  { src: '/images/cafe/coffee-and-case.webp', alt: 'قهوه و پرونده روی میز کافه', category: 'cafe' },
  { src: '/images/gallery/reception.webp', alt: 'پذیرش و سالن انتظار خانه وکلا', category: 'cafe' },
  { src: '/images/rooms/consultation-room.webp', alt: 'اتاق مشاورهٔ «دادنامه»', category: 'rooms' },
  { src: '/images/gallery/meeting-room.webp', alt: 'اتاق جلسهٔ رسمی «استیناف»', category: 'rooms' },
  { src: '/images/gallery/library.webp', alt: 'کتابخانه و سالن مطالعهٔ حقوقی', category: 'library' },
];

export const panoramaTour = {
  src: '/images/gallery/panorama-cafe-360.webp',
  title: 'تور مجازی ۳۶۰ درجهٔ کافه خانه وکلا (نمونه)',
};
