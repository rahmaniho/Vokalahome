import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // پالت رسمی برند خانه وکلا — سرمه‌ای/طلایی/خاکستری روشن (طبق راهنمای برند)
        navy: { 950: '#060F1D', 900: '#0B1F3A', 800: '#16294A', 700: '#1F3560' },
        gold: { 500: '#C9A227', 400: '#D3B14A', 300: '#E2C87A', 100: '#F6EACA' },
        ivory: '#F5F6F8',
        coffee: { 950: '#1B100A', 900: '#2B1A12', 700: '#4A2E1E', 500: '#7B4B2A', 300: '#C08B5C', 100: '#F1E4D6' },
        cream: '#FBF6EF',
      },
      fontFamily: { sans: ['Vazirmatn Variable', 'Tahoma', 'sans-serif'] },
      maxWidth: { container: '1240px' },
      boxShadow: {
        soft: '0 20px 60px rgba(11, 19, 43, .09)',
        gold: '0 16px 40px rgba(212, 175, 55, .22)',
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite',
        'pulse-gold': 'pulseGold 2s infinite',
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '0%': { transform: 'translateX(120%) skewX(-20deg)' }, '100%': { transform: 'translateX(-220%) skewX(-20deg)' } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,.35)' }, '50%': { boxShadow: '0 0 0 14px rgba(212,175,55,0)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(50%)' } },
      },
    },
  },
  plugins: [],
};
export default config;
