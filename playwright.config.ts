import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Start dev server before running tests
  // Note: Using dev server since Vercel adapter doesn't support preview
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});

