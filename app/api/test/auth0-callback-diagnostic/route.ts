/**
 * GET /api/test/auth0-callback-diagnostic
 * Diagnostic endpoint to simulate and diagnose callback flow
 *
 * @returns {Promise<NextResponse>} JSON response with callback flow diagnostic information
 */
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Test endpoint to diagnose callback flow issues.
 * Simulates what happens during OAuth callback processing.
 *
 * @returns {Promise<NextResponse>} JSON response with callback flow diagnostic information
 */
export async function GET(req: NextRequest) {
  try {
    // Get current session to check if callback was successful
    const session = await auth0.getSession(req);

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
              image: session.user?.picture,
              roles: (session.user as any)?.roles || [],
            },
            expires: session.tokenSet?.expiresAt
              ? new Date(session.tokenSet.expiresAt * 1000).toISOString()
              : null,
          }
        : {
            exists: false,
            message: 'No session found - callback may have failed or user not logged in',
          },
      callbackFlow: {
        step1: {
          name: 'Auth0 Redirects to Callback',
          url: '/api/auth/callback',
          status: 'expected',
          description: 'Auth0 redirects user to this URL after successful authentication',
        },
        step2: {
          name: 'Auth0 SDK Processes Callback',
          status: session ? 'success' : 'unknown',
          description: 'Auth0 SDK processes the callback and creates session',
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
            'If profile is missing, Auth0 SDK may fail to create session. Check Auth0 user profile configuration.',
          status: session ? 'not_applicable' : 'possible_issue',
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
            'Verify AUTH0_BASE_URL environment variable is set correctly',
          ],
    };

    logger.info('[Auth0 Callback Diagnostic] Diagnostic check completed', {
      sessionExists: !!session,
      userEmail: session?.user?.email || 'no session',
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error('[Auth0 Callback Diagnostic] Diagnostic check failed:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to run callback diagnostic', 'SERVER_ERROR', 500, {
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
}
