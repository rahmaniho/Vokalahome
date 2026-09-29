import type { Metadata } from 'next';
import { Camera, Compass, ImageIcon } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { GalleryExplorer } from '@/components/gallery/GalleryExplorer';
import { VirtualTour } from '@/components/gallery/VirtualTour';
import { galleryItems } from '@/lib/data/gallery';
import { buildMetadata } from '@/lib/seo';
import { toFa } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'گالری تصاویر و تور مجازی ۳۶۰ درجه',
  description:
    'تصاویر کافه، اتاق‌های مشاوره، کتابخانه و سالن نشست خانه وکلا قزوین به همراه تور مجازی ۳۶۰ درجه از سالن اصلی.',
  path: '/gallery/',
  image: '/images/gallery/cafe-main.jpg',
  keywords: ['گالری خانه وکلا', 'تور مجازی', 'کافه حقوقی قزوین', 'اتاق مشاوره تصاویر'],
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="گالری و تور مجازی"
        title={
          <>
            پیش از آمدن،
            <br />
            <span className="text-gold-400">فضا را ببینید</span>
          </>
        }
        description="از بار قهوه تا اتاق داوری؛ تصاویر واقعی فضاها و یک تور ۳۶۰ درجه که می‌توانید در آن بچرخید."
        crumbs={[{ label: 'گالری', href: '/gallery/' }]}
      >
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/55">
          <span className="flex items-center gap-2">
            <ImageIcon size={15} className="text-gold-400" aria-hidden />
            {toFa(galleryItems.length)} تصویر
          </span>
          <span className="flex items-center gap-2">
            <Compass size={15} className="text-gold-400" aria-hidden />
            تور ۳۶۰ درجه
          </span>
        </div>
      </PageHero>

      {/* تور مجازی */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="تور مجازی"
            title="در سالن اصلی قدم بزنید"
            description="با کشیدن ماوس یا انگشت بچرخید، زوم کنید و فضا را از همه طرف ببینید."
            className="mb-11"
          />
          <VirtualTour />
        </div>
      </section>

      {/* گالری */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle
            center
            eyebrow="تصاویر"
            title="هر گوشه از خانه"
            description="برای بزرگ‌نمایی روی هر تصویر بزنید؛ با جهت‌نماها یا کشیدن، بین تصاویر جابه‌جا شوید."
            className="mb-11"
          />
          <GalleryExplorer />
        </div>
      </section>

      {/* دعوت */}
      <section className="section-space">
        <div className="container-shell">
          <div className="noise persian-pattern relative overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-14 text-center text-white sm:px-12">
            <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-gold-500/15 blur-[90px]" />
            <div className="relative mx-auto max-w-xl">
              <Camera size={30} className="mx-auto text-gold-400" aria-hidden />
              <h2 className="mt-5 text-2xl font-black leading-[1.5] sm:text-3xl">
                تصاویر هرچقدر هم خوب باشند،
                <br />
                <span className="text-gold-400">جای یک فنجان قهوه را نمی‌گیرند</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-[2.05] text-white/60">
                برای بازدید حضوری هماهنگ کنید؛ اولین قهوه مهمان ماست.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/contact/" variant="gold" size="lg" arrow>
                  هماهنگی بازدید
                </Button>
                <Button href="/rooms/" variant="light" size="lg">
                  مشاهدهٔ اتاق‌ها
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
