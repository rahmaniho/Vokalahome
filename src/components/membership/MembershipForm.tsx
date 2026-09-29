'use client';

import { FormEvent, useRef, useState } from 'react';
import { BadgeCheck, Loader2, MessageCircle, Send } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { MembershipCard, buildMemberId } from './MembershipCard';
import { BILLING_CYCLES, plans, planPrice } from '@/lib/data/plans';
import { membershipSchema, collectErrors, HONEYPOT_FIELD, isLikelyBot } from '@/lib/validation';
import { submitForm } from '@/lib/submit';
import type { BillingCycle } from '@/types';
import { cn, formatToman, toFa } from '@/lib/utils';

const ROLES = [
  'وکیل پایه یک دادگستری',
  'وکیل پایه دو دادگستری',
  'کارآموز وکالت',
  'مشاور حقوقی مادهٔ ۱۸۷',
  'دانشجوی ارشد یا دکتری حقوق',
] as const;

type MembershipFormProps = {
  defaultPlan?: string;
  defaultCycle?: BillingCycle;
};

/**
 * فرم درخواست عضویت با اعتبارسنجی Zod سمت کلاینت.
 *
 * پس از ارسال موفق، «پیش‌نمایش» کارت دیجیتال نشان داده می‌شود؛ کارت واقعی
 * فقط پس از احراز پروانه توسط دبیرخانه صادر می‌شود. این تفکیک عمدی است:
 * سایت نباید ادعای عضویتی کند که هنوز تأیید نشده.
 */
export function MembershipForm({ defaultPlan = 'vakil', defaultCycle = 'monthly' }: MembershipFormProps) {
  const startedAt = useRef(Date.now());

  const [planSlug, setPlanSlug] = useState(defaultPlan);
  const [cycle, setCycle] = useState<BillingCycle>(defaultCycle);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [submitted, setSubmitted] = useState<{ name: string; memberId: string } | null>(null);

  const plan = plans.find((item) => item.slug === planSlug) ?? plans[1];
  const price = planPrice(plan, cycle);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setFallbackUrl('');

    const form = new FormData(event.currentTarget);
    if (isLikelyBot(form, startedAt.current)) {
      setSubmitError('فرم خیلی سریع ارسال شد. لطفاً دوباره تلاش کنید.');
      return;
    }

    const parsed = membershipSchema.safeParse({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      email: String(form.get('email') ?? ''),
      plan: plan.name,
      cycle,
      role: String(form.get('role') ?? ''),
      licenseNumber: String(form.get('licenseNumber') ?? ''),
      specialty: String(form.get('specialty') ?? ''),
      note: String(form.get('note') ?? ''),
      consent: form.get('consent') === 'on',
    });

    if (!parsed.success) {
      setErrors(collectErrors(parsed.error));
      // اولین فیلد خطادار را در دید کاربر بیاور.
      const first = parsed.error.issues[0]?.path[0];
      if (first) document.querySelector<HTMLElement>(`[name="${String(first)}"]`)?.focus();
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await submitForm('membership', {
      ...parsed.data,
      cycle: BILLING_CYCLES[cycle].label,
      estimatedPrice: `${formatToman(price.total)} تومان برای ${toFa(price.months)} ماه`,
    });

    setLoading(false);

    if (result.status === 'error') {
      setSubmitError(result.message);
      return;
    }
    if (result.status === 'fallback') setFallbackUrl(result.whatsappUrl);

    setSubmitted({
      name: parsed.data.name,
      memberId: buildMemberId(Math.floor(Math.random() * 90_000) + 10_000),
    });
  }

  /* ───────── پس از ارسال ───────── */
  if (submitted) {
    return (
      <div className="surface-card p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-600">
            <BadgeCheck size={24} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-ink">درخواست عضویت ثبت شد</h3>
            <p className="mt-2 text-sm leading-[1.95] text-ink-muted">
              دبیرخانهٔ خانه وکلا ظرف یک روز کاری برای احراز پروانه و هماهنگی بازدید با شما تماس می‌گیرد. پس از تأیید،
              کارت عضویت دیجیتال شما فعال می‌شود.
            </p>
          </div>
        </div>

        {fallbackUrl && (
          <Alert tone="warning" className="mt-5">
            سرویس ارسال فرم هنوز پیکربندی نشده است. برای اینکه درخواست شما گم نشود، همین اطلاعات را در واتساپ بفرستید:
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

        <div className="mt-7 border-t border-line pt-6">
          <h4 className="mb-1 text-sm font-black text-ink">پیش‌نمایش کارت عضویت شما</h4>
          <p className="mb-4 text-xs leading-6 text-ink-faint">
            این کارت پس از تأیید دبیرخانه فعال و قابل دانلود می‌شود. QR روی کارت، شناسهٔ عضویت را برای پذیرش خانه
            اعتبارسنجی می‌کند.
          </p>
          <MembershipCard
            preview
            data={{
              name: submitted.name,
              planName: plan.name,
              memberId: submitted.memberId,
              validUntil: `${toFa(price.months)} ماه پس از تأیید`,
              role: 'عضو خانه وکلا',
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            setFallbackUrl('');
            startedAt.current = Date.now();
          }}
          className="mt-6 min-h-11 text-sm font-bold text-gold-600 dark:text-gold-400"
        >
          ثبت درخواست دیگر
        </button>
      </div>
    );
  }

  /* ───────── فرم ───────── */
  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card p-5 shadow-soft sm:p-7">
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="form-label">نام و نام خانوادگی *</span>
          <input
            name="name"
            autoComplete="name"
            className={cn('form-control', errors.name && 'form-control-error')}
            placeholder="نام کامل، مطابق پروانه"
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

        <label className="block">
          <span className="form-label">ایمیل</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            className={cn('form-control text-right', errors.email && 'form-control-error')}
            placeholder="name@example.com"
          />
          {errors.email ? <span className="form-error">{errors.email}</span> : <span className="form-hint">اختیاری</span>}
        </label>

        <label className="block">
          <span className="form-label">جایگاه حرفه‌ای *</span>
          <select name="role" className={cn('form-control', errors.role && 'form-control-error')} defaultValue={ROLES[0]}>
            {ROLES.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          {errors.role && <span className="form-error">{errors.role}</span>}
        </label>

        <label className="block">
          <span className="form-label">شمارهٔ پروانه یا کارنامه *</span>
          <input
            name="licenseNumber"
            dir="ltr"
            className={cn('form-control text-right', errors.licenseNumber && 'form-control-error')}
            placeholder="مثال: 12345"
          />
          {errors.licenseNumber ? (
            <span className="form-error">{errors.licenseNumber}</span>
          ) : (
            <span className="form-hint">فقط برای احراز هویت صنفی استفاده می‌شود</span>
          )}
        </label>

        <label className="block">
          <span className="form-label">حوزهٔ تخصص</span>
          <input name="specialty" className="form-control" placeholder="مثال: خانواده، تجاری، کیفری" />
        </label>
      </div>

      {/* انتخاب پلن */}
      <div className="mt-5">
        <span className="form-label">پلن عضویت *</span>
        <div className="grid gap-2 sm:grid-cols-3">
          {plans.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setPlanSlug(item.slug)}
              aria-pressed={planSlug === item.slug}
              className={cn(
                'rounded-2xl border p-3 text-right transition',
                planSlug === item.slug
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-line bg-surface hover:border-gold-500/50',
              )}
            >
              <b className="block text-xs font-black text-ink">{item.name}</b>
              <small className="mt-1 block text-[10px] text-ink-faint">{item.roomHours}</small>
            </button>
          ))}
        </div>
      </div>

      {/* دورهٔ پرداخت */}
      <div className="mt-4">
        <span className="form-label">دورهٔ پرداخت *</span>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(BILLING_CYCLES) as BillingCycle[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCycle(key)}
              aria-pressed={cycle === key}
              className={cn(
                'min-h-11 rounded-xl border px-2 text-xs font-bold transition',
                cycle === key ? 'border-gold-500 bg-gold-500/15 text-ink' : 'border-line text-ink-muted hover:border-gold-500',
              )}
            >
              {BILLING_CYCLES[key].label}
              {BILLING_CYCLES[key].badge && (
                <span className="mt-0.5 block text-[9px] font-black text-emerald-600 dark:text-emerald-400">
                  {BILLING_CYCLES[key].badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* خلاصهٔ مبلغ */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gold-500/25 bg-gold-500/[.06] px-4 py-3.5">
        <div className="text-xs text-ink-muted">
          <b className="text-ink">{plan.name}</b> · {BILLING_CYCLES[cycle].label}
          {price.saved > 0 && (
            <span className="mr-2 text-emerald-600 dark:text-emerald-400">
              {formatToman(price.saved)} تومان صرفه‌جویی
            </span>
          )}
        </div>
        <div className="text-left">
          <b className="block text-base font-black text-ink">{formatToman(price.total)} تومان</b>
          <small className="text-[10px] text-ink-faint">
            معادل ماهانه {formatToman(price.perMonth)} تومان
          </small>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="form-label">توضیح کوتاه</span>
        <textarea
          name="note"
          rows={3}
          className="form-control resize-none"
          placeholder="اگر نکته‌ای هست که بهتر است بدانیم، اینجا بنویسید."
        />
      </label>

      <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-xs leading-[1.9] text-ink-muted">
        <input type="checkbox" name="consent" className="mt-1 size-[18px] shrink-0 accent-gold-500" />
        <span>
          قواعد خانه و سیاست حریم خصوصی را خوانده‌ام و می‌پذیرم که اطلاعات من برای احراز پروانه و هماهنگی عضویت
          استفاده شود.
        </span>
      </label>
      {errors.consent && <span className="form-error">{errors.consent}</span>}

      {submitError && (
        <Alert tone="danger" className="mt-4">
          {submitError}
        </Alert>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-black text-navy-900 transition hover:bg-gold-400 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Send size={17} aria-hidden />}
        ارسال درخواست عضویت
      </button>

      <p className="mt-3 text-center text-[10px] leading-5 text-ink-faint">
        هیچ پرداخت آنلاینی در این مرحله انجام نمی‌شود. مبلغ پس از جلسهٔ آشنایی و تأیید عضویت، حضوری تسویه می‌شود.
      </p>
    </form>
  );
}
