import { logger } from '@/lib/logger';
import { getSquareConfig } from '../config';
import { getSquareClient } from './factory';

/**
 * Check if Square is configured for a user.
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
