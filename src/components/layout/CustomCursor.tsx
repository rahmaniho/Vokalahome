'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 28, stiffness: 350, mass: .5 });
  const sy = useSpring(y, { damping: 28, stiffness: 350, mass: .5 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.body.classList.add('has-custom-cursor');
    const move = (event: MouseEvent) => { x.set(event.clientX); y.set(event.clientY); setVisible(true); };
    const over = (event: MouseEvent) => setActive(!!(event.target as HTMLElement).closest('a,button,input,select,textarea'));
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    return () => { document.body.classList.remove('has-custom-cursor'); window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); };
  }, [x, y]);

  return <>
    <motion.span aria-hidden className="pointer-events-none fixed left-0 top-0 z-[150] hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 mix-blend-difference lg:block" style={{ x, y, opacity: visible ? 1 : 0 }} />
    <motion.span aria-hidden className="pointer-events-none fixed left-0 top-0 z-[149] hidden size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-500/70 lg:block" animate={{ scale: active ? 1.55 : 1 }} style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }} />
  </>;
}
