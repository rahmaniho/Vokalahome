'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CalendarCheck2, ChevronLeft, ChevronRight, Clock3, Loader2, ShieldCheck } from 'lucide-react';
import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js';
import { CONSULTATION_TYPES, SITE } from '@/lib/constants';
import { rooms } from '@/lib/data/rooms';
import { holidays, weeklyHolidays } from '@/lib/data/holidays';
import { generateTrackingCode, toFa } from '@/lib/utils';

const monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const weekDays = ['ش','ی','د','س','چ','پ','ج'];
const pad = (v:number) => String(v).padStart(2,'0');
const keyOf = (jy:number,jm:number,jd:number) => `${jy}/${pad(jm)}/${pad(jd)}`;

type Selected = { jy:number; jm:number; jd:number; key:string };

export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const [now] = useState(() => new Date());
  const today = toJalaali(now);
  const [view,setView] = useState({ jy:today.jy, jm:today.jm });
  const [selected,setSelected] = useState<Selected | null>(null);
  const [slot,setSlot] = useState('');
  const [type,setType] = useState('member-room');
  const [loading,setLoading] = useState(false);
  const [tracking,setTracking] = useState('');

  const days = useMemo(() => {
    const length = jalaaliMonthLength(view.jy,view.jm);
    const firstG = toGregorian(view.jy,view.jm,1);
    const firstDay = new Date(firstG.gy,firstG.gm-1,firstG.gd).getDay();
    const offset = (firstDay + 1) % 7; // شنبه = صفر
    return [...Array(offset).fill(null), ...Array.from({length},(_,i)=>i+1)];
  },[view]);

  const status = (day:number) => {
    const key = keyOf(view.jy,view.jm,day);
    const g = toGregorian(view.jy,view.jm,day);
    const date = new Date(g.gy,g.gm-1,g.gd);
    const isPast = date < new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const holiday = weeklyHolidays.includes(date.getDay()) || holidays.some(h => h.date === key);
    const booked = !holiday && day % 9 === 0;
    if (isPast) return 'past'; if (holiday) return 'holiday'; if (booked) return 'booked'; return 'available';
  };

  const moveMonth = (delta:number) => {
    let {jy,jm}=view; jm += delta; if(jm>12){jm=1;jy++} if(jm<1){jm=12;jy--}
    const index=(jy-today.jy)*12+(jm-today.jm); if(index<0||index>3)return;
    setView({jy,jm}); setSelected(null); setSlot('');
  };

  const slots = useMemo(() => {
    if(!selected) return [];
    const output:string[]=[];
    for(let h=8;h<22;h++) for(const m of [0,30]) {
      if(h===13) continue; // بازه استراحت پذیرش
      if((h*2+(m?1:0)+selected.jd)%11===0) continue;
      const g=toGregorian(selected.jy,selected.jm,selected.jd);
      const isToday=g.gy===now.getFullYear()&&g.gm===now.getMonth()+1&&g.gd===now.getDate();
      if(isToday && (h<now.getHours() || (h===now.getHours()&&m<=now.getMinutes()))) continue;
      output.push(`${pad(h)}:${pad(m)}`);
    }
    return output;
  },[selected, now]);

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(!selected||!slot)return;
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const code=generateTrackingCode(); form.set('jalaliDate',selected.key); form.set('timeSlot',slot); form.set('consultationType',type); form.set('trackingCode',code);
    try {
      if(!SITE.formspreeEndpoint.includes('YOUR_FORM_ID')) await fetch(SITE.formspreeEndpoint,{method:'POST',body:form,headers:{Accept:'application/json'}});
      const old=JSON.parse(localStorage.getItem('vokalahome-bookings')||'[]');
      localStorage.setItem('vokalahome-bookings',JSON.stringify([...old,{date:selected.key,time:slot,type,code,createdAt:new Date().toISOString()}]));
      setTracking(code);
    } finally { setLoading(false); }
  }

  if(tracking) return <div className="grid min-h-[480px] place-items-center rounded-[2rem] bg-white p-8 text-center shadow-soft"><div><span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CalendarCheck2 size={36}/></span><h3 className="mt-6 text-2xl font-black text-navy-900">رزرو شما ثبت شد</h3><p className="mt-3 text-sm leading-7 text-gray-500">پذیرش خانه وکلا برای تأیید نهایی زمان و آماده‌سازی اتاق با شما تماس می‌گیرد.</p><div className="mt-6 rounded-2xl bg-navy-900 p-5 text-white"><small className="block text-white/50">کد پیگیری</small><strong className="mt-2 block font-mono text-3xl tracking-[.25em] text-gold-400" dir="ltr">{toFa(tracking)}</strong></div><button onClick={()=>{setTracking('');setSelected(null);setSlot('')}} className="mt-5 text-sm font-bold text-gold-500">رزرو جدید</button></div></div>;

  return <div className={`overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-soft ${compact?'':'lg:grid lg:grid-cols-[1.05fr_.95fr]'}`}>
    <div className="p-5 sm:p-7 lg:p-8">
      <div className="flex items-center justify-between"><button onClick={()=>moveMonth(-1)} className="grid size-9 place-items-center rounded-xl border border-gray-100" aria-label="ماه قبل"><ChevronRight size={17}/></button><div className="text-center"><b className="block text-base text-navy-900">{monthNames[view.jm-1]} {toFa(view.jy)}</b><small className="text-[10px] text-gray-400">یک روز آزاد را انتخاب کنید</small></div><button onClick={()=>moveMonth(1)} className="grid size-9 place-items-center rounded-xl border border-gray-100" aria-label="ماه بعد"><ChevronLeft size={17}/></button></div>
      <div className="mt-6 grid grid-cols-7 gap-1 text-center">{weekDays.map(day=><span key={day} className="py-2 text-[10px] font-bold text-gray-400">{day}</span>)}{days.map((day,index)=> day===null?<span key={`e${index}`}/>:<button key={day} disabled={status(day)!=='available'} onClick={()=>{const key=keyOf(view.jy,view.jm,day);setSelected({jy:view.jy,jm:view.jm,jd:day,key});setSlot('')}} className={`relative aspect-square rounded-xl text-xs font-bold transition ${selected?.jd===day&&selected?.jm===view.jm?'bg-gold-500 text-navy-950 shadow-gold':status(day)==='available'?'bg-emerald-50 text-emerald-700 hover:bg-emerald-100':status(day)==='booked'?'bg-red-50 text-red-300 line-through':'bg-gray-50 text-gray-300'}`} title={status(day)==='holiday'?'تعطیل':status(day)==='booked'?'تکمیل ظرفیت':'آزاد'}>{toFa(day)}{view.jy===today.jy&&view.jm===today.jm&&day===today.jd&&<i className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-blue-500"/>}</button>)}</div>
      <div className="mt-5 flex flex-wrap gap-3 text-[9px] text-gray-500"><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-emerald-500"/>آزاد</span><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-red-400"/>تکمیل</span><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-gray-300"/>تعطیل/گذشته</span><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-blue-500"/>امروز</span></div>
      {selected && <div className="mt-6 border-t border-gray-100 pt-5"><div className="mb-3 flex items-center gap-2 text-xs font-black text-navy-900"><Clock3 size={16} className="text-gold-500"/>ساعت جلسه در {toFa(selected.key)}</div><div className="grid grid-cols-4 gap-2 sm:grid-cols-5">{slots.map(time=><button key={time} onClick={()=>setSlot(time)} className={`rounded-lg border px-2 py-2 text-[11px] font-bold ${slot===time?'border-gold-500 bg-gold-500 text-navy-950':'border-gray-100 text-gray-500 hover:border-gold-500'}`} dir="ltr">{toFa(time)}</button>)}</div></div>}
    </div>
    {!compact && <form onSubmit={submit} className="bg-gray-50/80 p-5 sm:p-7 lg:p-8"><h3 className="text-lg font-black text-navy-900">اطلاعات رزرو</h3><p className="mt-1 text-xs text-gray-400">اطلاعات شما نزد خانه وکلا محرمانه می‌ماند.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label><span className="form-label">نام و نام خانوادگی *</span><input name="name" required className="form-control" placeholder="نام شما"/></label><label><span className="form-label">شماره همراه *</span><input name="phone" required inputMode="tel" dir="ltr" className="form-control text-right" placeholder="09xxxxxxxxx"/></label></div><div className="mt-4"><span className="form-label">نوع رزرو</span><div className="grid grid-cols-3 gap-2">{CONSULTATION_TYPES.map(item=><button type="button" key={item.id} onClick={()=>setType(item.id)} className={`rounded-xl border p-2.5 text-[11px] font-bold ${type===item.id?'border-gold-500 bg-gold-500/10 text-navy-900':'border-gray-200 bg-white text-gray-500'}`}>{item.title.replace('رزرو اتاق ','').replace('مشاوره حقوقی ','مشاوره ')}</button>)}</div></div><label className="mt-4 block"><span className="form-label">فضای موردنظر</span><select name="room" className="form-control">{rooms.map(room=><option key={room.slug}>{room.name}</option>)}</select></label><label className="mt-4 block"><span className="form-label">توضیح کوتاه</span><textarea name="description" rows={3} className="form-control resize-none" placeholder="تعداد مهمانان، نیاز به پذیرایی یا تجهیزات خاص را بنویسید..."/></label><button disabled={!selected||!slot||loading} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 font-black text-white transition hover:bg-gold-500 hover:text-navy-950 disabled:cursor-not-allowed disabled:opacity-40">{loading?<Loader2 className="animate-spin" size={18}/>:<CalendarCheck2 size={18}/>} ثبت رزرو</button><p className="mt-4 flex items-center justify-center gap-1.5 text-[9px] leading-5 text-gray-400"><ShieldCheck size={13}/>ثبت فرم رزرو اولیه است؛ تأیید نهایی پس از تماس پذیرش انجام می‌شود.</p></form>}
  </div>;
}
