import { BASE_PATH } from './site.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. فعال‌سازی خروجی استاتیک (سازگار با GitHub Pages)
  output: 'export',

  // 2. غیرفعال‌سازی بهینه‌سازی تصاویر (الزامی برای استاتیک export)
  images: {
    unoptimized: true,
  },

  // 3. مسیر پایه - از site.config.mjs خوانده می‌شود تا با کل اپ هم‌خوان بماند
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : '',

  // 4. برای جلوگیری از خطای ۴۰۴ در مسیرهای تودرتو روی هاست استاتیک
  trailingSlash: true,

  // 5. در محیط development مسیر پایه غیرفعال باشد (تجربه لوکال ساده‌تر)
  ...(process.env.NODE_ENV === 'development' && {
    basePath: '',
    assetPrefix: '',
  }),
};

export default nextConfig;
