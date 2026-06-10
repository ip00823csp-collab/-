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
        warm: {
          bg: "#FFF9F2",
          cream: "#FFF3E0",
          peach: "#FFE0B2",
          honey: "#FFE8CC",
        },
      },
      fontFamily: {
        display: ['system-ui', '-apple-system', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
      fontSize: {
        'elder': ['1.25rem', { lineHeight: '1.8' }],
        'elder-lg': ['1.5rem', { lineHeight: '1.8' }],
        'elder-xl': ['2rem', { lineHeight: '1.6' }],
        'elder-2xl': ['2.5rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-warm': 'pulseWarm 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(0.6)', opacity: '0.6' },
          '50%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseWarm: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 152, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(255, 152, 0, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
