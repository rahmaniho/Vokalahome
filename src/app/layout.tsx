import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuickContact } from '@/components/layout/QuickContact';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { THEME_INIT_SCRIPT } from '@/components/ui/ThemeToggle';
import { JsonLd, localBusinessSchema, webSiteSchema } from '@/lib/seo';
import { SITE } from '@/lib/constants';
import { canonicalUrl, SITE_URL, withBase } from '@/lib/site';

/**
 * فونت وزیرمتن، کاملاً خودمیزبان (self-host) با next/font/local.
 *
 * چرا خودمیزبان و نه CDN؟
 *  • هیچ درخواستی به دامنهٔ سوم نمی‌رود → سریع‌تر، خصوصی‌تر، و در حالت آفلاین PWA هم کار می‌کند
 *  • Next فایل را با نام هش‌دار در `_next/static/media` می‌گذارد و خودش preload می‌کند
 *  • CSS فونت inline می‌شود، پس هیچ درخواست بلاک‌کنندهٔ رندری نداریم
 *  • فونت «متغیر» است: یک فایل، همهٔ وزن‌های ۱۰۰ تا ۹۰۰ (۴۶KB برای زیرمجموعهٔ عربی)
 *  • display: swap یعنی متن بلافاصله دیده می‌شود (بهبود مستقیم LCP)
 *
 * پروانه: OFL 1.1 — متن کامل در src/fonts/LICENSE-Vazirmatn.txt
 */
const vazirmatn = localFont({
  src: [{ path: '../fonts/vazirmatn-arabic-wght-normal.woff2', weight: '100 900', style: 'normal' }],
  display: 'swap',
  variable: '--font-vazirmatn',
  fallback: ['Tahoma', 'system-ui', 'sans-serif'],
  preload: true,
});

/**
 * زیرمجموعهٔ لاتین، عمداً **بدون preload**.
 *
 * وقتی هر دو فایل در یک localFont بودند، Next هر دو را در هر صفحه preload
 * می‌کرد: ۸۱ کیلوبایت روی مسیر بحرانی. ولی کل سایت فارسی است و حروف لاتین
 * فقط در چند واژه (WhatsApp، ایمیل، کد پیگیری) ظاهر می‌شوند.
 *
 * حالا این فایل در انتهای font-stack قرار می‌گیرد و مرورگر فقط وقتی آن را
 * می‌گیرد که واقعاً به یک گلیف لاتین برسد — ۳۴ کیلوبایت کمتر در اولین رنگ‌آمیزی
 * هر صفحه. با display: swap تا رسیدنش Tahoma نمایش داده می‌شود.
 */
const vazirmatnLatin = localFont({
  src: [{ path: '../fonts/vazirmatn-latin-wght-normal.woff2', weight: '100 900', style: 'normal' }],
  display: 'swap',
  variable: '--font-vazirmatn-latin',
  fallback: ['Tahoma', 'system-ui', 'sans-serif'],
  preload: false,
});

export const metadata: Metadata = {
  // metadataBase روی آدرس واقعی انتشار (شامل زیرمسیر /Vokalahome) تنظیم می‌شود.
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: 'خانه وکلا | باشگاه تخصصی و کافهٔ حقوقی وکلا در قزوین',
    template: '%s | خانه وکلا',
  },
  description:
    'خانه وکلا؛ کافه و باشگاه تخصصی وکلا در قزوین برای تبادل دانش حقوقی، عضویت، نشست‌های علمی و اتاق‌های مشاوره: رایگان برای اعضا و ساعتی ۵۰۰ هزار تومان برای وکلای مهمان.',
  keywords: [
    'خانه وکلا',
    'کافه وکلا',
    'باشگاه وکلا قزوین',
    'اتاق مشاوره وکالت',
    'دفتر اشتراکی وکلا',
    'عضویت وکلا',
    'مشاوره حقوقی قزوین',
    'نشست علمی حقوقی',
  ],
  authors: [{ name: SITE.name, url: canonicalUrl('/') }],
  creator: SITE.name,
  publisher: SITE.name,
  applicationName: SITE.name,
  alternates: { canonical: canonicalUrl('/') },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: canonicalUrl('/'),
    siteName: SITE.name,
    title: 'خانه وکلا | کافه و باشگاه تخصصی وکلا',
    description:
      'اینجا وکلا می‌نشینند، قهوه می‌نوشند و دانش حقوقی مبادله می‌کنند؛ با اتاق‌های مشاورهٔ رایگان برای اعضا.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'خانه وکلا' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'خانه وکلا',
    description: 'کافه و باشگاه تخصصی وکلا در قزوین',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  // مسیرها با withBase ساخته می‌شوند چون Next برای همهٔ انواع آیکون basePath را اضافه نمی‌کند.
  icons: {
    icon: [
      { url: withBase('/favicon.svg'), type: 'image/svg+xml' },
      { url: withBase('/icons/favicon-32.png'), sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: withBase('/icons/apple-touch-icon.png'), sizes: '180x180' }],
  },
  manifest: withBase('/manifest.webmanifest'),
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: SITE.name },
  formatDetection: { telephone: true, address: true },
  category: 'legal',
};

export const viewport: Viewport = {
  themeColor: '#0B1F3A',
  width: 'device-width',
  initialScale: 1,
  // کاربر باید بتواند بزرگ‌نمایی کند (الزام دسترسی‌پذیری).
  maximumScale: 5,
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${vazirmatnLatin.variable} no-js`}
      suppressHydrationWarning
    >
      <head>
        {/* پیش از اولین رنگ‌آمیزی: تم ذخیره‌شده اعمال و کلاس no-js حذف می‌شود. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

        {/*
          روی GitHub Pages، فایل robots.txt فقط در ریشهٔ دامنه خوانده می‌شود
          (`rahmaniho.github.io/robots.txt`) و ما به آن دسترسی نداریم؛ پس
          `Sitemap:` داخل robots.txt زیرمسیر عملاً نادیده گرفته می‌شود.
          این دو لینک، نقشهٔ سایت و فید را مستقیم از خود HTML اعلام می‌کنند.
          راهنما: docs/SEO-NOTES.md
        */}
        <link rel="sitemap" type="application/xml" href={withBase('/sitemap.xml')} />
        <link rel="alternate" type="application/rss+xml" title="وبلاگ حقوقی خانه وکلا" href={withBase('/rss.xml')} />
      </head>
      <body className="min-h-dvh antialiased">
        {/* پرش سریع به محتوا برای کاربران صفحه‌کلید و صفحه‌خوان */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-gold-500 focus:px-5 focus:py-3 focus:text-sm focus:font-black focus:text-navy-900"
        >
          رفتن به محتوای اصلی
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
        <QuickContact />
        <ServiceWorkerRegister />

        <JsonLd data={[localBusinessSchema(), webSiteSchema()]} />
      </body>
    </html>
  );
}
