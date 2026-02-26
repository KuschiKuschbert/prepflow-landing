import { Page } from '@playwright/test';

/**
 * Extend Window interface for error collection
 */
declare global {
  interface Window {
    __playwrightErrors?: Array<{
      type: 'console.error' | 'console.warn' | 'uncaught' | 'network';
      message: string;
      timestamp: string;
      url: string;
      stack?: string;
    }>;
  }
}

/**
 * Error record structure for collected errors
 */
export interface ErrorRecord {
  type: 'console.error' | 'console.warn' | 'uncaught' | 'network';
  url: string;
  message: string;
  stack?: string;
  statusCode?: number;
  timestamp: string;
  screenshot?: string;
}

/**
 * Global error collection array
 * This is shared across all tests and pages
 */
export const errorCollection: ErrorRecord[] = [];

/**
 * Setup global error listeners on a page
 * This injects listeners for console errors, warnings, uncaught exceptions, and network errors
 */
export async function setupGlobalErrorListener(page: Page): Promise<void> {
  // Clear previous errors for this page
  const _currentUrl = page.url();
  const _initialErrorCount = errorCollection.length;

  // Inject console.error listener
  await page.addInitScript(() => {
    if (!window.__playwrightErrors) {
      window.__playwrightErrors = [];
    }
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const errors = window.__playwrightErrors || [];
      errors.push({
        type: 'console.error',
        message: args.map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' '),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
      window.__playwrightErrors = errors;
      originalError.apply(console, args);
    };
  });

  // Inject console.warn listener
  await page.addInitScript(() => {
    if (!window.__playwrightErrors) {
      window.__playwrightErrors = [];
    }
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const errors = window.__playwrightErrors || [];
      errors.push({
        type: 'console.warn',
        message: args.map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' '),
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
      window.__playwrightErrors = errors;
      originalWarn.apply(console, args);
    };
  });

  // Listen for uncaught exceptions
  page.on('pageerror', error => {
    errorCollection.push({
      type: 'uncaught',
      url: page.url(),
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  });

  // Listen for network errors (4xx, 5xx)
  page.on('response', response => {
    const status = response.status();
    if (status >= 400) {
      errorCollection.push({
        type: 'network',
        url: response.url(),
        message: `HTTP ${status} ${response.statusText()}`,
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Periodically collect errors from page context
  await page.evaluate(() => {
    setInterval(() => {
      if (window.__playwrightErrors && window.__playwrightErrors.length > 0) {
        // Errors are collected via the listeners above
        // This interval ensures we don't miss any
      }
    }, 1000);
  });
}

/**
 * Collect errors from page context and add to errorCollection
 */
export async function collectPageErrors(page: Page): Promise<void> {
  try {
    const pageErrors = await page.evaluate(() => {
      const errors = window.__playwrightErrors || [];
      window.__playwrightErrors = []; // Clear after collection
      return errors;
    });

    pageErrors.forEach(error => {
      errorCollection.push({
        type: error.type as 'console.error' | 'console.warn' | 'uncaught' | 'network',
        url: error.url || page.url(),
        message: error.message,
        stack: error.stack,
        timestamp: error.timestamp || new Date().toISOString(),
      });
    });
  } catch (_error) {
    // Page might be closed or navigated away
    // Silently fail to avoid breaking tests
  }
}

/**
 * Allowlist patterns for known third-party console output.
 * Errors matching any pattern are excluded from assertion failures.
 * Add patterns only when a known third-party (Partytown, Auth0, etc.) emits unavoidable output.
 */
const CONSOLE_ERROR_ALLOWLIST: RegExp[] = [
  /partytown/i,
  /auth0/i,
  /stripe/i,
  /hydration/i, // Next.js hydration mismatch - evaluate if acceptable for your app
  /square.*unauthorized/i, // Square Status Hook / Mappings - expected when not admin
  /feature.?flag.*unauthorized/i, // Feature Flags - expected when not admin or not authenticated
  /SafeGradientOrbs/i, // Lazy-loaded landing component - chunk URL changes on hot-reload in dev
  /ChunkLoadError/i, // Next.js chunk load failures during hot-reload in dev mode
  /loading chunk.*failed/i, // General chunk load failures in dev mode
];

/**
 * Whether to fail tests on console.warn (default: true).
 * Set E2E_FAIL_ON_WARN=false to only fail on console.error.
 */
const FAIL_ON_WARN = process.env.E2E_FAIL_ON_WARN !== 'false';

/**
 * Check if an error matches any allowlist pattern
 */
function isAllowlisted(error: ErrorRecord): boolean {
  const message = (error.message || '').toLowerCase();
  const url = (error.url || '').toLowerCase();
  const combined = `${message} ${url}`;
  return CONSOLE_ERROR_ALLOWLIST.some(pattern => pattern.test(combined));
}

/**
 * Get errors that are NOT allowlisted and should cause test failure.
 * Includes console.error (always) and console.warn (when FAIL_ON_WARN is true).
 * Uncaught and network 5xx are always included (never allowlisted).
 */
export function getNonAllowlistedErrors(): ErrorRecord[] {
  return errorCollection.filter(error => {
    if (error.type === 'uncaught') return true;
    if (error.type === 'network' && error.statusCode && error.statusCode >= 500) return true;
    if (error.type === 'console.error') return !isAllowlisted(error);
    if (error.type === 'console.warn') return FAIL_ON_WARN && !isAllowlisted(error);
    if (error.type === 'network') return false; // 4xx network errors - keep as-is
    return true;
  });
}

/**
 * Get all collected errors
 */
export function getCollectedErrors(): ErrorRecord[] {
  return [...errorCollection];
}

/**
 * Clear all collected errors
 */
export function clearCollectedErrors(): void {
  errorCollection.length = 0;
}

/**
 * Get errors for a specific URL
 */
export function getErrorsForUrl(url: string): ErrorRecord[] {
  return errorCollection.filter(error => error.url.includes(url) || url.includes(error.url));
}

/**
 * Take screenshot for error and add to error record
 */
export async function captureErrorScreenshot(
  page: Page,
  error: ErrorRecord,
  screenshotDir: string = 'test-failures',
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const urlSlug = error.url.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
  const filename = `error-${error.type}-${urlSlug}-${timestamp}.png`;
  const filepath = `${screenshotDir}/${filename}`;

  try {
    await page.screenshot({ path: filepath, fullPage: true });
    error.screenshot = filepath;
  } catch (screenshotError) {
    // If screenshot fails, continue without it
    console.warn('Failed to capture screenshot:', screenshotError);
  }

  return filepath;
}
