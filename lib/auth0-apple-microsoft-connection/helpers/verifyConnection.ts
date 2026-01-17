import { logger } from '@/lib/logger';

/**
 * Verify connection is enabled for application
 */
export function verifyConnectionEnabled(
  connection: Record<string, unknown> | undefined,
  applicationClientId: string,
  connectionType: 'apple' | 'microsoft',
): boolean {
  if (!connection) {
    logger.dev(`[Auth0 ${connectionType}] ${connectionType} connection not found`);
    return false;
  }

  const enabledClients =
    Array.isArray(connection.enabled_clients) && connection.enabled_clients
      ? (connection.enabled_clients as string[])
      : [];
  const isEnabled = enabledClients.includes(applicationClientId);

  logger.dev(`[Auth0 ${connectionType}] Connection status:`, {
    id: connection.id,
    name: connection.name,
    strategy: connection.strategy,
    enabled: isEnabled,
  });

  return isEnabled;
}
