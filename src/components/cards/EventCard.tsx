import { CalendarDays, Clock3, Mic, Ticket, Users } from 'lucide-react';
import type { ClubEvent } from '@/types';
import { Button } from '@/components/ui/Button';

export function EventCard({ event }: { event: ClubEvent }) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:shadow-soft">
      <div className="flex items-center justify-between">
        <span className="rounded-lg bg-navy-900 px-3 py-1.5 text-[10px] font-black text-gold-400">{event.type}</span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400"><Users size={13} />{event.seats}</span>
      </div>
      <h3 className="mt-5 text-lg font-black leading-8 text-navy-900 transition group-hover:text-gold-600">{event.title}</h3>
      <p className="mt-3 text-sm leading-[1.95] text-gray-500">{event.summary}</p>
      <div className="my-5 space-y-2.5 border-y border-gray-100 py-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-2"><CalendarDays size={14} className="text-gold-500" />{event.date}</span>
        <span className="flex items-center gap-2"><Clock3 size={14} className="text-gold-500" />{event.time}</span>
        <span className="flex items-center gap-2"><Mic size={14} className="text-gold-500" />{event.speaker} — {event.speakerRole}</span>
        <span className="flex items-center gap-2"><Ticket size={14} className="text-gold-500" />{event.fee}</span>
      </div>
      <div className="mt-auto"><Button href="/contact/" variant="outline" className="w-full">ثبت‌نام در رویداد</Button></div>
    </article>
  );
}
