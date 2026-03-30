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
          50: '#EEF2FF',
          400: '#6366F1',
          500: '#4648D4',
          600: '#3730A3',
        },
        secondary: {
          400: '#64748B',
          500: '#505F76',
          600: '#3B4A5E',
        },
        tertiary: {
          400: '#10B981',
          500: '#006C49',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          'container-low': '#FAFAFA',
          container: '#F5F5FA',
          'container-high': '#EDEDF3',
          // Dark mode
          dark: '#0A0A0F',
          'dark-container-low': '#1A1A2E',
          'dark-container': '#141420',
          'dark-container-high': '#1E1E32',
        },
        'on-surface': {
          DEFAULT: '#1A1A2A',
          variant: '#505F76',
          // Dark mode
          dark: '#E8E8F0',
          'dark-variant': '#A0A0B8',
        },
        error: {
          DEFAULT: '#DC2626',
        },
        outline: {
          DEFAULT: '#D4D4E0',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
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
        DEFAULT: '16px',
        md: '24px',
        lg: '32px',
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
