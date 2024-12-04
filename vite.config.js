import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/medium-network-viz/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      external: ['@emotion/react/jsx-runtime'],
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material', '@mui/icons-material'],
  },
  server: {
    port: 3000,
    open: true,
  },
});