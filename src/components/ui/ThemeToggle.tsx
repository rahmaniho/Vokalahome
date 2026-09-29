'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export const THEME_STORAGE_KEY = 'vokalahome-theme';

/**
 * اسکریپتی که پیش از اولین رنگ‌آمیزی صفحه اجرا می‌شود تا «پرش تم» نداشته باشیم.
 * چون سایت استاتیک است و سروری وجود ندارد، این تنها راه درست است.
 * همچنین کلاس no-js را برمی‌دارد تا انیمیشن‌های reveal فعال شوند.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
  var d=document.documentElement;
  d.classList.remove('no-js');
  var s=localStorage.getItem('${THEME_STORAGE_KEY}');
  var dark = s ? s==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  d.classList.toggle('dark', dark);
  var m=document.querySelector('meta[name="theme-color"]');
  if(m) m.setAttribute('content', dark ? '#081426' : '#0B1F3A');
}catch(e){}})();`;

type ThemeToggleProps = {
  /** روی پس‌زمینهٔ تیره قرار دارد؟ */
  light?: boolean;
  className?: string;
};

/** کلید تغییر حالت روشن/تاریک. */
export function ThemeToggle({ light = false, className }: ThemeToggleProps) {
  // تا وقتی mount نشده‌ایم نمی‌دانیم تم چیست؛ برای جلوگیری از عدم تطابق
  // سرور/کلاینت، آیکون فقط بعد از mount رندر می‌شود.
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#081426' : '#0B1F3A');
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? (isDark ? 'روشن کردن تم' : 'تاریک کردن تم') : 'تغییر تم'}
      aria-pressed={mounted ? isDark : undefined}
      title={mounted ? (isDark ? 'حالت روشن' : 'حالت تاریک') : 'تغییر تم'}
      className={cn(
        'tap-target rounded-xl border transition',
        light
          ? 'border-white/20 text-white/85 hover:border-gold-400 hover:text-gold-300'
          : 'border-line text-ink-muted hover:border-gold-500 hover:text-gold-600',
        className,
      )}
    >
      {/* هر دو آیکون رندر می‌شوند و با CSS جابه‌جا می‌شوند تا hydration مشکل نخورد. */}
      <Sun size={18} className="hidden dark:block" aria-hidden />
      <Moon size={18} className="block dark:hidden" aria-hidden />
    </button>
  );
}
