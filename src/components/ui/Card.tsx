import { cn } from '@/lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  /** پس‌زمینهٔ تیره برای کارت‌هایی که روی زمینهٔ سرمه‌ای قرار می‌گیرند */
  dark?: boolean;
};

/** کارت پایهٔ سیستم طراحی خانه وکلا — برای معرفی خدمات، اتاق‌ها، مزایا و ... */
export function Card({ children, className, hoverable = false, dark = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border p-6 transition duration-300',
        dark
          ? 'border-white/10 bg-navy-800/60 text-white'
          : 'border-gray-100 bg-white text-navy-900 shadow-soft',
        hoverable && 'hover:-translate-y-1.5 hover:shadow-gold',
        className
      )}
    >
      {children}
    </div>
  );
}
