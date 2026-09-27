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
  title: { default: 'خانه وکیل | مؤسسه حقوقی علی کشاورز نجفی', template: '%s | خانه وکیل' },
  description: 'مؤسسه حقوقی خانه وکیل با مدیریت علی کشاورز نجفی، وکیل پایه یک دادگستری در قزوین؛ مشاوره و پیگیری تخصصی پرونده‌های حقوقی.',
  keywords: ['وکیل قزوین','خانه وکیل','علی کشاورز نجفی','وکیل پایه یک','مشاوره حقوقی قزوین'],
  authors: [{ name: 'خانه وکیل' }],
  creator: 'خانه وکیل',
  alternates: { canonical: '/' },
  openGraph: { type:'website', locale:'fa_IR', url:SITE.domain, siteName:'خانه وکیل', title:'خانه وکیل | مؤسسه حقوقی در قزوین', description:'مشاوره حقوقی روشن، تخصصی و مسئولانه در قزوین.', images:[{url:'/og-image.jpg',width:1200,height:630,alt:'خانه وکیل'}] },
  twitter: { card:'summary_large_image', title:'خانه وکیل', description:'مؤسسه حقوقی علی کشاورز نجفی در قزوین', images:['/og-image.jpg'] },
  robots: { index:true, follow:true },
  icons: { icon:'/favicon.svg' },
};

export const viewport: Viewport = { themeColor:'#0B132B', width:'device-width', initialScale:1 };

const schema = {
  '@context':'https://schema.org', '@type':'LegalService', name:SITE.legalName, url:SITE.domain, email:SITE.email, telephone:'+98-28-33222222',
  address:{'@type':'PostalAddress',addressLocality:'قزوین',streetAddress:'خیابان خیام جنوبی',addressCountry:'IR'},
  founder:{'@type':'Person',name:SITE.manager,jobTitle:SITE.managerTitle},
  openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'],opens:'09:00',closes:'19:00'}],
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body><Providers><LoadingScreen/><ScrollProgress/><Header/><main>{children}</main><Footer/><FloatingMenu/><CustomCursor/></Providers><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>}
