/**
 * بهینه‌سازی تصاویر برای میزبانی استاتیک.
 *
 *   node scripts/optimize-images.mjs
 *
 * چون روی GitHub Pages هیچ سروری وجود ندارد، بهینه‌ساز تصویر Next کار نمی‌کند.
 * پس همین‌جا و یک‌بار برای همیشه، از هر تصویر منبع تولید می‌کنیم:
 *
 *   • AVIF و WebP در سه عرض (۶۴۰ / ۱۰۲۴ / ۱۶۰۰ پیکسل)
 *   • یک JPEG با کیفیت مناسب به‌عنوان fallback
 *   • یک LQIP کوچک (۲۰ پیکسل، base64) برای جلوگیری از پرش چیدمان
 *   • فایل src/lib/generated/images.ts با ابعاد دقیق هر تصویر
 *
 * نتیجه: مرورگر همیشه سبک‌ترین فرمتی را می‌گیرد که می‌فهمد، و چون
 * width/height از قبل معلوم است، CLS صفر می‌ماند.
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = resolve(root, 'public/images');
const WIDTHS = [640, 1024, 1600];

const walk = (dir, list = []) => {
  if (!existsSync(dir)) return list;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) list.push(full);
  }
  return list;
};

const sources = walk(SOURCE_DIR);
if (sources.length === 0) {
  console.log('هیچ تصویر منبعی در public/images پیدا نشد.');
  process.exit(0);
}

/**
 * با پرچم --if-needed، اگر خروجی از همهٔ منابع تازه‌تر باشد کاری انجام نمی‌دهیم.
 * (کدگذاری AVIF کند است؛ این کار build محلی را چند ده ثانیه سریع‌تر می‌کند.)
 */
const manifestPath = resolve(root, 'src/lib/generated/images.ts');
if (process.argv.includes('--if-needed') && existsSync(manifestPath)) {
  const manifestTime = statSync(manifestPath).mtimeMs;
  const newestSource = Math.max(...sources.map((file) => statSync(file).mtimeMs));
  if (manifestTime >= newestSource) {
    console.log('تصاویر به‌روز هستند؛ بهینه‌سازی رد شد.  (برای اجرای اجباری: npm run images)');
    process.exit(0);
  }
}

/** @type {Record<string, {w:number,h:number,blur:string,widths:number[]}>} */
const manifest = {};
let savedBytes = 0;

for (const file of sources) {
  const key = '/images/' + relative(SOURCE_DIR, file).split(sep).join('/');
  const dir = dirname(file);
  const name = basename(file, extname(file));
  const image = sharp(file);
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const originalSize = statSync(file).size;

  const usableWidths = WIDTHS.filter((candidate) => candidate <= width);
  if (usableWidths.length === 0) usableWidths.push(width);
  // بزرگ‌ترین عرض همیشه خودِ تصویر است تا کیفیت اصلی از دست نرود.
  if (!usableWidths.includes(width) && width < Math.max(...WIDTHS)) usableWidths.push(width);

  let generatedSize = 0;

  for (const targetWidth of usableWidths) {
    const resized = sharp(file).resize({ width: targetWidth, withoutEnlargement: true });

    const webpPath = join(dir, `${name}-${targetWidth}.webp`);
    await resized.clone().webp({ quality: 78, effort: 5 }).toFile(webpPath);
    generatedSize += statSync(webpPath).size;

    const avifPath = join(dir, `${name}-${targetWidth}.avif`);
    await resized.clone().avif({ quality: 52, effort: 4 }).toFile(avifPath);
    generatedSize += statSync(avifPath).size;
  }

  // LQIP: تصویر ۲۰ پیکسلی و بسیار فشرده، مستقیماً داخل HTML به‌صورت base64.
  const blurBuffer = await sharp(file).resize(20).blur(1.2).webp({ quality: 28 }).toBuffer();
  const blur = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  manifest[key] = { w: width, h: height, blur, widths: usableWidths.sort((a, b) => a - b) };
  savedBytes += originalSize - generatedSize / usableWidths.length;

  console.log(
    `✓ ${key}  ${width}×${height}  →  ${usableWidths.length} عرض × ۲ فرمت  (${(originalSize / 1024) | 0}KB منبع)`,
  );
}

const output = `// این فایل به‌صورت خودکار با scripts/optimize-images.mjs ساخته می‌شود.
// دستی ویرایشش نکنید — با اجرای «npm run images» دوباره تولید می‌شود.
//
// w/h        : ابعاد واقعی تصویر منبع، برای رزرو فضا و CLS صفر
// blur       : LQIP بسیار کوچک به‌صورت data URL
// widths     : عرض‌هایی که نسخهٔ WebP/AVIF آن‌ها ساخته شده است

export type ImageMeta = { w: number; h: number; blur: string; widths: number[] };

export const IMAGE_MANIFEST: Record<string, ImageMeta> = ${JSON.stringify(manifest, null, 2)};
`;

const outPath = manifestPath;
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, output, 'utf8');

console.log(`\n✓ src/lib/generated/images.ts (${Object.keys(manifest).length} تصویر)`);
console.log(`صرفه‌جویی تقریبی نسبت به منبع: ${(savedBytes / 1024 / 1024).toFixed(2)} مگابایت`);
