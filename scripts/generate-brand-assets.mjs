/**
 * ساخت همهٔ دارایی‌های بصری برند از یک منبع واحد.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * خروجی‌ها:
 *   public/favicon.svg              نشانه، قابل استفاده در همهٔ مرورگرهای مدرن
 *   public/brand/logo-mark.svg      فقط نشانه (currentColor)
 *   public/brand/logo-full.svg      نشانه + لوگوتایپ فارسی، برای رسانه‌ها
 *   public/icons/icon-192.png       آیکون PWA
 *   public/icons/icon-512.png       آیکون PWA
 *   public/icons/icon-maskable-512.png  آیکون maskable با حاشیهٔ امن ۲۰٪
 *   public/icons/apple-touch-icon.png   آیکون iOS
 *   public/og-image.jpg             تصویر اشتراک‌گذاری ۱۲۰۰×۶۳۰
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NAVY = '#0B1F3A';
const GOLD = '#C9A227';
const MIST = '#F5F6F8';

const PATHS = [
  'M5 27.5 32 6l27 21.5',
  'M12.5 28.5V57h39V28.5',
  'M10 57h44',
  'M32 28v4.2',
  'M18.5 32.2h27',
  'M14.6 32.2q3.9 7.4 7.8 0',
  'M42.1 32.2q3.9 7.4 7.8 0',
  'M24.6 41.6h14.2v5.6a7.1 7.1 0 0 1-14.2 0z',
  'M38.8 43.2h2.3a3.3 3.3 0 0 1 0 6.6h-2.3',
];

const mark = (stroke, sw = 3.3) =>
  `<g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">` +
  PATHS.map((d) => `<path d="${d}"/>`).join('') +
  '</g>';

const write = (relative, content) => {
  const target = resolve(root, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  console.log('✓', relative);
};

/* ---------------------------------------------------------------- SVG ها */

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${NAVY}"/>
  ${mark(GOLD, 3.6)}
</svg>`;
write('public/favicon.svg', faviconSvg);

write(
  'public/brand/logo-mark.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="نشانهٔ خانه وکلا">${mark('currentColor')}</svg>`,
);

write(
  'public/brand/logo-full.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" role="img" aria-label="خانه وکلا">
  <rect width="320" height="80" fill="none"/>
  <g transform="translate(248 8) scale(1)">${mark(NAVY, 3.6)}</g>
  <text x="228" y="40" text-anchor="end" font-family="Vazirmatn, Tahoma, sans-serif" font-size="30" font-weight="900" fill="${NAVY}">خانه وکلا</text>
  <text x="228" y="62" text-anchor="end" font-family="Vazirmatn, Tahoma, sans-serif" font-size="11" letter-spacing="1.6" fill="${GOLD}">LAWYERS CLUB &amp; LEGAL CAFÉ</text>
</svg>`,
);

/* -------------------------------------------------------------- آیکون‌ها */

const iconSquare = (size, radius, bg, stroke) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
      <rect width="64" height="64" rx="${radius}" fill="${bg}"/>${mark(stroke, 3.6)}</svg>`,
  );

/** آیکون maskable: نشانه داخل ۶۰٪ مرکزی تا هیچ سیستم‌عاملی آن را نبُرد. */
const iconMaskable = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
      <rect width="64" height="64" fill="${NAVY}"/>
      <g transform="translate(32 32) scale(.62) translate(-32 -32)">${mark(GOLD, 3.8)}</g>
    </svg>`,
  );

// PNG با پالت محدود ذخیره می‌شود: نشانه فقط دو رنگ دارد، پس حجم فایل
// از ~۴۰۰KB به چند کیلوبایت می‌رسد بدون کوچک‌ترین افت کیفیت دیداری.
const pngOptions = { palette: true, colours: 16, compressionLevel: 9, effort: 10 };

await sharp(iconSquare(192, 0, NAVY, GOLD), { density: 900 }).png(pngOptions).toFile(resolve(root, 'public/icons/icon-192.png'));
await sharp(iconSquare(512, 0, NAVY, GOLD), { density: 900 }).png(pngOptions).toFile(resolve(root, 'public/icons/icon-512.png'));
await sharp(iconMaskable(512), { density: 900 }).png(pngOptions).toFile(resolve(root, 'public/icons/icon-maskable-512.png'));
await sharp(iconSquare(180, 0, NAVY, GOLD), { density: 900 })
  .png(pngOptions)
  .toFile(resolve(root, 'public/icons/apple-touch-icon.png'));
await sharp(iconSquare(32, 6, NAVY, GOLD), { density: 900 }).png(pngOptions).toFile(resolve(root, 'public/icons/favicon-32.png'));
console.log('✓ public/icons/*.png');

/* ------------------------------------------------------- تصویر og (۱۲۰۰×۶۳۰) */

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B1F3A"/><stop offset="55%" stop-color="#081426"/><stop offset="100%" stop-color="#1B100A"/>
    </linearGradient>
    <radialGradient id="glow" cx="20%" cy="18%" r="55%">
      <stop offset="0" stop-color="${GOLD}" stop-opacity=".22"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="${GOLD}" opacity=".13"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="${GOLD}"/>

  <g transform="translate(952 74) scale(2.55)">${mark(GOLD, 3.4)}</g>

  <text x="1108" y="330" text-anchor="end" font-family="Vazirmatn, Tahoma, sans-serif" font-size="84" font-weight="900" fill="#FFFFFF">خانه وکلا</text>
  <text x="1108" y="392" text-anchor="end" font-family="Vazirmatn, Tahoma, sans-serif" font-size="34" font-weight="700" fill="${GOLD}">باشگاه تخصصی و کافهٔ حقوقی وکلا</text>
  <text x="1108" y="446" text-anchor="end" font-family="Vazirmatn, Tahoma, sans-serif" font-size="25" fill="#A9B6CC">اتاق مشاوره، نشست علمی، عضویت · قزوین، خیابان خیام جنوبی</text>

  <g transform="translate(92 520)">
    <rect x="0" y="0" width="1016" height="1" fill="#FFFFFF" opacity=".12"/>
    <text x="1016" y="44" text-anchor="end" font-family="Vazirmatn, Tahoma, sans-serif" font-size="21" fill="#8394AD">اتاق مشاوره برای اعضا رایگان · مهمان ساعتی ۵۰۰٬۰۰۰ تومان</text>
    <text x="0" y="44" font-family="Vazirmatn, Tahoma, sans-serif" font-size="19" letter-spacing="3" fill="${GOLD}">VOKALAHOME</text>
  </g>
</svg>`;

await sharp(Buffer.from(og), { density: 144 }).jpeg({ quality: 88, mozjpeg: true }).toFile(resolve(root, 'public/og-image.jpg'));
console.log('✓ public/og-image.jpg');

console.log('\nهمهٔ دارایی‌های برند ساخته شد.');
