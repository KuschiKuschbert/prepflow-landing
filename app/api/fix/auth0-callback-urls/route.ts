import { NextRequest, NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';
import { logger } from '@/lib/logger';

/**
 * Fix Auth0 Callback URLs via Management API
 * Automatically adds missing callback URLs, logout URLs, and web origins
 */
export async function POST(request: NextRequest) {
  try {
    const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;
    const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;

    if (!auth0Issuer || !auth0ClientId || !auth0ClientSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Auth0 credentials',
          message: 'AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET must be set',
        },
        { status: 400 },
      );
    }

    if (!nextAuthUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing NEXTAUTH_URL',
          message: 'NEXTAUTH_URL must be set',
        },
        { status: 400 },
      );
    }

    const domain = auth0Issuer.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const managementClient = new ManagementClient({
      domain,
      clientId: auth0ClientId,
      clientSecret: auth0ClientSecret,
    });

    // Get current application configuration
    const appResponse = await managementClient.clients.get({ client_id: auth0ClientId });
    const app = appResponse.data || (appResponse as any);

    // Build required URLs
    const requiredCallbacks = [
      `${nextAuthUrl}/api/auth/callback/auth0`,
      ...(nextAuthUrl.includes('www.')
        ? [`${nextAuthUrl.replace('www.', '')}/api/auth/callback/auth0`]
        : [`${nextAuthUrl.replace(/^https?:\/\//, 'https://www.')}/api/auth/callback/auth0`]),
    ];

    const requiredLogoutUrls = [
      nextAuthUrl,
      `${nextAuthUrl}/`,
      ...(nextAuthUrl.includes('www.')
        ? [nextAuthUrl.replace('www.', ''), `${nextAuthUrl.replace('www.', '')}/`]
        : [
            nextAuthUrl.replace(/^https?:\/\//, 'https://www.'),
            `${nextAuthUrl.replace(/^https?:\/\//, 'https://www.')}/`,
          ]),
    ];

    const requiredWebOrigins = [
      nextAuthUrl,
      ...(nextAuthUrl.includes('www.')
        ? [nextAuthUrl.replace('www.', '')]
        : [nextAuthUrl.replace(/^https?:\/\//, 'https://www.')]),
    ];

    // Merge with existing URLs (avoid duplicates)
    const currentCallbacks = (app.callbacks || []) as string[];
    const currentLogoutUrls = (app.logout_urls || []) as string[];
    const currentWebOrigins = (app.web_origins || []) as string[];

    const updatedCallbacks = [
      ...new Set([...currentCallbacks, ...requiredCallbacks]),
    ];
    const updatedLogoutUrls = [
      ...new Set([...currentLogoutUrls, ...requiredLogoutUrls]),
    ];
    const updatedWebOrigins = [
      ...new Set([...currentWebOrigins, ...requiredWebOrigins]),
    ];

    // Update application
    await managementClient.clients.update(
      { client_id: auth0ClientId },
      {
        callbacks: updatedCallbacks,
        logout_urls: updatedLogoutUrls,
        web_origins: updatedWebOrigins,
      } as any, // Auth0 SDK types may be incomplete
    );

    logger.info('[Auth0 Fix] Updated Auth0 application configuration', {
      callbacks: updatedCallbacks,
      logoutUrls: updatedLogoutUrls,
      webOrigins: updatedWebOrigins,
    });

    return NextResponse.json({
      success: true,
      message: 'Auth0 configuration updated successfully',
      changes: {
        callbacks: {
          before: currentCallbacks,
          after: updatedCallbacks,
          added: requiredCallbacks.filter((url) => !currentCallbacks.includes(url)),
        },
        logoutUrls: {
          before: currentLogoutUrls,
          after: updatedLogoutUrls,
          added: requiredLogoutUrls.filter((url) => !currentLogoutUrls.includes(url)),
        },
        webOrigins: {
          before: currentWebOrigins,
          after: updatedWebOrigins,
          added: requiredWebOrigins.filter((url) => !currentWebOrigins.includes(url)),
        },
      },
    });
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
