'use client';

import { useState } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export function StyleGuideForm() {
  return (
    <div className="mt-10 grid max-w-xl gap-5">
      <Input label="نام و نام خانوادگی" placeholder="مثلاً علی کشاورز نجفی" required />
      <Input label="شماره تماس" placeholder="۰۹۱۲xxxxxxx" hint="فقط برای هماهنگی تماس گرفته می‌شود." />
      <Input label="ورودی دارای خطا" defaultValue="نمونهٔ نامعتبر" error="این مقدار معتبر نیست." />
      <Textarea label="توضیحات" placeholder="پیام خود را بنویسید..." />
    </div>
  );
}

export function StyleGuideModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setOpen(true); }}>
        باز کردن نمونهٔ مدال
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="نمونهٔ مدال">
        <p className="text-sm leading-7 text-gray-600">
          این یک نمونهٔ مدال پایه از سیستم طراحی خانه وکلا است؛ برای تأیید رزرو، نمایش کارت عضویت یا پیام موفقیت فرم‌ها استفاده می‌شود.
        </p>
        <Button href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setOpen(false); }} className="mt-6 w-full">
          متوجه شدم
        </Button>
      </Modal>
    </>
  );
}

export function StyleGuideThemeNote() {
  return (
    <div className="mt-8 max-w-2xl">
      <Alert variant="info" title="وضعیت پوشش حالت تاریک">
        دکمهٔ تعویض تم (بالای هدر) و زیرساخت Tailwind (<code dir="ltr">darkMode:&apos;class&apos;</code>) کامل و کار می‌کند؛ ترجیح
        کاربر در localStorage ذخیره و از prefers-color-scheme سیستم هم پیروی می‌شود. پوشش رنگ روی هدر/فوتر/بدنهٔ صفحه اعمال شده؛
        گسترش کامل به تک‌تک کارت‌های داخلی صفحات به‌عنوان یک قدم بعدی در docs/ROADMAP.md فهرست شده تا هیچ صفحه‌ای نیمه‌کاره دیده نشود.
      </Alert>
    </div>
  );
}
