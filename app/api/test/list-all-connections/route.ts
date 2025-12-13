/**
 * GET /api/test/list-all-connections
 * Diagnostic endpoint to list ALL connections (not just social)
 * Helps identify what connections actually exist in Auth0
 */
import { NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';
import { logger } from '@/lib/logger';

function getManagementClient(): ManagementClient | null {
  const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!issuerBaseUrl || !clientId || !clientSecret) {
    return null;
  }

  const domain = issuerBaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const applicationClientId = clientId;

  try {
    return new ManagementClient({
      domain,
      clientId,
      clientSecret,
    });
  } catch (error) {
    logger.error('[Auth0 Management] Failed to create Management API client:', error);
    return null;
  }
}

export async function GET() {
  try {
    const client = getManagementClient();

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Management API client not available',
          message: 'Check AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET',
        },
        { status: 500 },
      );
    }

    const connectionsResponse = await client.connections.getAll();
    const connections = Array.isArray(connectionsResponse)
      ? connectionsResponse
      : (connectionsResponse as any)?.data || [];

    if (!connections || !Array.isArray(connections)) {
      return NextResponse.json({
        success: true,
        total: 0,
        connections: [],
        message: 'No connections found or invalid response format',
      });
    }

    const applicationClientId = process.env.AUTH0_CLIENT_ID;

    const allConnections = connections.map((conn: any) => ({
      id: conn.id,
      name: conn.name,
      strategy: conn.strategy,
      enabled: conn.enabled_clients?.includes(applicationClientId) || false,
      enabledClients: conn.enabled_clients || [],
      isDomainConnection: conn.is_domain_connection || false,
      options: conn.options ? Object.keys(conn.options) : [],
    }));

    // Filter for Apple and Microsoft specifically
    const appleConnections = allConnections.filter((conn: any) => conn.strategy === 'apple');
    const microsoftConnections = allConnections.filter(
      (conn: any) => conn.strategy === 'windowslive' || conn.strategy === 'waad',
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      total: allConnections.length,
      applicationClientId,
      appleConnections: {
        found: appleConnections.length,
        connections: appleConnections,
      },
      microsoftConnections: {
        found: microsoftConnections.length,
        connections: microsoftConnections,
      },
      allConnections: allConnections.map((conn: any) => ({
        id: conn.id,
        name: conn.name,
        strategy: conn.strategy,
        enabled: conn.enabled,
      })),
    });
  } catch (error) {
    logger.error('[Auth0 Connections] Failed to list connections:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Failed to list connections',
      },
      { status: 500 },
    );
  }
}
