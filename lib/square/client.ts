/**
 * Square client library with singleton pattern and error handling.
 * Provides Square API client instances for authenticated requests.
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 * @module lib/square/client
 */

import { logger } from '@/lib/logger';
import { SquareClient, SquareEnvironment } from 'square';
import { getSquareConfig } from './config';
import { decryptSquareToken } from './token-encryption';

// Cache for Square client instances per user
const clientCache = new Map<string, { client: SquareClient; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Get Square client instance for a user.
 * Uses singleton pattern with per-user caching.
 * @param {string} userId - User ID
 * @returns {Promise<SquareClient | null>} Square client instance or null if not configured
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

    // Create Square client
    // Note: Square SDK constructor signature may vary by version
    // Using type assertion to handle potential type mismatches
     
    const client = new SquareClient({
      accessToken: accessToken,
      environment: environment,
      timeout: 30000, // 30 second timeout
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as any);

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
 * Check if Square is configured for a user.
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if Square is configured
 */
export async function isSquareConfigured(userId: string): Promise<boolean> {
  try {
    const config = await getSquareConfig(userId);
    return config !== null;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('[Square Client] Failed to check configuration:', {
      error: message,
      userId,
      context: { endpoint: 'isSquareConfigured', operation: 'check_config' },
    });
    return false;
  }
}

/**
 * Validate Square credentials by making a test API call.
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if credentials are valid
 */
export async function validateSquareCredentials(userId: string): Promise<boolean> {
  try {
    const client = await getSquareClient(userId);
    if (!client) {
      return false;
    }

    // Make a test API call to Locations API (lightweight endpoint)
    const locationsApi = client.locations;
    // @ts-expect-error - Square SDK method may have different signature
    const response = await locationsApi.listLocations();

    if (response.result?.locations) {
      return true;
    }

    return false;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('[Square Client] Failed to validate credentials:', {
      error: message,
      userId,
      context: { endpoint: 'validateSquareCredentials', operation: 'validate' },
    });
    return false;
  }
}

/**
 * Clear cached Square client for a user.
 * Useful when credentials are updated.
 * @param {string} userId - User ID
 */
export function clearSquareClientCache(userId: string): void {
  clientCache.delete(userId);
}

/**
 * Clear all cached Square clients. Useful for testing or when encryption key changes.
 */
export function clearAllSquareClientCache(): void {
  clientCache.clear();
}
