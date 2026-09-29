'use client';

import { useEffect, useRef, useState } from 'react';
import { toFa } from '@/lib/utils';

/**
 * شمارندهٔ عددی که هنگام دیده‌شدن شروع می‌شود.
 * پیاده‌سازی با requestAnimationFrame؛ بدون کتابخانه.
 */
export function CountUp({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutCubic برای توقف نرم روی عدد نهایی
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} aria-label={String(value)}>
      {toFa(display)}
    </span>
  );
}
