import { logger } from '@/lib/logger';

/**
 * Verify connection is enabled for application
 */
export function verifyConnectionEnabled(
  connection: any,
  applicationClientId: string,
  connectionType: 'apple' | 'microsoft',
): boolean {
  if (!connection) {
    logger.dev(`[Auth0 ${connectionType}] ${connectionType} connection not found`);
    return false;
  }

  const isEnabled = connection.enabled_clients?.includes(applicationClientId) || false;

  logger.dev(`[Auth0 ${connectionType}] Connection status:`, {
    id: connection.id,
    name: connection.name,
    strategy: connection.strategy,
    enabled: isEnabled,
  });

  return isEnabled;
}
