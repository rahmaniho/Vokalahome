'use client';

import { useEffect } from 'react';

/**
 * ثبت Service Worker برای پشتیبانی PWA.
 * - فقط در production ثبت می‌شود (در dev سرور Next خودش کش می‌کند و SW مزاحم می‌شود)
 * - مسیر sw.js و scope باید نسبت به basePath (که در runtime داخل HTML مشخص است) درست حل شوند؛
 *   از document.baseURI یا مسیر فعلی صفحه استفاده می‌کنیم تا در GitHub Pages زیرمسیر هم کار کند.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // basePath را از data attribute تزریق‌شده روی <html> می‌خوانیم (در layout ست می‌شود)
    const base = document.documentElement.dataset.basePath || '';
    const swUrl = `${base}/sw.js`;
    const scope = `${base}/`;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register(swUrl, { scope }).catch(() => {
        // ثبت SW نباید هیچ‌وقت تجربه کاربر را مختل کند؛ فقط بی‌صدا رد می‌شویم
      });
    });
  }, []);

  return null;
}
