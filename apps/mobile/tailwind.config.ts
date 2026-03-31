import type { Config } from 'tailwindcss';
import sharedConfig from '@omnicalc/ui/tailwind';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}', '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'],
  presets: [sharedConfig],
} satisfies Config;
