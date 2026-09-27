import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#070D1E', 900: '#0B132B', 800: '#1A2542', 700: '#253458' },
        gold: { 500: '#D4AF37', 400: '#E5B650', 300: '#F0CD6F', 100: '#FBF3D2' },
        ivory: '#F8F7F3',
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
