'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import { GALLERY_CATEGORIES, galleryItems } from '@/lib/data/gallery';
import { cn, toFa } from '@/lib/utils';

/**
 * گالری با فیلتر دسته‌بندی و لایت‌باکس دسترس‌پذیر.
 *
 * لایت‌باکس دست‌ساز است (بدون کتابخانه): پیمایش با جهت‌نماها، بستن با Escape،
 * قفل اسکرول پس‌زمینه و بازگرداندن فوکوس به همان تصویری که باز شده بود.
 * تصاویر تنبل بارگذاری می‌شوند و ابعادشان از پیش معلوم است، پس CLS نداریم.
 */
export function GalleryExplorer() {
  const [category, setCategory] = useState<string>('همه');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = category === 'همه' ? galleryItems : galleryItems.filter((item) => item.category === category);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => setOpenIndex((current) => (current === null ? null : (current + delta + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      // در RTL جهت منطقی برعکس است، ولی کاربر انتظار دارد پیکان راست = تصویر قبلی
      if (event.key === 'ArrowRight') step(-1);
      if (event.key === 'ArrowLeft') step(1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [openIndex, close, step]);

  const active = openIndex !== null ? visible[openIndex] : null;

  return (
    <div>
      {/* فیلتر دسته‌بندی */}
      <div role="tablist" aria-label="دسته‌بندی گالری" className="mb-8 flex flex-wrap gap-2">
        {GALLERY_CATEGORIES.map((item) => {
          const count = item === 'همه' ? galleryItems.length : galleryItems.filter((g) => g.category === item).length;
          const active = category === item;
          return (
            <button
              key={item}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(item)}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition',
                active
                  ? 'border-gold-500 bg-gold-500 text-navy-900'
                  : 'border-line bg-surface text-ink-muted hover:border-gold-500 hover:text-gold-600',
              )}
            >
              {item}
              <span className={cn('text-[10px]', active ? 'text-navy-900/60' : 'text-ink-faint')}>{toFa(count)}</span>
            </button>
          );
        })}
      </div>

      {/* شبکهٔ تصاویر */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block w-full overflow-hidden rounded-3xl border border-line bg-surface text-right transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lift"
              aria-label={`بزرگ‌نمایی تصویر: ${item.title}`}
            >
              <Picture
                src={item.src}
                alt={item.title}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="aspect-[4/3]"
                imgClassName="transition duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent p-4 pt-12">
                <b className="block text-sm font-black text-white">{item.title}</b>
                <small className="mt-1 block text-[11px] text-white/60">{item.category}</small>
              </span>
              <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-xl bg-navy-950/60 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                <Expand size={16} aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* لایت‌باکس */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[130] flex animate-fade-in flex-col bg-navy-950/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <b className="block truncate text-sm font-black text-white">{active.title}</b>
              <small className="text-[11px] text-white/50">
                {active.category} · {toFa((openIndex ?? 0) + 1)} از {toFa(visible.length)}
              </small>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="بستن گالری"
              className="tap-target rounded-xl border border-white/15 text-white transition hover:border-gold-500 hover:text-gold-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
            <Picture
              src={active.src}
              alt={active.title}
              sizes="100vw"
              priority
              className="max-h-full w-full max-w-5xl rounded-2xl"
              imgClassName="max-h-[70vh] w-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 p-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="tap-target rounded-xl border border-white/15 text-white transition hover:border-gold-500"
              aria-label="تصویر قبلی"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
            <p className="min-w-0 flex-1 text-center text-xs leading-6 text-white/60">{active.description}</p>
            <button
              type="button"
              onClick={() => step(1)}
              className="tap-target rounded-xl border border-white/15 text-white transition hover:border-gold-500"
              aria-label="تصویر بعدی"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
