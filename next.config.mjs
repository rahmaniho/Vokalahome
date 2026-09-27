/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. فعال‌سازی خروجی استاتیک
  output: 'export', 
  
  // 2. غیرفعال‌سازی بهینه‌سازی تصاویر (برای هاست استاتیک الزامی است)
  images: {
    unoptimized: true,
  },
  
  // 3. تنظیم مسیر پایه (اگر سایت را روی دامنه اصلی مثل khanevokala.com منتشر می‌کنید، این خط را کامنت کنید)
  // basePath: '/Vokalahome', 
  // assetPrefix: '/Vokalahome/',

  // 4. برای جلوگیری از خطای ۴۰۴ در صفحات داخلی در GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
