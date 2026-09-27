import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, UserRound } from 'lucide-react';
import type { Lawyer } from '@/types';

export function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-soft">
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950">
      {lawyer.image ? <Image src={lawyer.image} alt={`تصویر پیشنهادی ${lawyer.name}`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover object-top transition duration-700 group-hover:scale-105"/> : <div className="legal-pattern absolute inset-0 grid place-items-center"><span className="grid size-24 place-items-center rounded-full border border-gold-500/25 bg-white/5 text-gold-500"><UserRound size={42} strokeWidth={1}/></span></div>}
      <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-navy-900 backdrop-blur">{lawyer.specialty}</span>
      {lawyer.placeholder && <span className="absolute bottom-3 left-3 rounded-lg bg-navy-950/75 px-2.5 py-1 text-[9px] text-white/75 backdrop-blur">اطلاعات در انتظار تکمیل</span>}
    </div>
    <div className="p-6"><h3 className="text-lg font-black text-navy-900">{lawyer.name}</h3><p className="mt-1 text-xs text-gray-500">{lawyer.role}</p><div className="mt-4 flex flex-wrap gap-1.5">{lawyer.tags.map(tag => <span key={tag} className="rounded-lg bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-500">{tag}</span>)}</div><div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-xs font-bold text-gold-500">{lawyer.experience}</span><Link href={`/lawyers/${lawyer.slug}/`} className="flex items-center gap-1.5 text-xs font-extrabold text-navy-900 hover:text-gold-500">پروفایل <ArrowLeft size={14}/></Link></div></div>
  </article>;
}
