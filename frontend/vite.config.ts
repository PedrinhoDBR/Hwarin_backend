import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

dotenv.config()

const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
      },
    },
  },
})
