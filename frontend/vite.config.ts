// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // react-pdf is imported lazily; pre-bundle it so the dev server does not reload the page on first use.
  optimizeDeps: { include: ['@react-pdf/renderer'] },
  server: {
    port: 5173,
    // The app imports ../contracts/simulation_schema.json and ../backend/data/*.json (monorepo).
    fs: { allow: ['..'] },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
