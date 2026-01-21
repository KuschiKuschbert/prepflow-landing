
import {
    configureAndEnableGoogleConnection,
    enableGoogleConnectionForApp,
    verifyGoogleConnection,
} from '@/lib/auth0-google-connection';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const enableGoogleConnectionSchema = z
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

export async function parseRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function handleConfigAndEnable(clientId: string, clientSecret: string) {
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

export async function handleEnableOnly() {
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
