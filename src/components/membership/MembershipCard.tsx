'use client';

import { useMemo } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { LogoMark } from '@/components/ui/Logo';
import { generateQrMatrix, qrToSvgPath } from '@/lib/qr';
import { canonicalUrl } from '@/lib/site';
import { SITE } from '@/lib/constants';
import { toFa } from '@/lib/utils';

export type CardData = {
  name: string;
  planName: string;
  memberId: string;
  /** تاریخ اعتبار به شکل نمایشی فارسی */
  validUntil: string;
  role: string;
};

/**
 * کارت دیجیتال عضویت با QR — کاملاً سمت کلاینت تولید می‌شود.
 *
 * QR به صفحهٔ اعتبارسنجی اشاره می‌کند و شناسهٔ عضو را حمل می‌کند. تا وقتی
 * بک‌اندی نداریم، اعتبارسنجی «چشمی» است: پذیرش، QR را می‌خواند و شناسه را
 * با فهرست اعضا تطبیق می‌دهد. با اتصال به Supabase، همان آدرس به یک
 * بررسی واقعی تبدیل می‌شود بدون تغییر در این کامپوننت.
 *
 * ⚠️ کارت پیش از «تأیید دستی دبیرخانه» صادر نمی‌شود؛ این نمایش فقط پیش‌نمایش است.
 */
export function MembershipCard({ data, preview = false }: { data: CardData; preview?: boolean }) {
  const verifyUrl = `${canonicalUrl('/membership/')}?verify=${encodeURIComponent(data.memberId)}`;

  const qr = useMemo(() => {
    // سطح Q انتخاب شده تا کارت حتی با کمی خط‌وخش یا چاپ ضعیف خوانده شود.
    const matrix = generateQrMatrix(verifyUrl, 'Q');
    return qrToSvgPath(matrix, 2);
  }, [verifyUrl]);

  /** دانلود کارت به‌صورت SVG — برداری، سبک و قابل چاپ. */
  const download = () => {
    const svg = document.getElementById('membership-card-svg');
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${source}`], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vokalahome-card-${data.memberId}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* کارت — SVG تا در هر اندازه‌ای تیز بماند و دانلودش ساده باشد. */}
      <svg
        id="membership-card-svg"
        viewBox="0 0 340 214"
        className="w-full max-w-sm rounded-2xl shadow-lift"
        role="img"
        aria-label={`کارت عضویت ${data.name}، شناسهٔ ${data.memberId}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="card-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0B1F3A" />
            <stop offset="65%" stopColor="#081426" />
            <stop offset="100%" stopColor="#1B100A" />
          </linearGradient>
          <pattern id="card-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#C9A227" opacity="0.14" />
          </pattern>
        </defs>

        <rect width="340" height="214" rx="16" fill="url(#card-bg)" />
        <rect width="340" height="214" rx="16" fill="url(#card-dots)" />
        <rect x="0" y="0" width="340" height="3" fill="#C9A227" />

        {/* نشانه و نام مجموعه */}
        <g transform="translate(288 18)">
          <g fill="none" stroke="#C9A227" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" transform="scale(.53)">
            <path d="M5 27.5 32 6l27 21.5" />
            <path d="M12.5 28.5V57h39V28.5" />
            <path d="M10 57h44" />
            <path d="M32 28v4.2" />
            <path d="M18.5 32.2h27" />
            <path d="M14.6 32.2q3.9 7.4 7.8 0" />
            <path d="M42.1 32.2q3.9 7.4 7.8 0" />
            <path d="M24.6 41.6h14.2v5.6a7.1 7.1 0 0 1-14.2 0z" />
            <path d="M38.8 43.2h2.3a3.3 3.3 0 0 1 0 6.6h-2.3" />
          </g>
        </g>
        <text x="278" y="30" textAnchor="end" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="Vazirmatn, Tahoma, sans-serif">
          خانه وکلا
        </text>
        <text x="278" y="44" textAnchor="end" fill="#C9A227" fontSize="7" letterSpacing="1.1" fontFamily="Vazirmatn, Tahoma, sans-serif">
          LAWYERS CLUB &amp; LEGAL CAFÉ
        </text>

        {/* QR */}
        <g transform="translate(20 62)">
          <rect width="72" height="72" rx="8" fill="#FFFFFF" />
          <g transform={`translate(4 4) scale(${64 / qr.size})`}>
            <path d={qr.path} fill="#0B1F3A" />
          </g>
        </g>

        {/* اطلاعات عضو */}
        <text x="320" y="84" textAnchor="end" fill="#8394AD" fontSize="7.5" fontFamily="Vazirmatn, Tahoma, sans-serif">
          نام عضو
        </text>
        <text x="320" y="101" textAnchor="end" fill="#FFFFFF" fontSize="15" fontWeight="800" fontFamily="Vazirmatn, Tahoma, sans-serif">
          {data.name}
        </text>

        <text x="320" y="122" textAnchor="end" fill="#8394AD" fontSize="7.5" fontFamily="Vazirmatn, Tahoma, sans-serif">
          نوع عضویت
        </text>
        <text x="320" y="137" textAnchor="end" fill="#C9A227" fontSize="11" fontWeight="700" fontFamily="Vazirmatn, Tahoma, sans-serif">
          {data.planName}
        </text>

        <text x="320" y="157" textAnchor="end" fill="#8394AD" fontSize="7.5" fontFamily="Vazirmatn, Tahoma, sans-serif">
          اعتبار تا
        </text>
        <text x="320" y="171" textAnchor="end" fill="#ECF0F7" fontSize="10" fontWeight="600" fontFamily="Vazirmatn, Tahoma, sans-serif">
          {data.validUntil}
        </text>

        {/* شناسه */}
        <text x="20" y="150" fill="#8394AD" fontSize="7" letterSpacing="1" fontFamily="monospace">
          MEMBER ID
        </text>
        <text x="20" y="163" fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="1.4" fontFamily="monospace">
          {data.memberId}
        </text>

        {/* نوار پایین */}
        <rect x="0" y="182" width="340" height="32" fill="#000000" opacity="0.28" />
        <text x="20" y="202" fill="#7C8CA6" fontSize="7.5" fontFamily="Vazirmatn, Tahoma, sans-serif">
          {SITE.shortAddress}
        </text>
        <text x="320" y="202" textAnchor="end" fill="#7C8CA6" fontSize="7.5" fontFamily="Vazirmatn, Tahoma, sans-serif">
          {SITE.phone}
        </text>

        {preview && (
          <g>
            <rect x="0" y="0" width="340" height="214" rx="16" fill="#0B1F3A" opacity="0.55" />
            <text
              x="170"
              y="112"
              textAnchor="middle"
              fill="#C9A227"
              fontSize="17"
              fontWeight="900"
              fontFamily="Vazirmatn, Tahoma, sans-serif"
            >
              پیش‌نمایش — منتظر تأیید
            </text>
          </g>
        )}
      </svg>

      {!preview && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={download}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-xs font-black text-ink transition hover:border-gold-500 hover:text-gold-600"
          >
            <Download size={15} aria-hidden />
            دانلود کارت (SVG)
          </button>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-faint">
            <ShieldCheck size={13} aria-hidden />
            QR به صفحهٔ اعتبارسنجی خانه وکلا اشاره می‌کند
          </span>
        </div>
      )}
    </div>
  );
}

/** شناسهٔ عضویت خوانا و یکتا: VH-YY-XXXXX */
export function buildMemberId(seed: number) {
  const year = toFa(new Date().getFullYear() - 621).replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  return `VH-${year.slice(-2)}-${String(seed).padStart(5, '0')}`;
}
