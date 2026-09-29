'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { Check, Minus, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { BILLING_CYCLES, PLAN_COMPARISON, planPrice, plans } from '@/lib/data/plans';
import type { BillingCycle } from '@/types';
import { cn, formatToman, toFa } from '@/lib/utils';

/**
 * کارت‌های پلن + جدول مقایسه، با کلید تغییر دورهٔ پرداخت.
 * قیمت‌ها از `planPrice()` می‌آیند تا هیچ‌وقت عدد دستی و ناهماهنگ نداشته باشیم.
 */
export function PlanExplorer() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  return (
    <div>
      {/* کلید دورهٔ پرداخت */}
      <div className="mb-10 flex justify-center">
        <div
          role="tablist"
          aria-label="دورهٔ پرداخت"
          className="inline-flex gap-1 rounded-2xl border border-line bg-surface p-1.5"
        >
          {(Object.keys(BILLING_CYCLES) as BillingCycle[]).map((key) => {
            const active = cycle === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setCycle(key)}
                className={cn(
                  'relative min-h-11 rounded-xl px-4 text-xs font-black transition sm:px-6 sm:text-sm',
                  active ? 'bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-900' : 'text-ink-muted hover:text-ink',
                )}
              >
                {BILLING_CYCLES[key].label}
                {BILLING_CYCLES[key].badge && (
                  <span
                    className={cn(
                      'absolute -top-2.5 right-1 rounded-full px-1.5 py-0.5 text-[9px] font-black',
                      active ? 'bg-emerald-500 text-white' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                    )}
                  >
                    {BILLING_CYCLES[key].badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* کارت‌های پلن */}
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = planPrice(plan, cycle);
          return (
            <article
              key={plan.slug}
              className={cn(
                'relative flex flex-col rounded-3xl border p-6 transition',
                plan.highlight
                  ? 'border-gold-500 bg-surface shadow-lift lg:-mt-3 lg:mb-3'
                  : 'border-line bg-surface hover:border-gold-500/40',
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-6">
                  <Badge tone={plan.highlight ? 'gold' : 'neutral'} className="shadow-sm">
                    {plan.highlight && <Sparkles size={11} aria-hidden />}
                    {plan.badge}
                  </Badge>
                </span>
              )}

              <h3 className="text-lg font-black text-ink">{plan.name}</h3>
              <p className="mt-1.5 text-xs leading-6 text-ink-faint">{plan.audience}</p>

              <div className="mt-5 border-y border-line py-5">
                <div className="flex items-end gap-1.5">
                  <b className="text-3xl font-black leading-none text-ink">{formatToman(price.total)}</b>
                  <span className="pb-0.5 text-xs text-ink-muted">تومان</span>
                </div>
                <p className="mt-2 text-[11px] text-ink-faint">
                  برای {toFa(price.months)} ماه
                  {price.months > 1 && <> · معادل ماهانه {formatToman(price.perMonth)} تومان</>}
                </p>
                {price.saved > 0 && (
                  <p className="mt-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {formatToman(price.saved)} تومان نسبت به پرداخت ماهانه صرفه‌جویی می‌کنید
                  </p>
                )}
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs font-bold text-gold-700 dark:text-gold-400">
                <Check size={15} aria-hidden />
                {plan.roomHours}
              </p>

              <ul className="mt-4 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-xs leading-[1.9] text-ink-muted">
                    <Check size={14} className="mt-1 shrink-0 text-emerald-600" aria-hidden />
                    {feature}
                  </li>
                ))}
                {plan.excluded?.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-[1.9] text-ink-faint line-through">
                    <X size={14} className="mt-1 shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/membership/#apply`}
                className={cn(
                  'mt-6 flex min-h-12 items-center justify-center rounded-xl text-sm font-black transition',
                  plan.highlight
                    ? 'bg-gold-500 text-navy-900 hover:bg-gold-400'
                    : 'border border-line text-ink hover:border-gold-500 hover:text-gold-600',
                )}
              >
                انتخاب {plan.name}
              </Link>
            </article>
          );
        })}
      </div>

      {/* جدول مقایسه */}
      <div className="mt-16">
        <h3 className="mb-1 text-center text-xl font-black text-ink sm:text-2xl">مقایسهٔ کامل مزایا</h3>
        <p className="mb-7 text-center text-sm text-ink-muted">
          برای دیدن همهٔ ستون‌ها روی موبایل، جدول را به چپ و راست بکشید.
        </p>

        <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">مقایسهٔ مزایای پلن‌های عضویت خانه وکلا</caption>
            <thead>
              <tr className="bg-surface-2">
                <th scope="col" className="w-2/5 px-5 py-4 text-right text-xs font-black text-ink">
                  ویژگی
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.slug}
                    scope="col"
                    className={cn(
                      'px-4 py-4 text-center text-xs font-black',
                      plan.highlight ? 'bg-gold-500/10 text-gold-700 dark:text-gold-300' : 'text-ink',
                    )}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map((group) => (
                // Fragment کلیددار لازم است: هر گروه دو دستهٔ <tr> تولید می‌کند
                // و <tbody> فقط <tr> می‌پذیرد، پس نمی‌شود آن‌ها را در div پیچید.
                <Fragment key={group.group}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={plans.length + 1}
                      className="border-t border-line bg-surface-2/60 px-5 py-2.5 text-right text-[11px] font-black tracking-wide text-gold-700 dark:text-gold-400"
                    >
                      {group.group}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.feature} className="border-t border-line">
                      <th scope="row" className="px-5 py-3.5 text-right text-xs font-medium text-ink-muted">
                        {row.feature}
                      </th>
                      {row.values.map((value, index) => (
                        <td
                          key={index}
                          className={cn(
                            'px-4 py-3.5 text-center text-xs',
                            plans[index]?.highlight && 'bg-gold-500/[.06]',
                          )}
                        >
                          {typeof value === 'boolean' ? (
                            value ? (
                              <>
                                <Check size={17} className="mx-auto text-emerald-600" aria-hidden />
                                <span className="sr-only">دارد</span>
                              </>
                            ) : (
                              <>
                                <Minus size={17} className="mx-auto text-ink-faint/60" aria-hidden />
                                <span className="sr-only">ندارد</span>
                              </>
                            )
                          ) : (
                            <span className="font-bold text-ink">{value}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
