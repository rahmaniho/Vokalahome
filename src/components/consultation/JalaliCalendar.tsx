'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js';
import { holidays, weeklyHolidays } from '@/lib/data/holidays';
import { cn, toFa } from '@/lib/utils';

export const MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const;

/** هفته در تقویم ایران از شنبه شروع می‌شود. */
const WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const;

const pad = (value: number) => String(value).padStart(2, '0');
export const jalaliKey = (jy: number, jm: number, jd: number) => `${jy}/${pad(jm)}/${pad(jd)}`;

export type SelectedDay = { jy: number; jm: number; jd: number; key: string };
export type DayStatus = 'past' | 'holiday' | 'booked' | 'available';

type JalaliCalendarProps = {
  selected: SelectedDay | null;
  onSelect: (day: SelectedDay) => void;
  /** چند ماه به جلو قابل مرور باشد */
  monthsAhead?: number;
  /** نشانه‌گذاری روزهایی که رویداد دارند (کلید شمسی YYYY/MM/DD) */
  markedDates?: string[];
  /** روزهایی که پر شده‌اند */
  bookedDates?: string[];
  /** فقط نمایش؛ بدون انتخاب */
  readOnly?: boolean;
  className?: string;
};

/**
 * تقویم شمسی سبک و کاملاً سمت کلاینت.
 *
 * چرا دست‌ساز؟ همهٔ date-picker‌های آماده یا RTL نیستند، یا تقویم شمسی ندارند،
 * یا ۳۰ کیلوبایت به باندل اضافه می‌کنند. اینجا فقط `jalaali-js` (۲ کیلوبایت)
 * برای تبدیل تاریخ استفاده می‌شود و بقیه CSS و چند خط منطق است.
 *
 * دسترسی‌پذیری: هر روز یک دکمهٔ واقعی است، قابل پیمایش با Tab، با aria-label
 * فارسی کامل و aria-pressed برای روز انتخاب‌شده.
 */
export function JalaliCalendar({
  selected,
  onSelect,
  monthsAhead = 3,
  markedDates = [],
  bookedDates = [],
  readOnly = false,
  className,
}: JalaliCalendarProps) {
  const [now] = useState(() => new Date());
  const today = useMemo(() => toJalaali(now), [now]);
  const [view, setView] = useState({ jy: today.jy, jm: today.jm });

  /** شبکهٔ روزها با خانه‌های خالی ابتدای ماه. */
  const days = useMemo(() => {
    const length = jalaaliMonthLength(view.jy, view.jm);
    const first = toGregorian(view.jy, view.jm, 1);
    const weekday = new Date(first.gy, first.gm - 1, first.gd).getDay();
    // getDay: ۰=یکشنبه … ۶=شنبه. برای شروع هفته از شنبه: (weekday + 1) % 7
    const offset = (weekday + 1) % 7;
    return [...Array<null>(offset).fill(null), ...Array.from({ length }, (_, i) => i + 1)];
  }, [view]);

  const statusOf = (day: number): DayStatus => {
    const key = jalaliKey(view.jy, view.jm, day);
    const gregorian = toGregorian(view.jy, view.jm, day);
    const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (date < startOfToday) return 'past';
    if (weeklyHolidays.includes(date.getDay())) return 'holiday';
    if (holidays.some((item) => item.date === key)) return 'holiday';
    if (bookedDates.includes(key)) return 'booked';
    return 'available';
  };

  const holidayTitle = (day: number) => {
    const key = jalaliKey(view.jy, view.jm, day);
    return holidays.find((item) => item.date === key)?.title;
  };

  const moveMonth = (delta: number) => {
    let { jy, jm } = view;
    jm += delta;
    if (jm > 12) {
      jm = 1;
      jy += 1;
    }
    if (jm < 1) {
      jm = 12;
      jy -= 1;
    }
    const distance = (jy - today.jy) * 12 + (jm - today.jm);
    if (distance < 0 || distance > monthsAhead) return;
    setView({ jy, jm });
  };

  const atStart = view.jy === today.jy && view.jm === today.jm;
  const atEnd = (view.jy - today.jy) * 12 + (view.jm - today.jm) >= monthsAhead;

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {/* در RTL، «قبل» سمت راست است. */}
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          disabled={atStart}
          className="tap-target rounded-xl border border-line text-ink-muted transition hover:border-gold-500 hover:text-gold-600 disabled:opacity-30 disabled:hover:border-line"
          aria-label="ماه قبل"
        >
          <ChevronRight size={18} aria-hidden />
        </button>

        <div className="text-center" aria-live="polite">
          <b className="block text-sm font-black text-ink sm:text-base">
            {MONTH_NAMES[view.jm - 1]} {toFa(view.jy)}
          </b>
          <small className="text-[10px] text-ink-faint">
            {readOnly ? 'روزهای دارای برنامه مشخص شده‌اند' : 'یک روز آزاد را انتخاب کنید'}
          </small>
        </div>

        <button
          type="button"
          onClick={() => moveMonth(1)}
          disabled={atEnd}
          className="tap-target rounded-xl border border-line text-ink-muted transition hover:border-gold-500 hover:text-gold-600 disabled:opacity-30 disabled:hover:border-line"
          aria-label="ماه بعد"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center" role="grid">
        {WEEK_DAYS.map((label) => (
          <span key={label} className="py-2 text-[10px] font-bold text-ink-faint" role="columnheader">
            {label}
          </span>
        ))}

        {days.map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} aria-hidden />;

          const key = jalaliKey(view.jy, view.jm, day);
          const status = statusOf(day);
          const isSelected = selected?.key === key;
          const isToday = view.jy === today.jy && view.jm === today.jm && day === today.jd;
          const isMarked = markedDates.includes(key);
          const disabled = readOnly ? !isMarked : status !== 'available';

          const statusLabel =
            status === 'available'
              ? 'آزاد'
              : status === 'booked'
                ? 'تکمیل ظرفیت'
                : status === 'holiday'
                  ? (holidayTitle(day) ?? 'تعطیل')
                  : 'گذشته';

          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-selected={isSelected}
              aria-label={`${toFa(day)} ${MONTH_NAMES[view.jm - 1]} ${toFa(view.jy)} — ${statusLabel}`}
              title={statusLabel}
              onClick={() => onSelect({ jy: view.jy, jm: view.jm, jd: day, key })}
              className={cn(
                'relative grid aspect-square min-h-[38px] place-items-center rounded-xl text-xs font-bold transition',
                isSelected && 'bg-gold-500 text-navy-900 shadow-gold',
                !isSelected && isMarked && 'bg-gold-500/15 text-gold-700 ring-1 ring-gold-500/40 dark:text-gold-300',
                !isSelected && !isMarked && status === 'available' && 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300',
                !isSelected && !isMarked && status === 'booked' && 'bg-red-500/10 text-red-400 line-through',
                !isSelected && !isMarked && (status === 'holiday' || status === 'past') && 'bg-surface-3 text-ink-faint',
              )}
            >
              {toFa(day)}
              {isToday && (
                <i
                  aria-hidden
                  className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-navy-600 dark:bg-white"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-ink-faint">
        {readOnly ? (
          <>
            <Legend color="bg-gold-500" label="روز دارای برنامه" />
            <Legend color="bg-navy-600 dark:bg-white" label="امروز" />
          </>
        ) : (
          <>
            <Legend color="bg-emerald-500" label="آزاد" />
            <Legend color="bg-red-400" label="تکمیل" />
            <Legend color="bg-mist-400" label="تعطیل یا گذشته" />
            <Legend color="bg-navy-600 dark:bg-white" label="امروز" />
          </>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <i aria-hidden className={cn('size-2 rounded-full', color)} />
      {label}
    </span>
  );
}
