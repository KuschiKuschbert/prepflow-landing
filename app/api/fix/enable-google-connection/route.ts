import { ApiErrorHandler } from '@/lib/api-error-handler';
import { verifyGoogleConnection } from '@/lib/auth0-google-connection';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import {
  enableGoogleConnectionSchema,
  handleConfigAndEnable,
  handleEnableOnly,
  parseRequestBody,
} from './controller';

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
