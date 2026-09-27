'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { services } from '@/lib/data/services';
import { lawyers } from '@/lib/data/lawyers';
import { articles } from '@/lib/data/articles';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { LawyerCard } from '@/components/cards/LawyerCard';
import { ArticleCard } from '@/components/cards/ArticleCard';

export function ServicesCatalog(){const [term,setTerm]=useState('');const list=services.filter(s=>`${s.title} ${s.description} ${s.subservices.join(' ')}`.includes(term));return <><SearchBox value={term} onChange={setTerm} placeholder="جستجو در خدمات و زیرخدمات..."/><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map((service,index)=><ServiceCard key={service.slug} service={service} index={index}/>)}</div></>}

export function LawyersCatalog(){const cats=['همه',...Array.from(new Set(lawyers.map(l=>l.tags).flat()))];const [cat,setCat]=useState('همه');const list=cat==='همه'?lawyers:lawyers.filter(l=>l.tags.includes(cat));return <><FilterTabs items={cats} active={cat} onChange={setCat}/><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map(lawyer=><LawyerCard key={lawyer.slug} lawyer={lawyer}/>)}</div></>}

export function ArticlesCatalog(){const cats=['همه',...Array.from(new Set(articles.map(a=>a.category)))];const [cat,setCat]=useState('همه');const [term,setTerm]=useState('');const list=useMemo(()=>articles.filter(a=>(cat==='همه'||a.category===cat)&&`${a.title} ${a.excerpt}`.includes(term)),[cat,term]);return <><div className="grid gap-4 lg:grid-cols-[1fr_auto]"><SearchBox value={term} onChange={setTerm} placeholder="جستجو در عنوان و محتوای مقالات..."/><FilterTabs items={cats} active={cat} onChange={setCat}/></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map((article,index)=><ArticleCard key={article.slug} article={article} index={index}/>)}</div>{list.length===0&&<div className="mt-10 rounded-3xl border border-dashed border-gray-200 p-12 text-center text-sm text-gray-400">نتیجه‌ای برای جستجوی شما پیدا نشد.</div>}</>}

function SearchBox({value,onChange,placeholder}:{value:string;onChange:(v:string)=>void;placeholder:string}){return <label className="relative block"><Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={19}/><input value={value} onChange={e=>onChange(e.target.value)} className="form-control h-14 pr-12" placeholder={placeholder}/></label>}
function FilterTabs({items,active,onChange}:{items:string[];active:string;onChange:(v:string)=>void}){return <div className="flex flex-wrap items-center gap-2"><span className="ml-1 text-gray-400"><SlidersHorizontal size={17}/></span>{items.map(item=><button key={item} onClick={()=>onChange(item)} className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${active===item?'bg-navy-900 text-white shadow-lg':'border border-gray-200 bg-white text-gray-500 hover:border-gold-500'}`}>{item}</button>)}</div>}
