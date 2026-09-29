import Link from 'next/link';
import { BookOpenCheck, Briefcase, Check, DoorClosed, Maximize2, Presentation, Scale, Users, Video } from 'lucide-react';
import type { Room } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Picture } from '@/components/ui/Picture';

const ICONS = { DoorClosed, Briefcase, Scale, Video, Presentation, BookOpenCheck };

export function RoomCard({ room }: { room: Room }) {
  const Icon = ICONS[room.icon as keyof typeof ICONS] ?? DoorClosed;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift">
      {room.image && (
        <div className="relative">
          <Picture
            src={room.image}
            alt={`نمای ${room.name}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="aspect-[16/10]"
            imgClassName="transition duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute right-4 top-4">
            <Badge tone="coffee" className="bg-white/90 text-coffee-700 backdrop-blur dark:bg-navy-950/80 dark:text-coffee-300">
              {room.vibe}
            </Badge>
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-400 transition group-hover:bg-gold-500 group-hover:text-navy-900 dark:bg-navy-800">
            <Icon size={21} strokeWidth={1.7} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-black leading-7 text-ink transition group-hover:text-gold-600 sm:text-lg">
              {room.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-3 text-[11px] text-ink-faint">
              <span className="flex items-center gap-1.5">
                <Users size={12} aria-hidden />
                {room.capacity}
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize2 size={12} aria-hidden />
                {room.area}
              </span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-[1.95] text-ink-muted">{room.description}</p>

        <ul className="mt-4 flex-1 space-y-2 text-[11px] text-ink-muted">
          {room.equipment.map((item) => (
            <li key={item} className="flex gap-2">
              <Check size={13} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <dl className="mt-5 grid gap-2 rounded-2xl bg-surface-2 p-4 text-[11px]">
          <div className="flex items-center justify-between">
            <dt className="text-ink-muted">اعضای خانه وکلا</dt>
            <dd className="font-black text-emerald-600 dark:text-emerald-400">{room.memberPrice}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-muted">وکلای مهمان</dt>
            <dd className="font-black text-ink">{room.guestPrice}</dd>
          </div>
        </dl>

        <Link
          href="/consultation/#booking"
          className="mt-5 flex min-h-12 items-center justify-center rounded-xl border border-line text-sm font-black text-ink transition hover:border-gold-500 hover:bg-gold-500 hover:text-navy-900"
        >
          رزرو این فضا
        </Link>
      </div>
    </article>
  );
}
