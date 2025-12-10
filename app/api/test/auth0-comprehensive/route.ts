import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';
import { logger } from '@/lib/logger';
import { authOptions } from '@/lib/auth-options';

/**
 * Comprehensive Auth0 Test Endpoint
 * Tests all aspects of Auth0 configuration and NextAuth integration
 */
export async function GET(request: NextRequest) {
  const results: {
    timestamp: string;
    environment: string;
    tests: Array<{
      name: string;
      status: 'pass' | 'fail' | 'warning';
      message: string;
      details?: any;
    }>;
    summary: {
      total: number;
      passed: number;
      failed: number;
      warnings: number;
    };
  } = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    tests: [],
    summary: { total: 0, passed: 0, failed: 0, warnings: 0 },
  };

  // Helper to add test result
  const addTest = (
    name: string,
    status: 'pass' | 'fail' | 'warning',
    message: string,
    details?: any,
  ) => {
    results.tests.push({ name, status, message, details });
    results.summary.total++;
    if (status === 'pass') results.summary.passed++;
    else if (status === 'fail') results.summary.failed++;
    else results.summary.warnings++;
  };

  try {
    // Test 1: Environment Variables
    logger.info('[Auth0 Test] Starting comprehensive tests...');

    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;
    const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;

    if (!nextAuthUrl) {
      addTest('NEXTAUTH_URL', 'fail', 'NEXTAUTH_URL is not set');
    } else {
      addTest('NEXTAUTH_URL', 'pass', `Set to: ${nextAuthUrl}`, { url: nextAuthUrl });
    }

    if (!auth0Issuer) {
      addTest('AUTH0_ISSUER_BASE_URL', 'fail', 'AUTH0_ISSUER_BASE_URL is not set');
    } else {
      addTest('AUTH0_ISSUER_BASE_URL', 'pass', `Set to: ${auth0Issuer}`, { issuer: auth0Issuer });
    }

    if (!auth0ClientId) {
      addTest('AUTH0_CLIENT_ID', 'fail', 'AUTH0_CLIENT_ID is not set');
    } else {
      addTest('AUTH0_CLIENT_ID', 'pass', 'Set correctly', { hasValue: true });
    }

    if (!auth0ClientSecret) {
      addTest('AUTH0_CLIENT_SECRET', 'fail', 'AUTH0_CLIENT_SECRET is not set');
    } else {
      addTest('AUTH0_CLIENT_SECRET', 'pass', 'Set correctly', { hasValue: true });
    }

    if (!nextAuthSecret) {
      addTest('NEXTAUTH_SECRET', 'fail', 'NEXTAUTH_SECRET is not set');
    } else {
      const secretLength = nextAuthSecret.length;
      if (secretLength < 32) {
        addTest('NEXTAUTH_SECRET', 'warning', `Secret is only ${secretLength} characters (recommended: 32+)`, {
          length: secretLength,
        });
      } else {
        addTest('NEXTAUTH_SECRET', 'pass', `Secret length: ${secretLength} characters`, { length: secretLength });
      }
    }

    // Test 2: Callback URL Construction
    if (nextAuthUrl) {
      const expectedCallback = `${nextAuthUrl}/api/auth/callback/auth0`;
      addTest('Callback URL Construction', 'pass', `Expected: ${expectedCallback}`, {
        callbackUrl: expectedCallback,
      });
    }

    // Test 3: Provider Configuration
    const auth0Provider = authOptions.providers.find((p) => p.id === 'auth0');
    if (!auth0Provider) {
      addTest('Auth0 Provider', 'fail', 'Auth0 provider not found in authOptions');
    } else {
      addTest('Auth0 Provider', 'pass', 'Auth0 provider configured', {
        providerId: auth0Provider.id,
        providerType: auth0Provider.type,
      });

      // Try to access provider internals (may not work due to NextAuth internals)
      try {
        const providerAny = auth0Provider as any;
        const redirectUri = providerAny.authorization?.params?.redirect_uri;
        const callbackURL = providerAny.callbackURL;

        if (redirectUri) {
          addTest('Provider redirect_uri', 'pass', `Set to: ${redirectUri}`, { redirectUri });
        } else {
          addTest('Provider redirect_uri', 'warning', 'Not accessible at runtime (expected)', {
            note: 'NextAuth provider config is not accessible at runtime',
          });
        }

        if (callbackURL) {
          addTest('Provider callbackURL', 'pass', `Set to: ${callbackURL}`, { callbackURL });
        } else {
          addTest('Provider callbackURL', 'warning', 'Not accessible at runtime (expected)', {
            note: 'NextAuth provider config is not accessible at runtime',
          });
        }
      } catch (error) {
        addTest('Provider Config Access', 'warning', 'Cannot access provider internals (expected)', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Test 4: Auth0 Management API Connection
    if (auth0Issuer && auth0ClientId && auth0ClientSecret) {
      try {
        const domain = auth0Issuer.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const managementClient = new ManagementClient({
          domain,
          clientId: auth0ClientId,
          clientSecret: auth0ClientSecret,
        });

        // Test connection by getting application details
        const appResponse = await managementClient.clients.get({ client_id: auth0ClientId });
        const app = appResponse.data || (appResponse as any);
        addTest('Auth0 Management API', 'pass', 'Successfully connected to Auth0 Management API', {
          applicationName: app.name || 'Unknown',
          applicationId: app.client_id || auth0ClientId,
        });

        // Test 5: Verify Callback URLs in Auth0
        const callbacks = (app.callbacks || []) as string[];
        const expectedCallback = nextAuthUrl ? `${nextAuthUrl}/api/auth/callback/auth0` : null;
        const expectedCallbackNonWww = nextAuthUrl && nextAuthUrl.includes('www.')
          ? `${nextAuthUrl.replace('www.', '')}/api/auth/callback/auth0`
          : null;

        if (expectedCallback && callbacks.includes(expectedCallback)) {
          addTest('Auth0 Callback URL (www)', 'pass', `Found in Auth0: ${expectedCallback}`, {
            callbackUrl: expectedCallback,
          });
        } else if (expectedCallback) {
          addTest('Auth0 Callback URL (www)', 'fail', `NOT found in Auth0: ${expectedCallback}`, {
            expected: expectedCallback,
            configured: callbacks,
          });
        }

        if (expectedCallbackNonWww && callbacks.includes(expectedCallbackNonWww)) {
          addTest('Auth0 Callback URL (non-www)', 'pass', `Found in Auth0: ${expectedCallbackNonWww}`, {
            callbackUrl: expectedCallbackNonWww,
          });
        } else if (expectedCallbackNonWww) {
          addTest('Auth0 Callback URL (non-www)', 'warning', `Not found in Auth0: ${expectedCallbackNonWww}`, {
            expected: expectedCallbackNonWww,
            configured: callbacks,
            note: 'Non-www callback recommended but not required if middleware redirects',
          });
        }

        // Test 6: Verify Logout URLs
        const logoutUrls = (app.logout_urls || []) as string[];
        const expectedLogout = nextAuthUrl || '';
        const expectedLogoutNonWww = nextAuthUrl && nextAuthUrl.includes('www.')
          ? nextAuthUrl.replace('www.', '')
          : null;

        if (logoutUrls.some((url: string) => url.includes(expectedLogout))) {
          addTest('Auth0 Logout URL', 'pass', `Found in Auth0: ${expectedLogout}`, {
            logoutUrls,
          });
        } else {
          addTest('Auth0 Logout URL', 'warning', `Not found in Auth0: ${expectedLogout}`, {
            expected: expectedLogout,
            configured: logoutUrls,
          });
        }

        // Test 7: Verify Web Origins
        const webOrigins = (app.web_origins || []) as string[];
        const expectedOrigin = nextAuthUrl || '';
        const expectedOriginNonWww = nextAuthUrl && nextAuthUrl.includes('www.')
          ? nextAuthUrl.replace('www.', '')
          : null;

        if (webOrigins.includes(expectedOrigin) || webOrigins.includes('*')) {
          addTest('Auth0 Web Origins', 'pass', `Found in Auth0: ${expectedOrigin}`, {
            webOrigins,
          });
        } else {
          addTest('Auth0 Web Origins', 'warning', `Not found in Auth0: ${expectedOrigin}`, {
            expected: expectedOrigin,
            configured: webOrigins,
          });
        }
      } catch (error) {
        addTest('Auth0 Management API', 'fail', 'Failed to connect to Auth0 Management API', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      addTest('Auth0 Management API', 'fail', 'Cannot test - missing Auth0 credentials');
    }

    // Test 8: Request Origin Check
    const requestOrigin = request.headers.get('origin') || request.headers.get('host') || 'unknown';
    addTest('Request Origin', 'pass', `Request from: ${requestOrigin}`, { origin: requestOrigin });

    // Test 9: URL Consistency Check
    if (nextAuthUrl && requestOrigin) {
      const originUrl = requestOrigin.includes('http') ? requestOrigin : `https://${requestOrigin}`;
      const nextAuthHost = new URL(nextAuthUrl).hostname;
      const originHost = originUrl.includes('http') ? new URL(originUrl).hostname : requestOrigin;

      if (nextAuthHost === originHost || originHost.includes(nextAuthHost) || nextAuthHost.includes(originHost)) {
        addTest('URL Consistency', 'pass', 'NEXTAUTH_URL matches request origin', {
          nextAuthHost,
          originHost,
        });
      } else {
        addTest('URL Consistency', 'warning', 'NEXTAUTH_URL may not match request origin', {
          nextAuthHost,
          originHost,
          note: 'This may cause callback URL validation issues',
        });
      }
    }

    logger.info('[Auth0 Test] Tests completed', {
      total: results.summary.total,
      passed: results.summary.passed,
      failed: results.summary.failed,
      warnings: results.summary.warnings,
    });

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    logger.error('[Auth0 Test] Error during testing:', error);
    addTest('Test Execution', 'fail', 'Error during test execution', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(results, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
