import { getManagementClient } from '@/lib/auth0-management';
import { logger } from '@/lib/logger';

/**
 * Find Apple connection from Auth0 connections list
 */
export async function findAppleConnection(): Promise<any | null> {
  const client = getManagementClient();
  if (!client) {
    return null;
  }

  try {
    const connections = await client.connections.getAll();
    const connectionsList = Array.isArray(connections)
      ? connections
      : (connections as any)?.data || [];

    return (
      connectionsList.find(
        (conn: any) => conn.strategy === 'apple' || conn.name?.toLowerCase().includes('apple'),
      ) || null
    );
  } catch (error) {
    logger.error('[Auth0 Apple] Failed to find Apple connection:', error);
    return null;
  }
}

/**
 * Find Microsoft connection from Auth0 connections list
 */
export async function findMicrosoftConnection(): Promise<any | null> {
  const client = getManagementClient();
  if (!client) {
    return null;
  }

  try {
    const connections = await client.connections.getAll();
    const connectionsList = Array.isArray(connections)
      ? connections
      : (connections as any)?.data || [];

    return (
      connectionsList.find(
        (conn: any) =>
          conn.strategy === 'windowslive' ||
          conn.strategy === 'waad' ||
          conn.strategy === 'microsoft-account' ||
          conn.name?.toLowerCase().includes('microsoft') ||
          conn.name?.toLowerCase().includes('windows'),
      ) || null
    );
  } catch (error) {
    logger.error('[Auth0 Microsoft] Failed to find Microsoft connection:', error);
    return null;
  }
}

