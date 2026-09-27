import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';
import type { Article } from '@/types';

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  return <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-soft">
    <Link href={`/articles/${article.slug}/`} className="relative block aspect-[16/10] overflow-hidden bg-navy-900">
      <Image src="/images/articles/legal-editorial.jpg" alt="میز مطالعه حقوقی" fill sizes="(max-width:768px) 100vw, 33vw" className={`object-cover opacity-75 transition duration-700 group-hover:scale-105 ${index % 3 === 1 ? 'object-left' : index % 3 === 2 ? 'object-right' : ''}`}/><span className="absolute inset-0 bg-gradient-to-t from-navy-950/75 to-transparent"/><span className="absolute right-4 top-4 rounded-full bg-gold-500 px-3 py-1.5 text-[10px] font-black text-navy-950">{article.category}</span>
    </Link>
    <div className="p-6"><div className="flex items-center gap-4 text-[10px] text-gray-400"><span>{article.date}</span><span className="flex items-center gap-1"><Clock3 size={12}/>{article.readTime}</span></div><h3 className="mt-3 min-h-[58px] text-lg font-black leading-[1.65] text-navy-900 transition group-hover:text-gold-500"><Link href={`/articles/${article.slug}/`}>{article.title}</Link></h3><p className="mt-3 line-clamp-2 text-xs leading-7 text-gray-500">{article.excerpt}</p><div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-[10px] font-bold text-gray-500">{article.author}</span><Link href={`/articles/${article.slug}/`} aria-label={`مطالعه ${article.title}`} className="text-navy-900 hover:text-gold-500"><ArrowLeft size={17}/></Link></div></div>
  </article>;
}
