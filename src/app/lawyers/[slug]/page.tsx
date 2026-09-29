import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Award, BadgeCheck, CalendarDays, Clock3, GraduationCap, Mail, Phone, UserRound } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Picture } from '@/components/ui/Picture';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { getLawyer, lawyers } from '@/lib/data/lawyers';
import { articles } from '@/lib/data/articles';
import { SITE } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return lawyers.map((lawyer) => ({ slug: lawyer.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lawyer = getLawyer(params.slug);
  if (!lawyer) return buildMetadata({ title: 'پروفایل یافت نشد', description: '', path: '/lawyers/', noIndex: true });

  return buildMetadata({
    title: `${lawyer.name} | ${lawyer.specialty}`,
    description: `پروفایل ${lawyer.name}، ${lawyer.role} در خانه وکلا قزوین. حوزهٔ تخصص: ${lawyer.specialty}.`,
    path: `/lawyers/${lawyer.slug}/`,
    keywords: [lawyer.name, lawyer.specialty, ...lawyer.tags],
    // پروفایل‌های نمونه نباید ایندکس شوند تا محتوای جای‌نگهدار وارد نتایج جستجو نشود.
    noIndex: lawyer.placeholder,
  });
}

export default function LawyerProfilePage({ params }: { params: { slug: string } }) {
  const lawyer = getLawyer(params.slug);
  if (!lawyer) notFound();

  return (
    <>
      <PageHero
        eyebrow={lawyer.specialty}
        title={
          <>
            {lawyer.name}
            <br />
            <span className="text-gold-400">{lawyer.role}</span>
          </>
        }
        description="آشنایی با سوابق، حوزه‌های تمرکز و زمان‌های مشاوره."
        crumbs={[
          { label: 'وکلای عضو', href: '/lawyers/' },
          { label: lawyer.name, href: `/lawyers/${lawyer.slug}/` },
        ]}
      />

      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-14">
          <aside>
            <div className="relative overflow-hidden rounded-[2rem] border border-line bg-navy-900">
              {lawyer.image ? (
                <Picture
                  src={lawyer.image}
                  alt={`تصویر ${lawyer.name}`}
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="aspect-[4/5]"
                  imgClassName="object-top"
                />
              ) : (
                <div className="persian-pattern grid aspect-[4/5] place-items-center text-gold-500">
                  <UserRound size={90} strokeWidth={0.7} aria-hidden />
                </div>
              )}
              {lawyer.placeholder && (
                <span className="absolute bottom-4 right-4 rounded-lg bg-navy-950/80 px-3 py-2 text-[9px] text-white/60 backdrop-blur">
                  تصویر و اطلاعات در انتظار تکمیل
                </span>
              )}
            </div>

            <div className="mt-4 rounded-3xl border border-line bg-surface p-6">
              <h2 className="text-sm font-black text-ink">راه ارتباط و رزرو</h2>
              <a
                href={SITE.phoneHref}
                className="mt-4 flex min-h-11 items-center gap-3 text-sm text-ink-muted transition hover:text-gold-600"
              >
                <Phone size={17} className="shrink-0 text-gold-600" aria-hidden />
                <span dir="ltr">{SITE.phone}</span>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex min-h-11 items-center gap-3 text-sm text-ink-muted transition hover:text-gold-600"
              >
                <Mail size={17} className="shrink-0 text-gold-600" aria-hidden />
                {SITE.email}
              </a>
              <Button href="/consultation/" className="mt-4 w-full">
                <CalendarDays size={17} aria-hidden />
                رزرو مشاوره
              </Button>
            </div>
          </aside>

          <article className="min-w-0">
            {lawyer.placeholder && (
              <Alert tone="warning" className="mb-8">
                این پروفایل نمونه است. اطلاعات واقعی پس از تکمیل توسط خود عضو و تأیید دبیرخانه جایگزین می‌شود.
              </Alert>
            )}

            <span className="eyebrow">معرفی حرفه‌ای</span>
            <h2 className="mt-4 text-2xl font-black text-ink sm:text-3xl">دربارهٔ {lawyer.name}</h2>
            <div className="prose-fa mt-6">
              <p>{lawyer.bio}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-line bg-surface p-6">
                <GraduationCap className="text-gold-600" aria-hidden />
                <h3 className="mt-4 text-sm font-black text-ink">تحصیلات و عضویت‌ها</h3>
                <ul className="mt-4 space-y-3">
                  {lawyer.education.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-[1.9] text-ink-muted">
                      <BadgeCheck size={15} className="mt-0.5 shrink-0 text-gold-600" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-line bg-surface p-6">
                <Award className="text-gold-600" aria-hidden />
                <h3 className="mt-4 text-sm font-black text-ink">حوزه‌های تمرکز</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {lawyer.tags.map((tag) => (
                    <span key={tag} className="rounded-lg bg-gold-500/10 px-3 py-2 text-xs font-bold text-ink">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-navy-900 p-7 text-white">
              <div className="flex items-center gap-3">
                <Clock3 className="text-gold-500" aria-hidden />
                <h3 className="text-sm font-black">زمان‌های پاسخ‌گویی</h3>
              </div>
              <p className="mt-4 text-sm leading-[1.95] text-white/60">{SITE.workHours} — صرفاً با هماهنگی قبلی</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-space bg-surface-2">
        <div className="container-shell">
          <SectionTitle eyebrow="مطالعهٔ بیشتر" title="مطالب منتخب وبلاگ" />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
