/**
 * تولیدکنندهٔ QR Code — پیاده‌سازی مستقل و بدون وابستگی.
 *
 * چرا دست‌ساز؟ تنها جای استفاده، کارت دیجیتال عضویت است. افزودن یک کتابخانهٔ
 * کامل QR (۱۵ تا ۴۰ کیلوبایت) برای یک قابلیت جانبی، با بودجهٔ عملکرد پروژه
 * جور نبود. این پیاده‌سازی ~۶ کیلوبایت است و فقط در همان صفحه بارگذاری می‌شود.
 *
 * پوشش: QR Model 2، حالت Byte (UTF-8)، سطوح تصحیح خطا L/M/Q/H، نسخهٔ ۱ تا ۲۰،
 * انتخاب خودکار نسخه و انتخاب خودکار بهترین ماسک بر اساس امتیاز جریمهٔ استاندارد.
 *
 * مرجع الگوریتم: ISO/IEC 18004.
 */

export type EcLevel = 'L' | 'M' | 'Q' | 'H';

/** ترتیب سطوح در جداول استاندارد. */
const EC_ORDER: EcLevel[] = ['L', 'M', 'Q', 'H'];

/** تعداد کدواژهٔ تصحیح خطا در هر بلوک — سطر: سطح EC، ستون: نسخه (۱ تا ۲۰). */
const EC_CODEWORDS_PER_BLOCK: Record<EcLevel, number[]> = {
  L: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28],
  M: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26],
  Q: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30],
  H: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28],
};

/** تعداد بلوک‌های تصحیح خطا — سطر: سطح EC، ستون: نسخه (۱ تا ۲۰). */
const EC_BLOCKS: Record<EcLevel, number[]> = {
  L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8],
  M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16],
  Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20],
  H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25],
};

/** مختصات مرکز الگوهای تراز (alignment) برای هر نسخه. */
const ALIGNMENT_POSITIONS: number[][] = [
  [], // v1
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
];

/* ───────────────────────── حساب میدان گالوا GF(256) ───────────────────────── */

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // چندجمله‌ای اولیهٔ استاندارد QR
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

const gfMul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]]);

/** چندجمله‌ای مولد Reed–Solomon با درجهٔ داده‌شده. */
function rsGenerator(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], GF_EXP[i]);
    }
    poly = next;
  }
  return poly;
}

/** کدواژه‌های تصحیح خطای یک بلوک داده. */
function rsEncode(data: Uint8Array, ecLength: number): Uint8Array {
  const generator = rsGenerator(ecLength);
  const result = new Uint8Array(ecLength);
  for (const byte of data) {
    const factor = byte ^ result[0];
    result.copyWithin(0, 1);
    result[ecLength - 1] = 0;
    for (let i = 0; i < ecLength; i++) result[i] ^= gfMul(generator[i + 1], factor);
  }
  return result;
}

/* ───────────────────────────── ظرفیت و نسخه ───────────────────────────── */

/** تعداد کل کدواژه‌های یک نسخه (داده + تصحیح خطا). */
function totalCodewords(version: number): number {
  const size = version * 4 + 17;
  let modules = size * size;
  modules -= 3 * 64; // سه الگوی یاب ۸×۸ (شامل جداکننده)
  modules -= (size - 16) * 2; // دو نوار زمان‌بندی
  const alignCount = ALIGNMENT_POSITIONS[version - 1].length;
  if (alignCount > 0) {
    const aligns = alignCount * alignCount - 3; // سه گوشه با الگوی یاب تداخل دارند
    modules -= aligns * 25;
    modules += (alignCount - 2) * 2 * 5; // بخش‌هایی که با نوار زمان‌بندی مشترک‌اند
  }
  modules -= 31; // اطلاعات فرمت (۳۱ ماژول شامل ماژول تیرهٔ ثابت)
  if (version >= 7) modules -= 36; // اطلاعات نسخه
  return Math.floor(modules / 8);
}

function dataCodewords(version: number, ec: EcLevel): number {
  const blocks = EC_BLOCKS[ec][version - 1];
  const ecPerBlock = EC_CODEWORDS_PER_BLOCK[ec][version - 1];
  return totalCodewords(version) - blocks * ecPerBlock;
}

/* ─────────────────────────────── کدگذاری داده ─────────────────────────────── */

class BitBuffer {
  bits: number[] = [];
  put(value: number, length: number) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
  get length() {
    return this.bits.length;
  }
}

/* ────────────────────────────── ساخت ماتریس ────────────────────────────── */

type Matrix = { size: number; modules: Uint8Array; reserved: Uint8Array };

const idx = (m: Matrix, x: number, y: number) => y * m.size + x;

function setModule(m: Matrix, x: number, y: number, dark: boolean, reserve = true) {
  m.modules[idx(m, x, y)] = dark ? 1 : 0;
  if (reserve) m.reserved[idx(m, x, y)] = 1;
}

function drawFinder(m: Matrix, x: number, y: number) {
  for (let dy = -1; dy <= 7; dy++) {
    for (let dx = -1; dx <= 7; dx++) {
      const px = x + dx;
      const py = y + dy;
      if (px < 0 || py < 0 || px >= m.size || py >= m.size) continue;
      const inOuter = dx >= 0 && dx <= 6 && (dy === 0 || dy === 6);
      const inSide = dy >= 0 && dy <= 6 && (dx === 0 || dx === 6);
      const inCore = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
      setModule(m, px, py, inOuter || inSide || inCore);
    }
  }
}

function drawFunctionPatterns(m: Matrix, version: number) {
  const size = m.size;

  drawFinder(m, 0, 0);
  drawFinder(m, size - 7, 0);
  drawFinder(m, 0, size - 7);

  // نوارهای زمان‌بندی
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0;
    setModule(m, i, 6, dark);
    setModule(m, 6, i, dark);
  }

  // الگوهای تراز
  const positions = ALIGNMENT_POSITIONS[version - 1];
  for (const cy of positions) {
    for (const cx of positions) {
      // سه گوشه‌ای که زیر الگوی یاب می‌افتند رسم نمی‌شوند.
      const nearFinder =
        (cx <= 8 && cy <= 8) || (cx >= size - 9 && cy <= 8) || (cx <= 8 && cy >= size - 9);
      if (nearFinder) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const dark = Math.max(Math.abs(dx), Math.abs(dy)) !== 1;
          setModule(m, cx + dx, cy + dy, dark);
        }
      }
    }
  }

  // رزرو محل اطلاعات فرمت
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      setModule(m, i, 8, false);
      setModule(m, 8, i, false);
    }
  }
  for (let i = 0; i < 8; i++) {
    setModule(m, size - 1 - i, 8, false);
    setModule(m, 8, size - 1 - i, false);
  }
  setModule(m, 8, 6, false);
  setModule(m, 6, 8, false);
  // ماژول تیرهٔ همیشگی
  setModule(m, 8, size - 8, true);

  // اطلاعات نسخه (نسخهٔ ۷ به بالا)
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >>> i) & 1) === 1;
      const a = Math.floor(i / 3);
      const b = (i % 3) + size - 11;
      setModule(m, a, b, dark);
      setModule(m, b, a, dark);
    }
  }
}

/** درج کدواژه‌ها به‌صورت زیگزاگ از پایین‌راست. */
function placeData(m: Matrix, data: Uint8Array) {
  const size = m.size;
  let bitIndex = 0;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // ستون زمان‌بندی نادیده گرفته می‌شود
    for (let step = 0; step < size; step++) {
      const y = upward ? size - 1 - step : step;
      for (let col = 0; col < 2; col++) {
        const x = right - col;
        if (m.reserved[idx(m, x, y)]) continue;
        let dark = false;
        if (bitIndex < data.length * 8) {
          dark = ((data[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) === 1;
        }
        m.modules[idx(m, x, y)] = dark ? 1 : 0;
        bitIndex++;
      }
    }
    upward = !upward;
  }
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function applyMask(m: Matrix, mask: number) {
  const fn = MASKS[mask];
  for (let y = 0; y < m.size; y++) {
    for (let x = 0; x < m.size; x++) {
      if (m.reserved[idx(m, x, y)]) continue;
      if (fn(x, y)) m.modules[idx(m, x, y)] ^= 1;
    }
  }
}

function drawFormatInfo(m: Matrix, ec: EcLevel, mask: number) {
  const ecBits = { L: 1, M: 0, Q: 3, H: 2 }[ec];
  const data = (ecBits << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  const size = m.size;

  for (let i = 0; i <= 5; i++) setModule(m, 8, i, ((bits >>> i) & 1) === 1);
  setModule(m, 8, 7, ((bits >>> 6) & 1) === 1);
  setModule(m, 8, 8, ((bits >>> 7) & 1) === 1);
  setModule(m, 7, 8, ((bits >>> 8) & 1) === 1);
  for (let i = 9; i < 15; i++) setModule(m, 14 - i, 8, ((bits >>> i) & 1) === 1);

  for (let i = 0; i < 8; i++) setModule(m, size - 1 - i, 8, ((bits >>> i) & 1) === 1);
  for (let i = 8; i < 15; i++) setModule(m, 8, size - 15 + i, ((bits >>> i) & 1) === 1);
  setModule(m, 8, size - 8, true);
}

/** امتیاز جریمهٔ استاندارد برای انتخاب بهترین ماسک. */
function penalty(m: Matrix): number {
  const size = m.size;
  const at = (x: number, y: number) => m.modules[idx(m, x, y)];
  let score = 0;

  // قاعدهٔ ۱: پنج ماژول هم‌رنگ پشت سر هم
  for (let y = 0; y < size; y++) {
    let runColor = at(0, y);
    let run = 1;
    for (let x = 1; x < size; x++) {
      if (at(x, y) === runColor) run++;
      else {
        if (run >= 5) score += run - 2;
        runColor = at(x, y);
        run = 1;
      }
    }
    if (run >= 5) score += run - 2;
  }
  for (let x = 0; x < size; x++) {
    let runColor = at(x, 0);
    let run = 1;
    for (let y = 1; y < size; y++) {
      if (at(x, y) === runColor) run++;
      else {
        if (run >= 5) score += run - 2;
        runColor = at(x, y);
        run = 1;
      }
    }
    if (run >= 5) score += run - 2;
  }

  // قاعدهٔ ۲: بلوک‌های ۲×۲ هم‌رنگ
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = at(x, y);
      if (c === at(x + 1, y) && c === at(x, y + 1) && c === at(x + 1, y + 1)) score += 3;
    }
  }

  // قاعدهٔ ۳: الگوی شبیه الگوی یاب (1:1:3:1:1 با فاصلهٔ روشن)
  const pattern = [1, 0, 1, 1, 1, 0, 1];
  const matches = (get: (i: number) => number, start: number, len: number) => {
    for (let i = 0; i < 7; i++) if (get(start + i) !== pattern[i]) return false;
    let blank = true;
    for (let i = start - 4; i < start; i++) if (i >= 0 && get(i) !== 0) blank = false;
    if (blank) return true;
    blank = true;
    for (let i = start + 7; i < start + 11; i++) if (i < len && get(i) !== 0) blank = false;
    return blank;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x <= size - 7; x++) if (matches((i) => at(i, y), x, size)) score += 40;
  }
  for (let x = 0; x < size; x++) {
    for (let y = 0; y <= size - 7; y++) if (matches((i) => at(x, i), y, size)) score += 40;
  }

  // قاعدهٔ ۴: انحراف نسبت ماژول‌های تیره از ۵۰٪
  let dark = 0;
  for (let i = 0; i < m.modules.length; i++) dark += m.modules[i];
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

/* ──────────────────────────────── API عمومی ──────────────────────────────── */

/**
 * ماتریس بولین QR را برمی‌گرداند: `matrix[y][x] === true` یعنی ماژول تیره.
 * @throws اگر متن حتی در نسخهٔ ۲۰ جا نشود.
 */
export function generateQrMatrix(text: string, ec: EcLevel = 'M'): boolean[][] {
  const bytes = new TextEncoder().encode(text);

  // ۱) کوچک‌ترین نسخه‌ای که داده در آن جا می‌شود
  let version = 0;
  for (let candidate = 1; candidate <= 20; candidate++) {
    const capacityBits = dataCodewords(candidate, ec) * 8;
    const countBits = candidate <= 9 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= capacityBits) {
      version = candidate;
      break;
    }
  }
  if (version === 0) throw new Error('متن برای QR بیش از حد بلند است (بیشینه: نسخهٔ ۲۰).');

  // ۲) رشتهٔ بیت‌ها
  const buffer = new BitBuffer();
  buffer.put(0b0100, 4); // حالت Byte
  buffer.put(bytes.length, version <= 9 ? 8 : 16);
  for (const byte of bytes) buffer.put(byte, 8);

  const capacityBits = dataCodewords(version, ec) * 8;
  buffer.put(0, Math.min(4, capacityBits - buffer.length)); // پایان‌دهنده
  while (buffer.length % 8 !== 0) buffer.bits.push(0);

  const codewords: number[] = [];
  for (let i = 0; i < buffer.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | buffer.bits[i + j];
    codewords.push(byte);
  }
  const padBytes = [0xec, 0x11];
  for (let i = 0; codewords.length < capacityBits / 8; i++) codewords.push(padBytes[i % 2]);

  // ۳) تقسیم به بلوک و محاسبهٔ تصحیح خطا
  const blockCount = EC_BLOCKS[ec][version - 1];
  const ecPerBlock = EC_CODEWORDS_PER_BLOCK[ec][version - 1];
  const totalData = codewords.length;
  const shortBlockLength = Math.floor(totalData / blockCount);
  const longBlockCount = totalData % blockCount;

  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;
  for (let i = 0; i < blockCount; i++) {
    const length = shortBlockLength + (i >= blockCount - longBlockCount ? 1 : 0);
    const block = Uint8Array.from(codewords.slice(offset, offset + length));
    offset += length;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, ecPerBlock));
  }

  // ۴) درهم‌بافی بلوک‌ها
  const interleaved: number[] = [];
  const maxDataLength = Math.max(...dataBlocks.map((block) => block.length));
  for (let i = 0; i < maxDataLength; i++) {
    for (const block of dataBlocks) if (i < block.length) interleaved.push(block[i]);
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocks) interleaved.push(block[i]);
  }

  // ۵) رسم ماتریس و انتخاب بهترین ماسک
  const size = version * 4 + 17;
  let best: Matrix | null = null;
  let bestScore = Infinity;

  for (let mask = 0; mask < 8; mask++) {
    const matrix: Matrix = {
      size,
      modules: new Uint8Array(size * size),
      reserved: new Uint8Array(size * size),
    };
    drawFunctionPatterns(matrix, version);
    placeData(matrix, Uint8Array.from(interleaved));
    applyMask(matrix, mask);
    drawFormatInfo(matrix, ec, mask);
    const score = penalty(matrix);
    if (score < bestScore) {
      bestScore = score;
      best = matrix;
    }
  }

  const result = best as Matrix;
  const output: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) row.push(result.modules[idx(result, x, y)] === 1);
    output.push(row);
  }
  return output;
}

/**
 * QR را به‌صورت رشتهٔ SVG برمی‌گرداند.
 * خروجی برداری است، پس در هر اندازه‌ای تیز می‌ماند و برای چاپ هم مناسب است.
 */
export function qrToSvgPath(matrix: boolean[][], quietZone = 4): { path: string; size: number } {
  const size = matrix.length + quietZone * 2;
  let path = '';
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x]) path += `M${x + quietZone},${y + quietZone}h1v1h-1z`;
    }
  }
  return { path, size };
}
