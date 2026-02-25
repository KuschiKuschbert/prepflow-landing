/**
 * Playwright config for persona simulation tests.
 * - Runs persona-*.spec.ts only
 * - Uses AUTH0_BYPASS_DEV=true so simulations focus on app workflows, not Auth0 login
 * - globalSetup creates a minimal empty storageState (no real Auth0 session needed)
 * - Extended timeout for long simulations
 */
import { loadEnvConfig } from '@next/env';
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

// Load .env.local so Auth0 vars and SIM_AUTH_* are available for webServer
loadEnvConfig(process.cwd());

// Enable resilient mode for all simulation tests - failures are recorded as faulty paths
// rather than crashing the test, allowing all personas to complete.
process.env.SIM_RESILIENT = 'true';

export default defineConfig({
  ...baseConfig,
  testMatch: ['**/persona-*.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0, // No retries for persona simulations - each test is long, retries waste time
  timeout: 90 * 60 * 1000, // 90 minutes per test - food truck persona has many complex actions
  globalTimeout: 4 * 60 * 60 * 1000, // 4 hours for all 3 personas (overrides base 1-hour limit)
  globalSetup: './e2e/scripts/simulation-global-setup.ts',
  use: {
    ...baseConfig.use,
    storageState: 'e2e/simulation-auth.json',
    headless: true,
    navigationTimeout: 60000, // 60s max for any single navigation (prevents infinite hangs)
    actionTimeout: 30000, // 30s max for any single action
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
      // Bypass Auth0 for simulation - tests focus on app workflows, not login flow
      AUTH0_BYPASS_DEV: 'true',
      AUTH0_BASE_URL: 'http://localhost:3000',
      NEXTAUTH_URL: 'http://localhost:3000',
      // Allow all users to access webapp in simulation
      DISABLE_ALLOWLIST: 'true',
      // Skip rate limiting during simulation (many rapid API calls)
      DISABLE_RATE_LIMIT: 'true',
    },
  },
});
