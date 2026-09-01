import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  // GitHub Pages serves this under /Adla-Website/, so its workflow sets
  // VITE_BASE_PATH accordingly. Other hosts (Render, etc.) serve from the
  // domain root, so this defaults to '/' when the env var isn't set.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
