import { Check, Clock4, X } from 'lucide-react';
import type { MembershipPlan } from '@/types';
import { Button } from '@/components/ui/Button';

export function PlanCard({ plan }: { plan: MembershipPlan }) {
  return (
    <article className={`relative flex h-full flex-col rounded-3xl border p-7 transition duration-500 hover:-translate-y-2 ${plan.highlight ? 'border-gold-500 bg-navy-950 text-white shadow-gold' : 'border-gray-100 bg-white hover:shadow-soft'}`}>
      {plan.badge && (
        <span className={`absolute left-6 top-0 -translate-y-1/2 rounded-full px-3 py-1 text-[9px] font-black ${plan.highlight ? 'bg-gold-500 text-navy-950' : 'bg-navy-900 text-gold-400'}`}>{plan.badge}</span>
      )}
      <h3 className={`text-xl font-black ${plan.highlight ? 'text-white' : 'text-navy-900'}`}>{plan.name}</h3>
      <p className={`mt-2 text-xs leading-6 ${plan.highlight ? 'text-white/55' : 'text-gray-500'}`}>{plan.audience}</p>

      <div className={`my-6 flex items-end gap-2 border-y py-5 ${plan.highlight ? 'border-white/10' : 'border-gray-100'}`}>
        <strong className={`text-3xl font-black ${plan.highlight ? 'text-gold-400' : 'text-navy-900'}`}>{plan.price}</strong>
        <span className={`pb-1 text-xs ${plan.highlight ? 'text-white/50' : 'text-gray-400'}`}>{plan.priceNote} / {plan.period}</span>
      </div>

      <span className={`mb-5 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${plan.highlight ? 'bg-gold-500/15 text-gold-300' : 'bg-gold-500/10 text-gold-600'}`}>
        <Clock4 size={15} />{plan.roomHours}
      </span>

      <ul className="space-y-3 text-xs leading-6">
        {plan.features.map((feature) => (
          <li key={feature} className={`flex gap-2.5 ${plan.highlight ? 'text-white/75' : 'text-gray-600'}`}>
            <Check size={15} className="mt-0.5 shrink-0 text-gold-500" />{feature}
          </li>
        ))}
        {plan.excluded?.map((item) => (
          <li key={item} className={`flex gap-2.5 ${plan.highlight ? 'text-white/35' : 'text-gray-300'}`}>
            <X size={15} className="mt-0.5 shrink-0" />{item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Button href="/membership/#join" variant={plan.highlight ? 'gold' : 'outline'} className="w-full">انتخاب این عضویت</Button>
      </div>
    </article>
  );
}
