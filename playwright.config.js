import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests',
  testMatch: ['**/FV-001.test.js', '**/FV-002.test.js', '**/e2e/**/*.test.js'],
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4173',
    headless: true
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
