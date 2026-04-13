/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#392cc1',
          50: '#f0eeff',
          100: '#e0dcff',
          200: '#c3c0ff',
          300: '#a6a3ff',
          400: '#8885ff',
          500: '#6b68f0',
          600: '#534ad9',
          700: '#392cc1',
          800: '#2a1f99',
          900: '#1b1470',
        },
        surface: {
          DEFAULT: '#0a0a0f',
          low: '#141420',
          mid: '#1a1a2e',
          high: '#1e1e32',
          highest: '#252540',
        },
      },
      fontFamily: {
        headline: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
