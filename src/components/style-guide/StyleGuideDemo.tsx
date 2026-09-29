'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select, Checkbox, Textarea } from '@/components/ui/Field';

/**
 * بخش‌های تعاملی راهنمای سبک.
 *
 * فقط همین تکه کلاینت-کامپوننت است تا بقیهٔ صفحهٔ راهنما بدون جاوااسکریپت
 * رندر شود و خودش نمونه‌ای از اصلی باشد که در کل سایت رعایت شده است.
 */
export function StyleGuideDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-10">
      {/* فرم */}
      <div>
        <h3 className="mb-5 text-sm font-black text-ink">فیلدهای فرم</h3>
        <div className="grid gap-4 rounded-3xl border border-line bg-surface p-6 sm:grid-cols-2">
          <Input label="حالت عادی" placeholder="نام و نام خانوادگی" hint="راهنمای کوتاه زیر فیلد" />
          <Input label="حالت خطا" placeholder="09xxxxxxxxx" error="شمارهٔ همراه معتبر نیست." />
          <Select
            label="فهرست انتخابی"
            options={[
              { value: 'a', label: 'گزینهٔ نخست' },
              { value: 'b', label: 'گزینهٔ دوم' },
            ]}
          />
          <Input label="غیرفعال" placeholder="قابل ویرایش نیست" disabled />
          <div className="sm:col-span-2">
            <Textarea label="متن چندخطی" rows={3} placeholder="توضیح خود را بنویسید…" />
          </div>
          <div className="sm:col-span-2">
            <Checkbox label="قواعد خانه و سیاست حریم خصوصی را می‌پذیرم." />
          </div>
        </div>
      </div>

      {/* مودال */}
      <div>
        <h3 className="mb-5 text-sm font-black text-ink">پنجرهٔ گفت‌وگو (Modal)</h3>
        <div className="rounded-3xl border border-line bg-surface p-6">
          <Button onClick={() => setOpen(true)} variant="outline">
            باز کردن پنجرهٔ نمونه
          </Button>
          <p className="mt-3 text-xs leading-[1.9] text-ink-faint">
            فوکوس داخل پنجره حبس می‌شود، با Escape بسته می‌شود و پس از بسته شدن فوکوس به همان دکمه برمی‌گردد.
          </p>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="پنجرهٔ نمونه">
        <p className="text-sm leading-[2.05] text-ink-muted">
          این یک پنجرهٔ نمونه است. با کلید Escape، کلیک روی پس‌زمینه یا دکمهٔ بستن می‌توانید آن را ببندید. کلید Tab
          فقط بین عناصر داخل همین پنجره جابه‌جا می‌شود.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => setOpen(false)}>تأیید</Button>
          <Button onClick={() => setOpen(false)} variant="ghost">
            انصراف
          </Button>
        </div>
      </Modal>
    </div>
  );
}
