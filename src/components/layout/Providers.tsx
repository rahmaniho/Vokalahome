'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, smoothWheel: true, anchors: true });
    return () => lenis.destroy();
  }, []);
  return children;
}
