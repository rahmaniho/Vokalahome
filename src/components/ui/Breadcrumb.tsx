import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';
import { absoluteUrl } from '../../lib/basePath';

export type BreadcrumbItem = { label: string; href?: string };

/**
 * breadcrumb مستقل (علاوه‌بر نسخهٔ ساده‌ای که داخل PageHero برای هر صفحهٔ
 * داخلی هست) — برای صفحاتی که چند سطح دارند، مثل «خانه > دانش‌نامه > عنوان مقاله»
 * و برای JSON-LD نوع BreadcrumbList قابل استفاده است.
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [{ label: 'خانه', href: '/' }, ...items];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      // schema.org BreadcrumbList.item باید URL مطلق باشد، نه مسیر ریشه‌نسبی
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
      <Link href="/" aria-label="خانه" className="flex items-center gap-1 hover:text-gold-500">
        <Home size={13} />
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          <ChevronLeft size={12} />
          {item.href && i !== items.length - 1 ? (
            <Link href={item.href} className="hover:text-gold-500">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-navy-900" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </nav>
  );
}
