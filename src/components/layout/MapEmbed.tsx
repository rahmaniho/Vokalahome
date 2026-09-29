'use client';

import { useState } from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { SITE } from '@/lib/constants';

const { lat, lng } = SITE.geo;
const DELTA = 0.012;
const BBOX = [lng - DELTA, lat - DELTA / 2, lng + DELTA, lat + DELTA / 2].map((n) => n.toFixed(4)).join('%2C');

const OSM_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${lat}%2C${lng}`;
const OSM_PAGE = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

/**
 * نقشهٔ ایستا با بارگذاری تأخیری (facade pattern).
 *
 * یک iframe نقشه حدود ۵۰۰ کیلوبایت و ده‌ها درخواست شبکه به همراه دارد و
 * روی امتیاز Lighthouse اثر مستقیم می‌گذارد. اینجا تا وقتی کاربر روی نقشه
 * کلیک نکند، فقط یک «نمای جایگزین» سبک نشان داده می‌شود. لینک‌های «مسیریابی»
 * و «نمای بزرگ‌تر» همیشه کار می‌کنند، حتی اگر کاربر هرگز نقشه را باز نکند.
 *
 * چون سایت روی GitHub Pages است و کوکی سمت سرور نداریم، انتخاب کاربر ذخیره
 * نمی‌شود و هر بار با آگاهی خودش نقشه را باز می‌کند — که از نظر حریم خصوصی
 * هم رفتار بهتری است.
 */
export function MapEmbed({ className = '' }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line bg-surface-2 sm:aspect-[16/11]">
        {loaded ? (
          <iframe
            title="نقشهٔ موقعیت خانه وکلا در قزوین"
            src={OSM_EMBED}
            className="size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group relative size-full"
            aria-label="بارگذاری نقشهٔ تعاملی موقعیت خانه وکلا"
          >
            {/* نمای جایگزین: شبکهٔ خیابان‌مانند با CSS — بدون هیچ درخواست شبکه‌ای */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-70 dark:opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />
            <span aria-hidden className="absolute inset-x-0 top-1/3 h-3 bg-gold-500/15" />
            <span aria-hidden className="absolute inset-y-0 right-1/3 w-3 bg-gold-500/15" />

            <span className="relative flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-navy-900 text-gold-400 shadow-lift transition group-hover:scale-110">
                <MapPin size={24} aria-hidden />
              </span>
              <b className="text-sm font-black text-ink">{SITE.shortAddress}</b>
              <span className="rounded-xl bg-surface px-4 py-2 text-xs font-bold text-ink-muted ring-1 ring-line transition group-hover:ring-gold-500">
                برای دیدن نقشهٔ تعاملی کلیک کنید
              </span>
              <small className="text-[10px] text-ink-faint">
                نقشه فقط با درخواست شما بارگذاری می‌شود (صرفه‌جویی در مصرف داده)
              </small>
            </span>
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={DIRECTIONS}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink transition hover:border-gold-500 hover:text-gold-600"
        >
          <Navigation size={14} aria-hidden />
          مسیریابی
        </a>
        <a
          href={OSM_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink transition hover:border-gold-500 hover:text-gold-600"
        >
          <ExternalLink size={14} aria-hidden />
          نمای بزرگ‌تر
        </a>
      </div>

      <p className="mt-3 text-[10px] leading-6 text-ink-faint">
        موقعیت نقشه تقریبی است و پس از دریافت نشانی و پلاک دقیق باید در{' '}
        <code className="rounded bg-surface-3 px-1 py-0.5">src/lib/constants.ts</code> به‌روزرسانی شود.
      </p>
    </div>
  );
}
