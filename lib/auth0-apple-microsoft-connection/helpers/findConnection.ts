import { Connection, getManagementClient } from '@/lib/auth0-management';
import { logger } from '@/lib/logger';

/**
 * Find Apple connection from Auth0 connections list
 */
export async function findAppleConnection(): Promise<Connection | null> {
  const client = getManagementClient();
  if (!client) {
    return null;
  }

  try {
    const response = await client.connections.list();
    const connections = response.data;

    return (connections.find(
      conn => conn.strategy === 'apple' || conn.name?.toLowerCase().includes('apple'),
    ) || null) as Connection | null;
  } catch (error) {
    logger.error('[Auth0 Apple] Failed to find Apple connection:', error);
    return null;
  }
}

/**
 * Find Microsoft connection from Auth0 connections list
 */
export async function findMicrosoftConnection(): Promise<Connection | null> {
  const client = getManagementClient();
  if (!client) {
    return null;
  }

  try {
    const response = await client.connections.list();
    const connections = response.data;

    return (connections.find(
      conn =>
        conn.strategy === 'windowslive' ||
        conn.strategy === 'waad' ||
        conn.strategy === 'microsoft-account' ||
        conn.name?.toLowerCase().includes('microsoft') ||
        conn.name?.toLowerCase().includes('windows'),
    ) || null) as Connection | null;
  } catch (error) {
    logger.error('[Auth0 Microsoft] Failed to find Microsoft connection:', error);
    return null;
  }
}
