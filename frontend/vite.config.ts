// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';          // ⬅️  Node core module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),   //  @/something → /src/something
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
