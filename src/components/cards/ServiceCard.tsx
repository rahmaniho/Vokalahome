import Link from 'next/link';
import { ArrowLeft, BadgeCheck, BookOpenCheck, Clock3, Coffee, DoorClosed, Landmark, Presentation, UsersRound } from 'lucide-react';
import type { Service } from '@/types';

const icons = { Coffee, DoorClosed, BadgeCheck, Presentation, UsersRound, BookOpenCheck, Landmark };

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = icons[service.icon as keyof typeof icons] || Landmark;
  return <article className="service-card group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-soft lg:p-7">
    <div className="relative z-10"><div className="flex items-start justify-between"><span className="grid size-14 place-items-center rounded-2xl bg-navy-900 text-gold-400 transition duration-500 group-hover:-rotate-6 group-hover:bg-gold-500 group-hover:text-navy-950"><Icon size={27} strokeWidth={1.6}/></span><span className="text-sm font-black text-gray-200">۰{index + 1}</span></div><h3 className="mt-6 text-xl font-black text-navy-900">{service.title}</h3><p className="mt-3 min-h-[84px] text-sm leading-[1.9] text-gray-500">{service.description}</p><div className="my-5 flex items-center justify-between border-y border-gray-100 py-3 text-[11px] text-gray-400"><span className="flex items-center gap-1.5"><Clock3 size={13}/>{service.duration}</span><span>{service.subservices.length.toLocaleString('fa-IR')} بخش</span></div><Link className="inline-flex items-center gap-2 text-sm font-extrabold text-navy-900 transition group-hover:text-gold-500" href={`/services/${service.slug}/`}>جزئیات بیشتر <ArrowLeft size={16}/></Link></div>
  </article>;
}
