/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. فعال‌سازی خروجی استاتیک
  output: 'export',
  
  // 2. غیرفعال‌سازی بهینه‌سازی تصاویر (الزامی برای استاتیک)
  images: {
    unoptimized: true,
  },
  
  // 3. مسیر پایه - بسیار مهم برای GitHub Pages زیرمسیر
  basePath: '/Vokalahome',
  assetPrefix: '/Vokalahome/',
  
  // 4. برای جلوگیری از خطای ۴۰۴
  trailingSlash: true,
  
  // 5. در محیط development مسیر پایه غیرفعال باشد
  ...(process.env.NODE_ENV === 'development' && {
    basePath: '',
    assetPrefix: '',
  }),
};

export default nextConfig;
