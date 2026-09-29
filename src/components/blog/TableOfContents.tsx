'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TocItem = { id: string; label: string };

/**
 * فهرست مطالب چسبان با هایلایت بخش فعال.
 *
 * از `IntersectionObserver` استفاده می‌کنیم (نه رویداد scroll) چون مرورگر
 * محاسبه را خودش و خارج از نخ اصلی انجام می‌دهد؛ روی موبایل‌های ضعیف هم
 * روان می‌ماند. `rootMargin` طوری تنظیم شده که سرفصل وقتی به یک‌سوم بالای
 * صفحه می‌رسد فعال شود.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -66% 0px', threshold: 0 },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="فهرست مطالب" className="rounded-3xl border border-line bg-surface p-5">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-black text-ink">
        <List size={15} className="text-gold-600" aria-hidden />
        در این مطلب می‌خوانید
      </h2>
      <ol className="space-y-1">
        {items.map((item, index) => {
          const active = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex gap-2.5 rounded-lg border-r-2 py-2 pr-3 text-xs leading-[1.85] transition',
                  active
                    ? 'border-gold-500 bg-gold-500/[.07] font-bold text-gold-700 dark:text-gold-300'
                    : 'border-transparent text-ink-muted hover:border-line hover:text-ink',
                )}
              >
                <span className={cn('shrink-0 tabular-nums', active ? 'text-gold-600' : 'text-ink-faint')}>
                  {String(index + 1).padStart(2, '۰').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
