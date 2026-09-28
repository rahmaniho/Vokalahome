'use client';

import { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';

export function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const seen = sessionStorage.getItem('vokalahome-loaded');
    if (seen) { setShow(false); return; }
    const timer = window.setTimeout(() => { setShow(false); sessionStorage.setItem('vokalahome-loaded', '1'); }, 850);
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return <div className="fixed inset-0 z-[200] grid place-items-center bg-navy-950 text-white" role="status" aria-label="در حال بارگذاری">
    <div className="text-center"><span className="mx-auto grid size-16 animate-pulse-gold place-items-center rounded-2xl bg-gold-500 text-navy-950"><Coffee size={31} /></span><strong className="mt-5 block text-2xl">خانه وکلا</strong><small className="mt-2 block text-[10px] tracking-[.2em] text-white/40">LAWYERS CLUB &amp; LEGAL CAFÉ</small><span className="mx-auto mt-5 block h-px w-36 overflow-hidden bg-white/10"><i className="block h-full w-2/3 animate-shimmer bg-gold-500" /></span></div>
  </div>;
}
