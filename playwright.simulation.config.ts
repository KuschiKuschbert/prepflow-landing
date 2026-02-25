/**
 * Playwright config for persona simulation tests.
 * - Runs persona-*.spec.ts only
 * - Uses real Auth0 (no AUTH0_BYPASS_DEV)
 * - globalSetup logs in once and saves session; personas reuse via storageState
 * - Extended timeout for long simulations
 */
import { loadEnvConfig } from '@next/env';
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

// Load .env.local so Auth0 vars and SIM_AUTH_* are available for webServer
loadEnvConfig(process.cwd());

export default defineConfig({
  ...baseConfig,
  testMatch: ['**/persona-*.spec.ts'],
  fullyParallel: false,
  workers: 1,
  timeout: 600 * 1000,
  globalSetup: './e2e/scripts/simulation-global-setup.ts',
  use: {
    ...baseConfig.use,
    storageState: 'e2e/simulation-auth.json',
    // Headed until simulations are stable (easier to debug DOM detach, selectors, etc.)
    headless: false,
    // Position browser out of the way (bottom-right, compact) so it doesn't cover the whole screen
    launchOptions: {
      args: ['--window-position=1200,400', '--window-size=640,480'],
    },
  },
  webServer: {
    ...baseConfig.webServer,
    // Use simulation-dev-server: runs next dev --webpack with auto-restart on crash
    command: 'node scripts/simulation-dev-server.js',
    reuseExistingServer: false,
    timeout: 180 * 1000,
    env: {
      ...process.env,
      PORT: '3000',
      SIM_AUTH_EMAIL: process.env.SIM_AUTH_EMAIL ?? '',
      SIM_AUTH_PASSWORD: process.env.SIM_AUTH_PASSWORD ?? '',
      AUTH0_BYPASS_DEV: 'false',
      AUTH0_BASE_URL: 'http://localhost:3000',
      NEXTAUTH_URL: 'http://localhost:3000',
      // Allow simulation@prepflow.org to access webapp after login
      DISABLE_ALLOWLIST: 'true',
      // Skip rate limiting during simulation (many rapid API calls)
      DISABLE_RATE_LIMIT: 'true',
    },
  },
});
