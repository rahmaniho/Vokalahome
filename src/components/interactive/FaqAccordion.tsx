'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/lib/data/faqs';
import { cn } from '@/lib/utils';

/**
 * آکاردئون پرسش‌های پرتکرار — بدون framer-motion.
 *
 * انیمیشن باز/بسته شدن با `grid-template-rows: 0fr → 1fr` انجام می‌شود؛
 * ترفندی خالص‌CSS که برخلاف انیمیشن `height`، نیازی به دانستن ارتفاع
 * محتوا ندارد و روی GPU اجرا می‌شود. نتیجه: صفر بایت جاوااسکریپت اضافه.
 *
 * دسترسی‌پذیری: هر پرسش یک `<button aria-expanded>` است که پاسخِ متناظر را
 * با `aria-controls` معرفی می‌کند؛ صفحه‌خوان وضعیت باز/بسته را می‌خواند.
 */
export function FaqAccordion({ category: initialCategory, limit }: { category?: string; limit?: number } = {}) {
  const categories = useMemo(() => ['همه', ...Array.from(new Set(faqs.map((item) => item.category)))], []);
  const [category, setCategory] = useState(initialCategory ?? 'همه');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const visible = useMemo(() => {
    const list = category === 'همه' ? faqs : faqs.filter((item) => item.category === category);
    return limit ? list.slice(0, limit) : list;
  }, [category, limit]);

  return (
    <div>
      {!limit && categories.length > 2 && (
        <div role="tablist" aria-label="دستهٔ پرسش‌ها" className="mb-7 flex flex-wrap gap-2">
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setCategory(item);
                  setOpenIndex(0);
                }}
                className={cn(
                  'min-h-11 rounded-xl border px-4 text-xs font-bold transition',
                  active
                    ? 'border-gold-500 bg-gold-500 text-navy-900'
                    : 'border-line bg-surface text-ink-muted hover:border-gold-500 hover:text-gold-600',
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}

      <ul className="space-y-3">
        {visible.map((item, index) => {
          const open = openIndex === index;
          return (
            <li key={item.question} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                  className="flex w-full min-h-14 items-center justify-between gap-4 px-5 py-4 text-right text-sm font-bold leading-[1.85] text-ink transition hover:bg-surface-2"
                >
                  {item.question}
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={cn(
                      'shrink-0 text-gold-600 transition-transform duration-300',
                      open && 'rotate-180',
                    )}
                  />
                </button>
              </h3>

              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-button-${index}`}
                className={cn(
                  'grid transition-all duration-300 ease-out motion-reduce:transition-none',
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-line px-5 py-4 text-sm leading-[2.05] text-ink-muted">{item.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
