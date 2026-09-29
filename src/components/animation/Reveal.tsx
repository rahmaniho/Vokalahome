'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * انیمیشن «ظاهر شدن هنگام اسکرول» بدون هیچ کتابخانه‌ای.
 *
 * چرا دست‌ساز؟ نسخهٔ قبلی از framer-motion استفاده می‌کرد که ~۳۴KB به هر
 * صفحه اضافه می‌کرد. اینجا فقط یک IntersectionObserver مشترک داریم و
 * خود انیمیشن با CSS (کلاس data-reveal در globals.css) اجرا می‌شود.
 *
 * نکتهٔ دسترسی‌پذیری: اگر JS اجرا نشود کلاس `no-js` روی <html> می‌ماند و
 * محتوا کاملاً قابل مشاهده است؛ محتوا هرگز پشت انیمیشن پنهان نمی‌ماند.
 */

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === 'undefined') return null;
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'visible');
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  return observer;
}

type RevealProps = {
  children: React.ReactNode;
  /** تأخیر بر حسب میلی‌ثانیه؛ برای آبشاری‌کردن فهرست‌ها */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
};

export function Reveal({ children, delay = 0, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // کاربرانی که حرکت کمتر خواسته‌اند: بی‌درنگ نمایش بده.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.setAttribute('data-reveal', 'visible');
      return;
    }
    const io = getObserver();
    if (!io) {
      node.setAttribute('data-reveal', 'visible');
      return;
    }
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
