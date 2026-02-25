/**
 * Auth helper for persona simulation tests.
 * Logs in with dedicated Auth0 account (SIM_AUTH_EMAIL / SIM_AUTH_PASSWORD) for isolated data.
 */
import { Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const SIM_AUTH_STORAGE = path.join(__dirname, '..', 'simulation-auth.json');
const DEBUG = process.env.DEBUG_SIM_AUTH === 'true';

/** Auth0 hostnames: custom domain (auth.prepflow.org) or default (auth0.com) */
const isAuth0Page = (hostname: string) =>
  hostname.includes('auth0.com') || hostname.includes('auth.prepflow.org');

/**
 * Fill Auth0 login form. Handles both single-step (username+password) and two-step (email then Continue, then password) flows.
 */
async function fillAndSubmitAuth0Form(page: Page, email: string, password: string): Promise<void> {
  // Step 1: Find and fill username/email field (Auth0 Universal Login variations)
  const usernameSelectors = [
    'input[name="username"]',
    'input[name="email"]',
    'input[type="email"]',
    'input[id="username"]',
    'input[autocomplete="username"]',
  ].join(', ');
  const usernameInput = page.locator(usernameSelectors).first();
  await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
  await usernameInput.fill(email, { timeout: 5000 });
  await page.waitForTimeout(200); // Allow Auth0 validation to run

  // Check for two-step flow: "Continue" button (password shown after)
  const continueBtn = page.locator(
    'button[type="submit"]:has-text("Continue"), button:has-text("Continue")',
  );
  const hasContinue = (await continueBtn.count()) > 0 && (await continueBtn.isVisible());
  if (hasContinue) {
    await continueBtn.click();
    await page.waitForTimeout(800); // Wait for password step to appear
  }

  // Step 2: Find and fill password
  const passwordInput = page
    .locator('input[name="password"], input[type="password"], input[id="password"]')
    .first();
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await passwordInput.fill(password, { timeout: 5000 });
  await page.waitForTimeout(200);

  // Step 3: Submit (Log in, Sign in, etc.)
  const submitBtn = page
    .locator(
      'button[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Continue")',
    )
    .first();
  await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
  await submitBtn.click();
}

/**
 * Log in with the simulation Auth0 account.
 * Navigates to login, fills Auth0 Universal Login form, waits for redirect to webapp.
 *
 * @param page - Playwright page
 * @returns true if login succeeded, false if credentials not set or login failed
 */
export async function loginWithSimulationAccount(page: Page): Promise<boolean> {
  const email = process.env.SIM_AUTH_EMAIL;
  const password = process.env.SIM_AUTH_PASSWORD;

  if (!email || !password) {
    return false;
  }

  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

  try {
    // Navigate to login with returnTo; Auth0 will redirect to login page
    await page.goto(`${baseURL}/api/auth/login?returnTo=/webapp`, {
      waitUntil: 'load',
      timeout: 25000,
    });

    let currentUrl = page.url();

    // Already on webapp? (cached session)
    if (
      currentUrl.includes('/webapp') ||
      (currentUrl.includes('localhost') && !currentUrl.includes('auth'))
    ) {
      await page.context().storageState({ path: SIM_AUTH_STORAGE });
      return true;
    }

    // Wait for Auth0 redirect if we're still on localhost (redirect in progress)
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      await page.waitForURL(url => isAuth0Page(url.hostname), { timeout: 15000 }).catch(() => null);
      currentUrl = page.url();
    }

    // Verify we're on Auth0 (auth0.com or auth.prepflow.org)
    const urlObj = new URL(currentUrl);
    if (!isAuth0Page(urlObj.hostname)) {
      if (DEBUG) {
        console.error('[SIM_AUTH] Not on Auth0 after login redirect, URL:', currentUrl);
      }
      return false;
    }

    await fillAndSubmitAuth0Form(page, email, password);

    // Wait for redirect: Auth0 callback -> localhost/webapp (or /)
    await page.waitForURL(
      url => {
        const onLocalhost = url.hostname === 'localhost' || url.hostname.startsWith('127.0.0.1');
        const onWebapp = url.pathname.startsWith('/webapp') || url.pathname === '/';
        return onLocalhost && onWebapp;
      },
      { timeout: 45000 },
    );

    // Brief wait for app to finish loading
    await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});

    // Save storage state for reuse
    await page.context().storageState({ path: SIM_AUTH_STORAGE });
    return true;
  } catch (err) {
    if (DEBUG) {
      console.error('[SIM_AUTH] Login failed:', err instanceof Error ? err.message : String(err));

      console.error('[SIM_AUTH] Final URL:', page.url());
    }
    return false;
  }
}

/**
 * Reset current user's data via POST /api/db/reset-self.
 * Requires authenticated session (cookies from loginWithSimulationAccount).
 *
 * @param page - Playwright page (must have valid session)
 * @returns true if reset succeeded
 */
export async function resetSelfData(page: Page): Promise<boolean> {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  const url = `${baseURL}/api/db/reset-self`;

  try {
    const response = await page.request.post(url, {
      headers: { 'Content-Type': 'application/json' },
      data: {},
    });
    return response.ok();
  } catch {
    return false;
  }
}

/**
 * Check if simulation auth storage exists and is usable
 */
export function hasStoredSimulationAuth(): boolean {
  try {
    return fs.existsSync(SIM_AUTH_STORAGE);
  } catch {
    return false;
  }
}
