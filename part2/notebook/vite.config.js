// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps in production builds
  },
  server: {
    sourcemap: true, // Enable source maps in development builds
  },
  test: {
    environment: 'jsdom',
    globals: true,
//With globals: true, there is no need to import keywords such as describe, test and expect into the tests.
    setupFiles: './testSetup.js', 
  }
})
