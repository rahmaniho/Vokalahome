'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, Play, RotateCw } from 'lucide-react';
import { Picture } from '@/components/ui/Picture';
import { panoramas } from '@/lib/data/gallery';
import { withBase } from '@/lib/site';

const PANNELLUM_VERSION = '2.5.6';
const PANNELLUM_JS = `https://cdn.jsdelivr.net/npm/pannellum@${PANNELLUM_VERSION}/build/pannellum.js`;
const PANNELLUM_CSS = `https://cdn.jsdelivr.net/npm/pannellum@${PANNELLUM_VERSION}/build/pannellum.css`;

type PannellumViewer = { destroy: () => void };
type PannellumApi = {
  viewer: (element: HTMLElement, config: Record<string, unknown>) => PannellumViewer;
};

declare global {
  interface Window {
    pannellum?: PannellumApi;
  }
}

/** یک اسکریپت/استایل خارجی را فقط یک‌بار بارگذاری می‌کند. */
function loadOnce(url: string, type: 'js' | 'css') {
  return new Promise<void>((resolve, reject) => {
    const selector = type === 'js' ? `script[src="${url}"]` : `link[href="${url}"]`;
    const existing = document.querySelector(selector);
    if (existing) {
      if (existing.getAttribute('data-loaded') === '1') resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }

    const element =
      type === 'js'
        ? Object.assign(document.createElement('script'), { src: url, async: true, crossOrigin: 'anonymous' })
        : Object.assign(document.createElement('link'), { rel: 'stylesheet', href: url, crossOrigin: 'anonymous' });

    element.addEventListener('load', () => {
      element.setAttribute('data-loaded', '1');
      resolve();
    });
    element.addEventListener('error', () => reject(new Error(`بارگذاری ${url} ناموفق بود`)));
    document.head.appendChild(element);
  });
}

/**
 * تور مجازی ۳۶۰ درجه با Pannellum.
 *
 * چرا «با کلیک» بارگذاری می‌شود؟ Pannellum حدود ۱۰۰ کیلوبایت جاوااسکریپت است
 * و تصویر پانوراما هم سنگین. اگر همراه صفحه بارگذاری شود، امتیاز Lighthouse و
 * مصرف دادهٔ موبایل را خراب می‌کند. اینجا تا وقتی کاربر روی «شروع تور» نزند،
 * حتی یک بایت هم دانلود نمی‌شود — این الگو lazy hydration نام دارد.
 *
 * حالت بدون JS / خطای شبکه: تصویر ثابت پانوراما نمایش داده می‌شود، پس
 * کاربر همیشه چیزی برای دیدن دارد.
 */
export function VirtualTour() {
  const scene = panoramas[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, []);

  const start = async () => {
    if (state === 'loading' || state === 'ready') return;
    setState('loading');
    try {
      await Promise.all([loadOnce(PANNELLUM_CSS, 'css'), loadOnce(PANNELLUM_JS, 'js')]);
      if (!window.pannellum || !containerRef.current) throw new Error('Pannellum در دسترس نیست');

      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: withBase(scene.src),
        autoLoad: true,
        autoRotate: -2,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        compass: false,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        friction: 0.15,
        // متن‌های داخلی Pannellum فارسی می‌شوند.
        strings: {
          loadButtonLabel: 'شروع تور',
          loadingLabel: 'در حال بارگذاری…',
          bylineLabel: '',
          noPanoramaError: 'تصویر پانوراما بارگذاری نشد.',
          fileAccessError: 'دسترسی به فایل پانوراما ممکن نیست.',
          genericWebGLError: 'مرورگر شما از WebGL پشتیبانی نمی‌کند.',
        },
      });
      setState('ready');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="relative aspect-[16/9] w-full bg-navy-950 sm:aspect-[2/1]">
        {/* ظرف Pannellum — تا شروع نشدن تور خالی می‌ماند. */}
        <div ref={containerRef} className="absolute inset-0" aria-hidden={state !== 'ready'} />

        {state !== 'ready' && (
          <div className="absolute inset-0">
            <Picture
              src={scene.src}
              alt={`نمای ثابت از ${scene.title}`}
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="absolute inset-0 size-full"
              imgClassName="size-full object-cover opacity-60"
            />
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-navy-950/85 via-navy-950/35 to-navy-950/55 p-6 text-center">
              <div>
                <button
                  type="button"
                  onClick={start}
                  disabled={state === 'loading'}
                  className="mx-auto flex min-h-14 items-center gap-2.5 rounded-2xl bg-gold-500 px-7 text-sm font-black text-navy-900 shadow-gold transition hover:bg-gold-400 disabled:opacity-70"
                >
                  {state === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" aria-hidden />
                      در حال آماده‌سازی تور…
                    </>
                  ) : (
                    <>
                      <Play size={20} aria-hidden />
                      شروع تور مجازی ۳۶۰ درجه
                    </>
                  )}
                </button>
                <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-white/65">
                  {state === 'error'
                    ? 'بارگذاری تور ممکن نشد. اتصال اینترنت را بررسی کنید یا از تصویر ثابت بالا استفاده کنید.'
                    : 'برای صرفه‌جویی در مصرف داده، تور فقط با کلیک شما بارگذاری می‌شود (حدود ۳۵۰ کیلوبایت).'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-5">
        <div className="min-w-0">
          <b className="block text-sm font-black text-ink">{scene.title}</b>
          <small className="mt-1 block text-xs leading-6 text-ink-muted">{scene.description}</small>
        </div>
        <div className="flex shrink-0 gap-3 text-[11px] text-ink-faint">
          <span className="flex items-center gap-1.5">
            <RotateCw size={13} aria-hidden />
            کشیدن برای چرخش
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 size={13} aria-hidden />
            تمام‌صفحه
          </span>
        </div>
      </div>
    </div>
  );
}
