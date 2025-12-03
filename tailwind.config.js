/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': {
          DEFAULT: '#006064', // Deep Teal - main color
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#006064', // Base teal
          600: '#004D4F', // Darker teal
          700: '#003A3A', // Even darker teal
          800: '#00292A',
          900: '#001B1B',
        },
        'brand-secondary': {
          DEFAULT: '#B2DFDB', // Soft Aqua
          50: '#FFFFFF',
          100: '#F1F9F8',
          200: '#D8EFEC',
          300: '#B2DFDB', // Base soft aqua
          400: '#8BCDC7',
          500: '#63BBB3',
          600: '#42A59C',
          700: '#357F78',
          800: '#275A55',
          900: '#1A3633',
        },
        'brand-accent': {
          DEFAULT: '#2C96A3', // Turquoise Blue (replacing Amber Gold)
          50: '#E0F5F7',
          100: '#B2E5EA',
          200: '#80D5DD',
          300: '#54C5D0',
          400: '#3BAEBB',
          500: '#2C96A3', // Base turquoise
          600: '#257B86', // Darker turquoise
          700: '#1E606A', // Even darker turquoise
          800: '#17464E',
          900: '#102C32',
        },
        'brand-light': '#F5F8F8', // Slightly cooler ivory
        'brand-dark': '#424242', // Deep Grey for main text
        'text-secondary': {
          DEFAULT: '#757575', // Warm Grey for secondary text on light backgrounds
          light: '#E0E0D9', // Light grey for text on dark backgrounds
        },
        'neutral-bg': {
          DEFAULT: '#F5F5F5', // Light grey background for cards/sections
          alt: '#EDF3F2', // Alternate light background with slight teal tint
          dark: '#E8EFEF', // Darker alt background with more teal tint
        },
        'white': '#FFFFFF',
        'black': '#1A1A1A', // Nearly black
        'success': {
          DEFAULT: '#2E7D32', // A green that complements teal/turquoise
          light: '#E8F5E9',
          dark: '#1B5E20',
        },
        'warning': {
          DEFAULT: '#0277BD', // Blue that complements teal (replacing orange)
          light: '#E1F5FE',
          dark: '#01579B',
        },
        'error': {
          DEFAULT: '#C62828', // Red that works with teal/turquoise
          light: '#FFEBEE',
          dark: '#B71C1C',
        },
        'info': {
          DEFAULT: '#0277BD', // Blue that works with teal
          light: '#E1F5FE',
          dark: '#01579B',
        },
        'gradient': {
          'teal-start': '#26C6DA', // Light teal
          'teal-end': '#004D4F', // Dark teal
          'turquoise-start': '#54C5D0', // Light turquoise
          'turquoise-end': '#1E606A', // Dark turquoise
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 