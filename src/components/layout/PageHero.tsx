import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { cn } from '@/lib/utils';

type PageHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** مسیر راهنما بدون «خانه» — خودش اضافه می‌شود. */
  crumbs: Crumb[];
  /** محتوای اختیاری زیر توضیح (دکمه، آمار کوتاه…) */
  children?: React.ReactNode;
  className?: string;
};

/**
 * سربرگ یکسان همهٔ صفحات داخلی.
 *
 * چون هدر روی صفحات داخلی جامد است، فاصلهٔ بالای این بخش (`pt-*`) باید
 * ارتفاع هدر را جبران کند؛ در غیر این صورت عنوان زیر هدر پنهان می‌ماند.
 */
export function PageHero({ eyebrow, title, description, crumbs, children, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'noise persian-pattern relative overflow-hidden bg-navy-900 pb-16 pt-32 text-white sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-44',
        className,
      )}
    >
      {/* هالهٔ طلایی تزئینی — صرفاً CSS، بدون تصویر و بدون هزینهٔ شبکه. */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-gold-500/12 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 size-72 rounded-full bg-navy-500/20 blur-[90px]" />

      <div className="container-shell relative">
        <Breadcrumbs items={crumbs} light className="mb-7" />

        {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}

        <h1 className="max-w-3xl text-3xl font-black leading-[1.4] tracking-[-.03em] sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && <p className="mt-5 max-w-2xl text-sm leading-[2.05] text-white/60 sm:text-base">{description}</p>}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
