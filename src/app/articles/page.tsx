import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { ArticlesCatalog } from '@/components/interactive/Catalogs';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata:Metadata={ alternates:{canonical:'/articles/'},title:'دانش‌نامه حقوقی',description:'مقالات کاربردی حقوقی خانه وکلا درباره قراردادها، املاک، خانواده، کیفری و تجارت.'};
export default function ArticlesPage(){return <><PageHero eyebrow="دانش‌نامه حقوقی" current="مقالات" title={<>دانش حقوقی برای<br/><span className="gold-text-on-dark">تصمیم‌های روزمره</span></>} description="مطالب این بخش با زبان روشن نوشته شده‌اند تا پیش از اقدام، پرسش‌های درست‌تری داشته باشید. این مطالب جایگزین مشاوره اختصاصی نیستند."/><section className="section-space"><div className="container-shell"><SectionTitle eyebrow="تازه‌ترین مطالب" title="جستجو و مطالعه در دانش‌نامه"/><div className="mt-10"><ArticlesCatalog/></div></div></section></>}
