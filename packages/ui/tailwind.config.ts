import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../apps/mobile/app/**/*.{ts,tsx}',
    '../../apps/mobile/components/**/*.{ts,tsx}',
    '../../apps/desktop/renderer/**/*.{ts,tsx}',
  ],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#392cc1',
          50: '#e3dfff',
          100: '#e0deff',
          200: '#c3c0ff',
          300: '#968ff5',
          400: '#6366f1',
          500: '#392cc1',
          600: '#372abf',
          700: '#2d1f9e',
        },
        'primary-container': {
          DEFAULT: '#534ad9',
          dark: '#372abf',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          dark: '#ffffff',
        },
        secondary: {
          DEFAULT: '#4648d4',
          50: '#e1e0ff',
          100: '#c0c1ff',
          400: '#6063ee',
          500: '#4648d4',
        },
        'secondary-container': {
          DEFAULT: '#6063ee',
          dark: '#2f2ebe',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          dark: '#ffffff',
        },
        background: {
          DEFAULT: '#f7f9fb',
          dark: '#0a0a0f',
        },
        surface: {
          DEFAULT: '#f7f9fb',
          dark: '#0a0a0f',
          dim: '#d8dadc',
          'dim-dark': '#0a0a0f',
          bright: '#f7f9fb',
          'bright-dark': '#0a0a0f',
          container: {
            lowest: { DEFAULT: '#ffffff', dark: '#141420' },
            low: { DEFAULT: '#f2f4f6', dark: '#1a1a2e' },
            DEFAULT: { DEFAULT: '#eceef0', dark: '#141420' },
            high: { DEFAULT: '#e6e8ea', dark: '#1e1e32' },
            highest: { DEFAULT: '#e0e3e5', dark: '#252540' },
          },
        },
        'on-surface': {
          DEFAULT: '#191c1e',
          dark: '#e8e8f0',
          variant: { DEFAULT: '#464555', dark: '#a0a0b8' },
        },
        'inverse-surface': { DEFAULT: '#2d3133', dark: '#e8e8f0' },
        'inverse-on-surface': { DEFAULT: '#eff1f3', dark: '#191c1e' },
        'inverse-primary': { DEFAULT: '#c3c0ff', dark: '#392cc1' },
        outline: { DEFAULT: '#777587', dark: '#3d3d5c' },
        'outline-variant': { DEFAULT: '#c7c4d8', dark: '#3d3d5c' },
        error: { DEFAULT: '#ba1a1a', dark: '#f87171' },
        'error-container': { DEFAULT: '#ffdad6', dark: '#93000a' },
        tertiary: { DEFAULT: '#7e3000', dark: '#ffb695' },
        'tertiary-container': { DEFAULT: '#a44100', dark: '#7e3000' },
      },
      fontFamily: {
        headline: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        label: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight: '1.1', fontWeight: '300' }],
        'display-lg': ['36px', { lineHeight: '1.2', fontWeight: '300' }],
        'heading-lg': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-md': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        label: ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        button: ['14px', { lineHeight: '1.0', fontWeight: '600' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.06)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 8px 24px rgba(0,0,0,0.12)',
        xl: '0 16px 48px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
