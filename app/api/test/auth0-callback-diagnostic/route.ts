/**
 * GET /api/test/auth0-callback-diagnostic
 * Diagnostic endpoint to simulate and diagnose callback flow
 *
 * @returns {Promise<NextResponse>} JSON response with callback flow diagnostic information
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';

/**
 * Test endpoint to diagnose callback flow issues.
 * Simulates what happens during OAuth callback processing.
 *
 * @returns {Promise<NextResponse>} JSON response with callback flow diagnostic information
 */
export async function GET() {
  try {
    // Get current session to check if callback was successful
    const session = await getServerSession(authOptions);

    // Build diagnostic response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      session: session
        ? {
            exists: true,
            user: {
              email: session.user?.email,
              name: session.user?.name,
              image: session.user?.image,
              roles: (session.user as any)?.roles || [],
            },
            expires: session.expires,
          }
        : {
            exists: false,
            message: 'No session found - callback may have failed or user not logged in',
          },
      callbackFlow: {
        step1: {
          name: 'Auth0 Redirects to Callback',
          url: '/api/auth/callback/auth0',
          status: 'expected',
          description: 'Auth0 redirects user to this URL after successful authentication',
        },
        step2: {
          name: 'NextAuth Processes Callback',
          status: session ? 'success' : 'unknown',
          description: 'NextAuth processes the callback and creates session',
          checks: {
            profileExtraction: session
              ? 'Profile extracted successfully'
              : 'Profile extraction status unknown',
            accountExtraction: session
              ? 'Account extracted successfully'
              : 'Account extraction status unknown',
            signInCallback: session
              ? 'signIn callback returned true'
              : 'signIn callback status unknown',
            sessionCreation: session
              ? 'Session created successfully'
              : 'Session creation failed or not attempted',
          },
        },
        step3: {
          name: 'Redirect to Destination',
          expectedDestination: '/webapp',
          status: session ? 'should_redirect' : 'blocked',
          description: session
            ? 'User should be redirected to /webapp after successful callback'
            : 'Redirect blocked due to callback failure',
        },
      },
      commonIssues: {
        missingProfile: {
          description:
            'If profile is missing, NextAuth redirects to /signin. Management API fallback should handle this.',
          status: session ? 'not_applicable' : 'possible_issue',
        },
        missingAccount: {
          description:
            'If account is missing, NextAuth redirects to /signin. Management API fallback should handle this.',
          status: session ? 'not_applicable' : 'possible_issue',
        },
        signInCallbackBlocked: {
          description:
            'If signIn callback returns false, NextAuth redirects to error page. Our callback always returns true.',
          status: 'not_applicable',
        },
        callbackUrlMismatch: {
          description:
            'If callback URL does not match Auth0 configuration, Auth0 rejects the callback.',
          status: 'check_auth0_dashboard',
        },
      },
      recommendations: session
        ? [
            'Session exists - callback flow is working correctly',
            'If redirect loop occurs, check middleware or client-side redirect logic',
            'Monitor Vercel logs for callback processing errors',
          ]
        : [
            'No session found - callback may have failed',
            'Check Auth0 dashboard for callback URL configuration',
            'Run /api/test/auth0-social-connections to verify Google connection',
            'Run /api/fix/auth0-callback-urls to fix callback URLs',
            'Check Vercel logs for callback processing errors',
            'Verify NEXTAUTH_URL environment variable is set correctly',
          ],
    };

    logger.info('[Auth0 Callback Diagnostic] Diagnostic check completed', {
      sessionExists: !!session,
      userEmail: session?.user?.email,
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error('[Auth0 Callback Diagnostic] Diagnostic check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to run callback diagnostic',
      },
      { status: 500 },
    );
  }
}
