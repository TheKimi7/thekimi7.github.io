import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import markdown from './vite-plugin-markdown.js'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [markdown(), vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
