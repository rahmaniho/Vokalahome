import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  Clock3,
  Coffee,
  DoorClosed,
  Landmark,
  Presentation,
  UsersRound,
} from 'lucide-react';
import type { Service } from '@/types';
import { toFa } from '@/lib/utils';

/** نگاشت نام آیکون (رشته در فایل داده) به کامپوننت واقعی. */
const ICONS = { Coffee, DoorClosed, BadgeCheck, Presentation, UsersRound, BookOpenCheck, Landmark };

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = ICONS[service.icon as keyof typeof ICONS] ?? Landmark;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift lg:p-7">
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-navy-900 text-gold-400 transition duration-300 group-hover:-rotate-6 group-hover:bg-gold-500 group-hover:text-navy-900 dark:bg-navy-800">
          <Icon size={26} strokeWidth={1.6} aria-hidden />
        </span>
        <span className="text-sm font-black text-ink-faint/40" aria-hidden>
          {toFa(String(index + 1).padStart(2, '0'))}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-black leading-8 text-ink transition group-hover:text-gold-600 sm:text-xl">
        <Link href={`/services/${service.slug}/`} className="after:absolute after:inset-0">
          {service.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-[1.95] text-ink-muted">{service.description}</p>

      <div className="my-5 flex items-center justify-between border-y border-line py-3 text-[11px] text-ink-faint">
        <span className="flex items-center gap-1.5">
          <Clock3 size={13} aria-hidden />
          {service.duration}
        </span>
        <span>{toFa(service.subservices.length)} بخش</span>
      </div>

      <span className="inline-flex items-center gap-2 text-sm font-extrabold text-ink transition group-hover:text-gold-600">
        جزئیات بیشتر
        <ArrowLeft size={16} aria-hidden className="transition-transform group-hover:-translate-x-1" />
      </span>
    </article>
  );
}
