/**
 * Validate and setup for orders sync.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../../../client';
import { getSquareConfig } from '../../../config';
import { logger } from '@/lib/logger';
import type { SyncResult } from '../types';

export interface SyncSetup {
  client: ReturnType<typeof getSquareClient> extends Promise<infer T> ? T : never;
  config: Awaited<ReturnType<typeof getSquareConfig>>;
  locationId: string;
}

/**
 * Validate and setup for orders sync.
 */
export async function validateAndSetup(
  userId: string,
  locationId: string | undefined,
  result: SyncResult,
): Promise<SyncSetup | null> {
  if (!supabaseAdmin) {
    result.errorMessages?.push('Database connection not available');
    return null;
  }

  const client = await getSquareClient(userId);
  if (!client) {
    logger.error('[Square Orders Sync] Square client not available for user:', { userId });
    result.errorMessages?.push('Square client not available');
    result.errors++;
    return null;
  }

  const config = await getSquareConfig(userId);
  if (!config) {
    logger.error('[Square Orders Sync] Square configuration not found for user:', { userId });
    result.errorMessages?.push('Square configuration not found');
    result.errors++;
    return null;
  }

  const targetLocationId = locationId || config.default_location_id;
  if (!targetLocationId) {
    logger.error('[Square Orders Sync] Location ID is required for orders sync:', { userId });
    result.errorMessages?.push('Location ID is required for orders sync');
    result.errors++;
    return null;
  }

  return { client, config, locationId: targetLocationId };
}
