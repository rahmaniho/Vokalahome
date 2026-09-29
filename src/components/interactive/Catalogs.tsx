'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { services } from '@/lib/data/services';
import { lawyers } from '@/lib/data/lawyers';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { LawyerCard } from '@/components/cards/LawyerCard';
import { cn, toEn, toFa } from '@/lib/utils';

/** یکسان‌سازی «ی/ک» و ارقام، تا جستجوی فارسی نتیجهٔ درست بدهد. */
const normalize = (value: string) =>
  toEn(value).replace(/[\u064A\u0649]/g, 'ی').replace(/\u0643/g, 'ک').trim().toLowerCase();

/* ───────────────── کاتالوگ خدمات ───────────────── */

export function ServicesCatalog() {
  const [term, setTerm] = useState('');
  const needle = normalize(term);

  const list = services.filter((service) =>
    normalize(`${service.title} ${service.description} ${service.subservices.join(' ')}`).includes(needle),
  );

  return (
    <>
      <SearchBox value={term} onChange={setTerm} placeholder="جستجو در خدمات و زیرخدمات…" />

      <p className="mt-4 text-xs text-ink-faint" aria-live="polite">
        {list.length > 0 ? `${toFa(list.length)} خدمت یافت شد` : 'خدمتی با این جستجو پیدا نشد.'}
      </p>

      <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((service, index) => (
          <li key={service.slug}>
            <ServiceCard service={service} index={index} />
          </li>
        ))}
      </ul>
    </>
  );
}

/* ───────────────── کاتالوگ وکلا ───────────────── */

export function LawyersCatalog() {
  const categories = ['همه', ...Array.from(new Set(lawyers.flatMap((lawyer) => lawyer.tags)))];
  const [category, setCategory] = useState('همه');

  const list = category === 'همه' ? lawyers : lawyers.filter((lawyer) => lawyer.tags.includes(category));

  return (
    <>
      <FilterTabs items={categories} active={category} onChange={setCategory} label="فیلتر حوزهٔ تخصصی" />

      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((lawyer) => (
          <li key={lawyer.slug}>
            <LawyerCard lawyer={lawyer} />
          </li>
        ))}
      </ul>
    </>
  );
}

/* ───────────────── اجزای مشترک ───────────────── */

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Search
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint"
        size={18}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="form-control h-14 pr-12 text-sm"
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="پاک کردن جستجو"
          className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-ink-faint transition hover:bg-surface-3 hover:text-ink"
        >
          <X size={16} />
        </button>
      )}
    </label>
  );
}

function FilterTabs({
  items,
  active,
  onChange,
  label,
}: {
  items: string[];
  active: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="ml-1 text-ink-faint" aria-hidden>
        <SlidersHorizontal size={17} />
      </span>
      {items.map((item) => {
        const isActive = active === item;
        return (
          <button
            key={item}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item)}
            className={cn(
              'min-h-11 rounded-xl border px-4 text-xs font-bold transition',
              isActive
                ? 'border-gold-500 bg-gold-500 text-navy-900'
                : 'border-line bg-surface text-ink-muted hover:border-gold-500 hover:text-gold-600',
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
