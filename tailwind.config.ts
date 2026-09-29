import type { Config } from 'tailwindcss';

/**
 * پالت رسمی برند «خانه وکلا»
 * ---------------------------------------------------------------
 *  سرمه‌ای (Navy)      #0B1F3A  → navy-900   رنگ اصلی، اعتماد و اقتدار
 *  طلایی  (Gold)       #C9A227  → gold-500   رنگ تأکید، عدالت و گرمی
 *  خاکستری روشن (Mist) #F5F6F8  → mist-100   بوم صفحه
 *  قهوه‌ای (Coffee)     #7B4B2A  → coffee-500 لهجه کافه
 *
 * رنگ‌های «معنایی» (surface/ink/line) از متغیرهای CSS می‌آیند تا حالت تاریک
 * بدون افزودن prefix «dark:» به تک‌تک کلاس‌ها کار کند. نگاه کنید به globals.css.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ——— رنگ‌های ثابت برند ———
        navy: {
          950: '#050D18',
          900: '#0B1F3A',
          800: '#122E52',
          700: '#1B3F6D',
          600: '#27548C',
          500: '#3A6DAE',
        },
        gold: {
          700: '#7E6416',
          600: '#A3831F',
          500: '#C9A227',
          400: '#D8B84E',
          300: '#E6CE83',
          200: '#F0E1B4',
          100: '#F8F0D8',
        },
        mist: {
          50: '#FAFBFC',
          100: '#F5F6F8',
          200: '#E8EAEF',
          300: '#D5DAE3',
          400: '#AFB7C5',
        },
        coffee: {
          950: '#1B100A',
          900: '#2B1A12',
          700: '#4A2E1E',
          500: '#7B4B2A',
          300: '#C08B5C',
          100: '#F1E4D6',
        },

        // ——— رنگ‌های معنایی (روشن/تاریک خودکار) ———
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted) / <alpha-value>)',
        'ink-faint': 'rgb(var(--ink-faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        // ترتیب مهم است: مرورگر برای هر گلیف اولین خانوادهٔ دارای آن گلیف را
        // برمی‌دارد. زیرمجموعهٔ عربی preload می‌شود، لاتین فقط در صورت نیاز.
        sans: [
          'var(--font-vazirmatn)',
          'var(--font-vazirmatn-latin)',
          'Vazirmatn',
          'Tahoma',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: { container: '1240px', prose: '68ch' },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      boxShadow: {
        soft: '0 18px 50px -12px rgb(11 31 58 / .14)',
        lift: '0 26px 70px -20px rgb(11 31 58 / .28)',
        gold: '0 14px 34px -10px rgb(201 162 39 / .45)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / .08)',
      },
      // انیمیشن‌ها فقط CSS هستند (بدون کتابخانه JS) تا باندل سبک بماند.
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2.4s ease-out infinite',
        marquee: 'marquee 38s linear infinite',
        'fade-up': 'fadeUp .6s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fadeIn .5s ease both',
        'scale-in': 'scaleIn .28s cubic-bezier(.22,1,.36,1) both',
        'slide-in-right': 'slideInRight .32s cubic-bezier(.22,1,.36,1) both',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: {
          '0%': { transform: 'translateX(120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(-240%) skewX(-18deg)' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgb(201 162 39 / .35)' },
          '50%': { boxShadow: '0 0 0 14px rgb(201 162 39 / 0)' },
        },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'none' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(.96)' }, to: { opacity: '1', transform: 'none' } },
        slideInRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
      },
    },
  },
  plugins: [],
};

export default config;
