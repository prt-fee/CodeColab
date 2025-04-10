
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  root: './frontend',
  resolve: {
    alias: {
      '@': resolve(__dirname, './frontend/src'),
    },
  },
  server: {
    port: 8080,
    host: true,
    open: true,
    allowedHosts: ['localhost', '*.lovableproject.com']
  },
  build: {
    outDir: '../dist',
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/database']
  }
}));
