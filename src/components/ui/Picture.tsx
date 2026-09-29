import { IMAGE_MANIFEST } from '@/lib/generated/images';
import { withBase } from '@/lib/site';
import { cn } from '@/lib/utils';

type PictureProps = {
  /** مسیر تصویر منبع، مثل `/images/gallery/library.jpg` */
  src: string;
  alt: string;
  /** ویژگی sizes برای انتخاب درست نسخه توسط مرورگر */
  sizes?: string;
  /** تصویر بالای صفحه؟ اگر بله، بدون lazy و با اولویت بالا بارگذاری می‌شود. */
  priority?: boolean;
  className?: string;
  /** کلاس روی خود <img> */
  imgClassName?: string;
  /** نسبت ابعاد دلخواه؛ پیش‌فرض از خود تصویر می‌آید. */
  aspect?: string;
};

/**
 * تصویر واکنش‌گرا بدون بهینه‌ساز سمت سرور.
 *
 * چرا next/image نه؟ چون در حالت `output: export` بهینه‌ساز خاموش است و
 * next/image عملاً فقط یک <img> با srcset تک‌نسخه‌ای می‌شود. اینجا به‌جایش
 * از نسخه‌های AVIF/WebP که در زمان build ساخته شده‌اند استفاده می‌کنیم:
 *
 *   <picture>
 *     <source type="image/avif" srcset="…-640.avif 640w, …-1024.avif 1024w, …">
 *     <source type="image/webp" srcset="…">
 *     <img src="…jpg" width height loading decoding>
 *   </picture>
 *
 * پس‌زمینهٔ LQIP هم تا رسیدن تصویر اصلی نمایش داده می‌شود تا صفحه نپرد.
 */
export function Picture({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px',
  priority = false,
  className,
  imgClassName,
  aspect,
}: PictureProps) {
  const meta = IMAGE_MANIFEST[src];
  const base = src.replace(/\.(jpe?g|png)$/i, '');
  const ext = src.match(/\.(jpe?g|png)$/i)?.[0] ?? '.jpg';

  // اگر تصویر هنوز بهینه نشده، به سادگی خود فایل را نشان بده (خرابی نرم).
  if (!meta) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- بهینه‌ساز Next در حالت export خاموش است؛ نسخه‌های AVIF/WebP در زمان build ساخته می‌شوند.
      <img
        src={withBase(src)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={cn('block h-full w-full object-cover', className, imgClassName)}
      />
    );
  }

  const srcSet = (format: 'avif' | 'webp') =>
    meta.widths.map((width) => `${withBase(`${base}-${width}.${format}`)} ${width}w`).join(', ');

  /**
   * بیشتر فراخوانی‌ها نسبت ابعاد دلخواهشان را با کلاس Tailwind می‌دهند
   * (`className="aspect-[4/3]"`). سبک درون‌خطی همیشه بر کلاس غلبه می‌کند،
   * پس اگر بی‌قید `aspectRatio` را بنویسیم آن کلاس‌ها بی‌اثر می‌شوند و تصویر
   * با نسبت ذاتی خودش رندر می‌شود. بنابراین:
   *   • prop صریح `aspect` → بالاترین اولویت
   *   • کلاس aspect-* → دست نمی‌زنیم
   *   • هیچ‌کدام → نسبت ذاتی تصویر تا صفحه نپرد (CLS صفر)
   */
  const hasAspectClass = /(?:^|\s)aspect-/.test(className ?? '');
  const aspectRatio = aspect ?? (hasAspectClass ? undefined : `${meta.w} / ${meta.h}`);

  return (
    <picture
      className={cn('block overflow-hidden', className)}
      style={{
        // LQIP به‌عنوان پس‌زمینه: فضای تصویر از لحظهٔ اول رنگ درست دارد.
        backgroundImage: `url("${meta.blur}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        aspectRatio,
      }}
    >
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element -- عمدی: <picture> با srcSet از پیش‌ساخته، جایگزین next/image در حالت export */}
      <img
        src={withBase(`${base}${ext}`)}
        alt={alt}
        width={meta.w}
        height={meta.h}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        // fetchPriority به مرورگر می‌گوید تصویر LCP را زودتر بگیرد.
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={cn('block h-full w-full object-cover', imgClassName)}
      />
    </picture>
  );
}
