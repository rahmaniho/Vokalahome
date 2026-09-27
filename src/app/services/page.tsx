import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { ServicesCatalog } from '@/components/interactive/Catalogs';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata:Metadata={title:'خدمات حقوقی',description:'خدمات حقوقی خانه وکیل در حوزه خانواده، کیفری، املاک، تجارت، امور ثبتی و اداری.'};
export default function ServicesPage(){return <><PageHero eyebrow="خدمات حقوقی" current="خدمات" title={<>برای هر مسئله،<br/><span className="gold-text">یک مسیر حقوقی روشن</span></>} description="حوزه موردنظر را پیدا کنید؛ در صفحه هر خدمت، مدارک لازم، مراحل احتمالی و شیوه شروع همکاری را توضیح داده‌ایم."/><section className="section-space"><div className="container-shell"><SectionTitle eyebrow="حوزه‌های تخصصی" title="خدمت موردنظر خود را پیدا کنید" description="جستجو کنید یا همه حوزه‌ها را مرور کنید. انتخاب نهایی پس از بررسی اولیه پرونده انجام می‌شود."/><div className="mt-10"><ServicesCatalog/></div></div></section></>}
