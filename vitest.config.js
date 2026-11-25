import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: '.',
    include: ['src/tests/**/*.test.js'],
    environment: 'jsdom',
    globals: true,
  },
});
