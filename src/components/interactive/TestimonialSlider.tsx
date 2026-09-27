'use client';

import { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  { text: 'از ابتدا مسیر پرونده و ریسک‌ها را شفاف توضیح دادند. همین صداقت و گزارش‌دهی منظم، نگرانی ما را بسیار کمتر کرد.', name: 'م. رضایی', case: 'پرونده قراردادی' },
  { text: 'جلسه مشاوره منظم و دقیق بود؛ اسناد پیش از جلسه بررسی شده بود و با یک نقشه راه روشن از دفتر خارج شدم.', name: 'س. احمدی', case: 'مشاوره ملکی' },
  { text: 'برخورد محترمانه، حفظ محرمانگی و پاسخ‌گویی تیم برای من مهم بود. در تمام مراحل احساس کردم پرونده با دقت پیگیری می‌شود.', name: 'ن. محمدی', case: 'پرونده خانواده' },
];

export function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [pause, setPause] = useState(false);
  useEffect(() => { if (pause) return; const timer = window.setInterval(() => setActive(v => (v + 1) % testimonials.length), 4500); return () => clearInterval(timer); }, [pause]);
  return <div onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}><div className="grid gap-5 md:grid-cols-3">{testimonials.map((item,index) => <article key={item.name} className={`relative overflow-hidden rounded-3xl border p-7 transition duration-500 ${active === index ? 'border-gold-500 bg-white shadow-soft' : 'border-gray-100 bg-white/60 md:opacity-65'}`}><Quote className="absolute -left-2 top-2 size-20 text-gold-500/8"/><div className="flex gap-1 text-gold-500">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div><p className="relative mt-5 min-h-32 text-sm italic leading-[2.1] text-gray-600">«{item.text}»</p><div className="mt-5 border-t border-gray-100 pt-4"><b className="text-sm text-navy-900">{item.name}</b><span className="mr-2 text-[10px] text-gray-400">{item.case}</span></div></article>)}</div><div className="mt-7 flex justify-center gap-2">{testimonials.map((_,i)=><button key={i} onClick={()=>setActive(i)} aria-label={`نظر ${i+1}`} className={`h-2 rounded-full transition ${active===i?'w-7 bg-gold-500':'w-2 bg-gray-300'}`}/>)}</div></div>;
}
