import Link from 'next/link';
import { ArrowLeft, UserRound } from 'lucide-react';
import type { Lawyer } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Picture } from '@/components/ui/Picture';

export function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950">
        {lawyer.image ? (
          <Picture
            src={lawyer.image}
            alt={`تصویر ${lawyer.name}`}
            sizes="(max-width: 768px) 100vw, 360px"
            className="size-full"
            imgClassName="object-top transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="persian-pattern grid size-full place-items-center">
            <span className="grid size-24 place-items-center rounded-full border border-gold-500/25 bg-white/5 text-gold-500">
              <UserRound size={42} strokeWidth={1} aria-hidden />
            </span>
          </div>
        )}

        <span className="absolute right-4 top-4">
          <Badge tone="neutral" className="bg-white/90 text-navy-900 ring-0 backdrop-blur dark:bg-navy-950/85 dark:text-white">
            {lawyer.specialty}
          </Badge>
        </span>

        {lawyer.placeholder && (
          <span className="absolute bottom-3 left-3 rounded-lg bg-navy-950/75 px-2.5 py-1 text-[9px] text-white/75 backdrop-blur">
            اطلاعات در انتظار تکمیل
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-black text-ink transition group-hover:text-gold-600 sm:text-lg">
          <Link href={`/lawyers/${lawyer.slug}/`} className="after:absolute after:inset-0">
            {lawyer.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-ink-muted">{lawyer.role}</p>

        <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
          {lawyer.tags.map((tag) => (
            <span key={tag} className="rounded-lg bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-ink-faint">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-xs font-bold text-gold-600 dark:text-gold-400">{lawyer.experience}</span>
          <span className="flex items-center gap-1.5 text-xs font-extrabold text-ink transition group-hover:text-gold-600">
            پروفایل
            <ArrowLeft size={14} aria-hidden className="transition-transform group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
