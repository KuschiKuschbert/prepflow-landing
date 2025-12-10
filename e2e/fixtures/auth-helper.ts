import { Page } from '@playwright/test';

/**
 * Check if user is authenticated by looking for auth indicators
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    const url = page.url();

    // If we're on the signin page, we're not authenticated
    if (url.includes('/api/auth/signin') || url.includes('/not-authorized')) {
      return false;
    }

    // If we're in development mode, auth is bypassed (per middleware.ts)
    // Check if we can access webapp pages without redirect
    if (url.includes('/webapp')) {
      // Try to find user info in navigation (desktop only)
      const userInfo = await page
        .locator('[data-testid="user-info"], [aria-label*="user"]')
        .first()
        .isVisible()
        .catch(() => false);
      if (userInfo) {
        return true;
      }

      // Check if we're not redirected to signin
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      if (!currentUrl.includes('/api/auth/signin') && !currentUrl.includes('/not-authorized')) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Authenticate user for testing
 * In development mode, auth is bypassed, so this just ensures we're on the right page
 */
export async function authenticateUser(page: Page): Promise<boolean> {
  try {
    // Check if already authenticated
    if (await isAuthenticated(page)) {
      return true;
    }

    // Navigate to webapp to trigger auth check
    await page.goto('/webapp');
    await page.waitForLoadState('networkidle');

    // Check if redirected to signin
    const url = page.url();
    if (url.includes('/api/auth/signin')) {
      // In development mode, auth should be bypassed
      // If we're here, we might need to handle Auth0 login
      // For now, check if we're in development
      const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

      if (isDevelopment) {
        // Auth should be bypassed in development, but if we're here, something's wrong
        // Try navigating again
        await page.goto('/webapp');
        await page.waitForLoadState('networkidle');
        return await isAuthenticated(page);
      } else {
        // Production mode - need to handle Auth0 login
        // This is complex and would require test credentials
        // For now, return false and let the test handle it
        console.warn('Authentication required but not configured for E2E tests');
        return false;
      }
    }

    // If we're on webapp page, we're authenticated (or auth is bypassed)
    return await isAuthenticated(page);
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

/**
 * Ensure user is authenticated before running a test
 * Call this at the start of tests that require authentication
 */
export async function ensureAuthenticated(page: Page): Promise<void> {
  const authenticated = await authenticateUser(page);
  if (!authenticated) {
    throw new Error('Failed to authenticate user for test');
  }

  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for authentication redirect to complete
 */
export async function waitForAuthRedirect(page: Page, timeout: number = 10000): Promise<boolean> {
  try {
    await page.waitForURL(
      url =>
        !url.pathname.includes('/api/auth/signin') && !url.pathname.includes('/not-authorized'),
      { timeout },
    );
    return true;
  } catch {
    return false;
  }
}



