import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Check for auth state
const authFile = path.join(__dirname, 'e2e', 'auth.json');
const hasAuth = fs.existsSync(authFile);

/**
 * Playwright E2E Test Configuration
 * See https://playwright.dev/docs/test-configuration
 *
 * System Audit Configuration:
 * - Headless: false (visible browser)
 * - Maximum speed (no slowMo)
 * - Serial execution (1 worker) to avoid database race conditions
 * - Viewport: 1920x1080
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests serially to avoid database race conditions */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Serial execution - 1 worker to avoid DB race conditions */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['./e2e/reporter.ts'], // Custom QA reporter
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
    /* Viewport: 1920x1080 */
    viewport: { width: 1920, height: 1080 },
    /* Headless in CI, visible locally */
    headless: !!process.env.CI,
    /* Load Auth State if available */
    storageState: hasAuth ? authFile : undefined,
    /* Maximum speed - no slowMo */
    // slowMo: 0, // Default is 0, no need to set
  },

  /* Configure projects for major browsers - Only chromium for system audit */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        headless: !!process.env.CI,
      },
    },
    // Commented out for system audit - run only chromium for speed
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //     headless: false,
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 },
    //     headless: false,
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
    env: { ...process.env, PORT: '3000', AUTH0_BYPASS_DEV: 'true' },
  },

  /* Global test timeout - increased for complex workflows */
  timeout: 60 * 1000,
  expect: {
    /* Maximum time expect() should wait for the condition to be met. */
    timeout: 5 * 1000,
  },
  /* Maximum time one test can run for. */
  globalTimeout: 60 * 60 * 1000, // 1 hour for full test suite
});
