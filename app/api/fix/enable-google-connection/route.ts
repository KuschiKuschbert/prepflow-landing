import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  enableGoogleConnectionForApp,
  verifyGoogleConnection,
  configureAndEnableGoogleConnection,
} from '@/lib/auth0-google-connection';

/**
 * Configure and Enable Google Connection
 * POST with body: { googleClientId: string, googleClientSecret: string }
 * Attempts to configure Google OAuth credentials and enable the connection for the PrepFlow application
 */
export async function POST(request: Request) {
  try {
    // Check if request body contains OAuth credentials
    let body: { googleClientId?: string; googleClientSecret?: string } = {};
    try {
      body = await request.json();
    } catch {
      // No body provided, just enable existing connection
    }

    const { googleClientId, googleClientSecret } = body;

    // If OAuth credentials provided, configure and enable
    if (googleClientId && googleClientSecret) {
      logger.info('[Auth0 Fix] Configuring Google OAuth credentials and enabling connection');
      const result = await configureAndEnableGoogleConnection(googleClientId, googleClientSecret);

      if (result.success) {
        // Verify it's now enabled
        const isNowEnabled = await verifyGoogleConnection();

        return NextResponse.json({
          success: true,
          message: result.message,
          configured: result.configured,
          enabled: isNowEnabled,
          action: 'configured_and_enabled',
        });
      }

      return NextResponse.json(
        {
          success: false,
          message: result.message,
          configured: result.configured,
          enabled: result.enabled,
          action: 'failed',
          troubleshooting: {
            ifConfigurationFailed:
              'Verify Google OAuth credentials are correct. Check Google Cloud Console for Client ID and Secret.',
            ifEnableFailed:
              'OAuth credentials configured but connection not enabled. Check Management API permissions (update:connections scope).',
            ifPermissionDenied:
              'Ensure Management API has "update:connections" scope. See docs/AUTH0_MANAGEMENT_API_SETUP.md',
          },
        },
        { status: 400 },
      );
    }

    // No credentials provided, just enable existing connection
    logger.info('[Auth0 Fix] Enabling Google connection (no credentials provided)');
    // Check current status
    const isCurrentlyEnabled = await verifyGoogleConnection();

    if (isCurrentlyEnabled) {
      return NextResponse.json({
        success: true,
        message: 'Google connection is already enabled for this application',
        enabled: true,
        action: 'none',
      });
    }

    // Attempt to enable
    const result = await enableGoogleConnectionForApp();

    if (result.success && result.enabled) {
      // Verify it's now enabled
      const isNowEnabled = await verifyGoogleConnection();

      return NextResponse.json({
        success: true,
        message: result.message,
        enabled: isNowEnabled,
        action: 'enabled',
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message,
        enabled: false,
        action: 'failed',
        troubleshooting: {
          ifConnectionDoesNotExist:
            'Create Google connection in Auth0 Dashboard > Connections > Social > Google',
          ifNotConfigured:
            'Configure Google OAuth credentials (Client ID, Client Secret) in Auth0 Dashboard > Connections > Social > Google',
          ifPermissionDenied:
            'Ensure Management API has "update:connections" scope. See docs/AUTH0_MANAGEMENT_API_SETUP.md',
        },
      },
      { status: 400 },
    );
  } catch (error) {
    logger.error('[Auth0 Fix] Error in Google connection endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to process Google connection request',
      },
      { status: 500 },
    );
  }
}

/**
 * Check Google Connection Status
 */
export async function GET() {
  try {
    const isEnabled = await verifyGoogleConnection();

    return NextResponse.json({
      success: true,
      enabled: isEnabled,
      message: isEnabled
        ? 'Google connection is enabled and configured correctly'
        : 'Google connection is not enabled or misconfigured',
      troubleshooting: isEnabled
        ? {}
        : {
            steps: [
              '1. Navigate to Auth0 Dashboard > Connections > Social',
              '2. Click on Google connection (or create it if it does not exist)',
              '3. Configure Google OAuth credentials (Client ID, Client Secret)',
              '4. Ensure the connection is enabled for your application',
              '5. Run POST /api/fix/enable-google-connection to auto-enable',
            ],
            manualSteps:
              'If auto-enable fails, manually enable in Auth0 Dashboard > Connections > Social > Google > Applications tab',
          },
    });
  } catch (error) {
    logger.error('[Auth0 Fix] Error checking Google connection status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to check Google connection status',
      },
      { status: 500 },
    );
  }
}
