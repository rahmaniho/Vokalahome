'use client';

import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { getOpenState, type OpenState, cn } from '@/lib/utils';

/**
 * نشانگر «هم‌اکنون باز است / بسته است».
 *
 * چون سایت استاتیک است و HTML یک‌بار در زمان build ساخته می‌شود، محاسبهٔ ساعت
 * باید سمت کلاینت و بعد از mount انجام شود؛ وگرنه HTML سرور و مرورگر با هم
 * اختلاف پیدا می‌کنند (hydration mismatch) و ساعت هم همیشه اشتباه می‌ماند.
 * تا پیش از mount، متن ثابت ساعات کاری نمایش داده می‌شود.
 */
export function OpenNow({ light = false, className }: { light?: boolean; className?: string }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    // هر دقیقه به‌روزرسانی، تا وضعیت در لحظهٔ باز/بسته شدن درست بماند.
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      className={cn('inline-flex items-center gap-2 text-[11px]', light ? 'text-white/70' : 'text-ink-muted', className)}
      suppressHydrationWarning
    >
      {state ? (
        <>
          <span className="relative flex size-2 shrink-0" aria-hidden>
            {state.isOpen && (
              <i className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            )}
            <i className={cn('relative inline-flex size-2 rounded-full', state.isOpen ? 'bg-emerald-400' : 'bg-mist-400')} />
          </span>
          <span className={state.isOpen ? (light ? 'text-emerald-300' : 'text-emerald-600') : undefined}>
            {state.label}
          </span>
        </>
      ) : (
        <>
          <Clock3 size={13} aria-hidden />
          <span>۸ صبح تا ۲۲ شب · جمعه ۱۴ تا ۲۲</span>
        </>
      )}
    </span>
  );
}
