import Link from 'next/link';
import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SITE } from '@/lib/constants';
import { services } from '@/lib/data/services';

export function Footer() {
  return <footer className="relative overflow-hidden bg-navy-950 text-white">
    <div className="pointer-events-none absolute -left-20 top-20 size-72 rounded-full bg-gold-500/5 blur-3xl" />
    <div className="container-shell relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_.9fr_1.2fr] lg:py-20">
      <div><Logo light/><p className="mt-6 max-w-sm text-sm leading-[2] text-white/55">همراه حقوقی شما برای تصمیم‌های مهم؛ با تحلیل دقیق، گفت‌وگوی شفاف و پیگیری مسئولانه در قزوین.</p><div className="mt-6 flex gap-2"><a aria-label="اینستاگرام" href="#" className="grid size-10 place-items-center rounded-xl border border-white/10 hover:border-gold-500 hover:text-gold-400"><Instagram size={18}/></a><a aria-label="لینکدین" href="#" className="grid size-10 place-items-center rounded-xl border border-white/10 hover:border-gold-500 hover:text-gold-400"><Linkedin size={18}/></a></div></div>
      <div><h3 className="mb-5 text-sm font-black text-gold-400">دسترسی سریع</h3><ul className="space-y-3.5 text-sm text-white/60">{[['درباره مؤسسه','/about/'],['تیم وکلا','/lawyers/'],['رزرو مشاوره','/consultation/'],['پرسش‌های متداول','/faq/'],['تماس با ما','/contact/']].map(([l,h]) => <li key={h}><Link className="transition hover:pr-1 hover:text-white" href={h}>{l}</Link></li>)}</ul></div>
      <div><h3 className="mb-5 text-sm font-black text-gold-400">خدمات حقوقی</h3><ul className="space-y-3.5 text-sm text-white/60">{services.slice(0,5).map((s) => <li key={s.slug}><Link className="transition hover:pr-1 hover:text-white" href={`/services/${s.slug}/`}>{s.shortTitle}</Link></li>)}</ul></div>
      <div><h3 className="mb-5 text-sm font-black text-gold-400">ارتباط با ما</h3><ul className="space-y-4 text-sm text-white/60"><li className="flex gap-3"><MapPin className="mt-1 shrink-0 text-gold-500" size={17}/><span className="leading-7">{SITE.address}</span></li><li><a href={SITE.phoneHref} className="flex items-center gap-3"><Phone className="text-gold-500" size={17}/><span dir="ltr">{SITE.phone}</span></a></li><li><a href={`mailto:${SITE.email}`} className="flex items-center gap-3"><Mail className="text-gold-500" size={17}/>{SITE.email}</a></li></ul></div>
    </div>
    <div className="border-t border-white/10"><div className="container-shell flex flex-col items-center justify-between gap-4 py-5 text-center text-[11px] text-white/40 sm:flex-row"><p>© ۱۴۰۵ خانه وکیل — تمامی حقوق محفوظ است.</p><div className="flex gap-5"><Link href="/privacy/">حریم خصوصی</Link><Link href="/terms/">شرایط استفاده</Link><Link href="/disclaimer/">سلب مسئولیت</Link></div></div></div>
  </footer>;
}
