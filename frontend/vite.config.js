import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/AI-Pocket-Tutor_Frontend/',
  plugins: [react()],
})
