/**
 * Auth0 Error Messages Configuration
 * Centralized error message definitions for authentication errors
 */

export interface ErrorMessage {
  title: string;
  message: string;
  troubleshooting?: string[];
}

export const errorMessages: Record<string, ErrorMessage> = {
  Configuration: {
    title: 'Configuration Error',
    message:
      'There was a problem with the server configuration. Please contact support if this persists.',
    troubleshooting: [
      'Check that Auth0 environment variables are configured correctly',
      'Verify AUTH0_BASE_URL matches your domain',
      'Check Vercel environment variables',
    ],
  },
  AccessDenied: {
    title: 'Access Denied',
    message:
      "You don't have permission to sign in. Please check your credentials or contact support.",
    troubleshooting: [
      'Verify your email is in the allowlist (if enabled)',
      'Check your Auth0 account permissions',
      'Contact support if you believe this is an error',
    ],
  },
  Verification: {
    title: 'Verification Error',
    message:
      'The verification token has expired or has already been used. Please try signing in again.',
    troubleshooting: [
      'Try signing in again',
      'Clear your browser cookies',
      'Use a different browser',
    ],
  },
  Callback: {
    title: 'Callback Error',
    message:
      'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please contact support.',
    troubleshooting: [
      'Ensure you are accessing via www.prepflow.org (not prepflow.org)',
      'Check Auth0 callback URL configuration',
      'Contact support with this error code',
    ],
  },
  autho: {
    title: 'Authentication Error',
    message:
      'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please contact support.',
    troubleshooting: [
      'Ensure you are accessing via www.prepflow.org',
      'Check Auth0 callback URL configuration',
      'Contact support with this error code',
    ],
  },
  auth0: {
    title: 'Authentication Error',
    message:
      'There was a problem with the authentication callback. This usually means the callback URL is not properly configured in Auth0. Please ensure you are accessing the site via www.prepflow.org (not prepflow.org).',
    troubleshooting: [
      'Ensure you are accessing via www.prepflow.org (not prepflow.org)',
      'Clear your browser cookies and try again',
      'Check Auth0 callback URL configuration',
    ],
  },
  MissingEmail: {
    title: 'Email Missing',
    message:
      "Your account email couldn't be retrieved during authentication. This may be a temporary issue with your identity provider.",
    troubleshooting: [
      'Try signing in again - this is usually a temporary issue',
      'Ensure your Google/Auth0 account has an email address',
      'Check Vercel logs for Management API errors',
      'Contact support if this persists',
    ],
  },
  MissingAccountOrUser: {
    title: 'Account Data Missing',
    message:
      'Required account information is missing during authentication. This may be a temporary issue with Auth0.',
    troubleshooting: [
      'Try signing in again - this is usually a temporary issue',
      'Clear your browser cookies',
      'Check Vercel logs for detailed error information',
      'Contact support if this persists',
    ],
  },
  MissingToken: {
    title: 'Session Token Missing',
    message:
      "Your session token couldn't be retrieved. Please try signing in again to create a new session.",
    troubleshooting: [
      'Try signing in again',
      'Clear your browser cookies',
      'Use a different browser',
      'Contact support if this persists',
    ],
  },
  InvalidCallbackUrl: {
    title: 'Invalid Redirect URL',
    message:
      'The redirect URL after authentication is invalid or unsafe. You have been redirected to the webapp instead.',
    troubleshooting: [
      'This is usually handled automatically',
      'If you see this repeatedly, contact support',
      'Check that callback URLs are configured correctly in Auth0',
    ],
  },
  Default: {
    title: 'Authentication Error',
    message:
      'Something went wrong during sign-in. Give it another go, or reach out if it keeps happening.',
    troubleshooting: [
      'Try signing in again',
      'Clear your browser cookies',
      'Check Vercel logs for detailed error information',
      'Contact support with the error code below',
    ],
  },
};
