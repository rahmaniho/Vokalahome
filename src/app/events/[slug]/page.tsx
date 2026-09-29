import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock3, MapPin, MessageCircle, Mic, Phone, Ticket, Users } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { EventCard } from '@/components/cards/EventCard';
import { ShareButtons } from '@/components/interactive/ShareButtons';
import { events, eventCapacity, getEvent } from '@/lib/data/events';
import { buildMetadata, eventSchema, JsonLd } from '@/lib/seo';
import { SITE } from '@/lib/constants';
import { cn, toFa, whatsappLink } from '@/lib/utils';

/** همهٔ مسیرهای رویداد در زمان build ساخته می‌شوند (لازمهٔ output: export). */
export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const event = getEvent(params.slug);
  if (!event) return buildMetadata({ title: 'رویداد یافت نشد', description: '', path: '/events/', noIndex: true });

  return buildMetadata({
    title: `${event.title} | ${event.date}`,
    description: event.summary,
    path: `/events/${event.slug}/`,
    keywords: [event.type, 'رویداد حقوقی', 'خانه وکلا', event.speaker],
  });
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  const capacity = eventCapacity(event);
  const related = events.filter((item) => item.slug !== event.slug && item.type === event.type).slice(0, 3);
  const others = related.length > 0 ? related : events.filter((item) => item.slug !== event.slug).slice(0, 3);

  const registerMessage = `سلام. مایل به ثبت‌نام در رویداد «${event.title}» در تاریخ ${event.date} هستم.`;

  return (
    <>
      <JsonLd
        data={eventSchema({
          slug: event.slug,
          title: event.title,
          summary: event.summary,
          startDate: event.isoStart,
          endDate: event.isoEnd,
          isFree: event.isFree,
        })}
      />

      <PageHero
        eyebrow={event.type}
        title={event.title}
        description={event.summary}
        crumbs={[
          { label: 'رویدادها', href: '/events/' },
          { label: event.title, href: `/events/${event.slug}/` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-2">
          {event.isFree && <Badge tone="success">ورود رایگان</Badge>}
          {capacity.isFull ? (
            <Badge tone="danger" dot>
              تکمیل ظرفیت
            </Badge>
          ) : (
            <Badge tone="gold" dot>
              {toFa(capacity.remaining)} جای خالی از {toFa(event.capacity)}
            </Badge>
          )}
        </div>
      </PageHero>

      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
          {/* محتوا */}
          <div className="min-w-0">
            {event.agenda && event.agenda.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-ink sm:text-2xl">برنامهٔ زمانی</h2>
                <ol className="mt-6 space-y-3">
                  {event.agenda.map((item, index) => (
                    <li key={item.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                      <span className="grid h-11 w-16 shrink-0 place-items-center rounded-xl bg-navy-900 text-xs font-black text-gold-400 dark:bg-navy-800">
                        {item.time}
                      </span>
                      <span className="flex min-w-0 items-center text-sm leading-[1.9] text-ink">
                        {item.title}
                      </span>
                      {index < event.agenda!.length - 1 && <span className="sr-only">سپس</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {event.takeaways && event.takeaways.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-black text-ink sm:text-2xl">با خود چه می‌برید</h2>
                <ul className="mt-6 space-y-3">
                  {event.takeaways.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-[2.05] text-ink-muted">
                      <CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Alert tone="warning" className="mt-10">
              نام سخنران و جزئیات نهایی برنامه پیش از انتشار عمومی، پس از تأیید دبیرخانهٔ علمی به‌روزرسانی می‌شود.
            </Alert>

            <div className="mt-10 border-t border-line pt-7">
              <ShareButtons title={event.title} path={`/events/${event.slug}/`} />
            </div>
          </div>

          {/* ستون کناری */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
              <h2 className="text-sm font-black text-ink">اطلاعات رویداد</h2>

              <dl className="mt-5 space-y-4 text-xs">
                {[
                  [CalendarDays, 'تاریخ', event.date],
                  [Clock3, 'ساعت', event.time],
                  [Mic, 'سخنران', `${event.speaker} — ${event.speakerRole}`],
                  [Ticket, 'هزینه', event.fee],
                  [MapPin, 'مکان', SITE.address],
                ].map(([Icon, label, value]) => {
                  const IconComponent = Icon as typeof CalendarDays;
                  return (
                    <div key={label as string} className="flex gap-3">
                      <IconComponent size={15} className="mt-0.5 shrink-0 text-gold-600" aria-hidden />
                      <div className="min-w-0">
                        <dt className="text-[10px] text-ink-faint">{label as string}</dt>
                        <dd className="mt-0.5 font-bold leading-[1.85] text-ink">{value as string}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>

              {/* ظرفیت */}
              <div className="mt-6 border-t border-line pt-5">
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-ink-muted">
                    <Users size={13} aria-hidden />
                    ثبت‌نام‌شده
                  </span>
                  <b className="text-ink">
                    {toFa(event.registered)} / {toFa(event.capacity)}
                  </b>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-surface-3"
                  role="progressbar"
                  aria-valuenow={capacity.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`ظرفیت تکمیل‌شده: ${capacity.percent} درصد`}
                >
                  <div
                    className={cn(
                      'h-full rounded-full',
                      capacity.isFull ? 'bg-red-500' : capacity.isAlmostFull ? 'bg-amber-500' : 'bg-emerald-500',
                    )}
                    style={{ width: `${capacity.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-ink-faint">
                  {capacity.isFull
                    ? 'ظرفیت تکمیل شده است؛ برای فهرست انتظار تماس بگیرید.'
                    : `${toFa(capacity.remaining)} جای خالی باقی مانده است.`}
                </p>
              </div>

              {/* ثبت‌نام */}
              <div className="mt-6 space-y-2.5">
                <a
                  href={whatsappLink(SITE.whatsappNumber, registerMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-black text-white transition hover:bg-emerald-600"
                >
                  <MessageCircle size={17} aria-hidden />
                  {capacity.isFull ? 'ثبت در فهرست انتظار' : 'ثبت‌نام با واتساپ'}
                </a>
                <a
                  href={SITE.phoneHref}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line text-sm font-black text-ink transition hover:border-gold-500 hover:text-gold-600"
                >
                  <Phone size={16} aria-hidden />
                  تماس با دبیرخانه
                </a>
              </div>

              <p className="mt-4 text-center text-[10px] leading-5 text-ink-faint">
                ثبت‌نام قطعی پس از تأیید دبیرخانه انجام می‌شود. پرداخت آنلاین در این نسخه فعال نیست.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* رویدادهای دیگر */}
      {others.length > 0 && (
        <section className="section-space bg-surface-2">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionTitle eyebrow="ادامه بدهید" title="رویدادهای دیگر" />
              <Link
                href="/events/"
                className="inline-flex min-h-11 items-center text-sm font-black text-ink transition hover:text-gold-600"
              >
                تقویم کامل
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <EventCard event={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
