import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { GalleryGrid, Panorama360 } from '@/components/interactive/GalleryClient';
import { panoramaTour } from '@/lib/data/gallery';

export const metadata: Metadata = {
  alternates: { canonical: '/gallery/' },
  title: 'گالری و تور مجازی',
  description: 'گالری تصاویر کافه، اتاق‌های مشاوره و کتابخانهٔ خانه وکلا؛ به‌همراه تور مجازی ۳۶۰ درجه.',
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="فضای خانه وکلا"
        current="گالری"
        title={<>پیش از حضور،<br /><span className="gold-text-on-dark">فضا را ببینید</span></>}
        description="تصاویر کافه، اتاق‌های مشاوره و کتابخانه؛ با فیلتر دسته‌بندی و نمایش بزرگ‌نمایی‌شده."
      />

      <section className="section-space">
        <div className="container-shell">
          <Breadcrumb items={[{ label: 'گالری' }]} />
          <SectionTitle eyebrow="گالری تصاویر" title="کافه، اتاق مشاوره و کتابخانه" className="mt-8" />
          <div className="mt-10">
            <GalleryGrid />
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-shell">
          <SectionTitle eyebrow="تور مجازی" title="یک دور بزنید، بدون آمدن" description="نمونهٔ تور ۳۶۰ درجه با Pannellum — تصویر فعلی نمونه/دمو است؛ برای انتشار نهایی باید با عکس واقعی ۳۶۰ درجهٔ فضای خانه وکلا جایگزین شود." />
          <div className="mt-10">
            <Panorama360 src={panoramaTour.src} title={panoramaTour.title} />
          </div>
        </div>
      </section>
    </>
  );
}
