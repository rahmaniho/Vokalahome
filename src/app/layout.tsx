import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/vazirmatn';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingMenu } from '@/components/layout/FloatingMenu';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { Providers } from '@/components/layout/Providers';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';
import { SITE } from '@/lib/constants';
import { asset } from '@/lib/basePath';

export const metadata: Metadata = {
  // ⚠️ SITE.domain اکنون آدرس واقعی GitHub Pages است (نه دامنهٔ آیندهٔ غیرفعال).
  // این یعنی canonical/og:url هم‌اکنون به‌درستی به همان URL منتشرشده اشاره می‌کنند.
  metadataBase: new URL(`${SITE.domain}/`),
  title: { default: 'خانه وکلا | باشگاه تخصصی و کافه حقوقی وکلا', template: '%s | خانه وکلا' },
  description: 'خانه وکلا؛ کافه و باشگاه تخصصی وکلا برای تبادل دانش حقوقی، عضویت، نشست‌های علمی و اتاق‌های مشاوره: رایگان برای اعضا و ساعتی ۵۰۰ هزار تومان برای وکلای مهمان.',
  keywords: ['خانه وکلا','کافه وکلا','باشگاه وکلا','اتاق مشاوره وکالت','دفتر اشتراکی وکلا','عضویت وکلا','مشاوره حقوقی قزوین'],
  authors: [{ name: 'خانه وکلا' }],
  creator: 'خانه وکلا',
  alternates: {
    canonical: `${SITE.domain}/`,
    types: { 'application/rss+xml': `${SITE.domain}/rss.xml` },
  },
  openGraph: { type:'website', locale:'fa_IR', url:`${SITE.domain}/`, siteName:'خانه وکلا', title:'خانه وکلا | کافه و باشگاه تخصصی وکلا', description:'اینجا وکلا می‌نشینند، قهوه می‌نوشند و دانش حقوقی مبادله می‌کنند؛ با اتاق‌های مشاوره رایگان برای اعضا.', images:[{url:asset('/og-image.jpg'),width:1200,height:630,alt:'خانه وکلا'}] },
  twitter: { card:'summary_large_image', title:'خانه وکلا', description:'کافه و باشگاه تخصصی وکلا', images:[asset('/og-image.jpg')] },
  robots: { index:true, follow:true },
  icons: {
    icon: [{ url: asset('/favicon.svg'), type: 'image/svg+xml' }, { url: asset('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' }],
    apple: [{ url: asset('/icons/icon-192.png') }],
  },
  // ⚠️ manifest عمداً اینجا ست نمی‌شود: چون app/manifest.ts (Metadata Route) وجود دارد،
  // Next خودش <link rel="manifest"> را تزریق می‌کند. تست شد که ست‌کردن دستی این فیلد در
  // کنار app/manifest.ts در Next 14.2 با output:'export' باعث می‌شد href بدون پیشوند
  // basePath تولید شود (باگ مشابه باگ تصاویر unoptimized). راه‌حل نهایی در public/manifest-link-fix
  // مستند شده؛ فعلاً manifestLinkFix زیر این مشکل را در runtime اصلاح می‌کند.
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'خانه وکلا' },
};

export const viewport: Viewport = { themeColor:'#0B1F3A', width:'device-width', initialScale:1 };

const schema = {
  '@context':'https://schema.org', '@type':['LegalService','CafeOrCoffeeShop'], name:SITE.legalName, url:SITE.domain, email:SITE.email, telephone:'+98-28-33222222',
  address:{'@type':'PostalAddress',addressLocality:'قزوین',streetAddress:'خیابان خیام جنوبی',addressCountry:'IR'},
  description:'باشگاه تخصصی و کافه حقوقی وکلا با اتاق‌های مشاوره، کتابخانه و نشست‌های علمی.',
  founder:{'@type':'Person',name:SITE.manager,jobTitle:SITE.managerTitle},
  openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'],opens:'08:00',closes:'22:00'},{'@type':'OpeningHoursSpecification',dayOfWeek:['Friday'],opens:'14:00',closes:'22:00'}],
  makesOffer:[{'@type':'Offer',name:'اجاره ساعتی اتاق مشاوره برای وکلای غیرعضو',price:'500000',priceCurrency:'IRT'},{'@type':'Offer',name:'استفاده رایگان اعضا از اتاق مشاوره',price:'0',priceCurrency:'IRT'}],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('khane-vokala-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl" data-base-path={SITE.basePath}><head><script dangerouslySetInnerHTML={{__html:themeInitScript}}/><link rel="manifest" href={asset('/manifest.webmanifest')} /></head><body className="dark:bg-navy-950 dark:text-ivory"><Providers><LoadingScreen/><ScrollProgress/><Header/><main>{children}</main><Footer/><FloatingMenu/><CustomCursor/><ServiceWorkerRegister/></Providers><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>}
