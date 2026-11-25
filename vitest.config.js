import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/**/*.test.js'],
    exclude: ['src/tests/FV-001.test.js', 'src/tests/FV-002.test.js', 'src/tests/e2e/**'],
    environment: 'node'
  }
});
