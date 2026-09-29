import type { MetadataRoute } from 'next';
import { SITE_URL, BASE_PATH } from '@/lib/basePath';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: `${BASE_PATH}/` }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
