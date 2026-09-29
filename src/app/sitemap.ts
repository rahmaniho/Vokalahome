import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/basePath';
import { articles } from '@/lib/data/articles';
import { lawyers } from '@/lib/data/lawyers';
import { services } from '@/lib/data/services';

/**
 * sitemap.xml به‌صورت خودکار از روی مسیرهای واقعی اپ ساخته می‌شود؛
 * پس هیچ‌وقت (مثل قبل) دستی از خروجی واقعی صفحات عقب نمی‌افتد.
 * در build استاتیک (output:'export')، Next این فایل را در zمان build
 * یک‌بار اجرا و به sitemap.xml استاتیک تبدیل می‌کند.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about/', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/lawyers/', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/membership/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/rooms/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/events/', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/consultation/', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/gallery/', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/style-guide/', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/contact/', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/faq/', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/articles/', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/privacy/', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms/', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/disclaimer/', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const dynamicRoutes = [
    ...articles.map((a) => ({ path: `/articles/${a.slug}/`, priority: 0.6, changeFrequency: 'monthly' as const })),
    ...lawyers.map((l) => ({ path: `/lawyers/${l.slug}/`, priority: 0.5, changeFrequency: 'monthly' as const })),
    ...services.map((s) => ({ path: `/services/${s.slug}/`, priority: 0.6, changeFrequency: 'monthly' as const })),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
