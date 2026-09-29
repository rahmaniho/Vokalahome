'use client';

import { FormEvent, useRef, useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { contactSchema, collectErrors, HONEYPOT_FIELD, isLikelyBot } from '@/lib/validation';
import { submitForm } from '@/lib/submit';
import { cn } from '@/lib/utils';

const SUBJECTS = {
  contact: ['پرسش عمومی', 'رزرو اتاق مشاوره', 'عضویت در خانه وکلا', 'همکاری و رویداد', 'انتقاد یا پیشنهاد'],
  question: ['قراردادها', 'املاک و ملکی', 'خانواده', 'کیفری', 'تجاری و شرکت‌ها', 'سایر موضوعات'],
} as const;

type Kind = keyof typeof SUBJECTS;

/** فرم تماس و پرسش حقوقی، با اعتبارسنجی Zod و مسیر جایگزین واتساپ. */
export function ContactForm({ kind = 'contact' }: { kind?: Kind }) {
  const startedAt = useRef(Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setFallbackUrl('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    if (isLikelyBot(form, startedAt.current)) {
      setSubmitError('فرم خیلی سریع ارسال شد. لطفاً دوباره تلاش کنید.');
      return;
    }

    const parsed = contactSchema.safeParse({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      email: String(form.get('email') ?? ''),
      subject: String(form.get('subject') ?? ''),
      message: String(form.get('message') ?? ''),
      consent: form.get('consent') === 'on',
    });

    if (!parsed.success) {
      setErrors(collectErrors(parsed.error));
      const first = parsed.error.issues[0]?.path[0];
      if (first) formElement.querySelector<HTMLElement>(`[name="${String(first)}"]`)?.focus();
      return;
    }

    setErrors({});
    setLoading(true);
    const result = await submitForm(kind, parsed.data);
    setLoading(false);

    if (result.status === 'error') {
      setSubmitError(result.message);
      return;
    }
    if (result.status === 'fallback') setFallbackUrl(result.whatsappUrl);
    setDone(true);
    formElement.reset();
  }

  if (done) {
    return (
      <div className="surface-card grid min-h-72 place-items-center p-8 text-center">
        <div className="max-w-sm">
          <CheckCircle2 className="mx-auto text-emerald-600" size={42} aria-hidden />
          <h3 className="mt-4 text-xl font-black text-ink">
            {kind === 'question' ? 'پرسش شما ثبت شد' : 'پیام شما ثبت شد'}
          </h3>
          <p className="mt-2 text-sm leading-[1.95] text-ink-muted">
            همکاران ما در اولین فرصت و حداکثر تا یک روز کاری پاسخ‌گو خواهند بود.
          </p>

          {fallbackUrl && (
            <Alert tone="warning" className="mt-5 text-right">
              سرویس ارسال فرم هنوز پیکربندی نشده است. برای اینکه پیام شما گم نشود، همین متن را در واتساپ بفرستید:
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
              setDone(false);
              setFallbackUrl('');
              startedAt.current = Date.now();
            }}
            className="mt-5 min-h-11 text-sm font-bold text-gold-600 dark:text-gold-400"
          >
            ارسال پیام دیگر
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card grid gap-4 p-5 shadow-soft sm:p-7">
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

      <div className="grid gap-4 sm:grid-cols-2">
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
          <span className="form-label">موضوع *</span>
          <select name="subject" className={cn('form-control', errors.subject && 'form-control-error')}>
            {SUBJECTS[kind].map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
          {errors.subject && <span className="form-error">{errors.subject}</span>}
        </label>
      </div>

      <label className="block">
        <span className="form-label">{kind === 'question' ? 'شرح پرسش *' : 'پیام شما *'}</span>
        <textarea
          name="message"
          rows={5}
          className={cn('form-control resize-none', errors.message && 'form-control-error')}
          placeholder={
            kind === 'question'
              ? 'موضوع را به‌اختصار و بدون ذکر اطلاعات هویتی اشخاص ثالث توضیح دهید…'
              : 'چه کمکی از ما برمی‌آید؟'
          }
        />
        {errors.message ? (
          <span className="form-error">{errors.message}</span>
        ) : (
          <span className="form-hint">
            لطفاً اطلاعات حساس پرونده یا مدارک هویتی را در فرم عمومی ارسال نکنید.
          </span>
        )}
      </label>

      <label className="flex min-h-11 cursor-pointer items-start gap-3 text-xs leading-[1.9] text-ink-muted">
        <input type="checkbox" name="consent" className="mt-1 size-[18px] shrink-0 accent-gold-500" />
        <span>قواعد خانه و سیاست حریم خصوصی را می‌پذیرم.</span>
      </label>
      {errors.consent && <span className="form-error">{errors.consent}</span>}

      {submitError && <Alert tone="danger">{submitError}</Alert>}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-black text-white transition hover:bg-gold-500 hover:text-navy-900 disabled:opacity-50 dark:bg-white dark:text-navy-900 dark:hover:bg-gold-500"
      >
        {loading ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Send size={17} aria-hidden />}
        {kind === 'question' ? 'ارسال پرسش' : 'ارسال پیام'}
      </button>
    </form>
  );
}
