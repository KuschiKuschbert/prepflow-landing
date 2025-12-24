/**
 * GET /api/test/auth0-signin-flow
 * Comprehensive diagnostic endpoint to test sign-in flow and identify failure points
 *
 * @returns {Promise<NextResponse>} JSON response with diagnostic information
 */
import {
  extractAuth0UserId,
  fetchProfileWithRetry,
  getUserProfileFromManagementAPI,
} from '@/lib/auth0-management';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { createDiagnosticStructure } from './diagnostic-helpers';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Test the complete sign-in flow and identify failure points.
 *
 * @returns {Promise<NextResponse>} JSON response with diagnostic information
 */
export async function GET(req: NextRequest) {
  try {
    const { auth0 } = await import('@/lib/auth0');
    const session = await auth0.getSession(req);
    const diagnostic: any = {
      timestamp: new Date().toISOString(),
      sessionStatus: session ? 'active' : 'inactive',
      session: session
        ? {
            user: {
              email: session.user?.email,
              name: session.user?.name,
              image: session.user?.picture,
              roles: (session.user as any)?.roles || [],
            },
            expiresAt: session.expiresAt,
          }
        : null,
      ...createDiagnosticStructure(),
    };

    // If session exists, test Management API with actual user ID
    if (session?.user?.email) {
      const userSub = session.user.sub;
      if (userSub) {
        const auth0UserId = extractAuth0UserId(userSub);
        if (auth0UserId) {
          diagnostic.managementApiTests.actualUser = {
            description: 'Test Management API with actual user ID',
            status: 'testing',
            userId: auth0UserId,
          };

          try {
            const profile = await getUserProfileFromManagementAPI(auth0UserId);
            if (profile) {
              diagnostic.managementApiTests.actualUser.status = 'success';
              diagnostic.managementApiTests.actualUser.profile = {
                email: profile.email,
                name: profile.name,
                email_verified: profile.email_verified,
              };
            } else {
              diagnostic.managementApiTests.actualUser.status = 'failed';
              diagnostic.managementApiTests.actualUser.message = 'Profile not found';
            }
          } catch (error) {
            logger.error('[route.ts] Error in catch block:', {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            });

            diagnostic.managementApiTests.actualUser.status = 'error';
            diagnostic.managementApiTests.actualUser.error =
              error instanceof Error ? error.message : String(error);
          }

          // Test fetchProfileWithRetry
          try {
            const email = await fetchProfileWithRetry(auth0UserId, session.user.email);
            diagnostic.managementApiTests.retryWithFallback = {
              description: 'Test fetchProfileWithRetry with fallback email',
              status: email ? 'success' : 'failed',
              email: email || 'Not found',
              fallbackUsed: email === session.user.email,
            };
          } catch (error) {
            logger.error('[route.ts] Error in catch block:', {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            });

            diagnostic.managementApiTests.retryWithFallback = {
              status: 'error',
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }
      }
    }

    // Add recommendations based on session status
    if (!session) {
      diagnostic.recommendations.push(
        'No active session - test sign-in flow by navigating to /webapp',
        'Check Vercel logs for JWT callback errors',
        'Check Vercel logs for session callback errors',
        'Check Vercel logs for signIn callback errors',
      );
    } else {
      diagnostic.recommendations.push(
        'Session active - sign-in flow appears to be working',
        'Monitor Vercel logs for any callback errors',
        'Test error scenarios by clearing cookies and signing in again',
      );
    }

    logger.info('[Auth0 SignIn Flow Diagnostic] Check completed', {
      sessionStatus: diagnostic.sessionStatus,
      hasManagementApiTests: !!diagnostic.managementApiTests.actualUser,
    });

    return NextResponse.json(diagnostic);
  } catch (error) {
    logger.error('[Auth0 SignIn Flow Diagnostic] Check failed:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to perform sign-in flow diagnostic check',
        'SERVER_ERROR',
        500,
        {
          details: error instanceof Error ? error.message : String(error),
        },
      ),
      { status: 500 },
    );
  }
}
