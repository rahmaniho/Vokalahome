import Link from 'next/link';
import { ArrowLeft, MoveRight } from 'lucide-react';
import { withBase } from '@/lib/site';

/**
 * صفحهٔ «انتقال دائمی» برای مسیرهای قدیمی.
 *
 * GitHub Pages ریدایرکت سمت سرور (۳۰۱) ندارد، پس سه لایه با هم استفاده می‌کنیم:
 *   ۱. `<meta http-equiv="refresh" content="0; url=…">` — مرورگر بلافاصله منتقل می‌شود
 *   ۲. `<link rel="canonical">` به آدرس جدید — گوگل اعتبار صفحهٔ قدیمی را منتقل می‌کند
 *   ۳. یک لینک قابل کلیک — اگر جاوااسکریپت و meta refresh هر دو کار نکردند
 *
 * صفحه با `noindex` علامت می‌خورد تا خودش در نتایج جستجو ظاهر نشود.
 */
export function RedirectStub({ to, label }: { to: string; label: string }) {
  const target = withBase(to);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <meta httpEquiv="refresh" content={`0; url=${target}`} />

      <section className="grid min-h-[70dvh] place-items-center px-5 py-28">
        <div className="max-w-md text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold-500/12 text-gold-600 dark:text-gold-400">
            <MoveRight size={26} aria-hidden />
          </span>

          <h1 className="mt-6 text-xl font-black text-ink sm:text-2xl">این صفحه جابه‌جا شده است</h1>
          <p className="mt-3 text-sm leading-[2.05] text-ink-muted">
            آدرس بخش مقالات به «وبلاگ» تغییر کرده است. در حال انتقال به {label} هستید…
          </p>

          <Link
            href={to}
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold-500 px-6 text-sm font-black text-navy-900 transition hover:bg-gold-400"
          >
            رفتن به {label}
            <ArrowLeft size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
