import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import type { Article } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Picture } from '@/components/ui/Picture';

export function ArticleCard({ article }: { article: Article; index?: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-lift">
      {article.image && (
        <div className="relative">
          <Picture
            src={article.image}
            alt=""
            sizes="(max-width: 768px) 100vw, 380px"
            className="aspect-[16/10]"
            imgClassName="transition duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute right-4 top-4">
            <Badge tone="gold" className="bg-gold-500 text-navy-900 ring-0">
              {article.category}
            </Badge>
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {!article.image && (
          <Badge tone="neutral" className="mb-3 self-start">
            {article.category}
          </Badge>
        )}

        <div className="flex items-center gap-4 text-[10px] text-ink-faint">
          <span>{article.date}</span>
          <span className="flex items-center gap-1">
            <Clock3 size={12} aria-hidden />
            {article.readTime}
          </span>
        </div>

        <h3 className="mt-3 text-base font-black leading-[1.75] text-ink transition group-hover:text-gold-600 sm:text-lg">
          <Link href={`/blog/${article.slug}/`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-2 flex-1 text-xs leading-[1.95] text-ink-muted">{article.excerpt}</p>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-[10px] font-bold text-ink-faint">{article.author}</span>
          <ArrowLeft
            size={17}
            aria-hidden
            className="text-ink transition-transform group-hover:-translate-x-1 group-hover:text-gold-600"
          />
        </div>
      </div>
    </article>
  );
}
