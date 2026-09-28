import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { LawyersCatalog } from '@/components/interactive/Catalogs';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata:Metadata={title:'وکلای عضو',description:'فهرست وکلای عضو خانه وکلا و حوزه‌های تخصصی آن‌ها.'};
export default function LawyersPage(){return <><PageHero eyebrow="اعضای خانه" current="وکلای عضو" title={<>وکلایی که اینجا<br/><span className="gold-text">قهوه می‌نوشند</span></>} description="اعضای خانه وکلا با تخصص‌های متفاوت؛ مراجعان می‌توانند وکیل متناسب با موضوع پرونده خود را انتخاب کنند و جلسه را در اتاق‌های خانه برگزار کنند."/><section className="section-space"><div className="container-shell"><SectionTitle eyebrow="فهرست اعضا" title="وکیل مناسب حوزه خود را پیدا کنید" description="اطلاعات اعضا پس از تکمیل پروفایل در پنل عضویت نمایش داده می‌شود؛ موارد جای‌نگهدار باید تکمیل شوند."/><div className="mt-10"><LawyersCatalog/></div></div></section></>}
