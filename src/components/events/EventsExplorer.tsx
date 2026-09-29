'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, LayoutList, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EVENT_CATEGORIES, eventCapacity, events } from '@/lib/data/events';
import { MONTH_NAMES } from '@/components/consultation/JalaliCalendar';
import type { ClubEvent, EventCategory } from '@/types';
import { cn, toFa } from '@/lib/utils';
import jalaali from 'jalaali-js';

type ViewMode = 'list' | 'calendar';
const WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

/** «1405/08/15» → {jy, jm, jd} */
function parseJalali(value: string) {
  const [jy, jm, jd] = value.split('/').map(Number);
  return { jy, jm, jd };
}

/**
 * فهرست رویدادها با دو نما (لیست و تقویم شمسی) و فیلتر دسته‌بندی.
 *
 * تقویم از همان منطق `JalaliCalendar` استفاده می‌کند اما به‌جای انتخاب روز،
 * رویدادهای هر روز را نشان می‌دهد؛ برای همین جداگانه نوشته شده و سبک مانده.
 */
export function EventsExplorer() {
  const [view, setView] = useState<ViewMode>('list');
  const [category, setCategory] = useState<EventCategory | 'همه'>('همه');

  const filtered = useMemo(
    () => (category === 'همه' ? events : events.filter((event) => event.type === category)),
    [category],
  );

  return (
    <div>
      {/* نوار ابزار */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="فیلتر دستهٔ رویداد" className="flex flex-wrap gap-2">
          {(['همه', ...EVENT_CATEGORIES] as const).map((item) => {
            const active = category === item;
            const count = item === 'همه' ? events.length : events.filter((event) => event.type === item).length;
            return (
              <button
                key={item}
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(item)}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition',
                  active
                    ? 'border-gold-500 bg-gold-500 text-navy-900'
                    : 'border-line bg-surface text-ink-muted hover:border-gold-500 hover:text-gold-600',
                )}
              >
                {item}
                <span className={cn('text-[10px]', active ? 'text-navy-900/60' : 'text-ink-faint')}>{toFa(count)}</span>
              </button>
            );
          })}
        </div>

        <div className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
          {([
            { id: 'list' as const, label: 'فهرست', Icon: LayoutList },
            { id: 'calendar' as const, label: 'تقویم', Icon: CalendarDays },
          ]).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              aria-pressed={view === id}
              className={cn(
                'inline-flex min-h-10 items-center gap-2 rounded-lg px-3.5 text-xs font-bold transition',
                view === id ? 'bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-900' : 'text-ink-muted hover:text-ink',
              )}
            >
              <Icon size={15} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' ? <EventList items={filtered} /> : <EventCalendar items={filtered} />}

      {filtered.length === 0 && (
        <p className="rounded-3xl border border-dashed border-line py-16 text-center text-sm text-ink-muted">
          در این دسته فعلاً رویدادی ثبت نشده است.
        </p>
      )}
    </div>
  );
}

/* ───────────────── نمای فهرست ───────────────── */

function EventList({ items }: { items: ClubEvent[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {items.map((event) => {
        const capacity = eventCapacity(event);
        return (
          <li key={event.slug}>
            <article className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lift">
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
                ) : (
                  <Badge tone="success" dot>
                    {toFa(capacity.remaining)} جای خالی
                  </Badge>
                )}
              </div>

              <h3 className="mt-4 text-base font-black leading-[1.75] text-ink transition group-hover:text-gold-600 sm:text-lg">
                <Link href={`/events/${event.slug}/`} className="after:absolute after:inset-0">
                  {event.title}
                </Link>
              </h3>

              <p className="mt-2.5 line-clamp-2 text-sm leading-[1.95] text-ink-muted">{event.summary}</p>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[11px]">
                <div className="flex items-center gap-2 text-ink-muted">
                  <CalendarDays size={14} className="shrink-0 text-gold-600" aria-hidden />
                  <dd>{event.date}</dd>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Clock size={14} className="shrink-0 text-gold-600" aria-hidden />
                  <dd>{event.time}</dd>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Users size={14} className="shrink-0 text-gold-600" aria-hidden />
                  <dd>
                    {toFa(event.registered)} از {toFa(event.capacity)} نفر
                  </dd>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <MapPin size={14} className="shrink-0 text-gold-600" aria-hidden />
                  <dd>خانه وکلا، قزوین</dd>
                </div>
              </dl>

              {/* نوار ظرفیت */}
              <div className="mt-4">
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
                      'h-full rounded-full transition-all',
                      capacity.isFull ? 'bg-red-500' : capacity.isAlmostFull ? 'bg-amber-500' : 'bg-emerald-500',
                    )}
                    style={{ width: `${capacity.percent}%` }}
                  />
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

/* ───────────────── نمای تقویم ───────────────── */

function EventCalendar({ items }: { items: ClubEvent[] }) {
  // ماه شروع = ماه اولین رویداد، تا تقویم خالی باز نشود.
  const first = items[0] ? parseJalali(items[0].jalaliDate) : parseJalali('1405/08/01');
  const [cursor, setCursor] = useState({ jy: first.jy, jm: first.jm });

  const byDate = useMemo(() => {
    const map = new Map<string, ClubEvent[]>();
    items.forEach((event) => {
      const list = map.get(event.jalaliDate) ?? [];
      list.push(event);
      map.set(event.jalaliDate, list);
    });
    return map;
  }, [items]);

  const daysInMonth = jalaali.jalaaliMonthLength(cursor.jy, cursor.jm);
  const firstGregorian = jalaali.toGregorian(cursor.jy, cursor.jm, 1);
  const firstWeekday = new Date(firstGregorian.gy, firstGregorian.gm - 1, firstGregorian.gd).getDay();
  // هفتهٔ ایرانی از شنبه شروع می‌شود؛ getDay شنبه را ۶ می‌دهد.
  const leadingBlanks = (firstWeekday + 1) % 7;

  const move = (delta: number) => {
    setCursor((current) => {
      const month = current.jm + delta;
      if (month < 1) return { jy: current.jy - 1, jm: 12 };
      if (month > 12) return { jy: current.jy + 1, jm: 1 };
      return { ...current, jm: month };
    });
  };

  const monthEvents = items
    .filter((event) => {
      const { jy, jm } = parseJalali(event.jalaliDate);
      return jy === cursor.jy && jm === cursor.jm;
    })
    .sort((a, b) => parseJalali(a.jalaliDate).jd - parseJalali(b.jalaliDate).jd);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="ماه قبل"
            className="tap-target rounded-xl border border-line text-ink-muted transition hover:border-gold-500 hover:text-gold-600"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
          <b className="text-sm font-black text-ink sm:text-base">
            {MONTH_NAMES[cursor.jm - 1]} {toFa(cursor.jy)}
          </b>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="ماه بعد"
            className="tap-target rounded-xl border border-line text-ink-muted transition hover:border-gold-500 hover:text-gold-600"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {WEEK_DAYS.map((day, index) => (
            <div
              key={day}
              className={cn(
                'pb-2 text-center text-[10px] font-black',
                index === 6 ? 'text-red-500/70' : 'text-ink-faint',
              )}
            >
              {day}
            </div>
          ))}

          {Array.from({ length: leadingBlanks }, (_, index) => (
            <div key={`blank-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const key = `${cursor.jy}/${String(cursor.jm).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
            const dayEvents = byDate.get(key) ?? [];
            const has = dayEvents.length > 0;

            return (
              <div
                key={day}
                className={cn(
                  'relative flex min-h-[3.25rem] flex-col items-center justify-center rounded-xl border p-1 text-xs transition sm:min-h-[4rem]',
                  has
                    ? 'border-gold-500/45 bg-gold-500/10 font-black text-ink'
                    : 'border-transparent bg-surface-2/60 text-ink-faint',
                )}
              >
                <span>{toFa(day)}</span>
                {has && (
                  <span className="mt-1 flex gap-0.5" aria-label={`${dayEvents.length} رویداد`}>
                    {dayEvents.slice(0, 3).map((event) => (
                      <i key={event.slug} aria-hidden className="size-1.5 rounded-full bg-gold-500" />
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* رویدادهای همان ماه */}
      <aside className="rounded-3xl border border-line bg-surface p-5">
        <h3 className="text-sm font-black text-ink">
          رویدادهای {MONTH_NAMES[cursor.jm - 1]} {toFa(cursor.jy)}
        </h3>
        {monthEvents.length === 0 ? (
          <p className="mt-4 text-xs leading-[1.9] text-ink-faint">
            در این ماه رویدادی ثبت نشده است. ماه‌های دیگر را ببینید یا در خبرنامه عضو شوید.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {monthEvents.map((event) => {
              const { jd } = parseJalali(event.jalaliDate);
              const capacity = eventCapacity(event);
              return (
                <li key={event.slug}>
                  <Link
                    href={`/events/${event.slug}/`}
                    className="flex gap-3 rounded-2xl border border-line p-3 transition hover:border-gold-500/50 hover:bg-gold-500/[.05]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-sm font-black text-gold-400 dark:bg-gold-500 dark:text-navy-900">
                      {toFa(jd)}
                    </span>
                    <span className="min-w-0">
                      <b className="line-clamp-2 block text-xs font-bold leading-6 text-ink">{event.title}</b>
                      <small className="mt-0.5 block text-[10px] text-ink-faint">
                        {event.time} ·{' '}
                        {capacity.isFull ? 'تکمیل' : `${toFa(capacity.remaining)} جای خالی`}
                      </small>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}
