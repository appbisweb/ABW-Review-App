/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

// Use standalone Vitest config to avoid Astro experimental features conflicts
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

