import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 40000,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    launchOptions: existsSync('/usr/bin/google-chrome')
      ? { executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }
      : {},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run start -- --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
