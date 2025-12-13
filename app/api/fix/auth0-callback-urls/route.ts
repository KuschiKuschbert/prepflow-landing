import { NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';
import { logger } from '@/lib/logger';
import { getSocialConnections, verifyCallbackUrls } from '@/lib/auth0-management';
import {
  verifyGoogleConnection,
  enableGoogleConnectionForApp,
} from '@/lib/auth0-google-connection';

/**
 * Fix Auth0 Callback URLs via Management API
 * Automatically adds missing callback URLs, logout URLs, and web origins
 */
export async function POST() {
  try {
    const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
    // Try M2M credentials first (more secure), fall back to regular app credentials
    const m2mClientId = process.env.AUTH0_M2M_CLIENT_ID;
    const m2mClientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;
    const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
    // Use AUTH0_BASE_URL (Auth0 SDK) or fall back to NEXTAUTH_URL for backward compatibility
    const baseUrl = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL;

    if (!auth0Issuer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Auth0 issuer',
          message: 'AUTH0_ISSUER_BASE_URL must be set',
        },
        { status: 400 },
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing base URL',
          message: 'AUTH0_BASE_URL or NEXTAUTH_URL must be set',
        },
        { status: 400 },
      );
    }

    // Determine which credentials to use (M2M preferred, fall back to regular app)
    const useM2M = m2mClientId && m2mClientSecret;
    const managementClientId = useM2M ? m2mClientId : auth0ClientId;
    const managementClientSecret = useM2M ? m2mClientSecret : auth0ClientSecret;

    if (!managementClientId || !managementClientSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Auth0 credentials',
          message:
            'Either AUTH0_M2M_CLIENT_ID/AUTH0_M2M_CLIENT_SECRET (recommended) or AUTH0_CLIENT_ID/AUTH0_CLIENT_SECRET must be set',
          hint: 'See docs/AUTH0_MANAGEMENT_API_SETUP.md for setup instructions',
        },
        { status: 400 },
      );
    }

    // The application client ID to update (always use the main app, not M2M)
    const applicationClientId = auth0ClientId;
    if (!applicationClientId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing application client ID',
          message: 'AUTH0_CLIENT_ID must be set to identify which application to update',
        },
        { status: 400 },
      );
    }

    const domain = auth0Issuer.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const managementClient = new ManagementClient({
      domain,
      clientId: managementClientId,
      clientSecret: managementClientSecret,
    });

    // Get current application configuration
    const appResponse = await managementClient.clients.get({ client_id: applicationClientId });
    const app = appResponse.data || (appResponse as any);

    // Build required URLs (Auth0 SDK uses /api/auth/callback, not /api/auth/callback/auth0)
    const requiredCallbacks = [
      `${baseUrl}/api/auth/callback`,
      ...(baseUrl.includes('www.')
        ? [`${baseUrl.replace('www.', '')}/api/auth/callback`]
        : [`${baseUrl.replace(/^https?:\/\//, 'https://www.')}/api/auth/callback`]),
      // Also include localhost for development
      'http://localhost:3000/api/auth/callback',
      'http://localhost:3001/api/auth/callback',
    ];

    const requiredLogoutUrls = [
      baseUrl,
      `${baseUrl}/`,
      ...(baseUrl.includes('www.')
        ? [baseUrl.replace('www.', ''), `${baseUrl.replace('www.', '')}/`]
        : [
            baseUrl.replace(/^https?:\/\//, 'https://www.'),
            `${baseUrl.replace(/^https?:\/\//, 'https://www.')}/`,
          ]),
      // Also include localhost for development
      'http://localhost:3000',
      'http://localhost:3000/',
      'http://localhost:3001',
      'http://localhost:3001/',
    ];

    const requiredWebOrigins = [
      baseUrl,
      ...(baseUrl.includes('www.')
        ? [baseUrl.replace('www.', '')]
        : [baseUrl.replace(/^https?:\/\//, 'https://www.')]),
      // Also include localhost for development
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    // Merge with existing URLs (avoid duplicates)
    const currentCallbacks = (app.callbacks || []) as string[];
    // Auth0 Management API uses 'allowed_logout_urls' (with underscores, not 'logout_urls')
    const currentLogoutUrls = (app.allowed_logout_urls || app.logout_urls || []) as string[];
    const currentWebOrigins = (app.web_origins || []) as string[];

    const updatedCallbacks = [...new Set([...currentCallbacks, ...requiredCallbacks])];
    const updatedLogoutUrls = [...new Set([...currentLogoutUrls, ...requiredLogoutUrls])];
    const updatedWebOrigins = [...new Set([...currentWebOrigins, ...requiredWebOrigins])];

    // Update application
    // Auth0 Management API expects 'allowed_logout_urls' (not 'logout_urls')
    await managementClient.clients.update(
      { client_id: applicationClientId },
      {
        callbacks: updatedCallbacks,
        allowed_logout_urls: updatedLogoutUrls,
        web_origins: updatedWebOrigins,
      } as any, // Auth0 SDK types may be incomplete
    );

    logger.info('[Auth0 Fix] Updated Auth0 application configuration', {
      usingM2M: useM2M,
      callbacks: updatedCallbacks,
      logoutUrls: updatedLogoutUrls,
      webOrigins: updatedWebOrigins,
    });

    // Verify social connections
    const socialConnections = await getSocialConnections();
    let googleConnectionVerified = await verifyGoogleConnection();

    // Try to enable Google connection if it exists but isn't enabled
    if (!googleConnectionVerified) {
      const enableResult = await enableGoogleConnectionForApp();
      if (enableResult.success && enableResult.enabled) {
        googleConnectionVerified = true;
        logger.info('[Auth0 Fix] Auto-enabled Google connection for application');
      }
    }

    const callbackUrlStatus = await verifyCallbackUrls(updatedCallbacks);

    // Build response with social connection status
    const response = {
      success: true,
      message: 'Auth0 configuration updated successfully',
      changes: {
        callbacks: {
          before: currentCallbacks,
          after: updatedCallbacks,
          added: requiredCallbacks.filter(url => !currentCallbacks.includes(url)),
        },
        logoutUrls: {
          before: currentLogoutUrls,
          after: updatedLogoutUrls,
          added: requiredLogoutUrls.filter(url => !currentLogoutUrls.includes(url)),
        },
        webOrigins: {
          before: currentWebOrigins,
          after: updatedWebOrigins,
          added: requiredWebOrigins.filter(url => !currentWebOrigins.includes(url)),
        },
      },
      socialConnections: {
        total: socialConnections.length,
        connections: socialConnections.map(conn => ({
          id: conn.id,
          name: conn.name,
          strategy: conn.strategy,
          enabled: conn.enabled_clients?.includes(applicationClientId) || false,
        })),
        google: {
          verified: googleConnectionVerified,
          status: googleConnectionVerified ? 'enabled' : 'disabled_or_misconfigured',
          message: googleConnectionVerified
            ? 'Google connection is enabled and configured correctly'
            : 'Google connection is not enabled or misconfigured. Please enable it in Auth0 Dashboard > Connections > Social > Google',
        },
      },
      callbackUrlVerification: {
        verified: callbackUrlStatus.isValid,
        configured: callbackUrlStatus.configuredUrls,
        expected: callbackUrlStatus.expectedUrls,
        missing: callbackUrlStatus.missingUrls,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error('[Auth0 Fix] Error updating Auth0 configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to update Auth0 configuration',
      },
      { status: 500 },
    );
  }
}
