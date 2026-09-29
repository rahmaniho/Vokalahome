import Link from 'next/link';
import { Coffee, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SITE, ROOM_RATE } from '@/lib/constants';
import { services } from '@/lib/data/services';

export function Footer() {
  return <footer className="relative overflow-hidden bg-navy-950 text-white">
    <div className="pointer-events-none absolute -left-20 top-20 size-72 rounded-full bg-gold-500/5 blur-3xl" />
    <div className="container-shell relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_.9fr_1.2fr] lg:py-20">
      <div>
        <Logo light />
        <p className="mt-6 max-w-sm text-sm leading-[2] text-white/55">
          خانه وکلا؛ جایی برای نشستن، قهوه خوردن، تبادل دانش حقوقی و ملاقات حرفه‌ای با موکل. اتاق‌های مشاوره برای اعضا رایگان و برای مهمانان ساعتی {ROOM_RATE.guestPrice}.
        </p>
        <div className="mt-6 flex gap-2">
          <a aria-label="اینستاگرام" href={SITE.instagram} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-xl border border-white/10 hover:border-gold-500 hover:text-gold-400"><Instagram size={18} /></a>
          <a aria-label="لینکدین" href={SITE.linkedin} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-xl border border-white/10 hover:border-gold-500 hover:text-gold-400"><Linkedin size={18} /></a>
        </div>
      </div>
      <div>
        <h3 className="mb-5 text-sm font-black text-gold-400">خانه وکلا</h3>
        <ul className="space-y-3.5 text-sm text-white/60">
          {[['درباره خانه', '/about/'], ['پلن‌های عضویت', '/membership/'], ['اتاق‌های مشاوره', '/rooms/'], ['تقویم رویدادها', '/events/'], ['وکلای عضو', '/lawyers/'], ['گالری و تور مجازی', '/gallery/'], ['دانش‌نامه حقوقی', '/articles/']].map(([l, h]) => (
            <li key={h}><Link className="transition hover:pr-1 hover:text-white" href={h}>{l}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-5 text-sm font-black text-gold-400">امکانات</h3>
        <ul className="space-y-3.5 text-sm text-white/60">
          {services.slice(0, 5).map((s) => <li key={s.slug}><Link className="transition hover:pr-1 hover:text-white" href={`/services/${s.slug}/`}>{s.title}</Link></li>)}
        </ul>
      </div>
      <div>
        <h3 className="mb-5 text-sm font-black text-gold-400">ارتباط و ساعات کار</h3>
        <ul className="space-y-4 text-sm text-white/60">
          <li className="flex gap-3"><MapPin className="mt-1 shrink-0 text-gold-500" size={17} /><span className="leading-7">{SITE.address}</span></li>
          <li><a href={SITE.phoneHref} className="flex items-center gap-3"><Phone className="text-gold-500" size={17} /><span dir="ltr">{SITE.phone}</span></a></li>
          <li><a href={`mailto:${SITE.email}`} className="flex items-center gap-3"><Mail className="text-gold-500" size={17} />{SITE.email}</a></li>
          <li className="flex gap-3"><Coffee className="mt-1 shrink-0 text-gold-500" size={17} /><span className="leading-7">{SITE.workHours}</span></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container-shell flex flex-col items-center justify-between gap-4 py-5 text-center text-[11px] text-white/60 sm:flex-row">
        <p>© ۱۴۰۵ خانه وکلا — تمامی حقوق محفوظ است.</p>
        <div className="flex gap-5"><Link href="/privacy/">حریم خصوصی</Link><Link href="/terms/">قواعد خانه</Link><Link href="/disclaimer/">سلب مسئولیت</Link><a href={`${SITE.basePath}/rss.xml`}>RSS</a><Link href="/style-guide/">راهنمای سبک</Link></div>
      </div>
    </div>
  </footer>;
}
