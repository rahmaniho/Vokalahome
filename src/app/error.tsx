'use client';

import { RotateCcw, TriangleAlert } from 'lucide-react';

export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){return <section className="persian-pattern grid min-h-screen place-items-center px-5 text-center text-white"><div><TriangleAlert className="mx-auto text-gold-500" size={56}/><h1 className="mt-6 text-3xl font-black">مشکلی پیش آمده است</h1><p className="mt-3 text-sm text-white/50">لطفاً دوباره تلاش کنید یا به صفحه نخست بازگردید.</p><button onClick={reset} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-black text-navy-950"><RotateCcw size={17}/>تلاش دوباره</button></div></section>}
