// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source map generation
  },
  test: {
    environment: 'jsdom',
    globals: true, 
//With globals: true, no need to import keywords such as describe, test and expect into tests.
    setupFiles: './testSetup.js', 
  }
})
