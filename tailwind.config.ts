import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // warm friendly orange/terracotta
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        paw: {
          cream: '#FAF6F0',
          sand: '#F3E9DD',
          caramel: '#E2A85C',
          slate: '#2C3E50',
          rose: '#F87171',
        }
      },
      animation: {
        'scan-line':    'scan 1.8s linear infinite',
        'fade-in':      'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'glow':         'glow 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(300%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1',    transform: 'scale(1)' },
          '50%':      { opacity: '0.92', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(249,115,22,0.3)' },
          '50%':      { boxShadow: '0 0 25px rgba(249,115,22,0.7)' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
