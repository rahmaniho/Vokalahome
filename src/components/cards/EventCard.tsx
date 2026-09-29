import Link from 'next/link';
import { CalendarDays, Clock3, Mic, Ticket, Users } from 'lucide-react';
import type { ClubEvent } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { eventCapacity } from '@/lib/data/events';
import { cn, toFa } from '@/lib/utils';

export function EventCard({ event }: { event: ClubEvent }) {
  const capacity = eventCapacity(event);

  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="navy">{event.type}</Badge>
        {event.isFree && <Badge tone="success">رایگان</Badge>}
        {capacity.isFull ? (
          <Badge tone="danger" dot>
            تکمیل ظرفیت
          </Badge>
        ) : capacity.isAlmostFull ? (
          <Badge tone="warning" dot>
            فقط {toFa(capacity.remaining)} جا
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-5 text-base font-black leading-[1.75] text-ink transition group-hover:text-gold-600 sm:text-lg">
        <Link href={`/events/${event.slug}/`} className="after:absolute after:inset-0">
          {event.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-[1.95] text-ink-muted">{event.summary}</p>

      <dl className="my-5 space-y-2.5 border-y border-line py-4 text-[11px] text-ink-muted">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="shrink-0 text-gold-600" aria-hidden />
          <dd>{event.date}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 size={14} className="shrink-0 text-gold-600" aria-hidden />
          <dd>{event.time}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Mic size={14} className="shrink-0 text-gold-600" aria-hidden />
          <dd className="truncate">
            {event.speaker} — {event.speakerRole}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <Ticket size={14} className="shrink-0 text-gold-600" aria-hidden />
          <dd>{event.fee}</dd>
        </div>
      </dl>

      <div className="mt-auto">
        <div className="mb-2 flex items-center justify-between text-[10px] text-ink-faint">
          <span className="flex items-center gap-1.5">
            <Users size={12} aria-hidden />
            {toFa(event.registered)} از {toFa(event.capacity)} نفر
          </span>
          <span>{capacity.isFull ? 'تکمیل' : `${toFa(capacity.remaining)} جای خالی`}</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-surface-3"
          role="progressbar"
          aria-valuenow={capacity.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`ظرفیت تکمیل‌شده: ${capacity.percent} درصد`}
        >
          <div
            className={cn(
              'h-full rounded-full',
              capacity.isFull ? 'bg-red-500' : capacity.isAlmostFull ? 'bg-amber-500' : 'bg-emerald-500',
            )}
            style={{ width: `${capacity.percent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
