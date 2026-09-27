'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { toFa } from '@/lib/utils';

export function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 55;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setValue(Math.round(end * progress));
      if (frame >= total) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{toFa(value)}{suffix}</span>;
}
