'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { plans } from '@/lib/data/plans';

type Kind = 'contact' | 'question' | 'membership';

export function ContactForm({ kind = 'contact' }: { kind?: Kind }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('loading');
    const form = new FormData(event.currentTarget);
    form.set('formKind', kind);
    try {
      if (!SITE.formspreeEndpoint.includes('YOUR_FORM_ID')) {
        await fetch(SITE.formspreeEndpoint, { method: 'POST', body: form, headers: { Accept: 'application/json' } });
      }
      setState('done');
      event.currentTarget.reset();
    } catch { setState('idle'); }
  }

  if (state === 'done') return (
    <div className="grid min-h-72 place-items-center rounded-3xl bg-emerald-50 p-8 text-center">
      <div>
        <CheckCircle2 className="mx-auto text-emerald-600" size={42} />
        <h3 className="mt-4 text-xl font-black text-navy-900">{kind === 'membership' ? 'درخواست عضویت ثبت شد' : 'پیام شما ثبت شد'}</h3>
        <p className="mt-2 text-sm leading-7 text-gray-500">{kind === 'membership' ? 'دبیرخانه خانه وکلا ظرف یک روز کاری برای احراز پروانه و هماهنگی بازدید تماس می‌گیرد.' : 'همکاران ما در اولین فرصت پاسخ‌گو خواهند بود.'}</p>
        <button onClick={() => setState('idle')} className="mt-4 text-xs font-bold text-emerald-700">ارسال درخواست دیگر</button>
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="form-label">نام و نام خانوادگی *</span><input required name="name" className="form-control" placeholder="نام شما" /></label>
        <label><span className="form-label">شماره همراه *</span><input required name="phone" inputMode="tel" dir="ltr" className="form-control text-right" placeholder="09xxxxxxxxx" /></label>
      </div>

      {kind === 'membership' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="form-label">جایگاه حرفه‌ای</span>
            <select name="role" className="form-control">
              <option>وکیل پایه یک دادگستری</option>
              <option>وکیل پایه دو دادگستری</option>
              <option>کارآموز وکالت</option>
              <option>دانشجوی تحصیلات تکمیلی حقوق</option>
              <option>تیم حقوقی / مؤسسه</option>
            </select>
          </label>
          <label><span className="form-label">پلن مورد نظر</span>
            <select name="plan" className="form-control">
              {plans.map((plan) => <option key={plan.slug}>{plan.name}</option>)}
              <option>هنوز تصمیم نگرفته‌ام؛ ابتدا بازدید</option>
            </select>
          </label>
        </div>
      )}

      <label><span className="form-label">{kind === 'question' ? 'دسته سؤال' : kind === 'membership' ? 'حوزه تخصصی شما' : 'موضوع پیام'}</span>
        {kind === 'question'
          ? <select name="category" className="form-control"><option>عضویت</option><option>اتاق مشاوره</option><option>کافه و فضای کار</option><option>رویدادها</option><option>مشاوره برای موکل</option></select>
          : <input name="subject" className="form-control" placeholder={kind === 'membership' ? 'مثلاً: خانواده، کیفری، قراردادها' : 'موضوع را کوتاه بنویسید'} />}
      </label>

      <label><span className="form-label">{kind === 'question' ? 'سؤال شما *' : kind === 'membership' ? 'توضیح کوتاه *' : 'متن پیام *'}</span>
        <textarea required name="message" rows={5} className="form-control resize-none" placeholder={kind === 'membership' ? 'چند ساعت اتاق مشاوره در ماه نیاز دارید؟ چه روزهایی بیشتر حاضر می‌شوید؟' : 'لطفاً از درج اطلاعات بسیار حساس خودداری کنید...'} />
      </label>

      <button disabled={state === 'loading'} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 text-sm font-black text-white transition hover:bg-gold-500 hover:text-navy-950">
        {state === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
        {kind === 'question' ? 'ارسال سؤال' : kind === 'membership' ? 'ارسال درخواست عضویت' : 'ارسال پیام'}
      </button>
      <small className="text-center text-[10px] leading-5 text-gray-400">با ارسال فرم، قواعد خانه و سیاست حریم خصوصی را می‌پذیرید.</small>
    </form>
  );
}
