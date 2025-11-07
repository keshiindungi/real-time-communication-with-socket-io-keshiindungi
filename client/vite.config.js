import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Changed from 3000 to 3001
    host: true,
    open: true,
    cors: true,
  }
})