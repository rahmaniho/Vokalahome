import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { Badge, BADGE_TONES } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Card, CardBody, CardText, CardTitle } from '@/components/ui/Card';
import { Logo, LogoMark } from '@/components/ui/Logo';
import { StyleGuideDemo } from '@/components/style-guide/StyleGuideDemo';
import { BRAND_COLORS } from '@/lib/brand';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'راهنمای برند و سیستم طراحی',
  description:
    'رنگ‌ها، تایپوگرافی، لوگو، فاصلهٔ امن و اجزای رابط کاربری خانه وکلا — مرجع واحد برای هر توسعه یا طراحی آینده.',
  path: '/style-guide/',
  noIndex: true,
});

const PALETTE = [
  { name: 'سرمه‌ای', token: 'navy-900', hex: BRAND_COLORS.navy, role: 'رنگ اصلی برند، هدر، فوتر، متن تیره', onDark: true },
  { name: 'طلایی', token: 'gold-500', hex: BRAND_COLORS.gold, role: 'رنگ تأکید، دکمهٔ اصلی، نشانه‌ها', onDark: false },
  { name: 'خاکستری روشن', token: 'mist-100', hex: BRAND_COLORS.mist, role: 'بوم صفحه و بخش‌های متناوب', onDark: false },
  { name: 'قهوه‌ای', token: 'coffee-500', hex: BRAND_COLORS.coffee, role: 'لهجهٔ کافه، برچسب فضاها', onDark: true },
];

/**
 * توکن‌های معنایی. کلاس Tailwind هرکدام کامل و ثابت نوشته شده تا در purge
 * باقی بماند — درون‌یابی رشته‌ای (`bg-${token}`) اینجا کار نمی‌کند.
 */
const SEMANTIC_TOKENS = [
  { token: 'surface', swatch: 'bg-surface' },
  { token: 'surface-2', swatch: 'bg-surface-2' },
  { token: 'surface-3', swatch: 'bg-surface-3' },
  { token: 'line', swatch: 'bg-line' },
  { token: 'ink', swatch: 'bg-ink' },
  { token: 'ink-muted', swatch: 'bg-ink-muted' },
  { token: 'ink-faint', swatch: 'bg-ink-faint' },
] as const;

const TYPE_SCALE = [
  { label: 'تیتر صفحه (h1)', className: 'text-3xl font-black leading-[1.4] sm:text-5xl', sample: 'خانه وکلا' },
  { label: 'تیتر بخش (h2)', className: 'text-2xl font-black leading-[1.45] sm:text-4xl', sample: 'اتاق‌های مشاوره' },
  { label: 'تیتر کارت (h3)', className: 'text-lg font-black leading-8', sample: 'اتاق مشاورهٔ شمارهٔ یک' },
  { label: 'متن بدنه', className: 'text-sm leading-[2.05] sm:text-base', sample: 'اتاق‌های عایق صدا با پذیرایی و پذیرش حرفه‌ای.' },
  { label: 'متن کوچک', className: 'text-xs leading-[1.95]', sample: 'برای اعضا رایگان · برای مهمانان ساعتی ۵۰۰٬۰۰۰ تومان' },
  { label: 'ریزمتن', className: 'text-[11px] leading-6', sample: 'تعرفه‌ها شامل پذیرایی و خدمات منشی است.' },
];

export default function StyleGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="سیستم طراحی"
        title={
          <>
            راهنمای برند
            <br />
            <span className="text-gold-400">خانه وکلا</span>
          </>
        }
        description="مرجع واحد رنگ، تایپوگرافی، لوگو و اجزای رابط کاربری. هر صفحهٔ جدیدی که ساخته می‌شود باید از همین اجزا استفاده کند تا سایت یکدست بماند."
        crumbs={[{ label: 'راهنمای برند', href: '/style-guide/' }]}
      />

      {/* لوگو */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            eyebrow="نشانه"
            title="لوگو و فضای امن"
            description="نشانه از سه عنصر ساخته شده: بام خانه، شاهین ترازوی عدالت و فنجان قهوه در قلب آن."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-line bg-surface p-8">
              <p className="mb-6 text-xs font-bold text-ink-faint">روی پس‌زمینهٔ روشن</p>
              <Logo />
            </div>
            <div className="rounded-3xl border border-line bg-navy-900 p-8">
              <p className="mb-6 text-xs font-bold text-white/45">روی پس‌زمینهٔ تیره</p>
              <Logo light />
            </div>
            <div className="rounded-3xl border border-line bg-surface p-8">
              <p className="mb-6 text-xs font-bold text-ink-faint">فقط نشانه (favicon / اپلیکیشن)</p>
              <div className="flex items-end gap-5">
                <LogoMark className="size-16 text-navy-900 dark:text-white" />
                <LogoMark className="size-10 text-gold-500" />
                <LogoMark className="size-7 text-navy-900 dark:text-white" />
              </div>
            </div>
          </div>

          {/* فضای امن */}
          <div className="mt-5 rounded-3xl border border-line bg-surface p-8">
            <h3 className="text-sm font-black text-ink">فاصلهٔ امن (Clear Space)</h3>
            <p className="mt-2 max-w-2xl text-xs leading-[1.95] text-ink-muted">
              پیرامون نشانه باید همیشه فضایی خالی به اندازهٔ <b>یک‌چهارم ارتفاع نشانه</b> باقی بماند. هیچ متن، خط یا
              تصویری نباید وارد این ناحیه شود. حداقل اندازهٔ مجاز نشانه ۲۴ پیکسل است؛ زیر آن، فنجان و کفه‌های ترازو
              ناخوانا می‌شوند.
            </p>
            <div className="mt-6 inline-block rounded-2xl border-2 border-dashed border-gold-500/50 p-[16px]">
              <div className="border border-line">
                <LogoMark className="size-16 text-navy-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* رنگ */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle
            eyebrow="پالت"
            title="رنگ‌های برند"
            description="رنگ‌های معنایی (surface / ink / line) از متغیرهای CSS می‌آیند و در حالت تاریک خودکار عوض می‌شوند."
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PALETTE.map((color) => (
              <li key={color.token} className="overflow-hidden rounded-3xl border border-line bg-surface">
                <div className="grid h-28 place-items-center" style={{ backgroundColor: color.hex }}>
                  <span className={`font-mono text-xs font-black ${color.onDark ? 'text-white' : 'text-navy-900'}`}>
                    {color.hex}
                  </span>
                </div>
                <div className="p-5">
                  <b className="block text-sm font-black text-ink">{color.name}</b>
                  <code className="mt-1 block text-[11px] text-gold-700 dark:text-gold-400">{color.token}</code>
                  <p className="mt-2.5 text-[11px] leading-[1.9] text-ink-muted">{color.role}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* رنگ‌های معنایی.
              کلاس‌ها عمداً به‌صورت رشتهٔ کامل نوشته شده‌اند: Tailwind فایل‌ها را
              متنی اسکن می‌کند و کلاس ساخته‌شده با درون‌یابی (`bg-${token}`)
              را نمی‌بیند و در purge حذف می‌شود. */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {SEMANTIC_TOKENS.map((item) => (
              <div key={item.token} className="rounded-2xl border border-line bg-surface p-4 text-center">
                <span className={cn('mx-auto mb-3 block size-10 rounded-xl border border-line', item.swatch)} />
                <code className="text-[10px] text-ink-muted">{item.token}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* تایپوگرافی */}
      <section className="section-space">
        <div className="container-shell">
          <SectionTitle
            eyebrow="تایپوگرافی"
            title="وزیرمتن، خودمیزبان"
            description="یک فایل فونت متغیر برای همهٔ وزن‌های ۱۰۰ تا ۹۰۰. ارقام همیشه فارسی نمایش داده می‌شوند."
          />

          <ul className="mt-10 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
            {TYPE_SCALE.map((item) => (
              <li key={item.label} className="flex flex-col gap-2 p-6 sm:flex-row sm:items-baseline sm:gap-8">
                <code className="w-40 shrink-0 text-[11px] text-ink-faint">{item.label}</code>
                <span className={`${item.className} text-ink`}>{item.sample}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ['۱۰۰ تا ۳۰۰', 'font-light', 'کم‌کاربرد؛ فقط ریزمتن روی پس‌زمینهٔ تیره'],
              ['۴۰۰ تا ۶۰۰', 'font-normal / font-bold', 'متن بدنه و برچسب‌ها'],
              ['۸۰۰ تا ۹۰۰', 'font-extrabold / font-black', 'تیترها و دکمه‌ها'],
            ].map(([weight, token, use]) => (
              <div key={weight} className="rounded-2xl border border-line bg-surface p-5">
                <b className="block text-sm font-black text-ink">{weight}</b>
                <code className="mt-1 block text-[11px] text-gold-700 dark:text-gold-400">{token}</code>
                <p className="mt-2 text-[11px] leading-[1.9] text-ink-muted">{use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دکمه‌ها */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle
            eyebrow="اجزا"
            title="دکمه‌ها"
            description="همهٔ اندازه‌ها حداقل ۴۴ پیکسل ارتفاع دارند (هدف لمسی WCAG 2.5.5)."
          />

          <div className="mt-10 space-y-5">
            <div className="rounded-3xl border border-line bg-surface p-6">
              <p className="mb-5 text-xs font-bold text-ink-faint">حالت‌ها</p>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(BUTTON_VARIANTS) as (keyof typeof BUTTON_VARIANTS)[])
                  .filter((variant) => variant !== 'light')
                  .map((variant) => (
                    <Button key={variant} variant={variant}>
                      {variant}
                    </Button>
                  ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-navy-900 p-6">
              <p className="mb-5 text-xs font-bold text-white/45">حالت روشن (روی پس‌زمینهٔ تیره)</p>
              <Button variant="light">light</Button>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-6">
              <p className="mb-5 text-xs font-bold text-ink-faint">اندازه‌ها و حالت غیرفعال</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">کوچک</Button>
                <Button size="md">متوسط</Button>
                <Button size="lg" arrow>
                  بزرگ با پیکان
                </Button>
                <Button disabled>غیرفعال</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* نشان‌ها و هشدارها */}
      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 text-xl font-black text-ink">نشان‌ها (Badge)</h2>
            <div className="flex flex-wrap gap-2 rounded-3xl border border-line bg-surface p-6">
              {(Object.keys(BADGE_TONES) as (keyof typeof BADGE_TONES)[]).map((tone) => (
                <Badge key={tone} tone={tone} dot>
                  {tone}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-xl font-black text-ink">پیام‌های وضعیت (Alert)</h2>
            <div className="space-y-3">
              <Alert tone="info">پیام اطلاع‌رسانی عمومی.</Alert>
              <Alert tone="success">عملیات با موفقیت انجام شد.</Alert>
              <Alert tone="warning" title="هشدار حقوقی">
                این مطلب جایگزین مشاورهٔ حقوقی موردی نیست.
              </Alert>
              <Alert tone="danger">خطا در ارسال فرم؛ لطفاً دوباره تلاش کنید.</Alert>
            </div>
          </div>
        </div>
      </section>

      {/* کارت‌ها و فرم */}
      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <h2 className="mb-5 text-xl font-black text-ink">کارت‌ها</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardBody>
                <CardTitle>کارت ساده</CardTitle>
                <CardText>ظرف پایهٔ محتوا، بدون تعامل.</CardText>
              </CardBody>
            </Card>
            <Card interactive>
              <CardBody>
                <CardTitle>کارت تعاملی</CardTitle>
                <CardText>با هاور بالا می‌آید و سایه می‌گیرد.</CardText>
              </CardBody>
            </Card>
            <Card href="/rooms/" interactive>
              <CardBody>
                <CardTitle>کارت لینک‌دار</CardTitle>
                <CardText>کل سطح کارت قابل کلیک است.</CardText>
              </CardBody>
            </Card>
          </div>

          <h2 className="mb-5 mt-12 text-xl font-black text-ink">فرم و پنجره</h2>
          <StyleGuideDemo />
        </div>
      </section>

      {/* قواعد */}
      <section className="section-space">
        <div className="container-shell mx-auto max-w-3xl">
          <SectionTitle center eyebrow="قواعد" title="چند اصل که نباید شکسته شوند" className="mb-9" />
          <ul className="space-y-3">
            {[
              'هر متن و عدد فارسی است؛ ارقام لاتین فقط در فیلدهای ورودی تلفن و ایمیل (با dir="ltr") مجازند.',
              'هیچ عنصر قابل لمسی کوچک‌تر از ۴۴×۴۴ پیکسل نباشد.',
              'هر تصویر باید width و height یا aspect-ratio داشته باشد تا چیدمان نپرد (CLS).',
              'رنگ نباید تنها حامل معنا باشد؛ همیشه آیکون یا متن همراهش بیاید.',
              'انیمیشن‌ها باید با prefers-reduced-motion خاموش شوند.',
              'هیچ رنگ ثابتی مثل bg-white یا text-gray-500 استفاده نشود؛ فقط توکن‌های معنایی.',
            ].map((rule) => (
              <li key={rule} className="rounded-2xl border border-line bg-surface p-5 text-sm leading-[1.95] text-ink-muted">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
