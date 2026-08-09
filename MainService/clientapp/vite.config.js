import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Фронт віддається тим самим .NET-сервісом із wwwroot, тому base = '/'.
// Для локальної розробки (npm run dev) проксі шле /api на бекенд на :8080.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
