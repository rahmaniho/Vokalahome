import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Logo } from '@/components/ui/Logo';
import { StyleGuideForm, StyleGuideModalDemo, StyleGuideThemeNote } from '@/components/interactive/StyleGuideClient';

export const metadata: Metadata = {
  alternates: { canonical: '/style-guide/' },
  title: 'راهنمای سبک (Style Guide)',
  description: 'رنگ، تایپوگرافی و کامپوننت‌های سیستم طراحی خانه وکلا؛ منبع مرجع برای توسعه یکپارچهٔ صفحات جدید.',
  robots: { index: false, follow: true }, // صفحهٔ مرجع داخلی تیم؛ نیازی به ایندکس در گوگل نیست
};

const colorGroups = [
  { name: 'سرمه‌ای (Navy) — رنگ اصلی برند', items: [
    { label: 'navy-950', hex: '#060F1D' }, { label: 'navy-900 (اصلی)', hex: '#0B1F3A' },
    { label: 'navy-800', hex: '#16294A' }, { label: 'navy-700', hex: '#1F3560' },
  ]},
  { name: 'طلایی (Gold) — رنگ تأکید و CTA', items: [
    { label: 'gold-500 (اصلی)', hex: '#C9A227' }, { label: 'gold-400', hex: '#D3B14A' },
    { label: 'gold-300', hex: '#E2C87A' }, { label: 'gold-100', hex: '#F6EACA' },
  ]},
  { name: 'خاکستری روشن و خنثی‌ها', items: [
    { label: 'ivory (پس‌زمینه)', hex: '#F5F6F8' }, { label: 'cream', hex: '#FBF6EF' },
    { label: 'coffee-500', hex: '#7B4B2A' }, { label: 'coffee-100', hex: '#F1E4D6' },
  ]},
];

export default function StyleGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="مرجع طراحی"
        current="راهنمای سبک"
        title={<>سیستم طراحی<br /><span className="gold-text-on-dark">خانه وکلا</span></>}
        description="رنگ، فونت، فاصله‌گذاری و کامپوننت‌های پایه — تا هر صفحهٔ جدید با همان هویت بصری ساخته شود."
      />

      <section className="section-space">
        <div className="container-shell">
          <Breadcrumb items={[{ label: 'راهنمای سبک' }]} />

          <SectionTitle eyebrow="۰۱ · رنگ" title="پالت رسمی برند" className="mt-10" description="سرمه‌ای برای اعتماد و اقتدار حرفه‌ای، طلایی برای تأکید و CTA، خاکستری روشن برای فضای تنفس." />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {colorGroups.map((group) => (
              <div key={group.name}>
                <h3 className="mb-4 text-sm font-black text-navy-900">{group.name}</h3>
                <div className="space-y-3">
                  {group.items.map((c) => (
                    <div key={c.hex} className="flex items-center gap-3 rounded-xl border border-gray-100 p-2">
                      <span className="size-12 shrink-0 rounded-lg border border-black/5" style={{ background: c.hex }} />
                      <div>
                        <p className="text-xs font-bold text-navy-900">{c.label}</p>
                        <p dir="ltr" className="font-mono text-[11px] text-gray-500">{c.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۲ · تایپوگرافی" title="فونت وزیرمتن (Vazirmatn)" description="فونت اصلی و تنها فونت سایت — فارسی، خوانا، با پشتیبانی کامل از اعداد فارسی و راست‌چین." />
          <div className="mt-10 space-y-6">
            <p className="display-title">عنوان بزرگ نمایشی — display-title</p>
            <h2 className="text-3xl font-black text-navy-900">تیتر سطح دو — H2 / text-3xl font-black</h2>
            <h3 className="text-xl font-black text-navy-900">تیتر سطح سه — H3 / text-xl font-black</h3>
            <p className="body-copy max-w-2xl">
              متن پاراگراف استاندارد با کلاس body-copy؛ برای خوانایی بهتر متن فارسی، ارتفاع خط ۲ برابر و رنگ خاکستری میانه انتخاب شده است.
              اندازهٔ پایهٔ فونت هرگز کمتر از ۱۴px نیست تا در موبایل خوانا بماند.
            </p>
            <span className="eyebrow">برچسب Eyebrow کوچک</span>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۳ · لوگو" title="نماد و فضای امن" description="نماد ترکیبی خانه (سقف) + ترازوی عدالت + اشارهٔ ظریف به بخار قهوه؛ همیشه با حداقل فاصلهٔ خالی معادل یک‌چهارم عرض نماد از عناصر اطراف استفاده شود." />
          <div className="mt-10 flex flex-wrap items-center gap-10">
            <div className="rounded-3xl border border-gray-100 bg-white p-8"><Logo /></div>
            <div className="rounded-3xl bg-navy-900 p-8"><Logo light /></div>
            <div className="rounded-3xl border border-gray-100 bg-white p-8"><Logo compact /></div>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۴ · دکمه‌ها" title="Button" />
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="#" variant="gold">دکمهٔ طلایی</Button>
            <Button href="#" variant="navy">دکمهٔ سرمه‌ای</Button>
            <Button href="#" variant="outline">دکمهٔ خطی</Button>
            <Button href="#" variant="gold" arrow>با فلش</Button>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۵ · نشان‌ها" title="Badge" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Badge variant="gold">محبوب‌ترین</Badge>
            <Badge variant="navy">رایگان برای اعضا</Badge>
            <Badge variant="success">ظرفیت باز</Badge>
            <Badge variant="warning">ظرفیت محدود</Badge>
            <Badge variant="danger">تکمیل‌شده</Badge>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۶ · کارت‌ها" title="Card" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <Card hoverable>
              <h3 className="font-black text-navy-900">کارت روشن</h3>
              <p className="mt-2 text-xs text-gray-500">برای محتوای عمومی روی زمینهٔ روشن.</p>
            </Card>
            <Card dark hoverable>
              <h3 className="font-black">کارت تیره</h3>
              <p className="mt-2 text-xs text-white/60">برای بخش‌های تأکیدی روی زمینهٔ سرمه‌ای.</p>
            </Card>
            <Card hoverable className="border-gold-500/40">
              <h3 className="font-black text-navy-900">کارت با حاشیهٔ طلایی</h3>
              <p className="mt-2 text-xs text-gray-500">برای پلن پیشنهادی یا مورد محبوب.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۷ · پیام‌ها" title="Alert" />
          <div className="mt-10 space-y-4">
            <Alert variant="info" title="اطلاع‌رسانی">این یک پیام اطلاع‌رسانی عمومی است.</Alert>
            <Alert variant="success" title="موفقیت">درخواست شما با موفقیت ثبت شد.</Alert>
            <Alert variant="warning" title="هشدار">ظرفیت این بازهٔ زمانی محدود است.</Alert>
            <Alert variant="danger" title="خطا">لطفاً فیلدهای الزامی را تکمیل کنید.</Alert>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۸ · فرم" title="Input / Textarea" />
          <StyleGuideForm />
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <SectionTitle eyebrow="۰۹ · مدال" title="Modal" description="بسته‌شدن با کلید Esc، قفل اسکرول پس‌زمینه و فوکوس خودکار — مطابق اصول دسترس‌پذیری." />
          <div className="mt-8"><StyleGuideModalDemo /></div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-shell">
          <SectionTitle eyebrow="۱۰ · حالت تاریک" title="Dark Mode" />
          <StyleGuideThemeNote />
        </div>
      </section>
    </>
  );
}
