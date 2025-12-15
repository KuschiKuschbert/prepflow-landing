/**
 * Diagnostic Helpers for Auth0 Sign-In Flow
 * Helper functions for creating diagnostic objects
 */

export function createDiagnosticStructure() {
  return {
    jwtCallbackTests: {
      missingAccount: {
        description: 'Test JWT callback with missing account',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
      missingUser: {
        description: 'Test JWT callback with missing user',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
      missingEmail: {
        description: 'Test JWT callback with missing email',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
      managementApiTimeout: {
        description: 'Test Management API timeout handling',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
    },
    sessionCallbackTests: {
      missingToken: {
        description: 'Test session callback with missing token',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
      missingEmail: {
        description: 'Test session callback with missing email',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
      expiredToken: {
        description: 'Test session callback with expired token',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
    },
    signInCallbackTests: {
      missingEmail: {
        description: 'Test signIn callback with missing email',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
      managementApiFallback: {
        description: 'Test Management API fallback in signIn callback',
        status: 'not_applicable',
        message: 'Cannot test without actual callback',
      },
    },
    redirectTests: {
      relativeUrl: {
        description: 'Test redirect callback with relative URL',
        status: 'not_applicable',
        message: 'Cannot test without actual redirect',
      },
      externalUrl: {
        description: 'Test redirect callback with external URL',
        status: 'not_applicable',
        message: 'Cannot test without actual redirect',
      },
      invalidUrl: {
        description: 'Test redirect callback with invalid URL',
        status: 'not_applicable',
        message: 'Cannot test without actual redirect',
      },
    },
    managementApiTests: {
      timeout: {
        description: 'Test Management API timeout (5 seconds)',
        status: 'not_applicable',
        message: 'Requires actual Management API call',
      },
      retry: {
        description: 'Test Management API retry logic',
        status: 'not_applicable',
        message: 'Requires actual Management API call',
      },
    },
    recommendations: [],
  };
}
