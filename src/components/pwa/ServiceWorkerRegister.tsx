'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
import { withBase } from '@/lib/site';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const INSTALL_DISMISSED_KEY = 'vokalahome-install-dismissed';

/**
 * ثبت Service Worker + دو اعلان کوچک:
 *   ۱. «نسخهٔ جدید آماده است» وقتی SW تازه‌ای منتظر فعال شدن است
 *   ۲. «نصب اپ» وقتی مرورگر امکان نصب PWA را اعلام می‌کند
 *
 * نکتهٔ GitHub Pages: هم فایل و هم scope باید زیرمسیر پروژه باشند،
 * وگرنه مرورگر ثبت را با خطای «scope not allowed» رد می‌کند.
 */
export function ServiceWorkerRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    // در حالت توسعه ثبت نمی‌کنیم تا کش، بازخوردِ زندهٔ Next را خراب نکند.
    if (process.env.NODE_ENV !== 'production') return;

    const swUrl = withBase('/sw.js');
    const scope = withBase('/');

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register(swUrl, { scope });

        if (registration.waiting) setWaitingWorker(registration.waiting);

        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            // فقط وقتی نسخهٔ قبلی وجود داشته باشد یعنی «به‌روزرسانی»، نه نصب اول.
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(installing);
            }
          });
        });
      } catch (error) {
        console.warn('ثبت Service Worker انجام نشد:', error);
      }
    };

    // ثبت را تا بعد از load عقب می‌اندازیم تا با بارگذاری اولیه رقابت نکند.
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  // رویداد نصب PWA
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(INSTALL_DISMISSED_KEY)) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', () => setInstallEvent(null));
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const applyUpdate = () => {
    waitingWorker?.postMessage('SKIP_WAITING');
    waitingWorker?.addEventListener('statechange', (event) => {
      if ((event.target as ServiceWorker).state === 'activated') window.location.reload();
    });
    setWaitingWorker(null);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  const dismissInstall = () => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
    setInstallEvent(null);
  };

  if (!waitingWorker && !installEvent) return null;

  return (
    <div className="no-print fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-sm sm:inset-x-auto sm:right-6">
      {waitingWorker && (
        <div className="mb-2 flex animate-fade-up items-center gap-3 rounded-2xl border border-gold-500/30 bg-surface p-3 shadow-lift">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400">
            <RefreshCw size={18} aria-hidden />
          </span>
          <p className="min-w-0 flex-1 text-xs leading-6 text-ink-muted">
            <b className="block text-ink">نسخهٔ تازه‌ای از سایت آماده است</b>
            برای دیدن آخرین تغییرات صفحه را تازه کنید.
          </p>
          <button
            type="button"
            onClick={applyUpdate}
            className="min-h-10 shrink-0 rounded-xl bg-gold-500 px-3.5 text-xs font-black text-navy-900 transition hover:bg-gold-400"
          >
            تازه‌سازی
          </button>
        </div>
      )}

      {installEvent && (
        <div className="flex animate-fade-up items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-lift">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-400">
            <Download size={18} aria-hidden />
          </span>
          <p className="min-w-0 flex-1 text-xs leading-6 text-ink-muted">
            <b className="block text-ink">خانه وکلا را روی گوشی نصب کنید</b>
            دسترسی سریع، بدون مرورگر و حتی بدون اینترنت.
          </p>
          <button
            type="button"
            onClick={install}
            className="min-h-10 shrink-0 rounded-xl bg-navy-900 px-3.5 text-xs font-black text-white transition hover:bg-navy-800 dark:bg-white dark:text-navy-900"
          >
            نصب
          </button>
          <button
            type="button"
            onClick={dismissInstall}
            aria-label="بستن پیشنهاد نصب"
            className="tap-target shrink-0 rounded-lg text-ink-faint transition hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
