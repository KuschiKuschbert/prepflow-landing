/**
 * Global setup for persona simulation tests.
 * Logs in once with SIM_AUTH_EMAIL/SIM_AUTH_PASSWORD and saves session to e2e/simulation-auth.json.
 * Reduces Auth0 load from 3 logins per run (one per persona) to 1 login per run.
 *
 * - If e2e/simulation-auth.json exists and is < 23h old, skips login (reuses session).
 * - Ensures dev server is running (starts it if needed), then performs Auth0 login.
 * - Leaves server running for Playwright to reuse via reuseExistingServer.
 */
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { chromium, type Page } from '@playwright/test';

const STORAGE_PATH = path.join(process.cwd(), 'e2e', 'simulation-auth.json');
const MAX_AGE_MS = 23 * 60 * 60 * 1000; // 23 hours
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

function loadEnv(): void {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx > 0) {
            const key = trimmed.slice(0, idx).trim();
            const value = trimmed
              .slice(idx + 1)
              .trim()
              .replace(/^["']|["']$/g, '');
            if (!process.env[key]) process.env[key] = value;
          }
        }
      });
  }
}

function isAuth0Page(hostname: string): boolean {
  return hostname.includes('auth0.com') || hostname.includes('auth.prepflow.org');
}

async function waitForServer(timeoutMs = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok || res.status === 404) return true;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

async function maybeStartServer(): Promise<void> {
  const ready = await waitForServer(5000);
  if (ready) return;

  const proc = spawn('npx', ['next', 'dev'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: '3000',
      DISABLE_ALLOWLIST: 'true',
      DISABLE_RATE_LIMIT: 'true',
    },
    stdio: 'ignore',
  });

  const ok = await waitForServer(180000);
  if (!ok) {
    proc.kill();
    throw new Error('Dev server failed to start within 3 minutes');
  }
  // Leave proc running for Playwright to reuse
}

async function fillAndSubmitAuth0Form(page: Page, email: string, password: string): Promise<void> {
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
  await page.waitForTimeout(200);

  const continueBtn = page.locator(
    'button[type="submit"]:has-text("Continue"), button:has-text("Continue")',
  );
  const hasContinue = (await continueBtn.count()) > 0 && (await continueBtn.isVisible());
  if (hasContinue) {
    await continueBtn.click();
    await page.waitForTimeout(800);
  }

  const passwordInput = page
    .locator('input[name="password"], input[type="password"], input[id="password"]')
    .first();
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await passwordInput.fill(password, { timeout: 5000 });
  await page.waitForTimeout(200);

  const submitBtn = page
    .locator(
      'button[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Continue")',
    )
    .first();
  await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
  await submitBtn.click();
}

export default async function globalSetup(): Promise<void> {
  loadEnv();

  const email = process.env.SIM_AUTH_EMAIL;
  const password = process.env.SIM_AUTH_PASSWORD;

  if (!email || !password) {
    return;
  }

  if (fs.existsSync(STORAGE_PATH)) {
    const stat = fs.statSync(STORAGE_PATH);
    if (Date.now() - stat.mtimeMs < MAX_AGE_MS) {
      return;
    }
  }

  await maybeStartServer();

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/api/auth/login?returnTo=/webapp`, {
      waitUntil: 'load',
      timeout: 25000,
    });

    let currentUrl = page.url();

    if (
      currentUrl.includes('/webapp') ||
      (currentUrl.includes('localhost') && !currentUrl.includes('auth'))
    ) {
      await context.storageState({ path: STORAGE_PATH });
      await browser.close();
      return;
    }

    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      await page.waitForURL(url => isAuth0Page(url.hostname), { timeout: 15000 }).catch(() => null);
      currentUrl = page.url();
    }

    const urlObj = new URL(currentUrl);
    if (!isAuth0Page(urlObj.hostname)) {
      await browser.close();
      throw new Error(`Expected Auth0 page, got ${currentUrl}`);
    }

    await fillAndSubmitAuth0Form(page, email, password);

    await page.waitForURL(
      url => {
        const onLocalhost = url.hostname === 'localhost' || url.hostname.startsWith('127.0.0.1');
        const onWebapp = url.pathname.startsWith('/webapp') || url.pathname === '/';
        return onLocalhost && onWebapp;
      },
      { timeout: 45000 },
    );

    await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});

    fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
    await context.storageState({ path: STORAGE_PATH });
  } finally {
    await browser.close();
  }
}
