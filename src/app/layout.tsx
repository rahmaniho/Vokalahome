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
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: 'خانه وکلا | باشگاه تخصصی و کافه حقوقی وکلا', template: '%s | خانه وکلا' },
  description: 'خانه وکلا؛ کافه و باشگاه تخصصی وکلا برای تبادل دانش حقوقی، عضویت، نشست‌های علمی و اتاق‌های مشاوره: رایگان برای اعضا و ساعتی ۵۰۰ هزار تومان برای وکلای مهمان.',
  keywords: ['خانه وکلا','کافه وکلا','باشگاه وکلا','اتاق مشاوره وکالت','دفتر اشتراکی وکلا','عضویت وکلا','مشاوره حقوقی قزوین'],
  authors: [{ name: 'خانه وکلا' }],
  creator: 'خانه وکلا',
  alternates: { canonical: '/' },
  openGraph: { type:'website', locale:'fa_IR', url:SITE.domain, siteName:'خانه وکلا', title:'خانه وکلا | کافه و باشگاه تخصصی وکلا', description:'اینجا وکلا می‌نشینند، قهوه می‌نوشند و دانش حقوقی مبادله می‌کنند؛ با اتاق‌های مشاوره رایگان برای اعضا.', images:[{url:'/og-image.jpg',width:1200,height:630,alt:'خانه وکلا'}] },
  twitter: { card:'summary_large_image', title:'خانه وکلا', description:'کافه و باشگاه تخصصی وکلا', images:['/og-image.jpg'] },
  robots: { index:true, follow:true },
  icons: { icon:'/favicon.svg' },
};

export const viewport: Viewport = { themeColor:'#0B132B', width:'device-width', initialScale:1 };

const schema = {
  '@context':'https://schema.org', '@type':['LegalService','CafeOrCoffeeShop'], name:SITE.legalName, url:SITE.domain, email:SITE.email, telephone:'+98-28-33222222',
  address:{'@type':'PostalAddress',addressLocality:'قزوین',streetAddress:'خیابان خیام جنوبی',addressCountry:'IR'},
  description:'باشگاه تخصصی و کافه حقوقی وکلا با اتاق‌های مشاوره، کتابخانه و نشست‌های علمی.',
  founder:{'@type':'Person',name:SITE.manager,jobTitle:SITE.managerTitle},
  openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'],opens:'08:00',closes:'22:00'},{'@type':'OpeningHoursSpecification',dayOfWeek:['Friday'],opens:'14:00',closes:'22:00'}],
  makesOffer:[{'@type':'Offer',name:'اجاره ساعتی اتاق مشاوره برای وکلای غیرعضو',price:'500000',priceCurrency:'IRT'},{'@type':'Offer',name:'استفاده رایگان اعضا از اتاق مشاوره',price:'0',priceCurrency:'IRT'}],
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body><Providers><LoadingScreen/><ScrollProgress/><Header/><main>{children}</main><Footer/><FloatingMenu/><CustomCursor/></Providers><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>}
