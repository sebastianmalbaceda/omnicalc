import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@omnicalc/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@omnicalc/core-math': path.resolve(__dirname, '../../packages/core-math/src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  root: '.',
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
