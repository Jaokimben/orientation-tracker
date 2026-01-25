// Simplified Vite config for Vercel build
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'client', 'src'),
      '@shared': resolve(process.cwd(), 'shared'),
      '@assets': resolve(process.cwd(), 'attached_assets'),
    },
  },
  root: resolve(process.cwd(), 'client'),
  publicDir: resolve(process.cwd(), 'client', 'public'),
  build: {
    outDir: resolve(process.cwd(), 'public'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(process.cwd(), 'client', 'index.html'),
    },
  },
});
