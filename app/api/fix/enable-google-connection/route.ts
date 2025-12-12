import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  enableGoogleConnectionForApp,
  verifyGoogleConnection,
} from '@/lib/auth0-google-connection';

/**
 * Enable Google Connection for Application
 * Attempts to enable Google social connection for the PrepFlow application
 * Note: The Google connection must already exist and be configured with OAuth credentials
 */
export async function POST() {
  try {
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
    logger.error('[Auth0 Fix] Error enabling Google connection:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to enable Google connection',
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

