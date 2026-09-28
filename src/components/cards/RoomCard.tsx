import { BookOpenCheck, Briefcase, Check, DoorClosed, Maximize2, Presentation, Scale, Users, Video } from 'lucide-react';
import type { Room } from '@/types';
import { Button } from '@/components/ui/Button';

const icons = { DoorClosed, Briefcase, Scale, Video, Presentation, BookOpenCheck };

export function RoomCard({ room }: { room: Room }) {
  const Icon = icons[room.icon as keyof typeof icons] || DoorClosed;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:shadow-soft">
      <span className="pointer-events-none absolute -left-16 -top-16 size-40 rounded-full bg-gold-500/5 transition duration-500 group-hover:scale-150" />
      <div className="relative flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-navy-900 text-gold-400 transition duration-500 group-hover:-rotate-6 group-hover:bg-gold-500 group-hover:text-navy-950"><Icon size={26} strokeWidth={1.6} /></span>
        <span className="rounded-lg bg-coffee-100 px-2.5 py-1 text-[10px] font-bold text-coffee-700">{room.vibe}</span>
      </div>
      <h3 className="relative mt-6 text-lg font-black text-navy-900">{room.name}</h3>
      <p className="relative mt-3 text-sm leading-[1.95] text-gray-500">{room.description}</p>

      <div className="relative my-5 flex items-center gap-4 border-y border-gray-100 py-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5"><Users size={13} />{room.capacity}</span>
        <span className="flex items-center gap-1.5"><Maximize2 size={13} />{room.area}</span>
      </div>

      <ul className="relative space-y-2 text-[11px] text-gray-600">
        {room.equipment.map((item) => <li key={item} className="flex gap-2"><Check size={13} className="mt-0.5 shrink-0 text-gold-500" />{item}</li>)}
      </ul>

      <div className="relative mt-6 grid gap-2 rounded-2xl bg-ivory p-4 text-[11px]">
        <span className="flex items-center justify-between"><span className="text-gray-500">اعضای خانه وکلا</span><b className="text-emerald-600">{room.memberPrice}</b></span>
        <span className="flex items-center justify-between"><span className="text-gray-500">وکلای مهمان</span><b className="text-navy-900">{room.guestPrice}</b></span>
      </div>

      <div className="relative mt-auto pt-6"><Button href="/rooms/#booking" variant="outline" className="w-full">رزرو این فضا</Button></div>
    </article>
  );
}
