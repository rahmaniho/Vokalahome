'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { testimonials } from '@/lib/data/testimonials';
import { cn } from '@/lib/utils';

/**
 * کاروسل نظرات — بدون کتابخانه.
 *
 * پیاده‌سازی با `scroll-snap` بومی مرورگر: روی موبایل با انگشت کشیده می‌شود،
 * روی دسکتاپ دکمه دارد، با صفحه‌کلید پیمایش‌پذیر است و حتی بدون JS هم
 * به‌صورت یک نوار افقی قابل اسکرول کار می‌کند.
 */
export function TestimonialSlider({ light = false }: { light?: boolean }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const node = trackRef.current;
    if (!node) return;
    // در RTL مقدار scrollLeft منفی یا معکوس است؛ با abs یکدست می‌شود.
    const offset = Math.abs(node.scrollLeft);
    setAtStart(offset < 8);
    setAtEnd(offset + node.clientWidth >= node.scrollWidth - 8);
  };

  const scrollBy = (direction: 1 | -1) => {
    const node = trackRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.8;
    node.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={updateEdges}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {testimonials.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex w-[300px] shrink-0 snap-start flex-col rounded-3xl border p-6 sm:w-[360px]',
              light ? 'border-white/12 bg-white/[.05]' : 'border-line bg-surface',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Quote size={26} className="shrink-0 text-gold-500/45" aria-hidden />
              <Badge tone={light ? 'gold' : 'neutral'}>{item.kind}</Badge>
            </div>

            <div className="mt-3 flex gap-0.5" aria-label={`امتیاز ${item.rating} از ۵`}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={14}
                  aria-hidden
                  className={index < item.rating ? 'fill-gold-500 text-gold-500' : 'text-mist-300 dark:text-navy-700'}
                />
              ))}
            </div>

            <p className={cn('mt-4 flex-1 text-sm leading-[2.05]', light ? 'text-white/70' : 'text-ink-muted')}>
              {item.text}
            </p>

            <div className={cn('mt-5 border-t pt-4', light ? 'border-white/10' : 'border-line')}>
              <b className={cn('block text-sm font-black', light ? 'text-white' : 'text-ink')}>{item.name}</b>
              <small className={cn('mt-1 block text-[11px]', light ? 'text-white/45' : 'text-ink-faint')}>
                {item.role}
              </small>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-center gap-2">
        {/* در RTL، دکمهٔ «قبلی» پیکان راست دارد. */}
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={atStart}
          aria-label="نظرات قبلی"
          className={cn(
            'tap-target rounded-xl border transition disabled:opacity-30',
            light ? 'border-white/15 text-white/80 hover:border-gold-400' : 'border-line text-ink-muted hover:border-gold-500',
          )}
        >
          <ChevronRight size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={atEnd}
          aria-label="نظرات بعدی"
          className={cn(
            'tap-target rounded-xl border transition disabled:opacity-30',
            light ? 'border-white/15 text-white/80 hover:border-gold-400' : 'border-line text-ink-muted hover:border-gold-500',
          )}
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
