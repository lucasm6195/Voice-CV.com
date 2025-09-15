import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Asegura que los assets se resuelvan desde la raíz del dominio
  base: '/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // (opcional) ajustes de build explícitos
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
