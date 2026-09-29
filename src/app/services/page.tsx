import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { ServicesCatalog } from '@/components/interactive/Catalogs';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata:Metadata={ alternates:{canonical:'/services/'},title:'امکانات خانه وکلا',description:'کافه، اتاق‌های مشاوره، عضویت، نشست‌های علمی، ارجاع مراجعان و کتابخانه حقوقی خانه وکلا.'};
export default function ServicesPage(){return <><PageHero eyebrow="امکانات" current="امکانات" title={<>هرچه یک وکیل لازم دارد،<br/><span className="gold-text-on-dark">زیر یک سقف</span></>} description="از کافه و کتابخانه تا اتاق داوری و سالن نشست؛ در صفحه هر بخش، جزئیات، شرایط و تعرفه استفاده را توضیح داده‌ایم."/><section className="section-space"><div className="container-shell"><SectionTitle eyebrow="فهرست امکانات" title="بخش موردنظر خود را پیدا کنید" description="جستجو کنید یا همه امکانات خانه وکلا را مرور کنید."/><div className="mt-10"><ServicesCatalog/></div></div></section></>}
