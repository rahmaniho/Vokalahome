'use client';

import { cn } from '@/lib/utils';

/**
 * دکمهٔ همبرگر با انیمیشن تبدیل به «ضربدر».
 *
 * سه خط با `transform` جابه‌جا و چرخانده می‌شوند — هیچ آیکون دومی سوییچ
 * نمی‌شود، پس حرکت پیوسته و بدون پرش است. کل انیمیشن CSS است و با
 * `prefers-reduced-motion` خودکار غیرفعال می‌شود (تعریف در globals.css).
 *
 * ابعاد ۴۴×۴۴ پیکسل، مطابق حداقل هدف لمسی WCAG 2.5.5.
 */
export function MenuToggle({
  open,
  onToggle,
  light = false,
  controls,
}: {
  open: boolean;
  onToggle: () => void;
  /** روی پس‌زمینهٔ تیره؟ */
  light?: boolean;
  /** شناسهٔ پنلی که این دکمه باز/بسته می‌کند */
  controls: string;
}) {
  const bar = cn(
    'absolute right-1/2 block h-[2px] w-5 translate-x-1/2 rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none',
    light ? 'bg-white' : 'bg-ink',
  );

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? 'بستن منو' : 'باز کردن منو'}
      aria-expanded={open}
      aria-controls={controls}
      className={cn(
        'relative grid size-11 place-items-center rounded-xl border transition xl:hidden',
        light ? 'border-white/20' : 'border-line',
      )}
    >
      {/* خط بالا */}
      <span aria-hidden className={cn(bar, open ? 'top-1/2 rotate-45' : 'top-[15px] rotate-0')} />
      {/* خط میانی — هنگام باز شدن محو می‌شود */}
      <span
        aria-hidden
        className={cn(
          bar,
          'top-1/2 duration-200',
          open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100',
        )}
      />
      {/* خط پایین */}
      <span aria-hidden className={cn(bar, open ? 'top-1/2 -rotate-45' : 'top-[27px] rotate-0')} />
    </button>
  );
}
