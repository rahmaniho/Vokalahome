import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';

export default function NotFound(){return <section className="persian-pattern grid min-h-screen place-items-center px-5 text-center text-white"><div><span className="mx-auto grid size-20 place-items-center rounded-3xl bg-gold-500 text-navy-950 shadow-gold"><Scale size={38}/></span><strong className="mt-7 block text-8xl font-black text-stroke">۴۰۴</strong><h1 className="mt-2 text-2xl font-black">این صفحه پیدا نشد</h1><p className="mt-3 text-sm text-white/50">ممکن است نشانی تغییر کرده یا صفحه حذف شده باشد.</p><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-black text-navy-950"><ArrowRight size={17}/>بازگشت به خانه</Link></div></section>}
