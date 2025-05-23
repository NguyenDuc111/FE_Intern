import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['tmdt1.cholimexfood.com.vn', 'localhost', '192.168.100.133'],
    cors: true,
    hmr: {
      host: 'tmdt1.cholimexfood.com.vn',
      protocol: 'ws',
      port: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // C?ng backend c?a b?n
        changeOrigin: true,
        secure: false,
      },
    },
  },
});