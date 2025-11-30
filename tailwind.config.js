/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Noto Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        terracotta: {
          DEFAULT: '#c7522a',
          dark: '#8f3a1d',
          light: '#e06b3f',
        },
        indigo: {
          DEFAULT: '#2d3561',
          deep: '#1a1f3a',
          light: '#4a5480',
        },
        saffron: {
          DEFAULT: '#e5a13b',
          light: '#f8c976',
          dark: '#c88920',
        },
        rice: '#f5ebe0',
        stone: '#d5cdc4',
        charcoal: '#2c2c2c',
        ink: '#1a1a1a',
      },
      fontSize: {
        'xs': '0.85rem',
        'sm': '1rem',
        'base': '1.125rem',
        'lg': '1.25rem',
        'xl': '1.4rem',
        '2xl': '1.7rem',
        '3xl': '2.25rem',
        '4xl': '2.8rem',
        '5xl': '4rem',
        '6xl': '5rem',
      },
      maxWidth: {
        'content': '1280px',
      },
      boxShadow: {
        'brutal': '6px 6px 0 #1a1a1a',
        'brutal-sm': '3px 3px 0 #1a1a1a',
        'brutal-lg': '10px 10px 0 #1a1a1a',
        'brutal-hover': '3px 3px 0 #1a1a1a',
      },
      animation: {
        'fade-in': 'fadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-up': 'scaleUp 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};
