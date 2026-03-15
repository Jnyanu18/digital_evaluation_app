import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../public',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_BACKEND_URL': mode === 'production' 
      ? JSON.stringify('/api') 
      : JSON.stringify('http://localhost:8000/api')
  }
}))
