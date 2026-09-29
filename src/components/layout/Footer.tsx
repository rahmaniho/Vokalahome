import Link from 'next/link';
import { Coffee, Instagram, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { OpenNow } from '@/components/interactive/OpenNow';
import { SITE, ROOM_RATE } from '@/lib/constants';
import { services } from '@/lib/data/services';
import { toFa } from '@/lib/utils';

const QUICK_LINKS = [
  ['دربارهٔ خانه', '/about/'],
  ['پلن‌های عضویت', '/membership/'],
  ['اتاق‌های مشاوره', '/rooms/'],
  ['تقویم رویدادها', '/events/'],
  ['وکلای عضو', '/lawyers/'],
  ['گالری و تور مجازی', '/gallery/'],
  ['وبلاگ حقوقی', '/blog/'],
  ['پرسش‌های پرتکرار', '/faq/'],
] as const;

const SOCIALS = [
  { label: 'اینستاگرام', href: SITE.instagram, Icon: Instagram },
  { label: 'لینکدین', href: SITE.linkedin, Icon: Linkedin },
  { label: 'تلگرام', href: SITE.telegram, Icon: Send },
] as const;

export function Footer() {
  const year = toFa(new Date().getFullYear() - 621); // تخمین سال شمسی برای متن حق نشر

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-gold-500/5 blur-3xl" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px gold-line" />

      <div className="container-shell relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_.85fr_.85fr_1.15fr] lg:gap-8 lg:py-18">
        {/* ستون برند */}
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-[2] text-white/55">
            خانه وکلا؛ جایی برای نشستن، قهوه خوردن، تبادل دانش حقوقی و ملاقات حرفه‌ای با موکل. اتاق‌های مشاوره برای اعضا
            رایگان و برای مهمانان ساعتی {ROOM_RATE.guestPrice}.
          </p>
          <div className="mt-5">
            <OpenNow light />
          </div>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                aria-label={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target rounded-xl border border-white/10 transition hover:border-gold-500 hover:text-gold-400"
              >
                <Icon size={18} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* لینک‌های سریع */}
        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="mb-4 text-sm font-black text-gold-400">
            دسترسی سریع
          </h2>
          <ul className="space-y-1 text-sm text-white/60">
            {QUICK_LINKS.map(([label, href]) => (
              <li key={href}>
                <Link className="flex min-h-9 items-center transition hover:pr-1 hover:text-white" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* خدمات */}
        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="mb-4 text-sm font-black text-gold-400">
            خدمات
          </h2>
          <ul className="space-y-1 text-sm text-white/60">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  className="flex min-h-9 items-center transition hover:pr-1 hover:text-white"
                  href={`/services/${service.slug}/`}
                >
                  {service.shortTitle || service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* تماس */}
        <div>
          <h2 className="mb-4 text-sm font-black text-gold-400">ارتباط و ساعات کار</h2>
          <ul className="space-y-3.5 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin className="mt-1 shrink-0 text-gold-500" size={17} aria-hidden />
              <span className="leading-7">{SITE.address}</span>
            </li>
            <li>
              <a href={SITE.phoneHref} className="flex min-h-11 items-center gap-3 transition hover:text-white">
                <Phone className="shrink-0 text-gold-500" size={17} aria-hidden />
                <span dir="ltr">{SITE.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex min-h-11 items-center gap-3 transition hover:text-white">
                <Mail className="shrink-0 text-gold-500" size={17} aria-hidden />
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Coffee className="mt-1 shrink-0 text-gold-500" size={17} aria-hidden />
              <span className="leading-7">{SITE.workHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col items-center justify-between gap-3 py-5 text-center text-[11px] text-white/40 sm:flex-row sm:text-right">
          <p>© {year} خانه وکلا — تمامی حقوق محفوظ است.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link className="min-h-9 leading-9 transition hover:text-white" href="/privacy/">
              حریم خصوصی
            </Link>
            <Link className="min-h-9 leading-9 transition hover:text-white" href="/terms/">
              قواعد خانه
            </Link>
            <Link className="min-h-9 leading-9 transition hover:text-white" href="/disclaimer/">
              سلب مسئولیت
            </Link>
            <Link className="min-h-9 leading-9 transition hover:text-white" href="/style-guide/">
              راهنمای برند
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
