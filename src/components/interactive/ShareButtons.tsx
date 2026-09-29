'use client';

import { useState } from 'react';
import { Check, Copy, Linkedin, MessageCircle, Send } from 'lucide-react';
import { canonicalUrl } from '@/lib/site';

/**
 * دکمه‌های اشتراک‌گذاری.
 *
 * آدرس از `canonicalUrl(path)` ساخته می‌شود، نه از `window.location`. چرا؟
 * چون کاربر ممکن است صفحه را از پیش‌نمایش محلی یا با پارامتر UTM باز کرده
 * باشد؛ لینکی که به اشتراک می‌گذارد باید همیشه آدرس رسمی و تمیز صفحه باشد.
 */
export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = canonicalUrl(path);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // اگر مرورگر اجازهٔ دسترسی به کلیپ‌بورد نداد، بی‌سروصدا نادیده بگیر.
    }
  };

  const links = [
    {
      label: 'اشتراک در واتساپ',
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      Icon: MessageCircle,
    },
    {
      label: 'اشتراک در تلگرام',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      Icon: Send,
    },
    {
      label: 'اشتراک در لینکدین',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      Icon: Linkedin,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="ml-2 text-xs font-bold text-ink-faint">اشتراک‌گذاری:</span>

      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="tap-target rounded-xl border border-line bg-surface text-ink-muted transition hover:border-gold-500 hover:text-gold-600"
        >
          <Icon size={16} aria-hidden />
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'لینک کپی شد' : 'کپی لینک صفحه'}
        className="tap-target rounded-xl border border-line bg-surface text-ink-muted transition hover:border-gold-500 hover:text-gold-600"
      >
        {copied ? <Check size={16} className="text-emerald-600" aria-hidden /> : <Copy size={16} aria-hidden />}
      </button>

      <span className="sr-only" role="status">
        {copied ? 'لینک صفحه در حافظه کپی شد.' : ''}
      </span>
    </div>
  );
}
