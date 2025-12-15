/**
 * Callback URL Testing Helpers
 * Tests for Auth0 callback URL configuration
 */

import { addTest, type TestResults } from '../test-utils';

/**
 * Test callback URLs in Auth0 application
 */
export function testCallbackURLs(
  results: TestResults,
  app: any,
  auth0BaseUrl: string | undefined,
): void {
  const callbacks = (app.callbacks || []) as string[];
  const expectedCallback = auth0BaseUrl ? `${auth0BaseUrl}/api/auth/callback` : null;
  const expectedCallbackNonWww =
    auth0BaseUrl && auth0BaseUrl.includes('www.')
      ? `${auth0BaseUrl.replace('www.', '')}/api/auth/callback`
      : null;

  if (expectedCallback && callbacks.includes(expectedCallback)) {
    addTest(results, 'Auth0 Callback URL (www)', 'pass', `Found in Auth0: ${expectedCallback}`, {
      callbackUrl: expectedCallback,
    });
  } else if (expectedCallback) {
    addTest(results, 'Auth0 Callback URL (www)', 'fail', `NOT found in Auth0: ${expectedCallback}`, {
      expected: expectedCallback,
      configured: callbacks,
    });
  }

  if (expectedCallbackNonWww && callbacks.includes(expectedCallbackNonWww)) {
    addTest(
      results,
      'Auth0 Callback URL (non-www)',
      'pass',
      `Found in Auth0: ${expectedCallbackNonWww}`,
      { callbackUrl: expectedCallbackNonWww },
    );
  } else if (expectedCallbackNonWww) {
    addTest(
      results,
      'Auth0 Callback URL (non-www)',
      'warning',
      `Not found in Auth0: ${expectedCallbackNonWww}`,
      {
        expected: expectedCallbackNonWww,
        configured: callbacks,
        note: 'Non-www callback recommended but not required if middleware redirects',
      },
    );
  }
}
