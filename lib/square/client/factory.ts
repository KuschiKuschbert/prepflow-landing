import { logger } from '@/lib/logger';
import { SquareClient, SquareEnvironment } from 'square';
import { getSquareConfig } from '../config';
import { decryptSquareToken } from '../token-encryption';

// Cache for Square client instances per user
const clientCache = new Map<string, { client: SquareClient; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Get Square client instance for a user.
 * Uses singleton pattern with per-user caching.
 */
export async function getSquareClient(userId: string): Promise<SquareClient | null> {
  try {
    // Check cache first
    const cached = clientCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.client;
    }

    // Get user's Square configuration
    const config = await getSquareConfig(userId);
    if (!config) {
      return null;
    }

    // Decrypt access token
    let accessToken: string;
    try {
      accessToken = await decryptSquareToken(config.square_access_token_encrypted);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error('[Square Client] Failed to decrypt access token:', {
        error: message,
        userId,
        context: { endpoint: 'getSquareClient', operation: 'decrypt_token' },
      });
      return null;
    }

    // Determine environment
    const environment =
      config.square_environment === 'production'
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox;

    // Create Square client (accessToken mapped to SDK's token; SquareClient.Options for constructor)
    const client = new SquareClient({
      accessToken: accessToken,
      environment: environment,
      timeout: 30000, // 30 second timeout
    } as unknown as ConstructorParameters<typeof SquareClient>[0]);

    // Cache client instance
    clientCache.set(userId, {
      client,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return client;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('[Square Client] Failed to create client:', {
      error: message,
      userId,
      context: { endpoint: 'getSquareClient', operation: 'create_client' },
    });
    return null;
  }
}

/**
 * Clear cached Square client for a user.
 */
export function clearSquareClientCache(userId: string): void {
  clientCache.delete(userId);
}

/**
 * Clear all cached Square clients.
 */
export function clearAllSquareClientCache(): void {
  clientCache.clear();
}
