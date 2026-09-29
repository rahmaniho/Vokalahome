import type { Metadata } from 'next';
import { SITE } from './constants';
import { absoluteUrl, canonicalUrl, SITE_URL } from './site';

/**
 * سازندهٔ متادیتای صفحات.
 *
 * چرا اینجا متمرکز شده؟ چون سایت روی زیرمسیر `/Vokalahome/` منتشر می‌شود و
 * canonical / og:url باید **دقیقاً** همین آدرس را نشان دهند، نه ریشهٔ دامنه.
 * نسخهٔ قبلی سایت به اشتباه روی `https://vokalahome.com` کنونیکال می‌داد؛
 * دامنه‌ای که هنوز فعال نیست. این تابع جلوی تکرار آن اشتباه را می‌گیرد.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
  type = 'website',
  publishedTime,
  noIndex = false,
}: {
  title: string;
  description: string;
  /** مسیر داخلی، مثل `/membership/` */
  path: string;
  /** مسیر داخلی تصویر og؛ پیش‌فرض تصویر برند */
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const url = canonicalUrl(path);
  const ogImage = absoluteUrl(image ?? '/og-image.jpg');

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: 'fa_IR',
      url,
      siteName: SITE.name,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/* ═══════════════════════ دادهٔ ساختاریافته (JSON-LD) ═══════════════════════ */

/** شناسهٔ ثابت کسب‌وکار تا همهٔ گره‌های JSON-LD به یک موجودیت اشاره کنند. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** LocalBusiness — مهم‌ترین اسکیمای سایت برای سئوی محلی قزوین. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'CafeOrCoffeeShop'],
    '@id': ORGANIZATION_ID,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: canonicalUrl('/'),
    logo: absoluteUrl('/icons/icon-512.png'),
    image: absoluteUrl('/og-image.jpg'),
    email: SITE.email,
    telephone: SITE.phoneE164,
    priceRange: '$$',
    currenciesAccepted: 'IRR',
    slogan: SITE.tagline,
    description:
      'باشگاه تخصصی و کافهٔ حقوقی وکلا در قزوین؛ با اتاق‌های مشاوره، کتابخانهٔ حقوقی، نشست‌های علمی و عضویت حرفه‌ای.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressRegion: 'قزوین',
      streetAddress: 'خیابان خیام جنوبی',
      addressCountry: 'IR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: `https://www.openstreetmap.org/?mlat=${SITE.geo.lat}&mlon=${SITE.geo.lng}#map=17/${SITE.geo.lat}/${SITE.geo.lng}`,
    founder: { '@type': 'Person', name: SITE.manager, jobTitle: SITE.managerTitle },
    sameAs: [SITE.instagram, SITE.linkedin].filter(Boolean),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '22:00',
      },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '14:00', closes: '22:00' },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'اجارهٔ ساعتی اتاق مشاوره برای وکلای غیرعضو',
        price: '500000',
        priceCurrency: 'IRR',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'استفادهٔ رایگان اعضا از اتاق مشاوره',
        price: '0',
        priceCurrency: 'IRR',
        availability: 'https://schema.org/InStock',
      },
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'اینترنت پرسرعت', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'کتابخانهٔ حقوقی', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'اتاق مشاورهٔ عایق صدا', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'پارکینگ مهمان', value: true },
    ],
  };
}

/** WebSite + SearchAction؛ جستجوی داخلی وبلاگ را به گوگل معرفی می‌کند. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: canonicalUrl('/'),
    name: SITE.name,
    inLanguage: 'fa-IR',
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${canonicalUrl('/blog/')}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Article — برای هر مطلب وبلاگ. */
export function articleSchema(article: {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  datePublished?: string;
  category: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    inLanguage: 'fa-IR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl(`/blog/${article.slug}/`) },
    author: { '@type': 'Person', name: article.author },
    publisher: { '@id': ORGANIZATION_ID },
    image: absoluteUrl(article.image ?? '/og-image.jpg'),
    ...(article.datePublished ? { datePublished: article.datePublished, dateModified: article.datePublished } : {}),
  };
}

/** Event — برای صفحهٔ هر رویداد. */
export function eventSchema(event: {
  slug: string;
  title: string;
  summary: string;
  startDate?: string;
  endDate?: string;
  isFree: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: canonicalUrl(`/events/${event.slug}/`),
    ...(event.startDate ? { startDate: event.startDate } : {}),
    ...(event.endDate ? { endDate: event.endDate } : {}),
    location: {
      '@type': 'Place',
      name: SITE.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'خیابان خیام جنوبی',
        addressLocality: SITE.city,
        addressCountry: 'IR',
      },
    },
    organizer: { '@id': ORGANIZATION_ID },
    offers: {
      '@type': 'Offer',
      price: event.isFree ? '0' : '300000',
      priceCurrency: 'IRR',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl(`/events/${event.slug}/`),
    },
  };
}

/** FAQPage — برای صفحهٔ پرسش‌های پرتکرار. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** کامپوننت کمکی برای تزریق JSON-LD. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
