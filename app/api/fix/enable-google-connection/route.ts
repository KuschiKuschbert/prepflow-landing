import { ApiErrorHandler } from '@/lib/api-error-handler';
import {
    configureAndEnableGoogleConnection,
    enableGoogleConnectionForApp,
    verifyGoogleConnection,
} from '@/lib/auth0-google-connection';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';
const enableGoogleConnectionSchema = z
  .object({
    googleClientId: z.string().min(1).optional(),
    googleClientSecret: z.string().min(1).optional(),
  })
  .refine(
    data => {
      // If one is provided, both must be provided
      if (data.googleClientId || data.googleClientSecret) {
        return data.googleClientId && data.googleClientSecret;
      }
      return true;
    },
    {
      message: 'Both googleClientId and googleClientSecret must be provided together',
      path: ['googleClientId'],
    },
  );

/**
 * Configure and Enable Google Connection
 * POST with body: { googleClientId: string, googleClientSecret: string }
 * Attempts to configure Google OAuth credentials and enable the connection for the PrepFlow application
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);

    // Validate body if provided
    let validatedBody = {};
    if (body && typeof body === 'object' && Object.keys(body).length > 0) {
      const validationResult = enableGoogleConnectionSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            validationResult.error.issues[0]?.message || 'Invalid request body',
            'VALIDATION_ERROR',
            400,
          ),
          { status: 400 },
        );
      }
      validatedBody = validationResult.data;
    }

    const { googleClientId, googleClientSecret } = validatedBody as {
      googleClientId?: string;
      googleClientSecret?: string;
    };

    if (googleClientId && googleClientSecret) {
      return await handleConfigAndEnable(googleClientId, googleClientSecret);
    }

    return await handleEnableOnly();
  } catch (error) {
    logger.error('[Auth0 Fix] Error in Google connection endpoint:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to process Google connection request',
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

async function parseRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function handleConfigAndEnable(clientId: string, clientSecret: string) {
  logger.info('[Auth0 Fix] Configuring Google OAuth credentials and enabling connection');
  const result = await configureAndEnableGoogleConnection(clientId, clientSecret);

  if (result.success) {
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

async function handleEnableOnly() {
  logger.info('[Auth0 Fix] Enabling Google connection (no credentials provided)');
  const isCurrentlyEnabled = await verifyGoogleConnection();

  if (isCurrentlyEnabled) {
    return NextResponse.json({
      success: true,
      message: 'Google connection is already enabled for this application',
      enabled: true,
      action: 'none',
    });
  }

  const result = await enableGoogleConnectionForApp();

  if (result.success && result.enabled) {
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
}


/** Check Google Connection Status */
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
      ApiErrorHandler.createError('Failed to check Google connection status', 'SERVER_ERROR', 500, {
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
}
