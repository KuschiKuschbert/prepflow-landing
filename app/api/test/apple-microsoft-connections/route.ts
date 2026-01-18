import { NextResponse } from 'next/server';
import {
  verifyAppleConnection,
  verifyMicrosoftConnection,
  enableAppleConnectionForApp,
  enableMicrosoftConnectionForApp,
} from '@/lib/auth0-apple-microsoft-connection';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Check Apple and Microsoft connection status
 */
export async function GET() {
  try {
    const appleEnabled = await verifyAppleConnection();
    const microsoftEnabled = await verifyMicrosoftConnection();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      apple: {
        enabled: appleEnabled,
        status: appleEnabled ? 'enabled' : 'disabled_or_misconfigured',
        message: appleEnabled
          ? 'Apple connection is enabled and configured correctly'
          : 'Apple connection is not enabled or misconfigured',
      },
      microsoft: {
        enabled: microsoftEnabled,
        status: microsoftEnabled ? 'enabled' : 'disabled_or_misconfigured',
        message: microsoftEnabled
          ? 'Microsoft connection is enabled and configured correctly'
          : 'Microsoft connection is not enabled or misconfigured',
      },
      troubleshooting: {
        apple: appleEnabled
          ? {}
          : {
              steps: [
                '1. Navigate to Auth0 Dashboard > Connections > Social',
                '2. Click on Apple connection (or create it if it does not exist)',
                '3. Configure Apple OAuth credentials (Client ID, Client Secret, Key ID, Team ID)',
                '4. Ensure the connection is enabled for your application',
                '5. Run POST /api/test/apple-microsoft-connections to auto-enable',
              ],
            },
        microsoft: microsoftEnabled
          ? {}
          : {
              steps: [
                '1. Navigate to Auth0 Dashboard > Connections > Social',
                '2. Click on Microsoft connection (or create it if it does not exist)',
                '3. Configure Microsoft OAuth credentials (Client ID, Client Secret)',
                '4. Ensure the connection is enabled for your application',
                '5. Run POST /api/test/apple-microsoft-connections to auto-enable',
              ],
            },
      },
    });
  } catch (error) {
    logger.error('[Auth0 Apple/Microsoft] Error checking connection status:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to check Apple/Microsoft connection status',
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

/**
 * Enable Apple and/or Microsoft connections
 * POST with body: { enableApple?: boolean, enableMicrosoft?: boolean }
 */
export async function POST(request: Request) {
  try {
    let body: { enableApple?: boolean; enableMicrosoft?: boolean } = {};
    try {
      body = await request.json();
    } catch {
      // No body provided, enable both
      body = { enableApple: true, enableMicrosoft: true };
    }

    const { enableApple = true, enableMicrosoft = true } = body;

    const results: {
      apple?: { success: boolean; enabled: boolean; message: string };
      microsoft?: { success: boolean; enabled: boolean; message: string };
    } = {};

    if (enableApple) {
      const appleResult = await enableAppleConnectionForApp();
      results.apple = appleResult;
    }

    if (enableMicrosoft) {
      const microsoftResult = await enableMicrosoftConnectionForApp();
      results.microsoft = microsoftResult;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    logger.error('[Auth0 Apple/Microsoft] Error enabling connections:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to enable Apple/Microsoft connections',
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
