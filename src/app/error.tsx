'use client';

import { useEffect } from 'react';
import { Home, Phone, RotateCcw, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { SITE } from '@/lib/constants';

/**
 * مرز خطای سراسری (Error Boundary) اپ.
 *
 * روی سایت استاتیک، رندر سمت سرور وجود ندارد؛ پس این صفحه فقط وقتی دیده
 * می‌شود که یک کامپوننت کلاینتی در مرورگر کاربر خطا بدهد (مثلاً مرورگر خیلی
 * قدیمی، افزونه‌ای که DOM را دستکاری کرده، یا نبود localStorage در حالت
 * ناشناس سخت‌گیرانه). چون علتش سمت کاربر است، مهم‌ترین کار این است که
 * کاربر بن‌بست نبیند و راه تماس مستقیم همیشه در دسترس باشد.
 *
 * نکته: این فایل باید 'use client' باشد و نمی‌تواند metadata صادر کند.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // بدون سرویس مانیتورینگ بیرونی (هزینه و حریم خصوصی)؛ فقط کنسول مرورگر
    // تا اگر کاربری اسکرین‌شات فرستاد، بشود علت را فهمید.
    console.error('[خانه وکلا] خطای سمت کلاینت:', error);
  }, [error]);

  return (
    <section className="noise persian-pattern grid min-h-[80vh] place-items-center bg-navy-900 px-5 py-28 text-center text-white">
      <div className="mx-auto max-w-lg">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-gold-500/15 text-gold-400 ring-1 ring-gold-500/30">
          <TriangleAlert size={30} aria-hidden />
        </span>

        <h1 className="mt-7 text-2xl font-black leading-[1.5] sm:text-3xl">مشکلی در نمایش این بخش پیش آمد</h1>

        <p className="mt-4 text-sm leading-[2.05] text-white/60">
          خطا سمت مرورگر رخ داده و اطلاعات شما جایی ثبت یا ارسال نشده است. یک‌بار «تلاش دوباره» را بزنید؛
          اگر باز هم تکرار شد، لطفاً مستقیم تماس بگیرید تا همان لحظه راهنمایی‌تان کنیم.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} variant="gold">
            <RotateCcw size={17} aria-hidden />
            تلاش دوباره
          </Button>
          <Button href="/" variant="light">
            <Home size={17} aria-hidden />
            صفحهٔ نخست
          </Button>
          <Button href={SITE.phoneHref} variant="light">
            <Phone size={17} aria-hidden />
            {SITE.phone}
          </Button>
        </div>

        {/* شناسهٔ خطا فقط وقتی نمایش داده می‌شود که وجود داشته باشد —
            برای پیگیری تلفنی به‌کار می‌آید و برای کاربر مزاحمتی ندارد. */}
        {error.digest && (
          <p className="mt-8 font-mono text-[11px] tracking-wider text-white/30">شناسهٔ خطا: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
