import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Prebundle lucide-react so Vite serves a single optimized module
  // instead of many per-icon files (e.g. icons/fingerprint.js) which
  // some ad/privacy extensions may block by URL pattern.
  optimizeDeps: {
    include: ['lucide-react'],
  },
  // Change dev server port to avoid potential client-side blocking rules
  server: {
    port: 5174,
    // bind to 127.0.0.1 so you can try accessing via 127.0.0.1:5174
    host: '127.0.0.1',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
