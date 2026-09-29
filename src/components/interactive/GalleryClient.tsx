'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronRight, ChevronLeft, ZoomIn } from 'lucide-react';
import { asset } from '@/lib/basePath';
import { cn } from '@/lib/utils';
import { GALLERY_CATEGORIES, galleryImages, type GalleryCategory } from '@/lib/data/gallery';

export function GalleryGrid() {
  const [active, setActive] = useState<GalleryCategory | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = active === 'all' ? galleryImages : galleryImages.filter((img) => img.category === active);

  const close = () => setLightboxIndex(null);
  const next = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  const prev = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filtered.length]);

  return (
    <div>
      {/* فیلتر دسته‌بندی */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="فیلتر گالری">
        <button
          role="tab"
          aria-selected={active === 'all'}
          onClick={() => setActive('all')}
          className={cn(
            'rounded-full border px-4 py-2 text-xs font-bold transition',
            active === 'all' ? 'border-gold-500 bg-gold-500 text-navy-950' : 'border-gray-200 text-navy-900 hover:border-gold-500'
          )}
        >
          همه
        </button>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={active === cat.id}
            onClick={() => setActive(cat.id)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-bold transition',
              active === cat.id ? 'border-gold-500 bg-gold-500 text-navy-950' : 'border-gray-200 text-navy-900 hover:border-gold-500'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* شبکهٔ تصاویر */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img, index) => (
          <button
            key={img.src}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-navy-900"
            aria-label={`مشاهدهٔ بزرگ‌شدهٔ ${img.alt}`}
          >
            <Image
              src={asset(img.src)}
              alt={img.alt}
              fill
              loading="lazy"
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-navy-950/0 text-white opacity-0 transition group-hover:bg-navy-950/40 group-hover:opacity-100">
              <ZoomIn size={22} />
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-navy-950/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button onClick={close} aria-label="بستن" className="absolute left-5 top-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-gold-500 hover:text-navy-950">
            <X size={20} />
          </button>
          <button onClick={prev} aria-label="تصویر قبلی" className="absolute right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-gold-500 hover:text-navy-950 sm:right-8">
            <ChevronRight size={22} />
          </button>
          <div className="relative aspect-[4/3] w-full max-w-3xl">
            <Image src={asset(filtered[lightboxIndex].src)} alt={filtered[lightboxIndex].alt} fill sizes="90vw" className="rounded-2xl object-contain" />
          </div>
          <button onClick={next} aria-label="تصویر بعدی" className="absolute left-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-gold-500 hover:text-navy-950 sm:left-8">
            <ChevronLeft size={22} />
          </button>
          <p className="absolute bottom-6 text-center text-xs text-white/70">{filtered[lightboxIndex].alt}</p>
        </div>
      )}
    </div>
  );
}

/**
 * تور مجازی ۳۶۰ درجه با Pannellum
 * -------------------------------------------------------------------
 * Pannellum از CDN بارگذاری می‌شود (کتابخانه سبک ~26KB gzip، بدون وابستگی).
 * چون سایت کاملاً استاتیک است، همین روش روی GitHub Pages هم کار می‌کند؛
 * تنها نیاز، دسترسی کاربر به اینترنت برای گرفتن اسکریپت CDN است (در پیش‌نمایش
 * آفلاین/sandbox داخل این ابزار، تصویر ثابت جایگزین نمایش داده می‌شود).
 *
 * برای افزودن تور واقعی: عکس ۳۶۰ درجهٔ equirectangular واقعی (نسبت ۲:۱) را در
 * public/images/gallery/ قرار دهید و src را در src/lib/data/gallery.ts عوض کنید.
 */
export function Panorama360({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let viewer: { destroy: () => void } | null = null;
    const CDN_JS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    const CDN_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';

    function loadCss() {
      if (document.querySelector(`link[href="${CDN_CSS}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CDN_CSS;
      document.head.appendChild(link);
    }

    function init() {
      loadCss();
      // @ts-expect-error -- pannellum از CDN و بدون تایپ بارگذاری می‌شود
      if (!window.pannellum || !containerRef.current) return setFailed(true);
      // @ts-expect-error -- global pannellum
      viewer = window.pannellum.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: asset(src),
        autoLoad: true,
        compass: false,
        showZoomCtrl: true,
        title,
      });
      setReady(true);
    }

    // @ts-expect-error -- global pannellum ممکن است از قبل بارگذاری شده باشد
    if (window.pannellum) {
      init();
    } else {
      const existing = document.querySelector(`script[src="${CDN_JS}"]`);
      if (existing) {
        existing.addEventListener('load', init);
      } else {
        const script = document.createElement('script');
        script.src = CDN_JS;
        script.async = true;
        script.onload = init;
        script.onerror = () => setFailed(true);
        document.body.appendChild(script);
      }
    }

    return () => viewer?.destroy();
  }, [src, title]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-navy-950">
      {!failed ? (
        <div ref={containerRef} className="size-full" />
      ) : (
        <Image src={asset(src)} alt={title} fill className="object-cover" sizes="100vw" />
      )}
      {!ready && !failed && (
        <div className="absolute inset-0 grid place-items-center text-xs text-white/50">در حال بارگذاری تور ۳۶۰ درجه...</div>
      )}
    </div>
  );
}
