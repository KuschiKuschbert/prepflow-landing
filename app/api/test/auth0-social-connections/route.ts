/**
 * GET /api/test/auth0-social-connections
 * Diagnostic endpoint to check social connection status and configuration
 *
 * @returns {Promise<NextResponse>} JSON response with social connection status
 */
import {
  getSocialConnections,
  verifyCallbackUrls,
  verifyGoogleConnection,
} from '@/lib/auth0-management';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Test endpoint to check social connection status and configuration.
 *
 * @returns {Promise<NextResponse>} JSON response with social connection status
 */
export async function GET() {
  try {
    // Use AUTH0_BASE_URL (Auth0 SDK) - test scripts keep NEXTAUTH_URL fallback for diagnostics
    const baseUrl = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL;
    // Auth0 SDK uses /api/auth/callback (not /api/auth/callback/auth0)
    const expectedCallbackUrls = baseUrl
      ? [
          `${baseUrl}/api/auth/callback`,
          ...(baseUrl.includes('www.')
            ? [`${baseUrl.replace('www.', '')}/api/auth/callback`]
            : [`${baseUrl.replace(/^https?:\/\//, 'https://www.')}/api/auth/callback`]),
        ]
      : [];

    // Get all social connections
    const socialConnections = await getSocialConnections();

    // Verify Google connection
    const googleConnectionVerified = await verifyGoogleConnection();

    // Verify callback URLs
    const callbackUrlStatus = await verifyCallbackUrls(expectedCallbackUrls);

    // Build detailed response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      socialConnections: {
        total: socialConnections.length,
        connections: socialConnections.map(conn => ({
          id: conn.id,
          name: conn.name,
          strategy: conn.strategy,
          enabled: (conn.enabled_clients?.length ?? 0) > 0,
          enabledClients: conn.enabled_clients || [],
        })),
      },
      googleConnection: {
        verified: googleConnectionVerified,
        status: googleConnectionVerified ? 'enabled' : 'disabled_or_misconfigured',
        message: googleConnectionVerified
          ? 'Google connection is enabled and configured correctly'
          : 'Google connection is not enabled or misconfigured',
      },
      callbackUrls: {
        verified: callbackUrlStatus.isValid,
        configured: callbackUrlStatus.configuredUrls,
        expected: callbackUrlStatus.expectedUrls,
        missing: callbackUrlStatus.missingUrls,
        extra: callbackUrlStatus.extraUrls,
      },
      summary: {
        allConnectionsOk: socialConnections.length > 0,
        googleOk: googleConnectionVerified,
        callbacksOk: callbackUrlStatus.isValid,
        overallStatus:
          googleConnectionVerified && callbackUrlStatus.isValid ? 'healthy' : 'needs_attention',
      },
    };

    logger.info('[Auth0 Social Connections] Diagnostic check completed', {
      socialConnectionsCount: socialConnections.length,
      googleVerified: googleConnectionVerified,
      callbacksValid: callbackUrlStatus.isValid,
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error('[Auth0 Social Connections] Diagnostic check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to check social connection status',
      },
      { status: 500 },
    );
  }
}
