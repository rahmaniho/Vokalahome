import type { Metadata } from 'next';
import { RedirectStub } from '@/components/layout/RedirectStub';
import { canonicalUrl } from '@/lib/site';

/**
 * مسیر قدیمی `/articles/` — به `/blog/` منتقل شده است.
 * صفحه noindex است و canonical آن به آدرس جدید اشاره می‌کند.
 */
export const metadata: Metadata = {
  title: 'انتقال به وبلاگ',
  robots: { index: false, follow: true },
  alternates: { canonical: canonicalUrl('/blog/') },
};

export default function ArticlesRedirectPage() {
  return <RedirectStub to="/blog/" label="وبلاگ" />;
}
