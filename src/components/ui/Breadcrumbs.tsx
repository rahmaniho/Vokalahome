import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { canonicalUrl } from '@/lib/site';

export type Crumb = { label: string; href?: string };

/**
 * مسیر راهنما (breadcrumb) + دادهٔ ساختاریافتهٔ BreadcrumbList.
 * در همهٔ صفحات داخلی استفاده می‌شود تا کاربر و گوگل بدانند کجا هستند.
 */
export function Breadcrumbs({
  items,
  light = false,
  className,
}: {
  items: Crumb[];
  /** روی پس‌زمینهٔ تیره؟ */
  light?: boolean;
  className?: string;
}) {
  const trail: Crumb[] = [{ label: 'خانه', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: canonicalUrl(crumb.href) } : {}),
    })),
  };

  return (
    <>
      <nav
        aria-label="مسیر صفحه"
        className={cn('flex flex-wrap items-center gap-1.5 text-xs', light ? 'text-white/55' : 'text-ink-faint', className)}
      >
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          const label =
            index === 0 ? (
              <span className="inline-flex items-center gap-1">
                <Home size={13} aria-hidden />
                <span className="sr-only sm:not-sr-only">خانه</span>
              </span>
            ) : (
              crumb.label
            );

          return (
            <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronLeft size={12} aria-hidden className="opacity-60" />}
              {isLast || !crumb.href ? (
                <span aria-current="page" className={light ? 'text-white/85' : 'text-ink-muted'}>
                  {label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className={cn('transition', light ? 'hover:text-gold-300' : 'hover:text-gold-600')}
                >
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
