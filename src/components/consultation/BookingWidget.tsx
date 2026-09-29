'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck2, Clock3, Loader2, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { toGregorian, toJalaali } from 'jalaali-js';
import { JalaliCalendar, MONTH_NAMES, type SelectedDay } from './JalaliCalendar';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { CONSULTATION_TYPES, ROOM_RATE } from '@/lib/constants';
import { rooms } from '@/lib/data/rooms';
import { plans } from '@/lib/data/plans';
import { bookingSchema } from '@/lib/validation';
import { collectErrors, HONEYPOT_FIELD, isLikelyBot } from '@/lib/validation';
import { submitForm, buildWhatsappMessage } from '@/lib/submit';
import { SITE } from '@/lib/constants';
import { cn, formatToman, generateTrackingCode, toFa, whatsappLink } from '@/lib/utils';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * ویجت رزرو اتاق مشاوره.
 *
 * سه بخش: تقویم شمسی → انتخاب ساعت و مدت → فرم و برآورد هزینه.
 * محاسبهٔ قیمت کاملاً سمت کلاینت است (هیچ درگاه یا سروری در کار نیست) و
 * ساختار کد طوری است که اتصال بعدی به درگاه پرداخت فقط جایگزینی تابع
 * `submitForm` با یک تابع «ایجاد تراکنش» باشد. راهنما: docs/BACKEND-INTEGRATION.md
 */
export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const [now] = useState(() => new Date());
  const startedAt = useRef(Date.now());

  const [selected, setSelected] = useState<SelectedDay | null>(null);
  const [slot, setSlot] = useState('');
  const [bookingType, setBookingType] = useState<'member-room' | 'guest-room' | 'client-consult'>('member-room');
  const [roomSlug, setRoomSlug] = useState(rooms[0].slug);
  const [hours, setHours] = useState(1);
  const [guests, setGuests] = useState(2);
  const [planSlug, setPlanSlug] = useState(plans[1].slug);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [submitError, setSubmitError] = useState('');

  const room = rooms.find((item) => item.slug === roomSlug) ?? rooms[0];
  const plan = plans.find((item) => item.slug === planSlug) ?? plans[1];

  /* ───────────── بازه‌های ساعتی روز انتخاب‌شده ───────────── */
  const slots = useMemo(() => {
    if (!selected) return [] as string[];
    const gregorian = toGregorian(selected.jy, selected.jm, selected.jd);
    const isFriday = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd).getDay() === 5;
    const opens = isFriday ? 14 : 8;
    const closes = 22;

    const isToday =
      gregorian.gy === now.getFullYear() && gregorian.gm === now.getMonth() + 1 && gregorian.gd === now.getDate();

    const output: string[] = [];
    for (let hour = opens; hour < closes; hour++) {
      for (const minute of [0, 30]) {
        if (hour === 13) continue; // بازهٔ استراحت پذیرش
        // شبیه‌سازی چند بازهٔ رزروشده تا تقویم واقعی به نظر برسد.
        // در اتصال به Supabase این شرط با دادهٔ واقعی جایگزین می‌شود.
        if ((hour * 2 + (minute ? 1 : 0) + selected.jd) % 11 === 0) continue;
        if (isToday && (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes()))) continue;
        output.push(`${pad(hour)}:${pad(minute)}`);
      }
    }
    return output;
  }, [selected, now]);

  // با تغییر روز، ساعت انتخابی باید پاک شود تا رزرو نامعتبر ثبت نشود.
  useEffect(() => setSlot(''), [selected]);

  /* ───────────── ماشین‌حساب هزینه (سمت کلاینت) ───────────── */
  const pricing = useMemo(() => {
    const rate = room.guestRate;

    if (bookingType === 'member-room') {
      const covered = Math.min(hours, plan.freeRoomHours);
      const extra = Math.max(hours - plan.freeRoomHours, 0);
      const extraCost = rate ? extra * rate : 0;
      return {
        isFree: extra === 0,
        total: extraCost,
        lines: [
          { label: `${toFa(covered)} ساعت در سقف پلن «${plan.name}»`, value: 'رایگان' },
          ...(extra > 0
            ? [{ label: `${toFa(extra)} ساعت مازاد بر سقف پلن`, value: `${formatToman(extraCost)} تومان` }]
            : []),
        ],
        note:
          extra > 0
            ? `سقف رایگان پلن شما ${toFa(plan.freeRoomHours)} ساعت در ماه است؛ ساعت‌های بیشتر با تعرفهٔ عادی محاسبه می‌شود.`
            : 'این رزرو کاملاً در سقف ساعتی پلن شما جا می‌شود.',
      };
    }

    if (bookingType === 'guest-room') {
      if (rate === null) {
        return {
          isFree: false,
          total: 0,
          lines: [{ label: 'تعرفهٔ این فضا', value: 'با هماهنگی دبیرخانه' }],
          note: 'هزینهٔ سالن نشست بر اساس نوع رویداد و مدت آن تعیین می‌شود.',
        };
      }
      const total = hours * rate;
      return {
        isFree: false,
        total,
        lines: [
          { label: `${toFa(hours)} ساعت × ${formatToman(rate)} تومان`, value: `${formatToman(total)} تومان` },
          { label: 'پذیرایی و خدمات منشی', value: 'شامل تعرفه' },
        ],
        note: `با عضویت «${plans[1].name}» همین رزرو برای شما رایگان می‌شد.`,
      };
    }

    return {
      isFree: false,
      total: 0,
      lines: [{ label: 'حق‌الزحمهٔ مشاوره', value: 'بر اساس تعرفهٔ وکیل' }],
      note: 'پس از بررسی موضوع، وکیل متخصص و تعرفهٔ جلسه به شما اعلام می‌شود.',
    };
  }, [bookingType, hours, plan, room.guestRate]);

  /* ───────────── ارسال ───────────── */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setFallbackUrl('');

    const form = new FormData(event.currentTarget);
    if (isLikelyBot(form, startedAt.current)) {
      setSubmitError('ارسال خیلی سریع انجام شد. لطفاً دوباره تلاش کنید.');
      return;
    }

    const parsed = bookingSchema.safeParse({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      room: room.name,
      bookingType,
      date: selected?.key ?? '',
      time: slot,
      hours,
      guests,
      note: String(form.get('note') ?? ''),
    });

    if (!parsed.success) {
      setErrors(collectErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);

    const code = generateTrackingCode();
    const payload = {
      ...parsed.data,
      date: `${toFa(parsed.data.date)} (${MONTH_NAMES[(selected?.jm ?? 1) - 1]})`,
      estimatedPrice: pricing.isFree ? 'رایگان' : `${formatToman(pricing.total)} تومان`,
      trackingCode: code,
    };

    const result = await submitForm('booking', payload);
    setLoading(false);

    // رزرو همیشه به‌صورت محلی هم ذخیره می‌شود تا کاربر بتواند پیگیری کند.
    try {
      const previous = JSON.parse(localStorage.getItem('vokalahome-bookings') || '[]');
      localStorage.setItem(
        'vokalahome-bookings',
        JSON.stringify([...previous, { ...payload, createdAt: new Date().toISOString() }]),
      );
    } catch {
      /* حافظهٔ محلی در دسترس نیست — مشکلی نیست */
    }

    if (result.status === 'error') {
      setSubmitError(result.message);
      return;
    }
    if (result.status === 'fallback') setFallbackUrl(result.whatsappUrl);
    setTracking(code);
  }

  /* ───────────── صفحهٔ موفقیت ───────────── */
  if (tracking) {
    return (
      <div className="surface-card grid min-h-[420px] place-items-center p-6 text-center shadow-soft sm:p-10">
        <div className="max-w-md">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500/12 text-emerald-600">
            <CalendarCheck2 size={36} aria-hidden />
          </span>
          <h3 className="mt-6 text-xl font-black text-ink sm:text-2xl">درخواست رزرو شما ثبت شد</h3>
          <p className="mt-3 text-sm leading-[1.95] text-ink-muted">
            پذیرش خانه وکلا برای تأیید نهایی زمان و آماده‌سازی اتاق با شما تماس می‌گیرد.
          </p>

          <div className="mt-6 rounded-2xl bg-navy-900 p-5 text-white">
            <small className="block text-white/50">کد پیگیری</small>
            <strong className="mt-2 block font-mono text-3xl tracking-[.25em] text-gold-400" dir="ltr">
              {toFa(tracking)}
            </strong>
          </div>

          {fallbackUrl && (
            <Alert tone="warning" className="mt-5 text-right">
              سرویس ارسال فرم هنوز پیکربندی نشده است. برای اینکه درخواست شما گم نشود، همین پیام را در واتساپ بفرستید:
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-xs font-black text-white transition hover:bg-emerald-600"
              >
                <MessageCircle size={16} aria-hidden />
                ارسال در واتساپ
              </a>
            </Alert>
          )}

          <button
            type="button"
            onClick={() => {
              setTracking('');
              setSelected(null);
              setSlot('');
              setFallbackUrl('');
              startedAt.current = Date.now();
            }}
            className="mt-5 min-h-11 text-sm font-bold text-gold-600 dark:text-gold-400"
          >
            ثبت رزرو جدید
          </button>
        </div>
      </div>
    );
  }

  /* ───────────── فرم ───────────── */
  return (
    <div
      className={cn(
        'surface-card overflow-hidden shadow-soft',
        !compact && 'lg:grid lg:grid-cols-[1.05fr_.95fr]',
      )}
    >
      {/* ستون تقویم و ساعت */}
      <div className="p-5 sm:p-7">
        <JalaliCalendar selected={selected} onSelect={setSelected} />

        {selected && (
          <div className="mt-6 border-t border-line pt-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-black text-ink">
              <Clock3 size={16} className="text-gold-500" aria-hidden />
              ساعت شروع جلسه در {toFa(selected.key)}
            </div>
            {slots.length === 0 ? (
              <Alert tone="warning">برای این روز بازهٔ آزادی باقی نمانده است. لطفاً روز دیگری انتخاب کنید.</Alert>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {slots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSlot(time)}
                    aria-pressed={slot === time}
                    dir="ltr"
                    className={cn(
                      'min-h-11 rounded-xl border px-2 text-[11px] font-bold transition',
                      slot === time
                        ? 'border-gold-500 bg-gold-500 text-navy-900'
                        : 'border-line text-ink-muted hover:border-gold-500 hover:text-gold-600',
                    )}
                  >
                    {toFa(time)}
                  </button>
                ))}
              </div>
            )}
            {errors.time && <p className="form-error">{errors.time}</p>}
          </div>
        )}

        {/* مدت جلسه */}
        <div className="mt-6 border-t border-line pt-5">
          <span className="form-label">مدت جلسه</span>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 6, 8].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setHours(value)}
                aria-pressed={hours === value}
                className={cn(
                  'min-h-11 min-w-11 rounded-xl border px-3 text-xs font-bold transition',
                  hours === value
                    ? 'border-gold-500 bg-gold-500/15 text-gold-700 dark:text-gold-300'
                    : 'border-line text-ink-muted hover:border-gold-500',
                )}
              >
                {toFa(value)} ساعت
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ستون فرم و برآورد هزینه */}
      {!compact && (
        <form onSubmit={handleSubmit} noValidate className="border-t border-line bg-surface-2 p-5 sm:p-7 lg:border-r lg:border-t-0">
          <h3 className="text-base font-black text-ink sm:text-lg">اطلاعات رزرو</h3>
          <p className="mt-1 text-xs text-ink-faint">اطلاعات شما نزد خانه وکلا محرمانه می‌ماند.</p>

          {/* تلهٔ ربات — از نظر بصری و صفحه‌خوان پنهان است */}
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="form-label">نام و نام خانوادگی *</span>
              <input
                name="name"
                autoComplete="name"
                className={cn('form-control', errors.name && 'form-control-error')}
                placeholder="نام شما"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="form-label">شمارهٔ همراه *</span>
              <input
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                className={cn('form-control text-right', errors.phone && 'form-control-error')}
                placeholder="09xxxxxxxxx"
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </label>
          </div>

          <div className="mt-4">
            <span className="form-label">نوع رزرو</span>
            <div className="grid grid-cols-3 gap-2">
              {CONSULTATION_TYPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBookingType(item.id as typeof bookingType)}
                  aria-pressed={bookingType === item.id}
                  title={item.subtitle}
                  className={cn(
                    'min-h-11 rounded-xl border px-2 text-[11px] font-bold transition',
                    bookingType === item.id
                      ? 'border-gold-500 bg-gold-500/15 text-ink'
                      : 'border-line bg-surface text-ink-muted hover:border-gold-500',
                  )}
                >
                  {item.short}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="form-label">فضای موردنظر</span>
              <select value={roomSlug} onChange={(e) => setRoomSlug(e.target.value)} className="form-control">
                {rooms.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name} — {item.capacity}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="form-label">تعداد حاضران</span>
              <input
                type="number"
                min={1}
                max={room.seats}
                value={guests}
                onChange={(e) => setGuests(Math.min(Number(e.target.value) || 1, room.seats))}
                className="form-control"
                dir="ltr"
              />
              <span className="form-hint">ظرفیت این فضا {room.capacity} است.</span>
            </label>
          </div>

          {bookingType === 'member-room' && (
            <label className="mt-4 block">
              <span className="form-label">پلن عضویت شما</span>
              <select value={planSlug} onChange={(e) => setPlanSlug(e.target.value)} className="form-control">
                {plans.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name} — {toFa(item.freeRoomHours)} ساعت رایگان در ماه
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="mt-4 block">
            <span className="form-label">توضیح کوتاه</span>
            <textarea
              name="note"
              rows={3}
              className="form-control resize-none"
              placeholder="نیاز به پذیرایی ویژه، تجهیزات خاص یا هماهنگی خاصی دارید؟"
            />
          </label>

          {/* ───── برآورد هزینه ───── */}
          <div className="mt-5 rounded-2xl border border-gold-500/25 bg-gold-500/[.06] p-4">
            <div className="flex items-center gap-2 text-xs font-black text-ink">
              <Sparkles size={15} className="text-gold-500" aria-hidden />
              برآورد هزینه
            </div>
            <ul className="mt-3 space-y-2 text-[11px]">
              {pricing.lines.map((line) => (
                <li key={line.label} className="flex items-start justify-between gap-3 text-ink-muted">
                  <span>{line.label}</span>
                  <b className="shrink-0 text-ink">{line.value}</b>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-gold-500/20 pt-3">
              <span className="text-xs font-bold text-ink">جمع قابل پرداخت</span>
              {pricing.isFree ? (
                <Badge tone="success" dot>
                  رایگان
                </Badge>
              ) : pricing.total > 0 ? (
                <b className="text-sm font-black text-ink">{formatToman(pricing.total)} تومان</b>
              ) : (
                <b className="text-xs font-bold text-ink-muted">اعلام پس از بررسی</b>
              )}
            </div>
            <p className="mt-2.5 text-[10px] leading-5 text-ink-faint">{pricing.note}</p>
          </div>

          {submitError && (
            <Alert tone="danger" className="mt-4">
              {submitError}
            </Alert>
          )}

          <button
            type="submit"
            disabled={!selected || !slot || loading}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-black text-white transition hover:bg-gold-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-navy-900 dark:hover:bg-gold-500"
          >
            {loading ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <CalendarCheck2 size={18} aria-hidden />}
            ثبت درخواست رزرو
          </button>

          <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-[10px] leading-5 text-ink-faint">
            <ShieldCheck size={13} className="mt-0.5 shrink-0" aria-hidden />
            این فرم فقط «درخواست» را ثبت می‌کند؛ تأیید نهایی پس از تماس پذیرش انجام می‌شود و هیچ پرداخت آنلاینی در این
            مرحله انجام نمی‌گیرد.
          </p>

          <p className="mt-2 text-center text-[10px] text-ink-faint">
            ترجیح می‌دهید مستقیم پیام بدهید؟{' '}
            <a
              href={whatsappLink(
                SITE.whatsappNumber,
                buildWhatsappMessage('booking', { room: room.name, hours, date: selected?.key ?? '—', time: slot || '—' }),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 dark:text-emerald-400"
            >
              رزرو از طریق واتساپ
            </a>{' '}
            یا{' '}
            <Link href="/contact/" className="font-bold text-gold-600 dark:text-gold-400">
              تماس با پذیرش
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

/** تاریخ امروز به شمسی — برای نمایش در عنوان‌ها. */
export function todayJalali() {
  const { jy, jm, jd } = toJalaali(new Date());
  return `${toFa(jd)} ${MONTH_NAMES[jm - 1]} ${toFa(jy)}`;
}

export { ROOM_RATE };
