'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'khane-vokala-theme';

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

/**
 * کلید حالت تاریک/روشن — سرمه‌ای پررنگ‌تر برای تم تاریک.
 * ترجیح کاربر در localStorage ذخیره می‌شود؛ در غیر این‌صورت از
 * prefers-color-scheme سیستم پیروی می‌کند.
 *
 * ⚠️ پوشش فعلی: زیرساخت کامل (Tailwind darkMode:'class' + توکن‌های رنگی
 * navy/gold) آماده است و روی Header/Footer/صفحهٔ اصلی اعمال شده؛ گسترش
 * dark: به تک‌تک کارت‌های داخلی صفحات باقی‌مانده و در docs/ROADMAP.md
 * به‌عنوان قدم بعدی مستند شده است.
 */
export function ThemeToggle({ light = false }: { light?: boolean }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
    const preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  if (!mounted) return <span className="grid size-9 place-items-center" aria-hidden />;

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'فعال‌سازی حالت روشن' : 'فعال‌سازی حالت تاریک'}
      aria-pressed={theme === 'dark'}
      className={cn(
        'grid size-9 place-items-center rounded-xl border transition',
        light ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-200 text-navy-900 hover:bg-gray-100'
      )}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
