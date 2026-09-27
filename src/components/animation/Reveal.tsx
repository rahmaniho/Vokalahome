'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Reveal({ children, className, delay = 0, direction = 'up', once = true }: { children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'right' | 'left' | 'none'; once?: boolean }) {
  const axis = direction === 'up' ? { y: 30 } : direction === 'right' ? { x: 35 } : direction === 'left' ? { x: -35 } : {};
  return (
    <motion.div className={cn(className)} initial={{ opacity: 0, ...axis }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once, amount: .16 }} transition={{ duration: .72, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
