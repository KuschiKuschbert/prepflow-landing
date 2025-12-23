/**
 * Auth0 Comprehensive Test Helpers
 * Test execution functions for Auth0 configuration
 */

import { ManagementClient } from 'auth0';
import { testCallbackURLs } from './test-helpers/callback-url-tests';
import { addTest, type TestResults } from './test-utils';
import { logger } from '@/lib/logger';

/**
 * Test environment variables
 */
export function testEnvironmentVariables(results: TestResults): void {
  const auth0BaseUrl = process.env.AUTH0_BASE_URL;
  const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
  const auth0Secret = process.env.AUTH0_SECRET;

  if (!auth0BaseUrl) {
    addTest(results, 'AUTH0_BASE_URL', 'fail', 'AUTH0_BASE_URL is not set');
  } else {
    addTest(results, 'AUTH0_BASE_URL', 'pass', `Set to: ${auth0BaseUrl}`, { url: auth0BaseUrl });
  }

  if (!auth0Issuer) {
    addTest(results, 'AUTH0_ISSUER_BASE_URL', 'fail', 'AUTH0_ISSUER_BASE_URL is not set');
  } else {
    addTest(results, 'AUTH0_ISSUER_BASE_URL', 'pass', `Set to: ${auth0Issuer}`, {
      issuer: auth0Issuer,
    });
  }

  if (!auth0ClientId) {
    addTest(results, 'AUTH0_CLIENT_ID', 'fail', 'AUTH0_CLIENT_ID is not set');
  } else {
    addTest(results, 'AUTH0_CLIENT_ID', 'pass', 'Set correctly', { hasValue: true });
  }

  if (!auth0ClientSecret) {
    addTest(results, 'AUTH0_CLIENT_SECRET', 'fail', 'AUTH0_CLIENT_SECRET is not set');
  } else {
    addTest(results, 'AUTH0_CLIENT_SECRET', 'pass', 'Set correctly', { hasValue: true });
  }

  if (!auth0Secret) {
    addTest(results, 'AUTH0_SECRET', 'fail', 'AUTH0_SECRET is not set');
  } else {
    const secretLength = auth0Secret.length;
    if (secretLength < 32) {
      addTest(
        results,
        'AUTH0_SECRET',
        'warning',
        `Secret is only ${secretLength} characters (recommended: 32+)`,
        { length: secretLength },
      );
    } else {
      addTest(results, 'AUTH0_SECRET', 'pass', `Secret length: ${secretLength} characters`, {
        length: secretLength,
      });
    }
  }
}

/**
 * Test callback URL construction
 */
export function testCallbackUrlConstruction(results: TestResults): void {
  const auth0BaseUrl = process.env.AUTH0_BASE_URL;
  if (auth0BaseUrl) {
    const expectedCallback = `${auth0BaseUrl}/api/auth/callback`;
    addTest(results, 'Callback URL Construction', 'pass', `Expected: ${expectedCallback}`, {
      callbackUrl: expectedCallback,
    });
  }
}

/**
 * Test Auth0 Management API connection and configuration
 */
export async function testManagementAPI(results: TestResults): Promise<void> {
  const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
  const auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
  const auth0BaseUrl = process.env.AUTH0_BASE_URL;

  if (!auth0Issuer || !auth0ClientId || !auth0ClientSecret) {
    addTest(results, 'Auth0 Management API', 'fail', 'Cannot test - missing Auth0 credentials');
    return;
  }

  try {
    const domain = auth0Issuer.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const managementClient = new ManagementClient({
      domain,
      clientId: auth0ClientId,
      clientSecret: auth0ClientSecret,
    });

    const appResponse = await managementClient.clients.get({ client_id: auth0ClientId });
    const app = appResponse.data || (appResponse as any);
    addTest(
      results,
      'Auth0 Management API',
      'pass',
      'Successfully connected to Auth0 Management API',
      {
        applicationName: app.name || 'Unknown',
        applicationId: app.client_id || auth0ClientId,
      },
    );

    // Test callback URLs
    testCallbackURLs(results, app, auth0BaseUrl);

    // Test logout URLs
    const logoutUrls = (app.logout_urls || []) as string[];
    const expectedLogout = auth0BaseUrl || '';
    if (logoutUrls.some((url: string) => url.includes(expectedLogout))) {
      addTest(results, 'Auth0 Logout URL', 'pass', `Found in Auth0: ${expectedLogout}`, {
        logoutUrls,
      });
    } else {
      addTest(results, 'Auth0 Logout URL', 'warning', `Not found in Auth0: ${expectedLogout}`, {
        expected: expectedLogout,
        configured: logoutUrls,
      });
    }

    // Test web origins
    const webOrigins = (app.web_origins || []) as string[];
    const expectedOrigin = auth0BaseUrl || '';
    if (webOrigins.includes(expectedOrigin) || webOrigins.includes('*')) {
      addTest(results, 'Auth0 Web Origins', 'pass', `Found in Auth0: ${expectedOrigin}`, {
        webOrigins,
      });
    } else {
      addTest(results, 'Auth0 Web Origins', 'warning', `Not found in Auth0: ${expectedOrigin}`, {
        expected: expectedOrigin,
        configured: webOrigins,
      });
    }
  } catch (error) {
    logger.error('[test-helpers.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    addTest(results, 'Auth0 Management API', 'fail', 'Failed to connect to Auth0 Management API', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Test URL consistency
 */
export function testURLConsistency(results: TestResults, requestOrigin: string): void {
  const auth0BaseUrl = process.env.AUTH0_BASE_URL;
  if (!auth0BaseUrl || !requestOrigin) return;

  const originUrl = requestOrigin.includes('http') ? requestOrigin : `https://${requestOrigin}`;
  const auth0Host = new URL(auth0BaseUrl).hostname;
  const originHost = originUrl.includes('http') ? new URL(originUrl).hostname : requestOrigin;

  if (
    auth0Host === originHost ||
    originHost.includes(auth0Host) ||
    auth0Host.includes(originHost)
  ) {
    addTest(results, 'URL Consistency', 'pass', 'AUTH0_BASE_URL matches request origin', {
      auth0Host,
      originHost,
    });
  } else {
    addTest(results, 'URL Consistency', 'warning', 'AUTH0_BASE_URL may not match request origin', {
      auth0Host,
      originHost,
      note: 'This may cause callback URL validation issues',
    });
  }
}
