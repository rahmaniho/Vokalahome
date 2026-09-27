import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { LawyersCatalog } from '@/components/interactive/Catalogs';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata:Metadata={title:'وکلای ما',description:'آشنایی با تیم وکلای خانه وکیل و حوزه‌های تخصصی آن‌ها.'};
export default function LawyersPage(){return <><PageHero eyebrow="تیم حرفه‌ای" current="وکلای ما" title={<>تخصص‌های متفاوت،<br/><span className="gold-text">تعهد حرفه‌ای مشترک</span></>} description="هر پرونده با توجه به موضوع و نیاز آن، به وکیل یا تیم مناسب ارجاع می‌شود؛ با استاندارد مشترک در کیفیت، محرمانگی و پاسخ‌گویی."/><section className="section-space"><div className="container-shell"><SectionTitle eyebrow="اعضای تیم" title="وکیل مناسب حوزه خود را پیدا کنید" description="اطلاعات اعضای غیرمدیر به‌صورت جای‌نگهدار درج شده و پیش از انتشار نهایی باید تکمیل شود."/><div className="mt-10"><LawyersCatalog/></div></div></section></>}
