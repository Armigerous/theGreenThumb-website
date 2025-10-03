import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./lib/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/lib': resolve(__dirname, './lib'),
      '@/components': resolve(__dirname, './components'),
      '@/app': resolve(__dirname, './app'),
    },
  },
})
