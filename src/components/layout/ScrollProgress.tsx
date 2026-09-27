'use client';

import { useScroll, motion } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-right bg-gradient-to-l from-gold-300 via-gold-500 to-gold-300" style={{ scaleX: scrollYProgress }} />;
}
