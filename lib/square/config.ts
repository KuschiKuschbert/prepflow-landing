/**
 * Square configuration service for user-specific config management.
 * Handles CRUD operations for Square configurations with encrypted token storage.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 *
 * @module lib/square/config
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { encryptSquareToken, decryptSquareToken } from './token-encryption';

export interface SquareConfig {
  id: string;
  user_id: string;
  square_application_id: string;
  square_access_token_encrypted: string;
  refresh_token_encrypted: string | null; // OAuth refresh token (encrypted)
  square_environment: 'sandbox' | 'production';
  default_location_id: string | null;
  auto_sync_enabled: boolean;
  sync_frequency_minutes: number;
  sync_menu_items: boolean;
  sync_staff: boolean;
  sync_sales_data: boolean;
  sync_food_costs: boolean;
  webhook_enabled: boolean;
  webhook_url: string | null;
  webhook_secret: string | null;
  last_full_sync_at: string | null;
  last_menu_sync_at: string | null;
  last_staff_sync_at: string | null;
  last_sales_sync_at: string | null;
  initial_sync_completed: boolean;
  initial_sync_started_at: string | null;
  initial_sync_completed_at: string | null;
  initial_sync_status: 'pending' | 'in_progress' | 'completed' | 'failed' | null;
  initial_sync_error: string | null;
  auto_sync_direction: 'prepflow_to_square' | 'bidirectional';
  auto_sync_staff: boolean;
  auto_sync_dishes: boolean;
  auto_sync_costs: boolean;
  sync_debounce_ms: number;
  sync_queue_batch_size: number;
  created_at: string;
  updated_at: string;
}

export interface SquareConfigInput {
  square_application_id: string;
  square_access_token: string; // Plaintext token (will be encrypted)
  refresh_token?: string; // Plaintext refresh token (will be encrypted, optional - only for OAuth)
  square_application_secret?: string; // DEPRECATED: No longer used - PrepFlow uses env vars for Application Secret
  square_environment?: 'sandbox' | 'production';
  default_location_id?: string;
  auto_sync_enabled?: boolean;
  sync_frequency_minutes?: number;
  sync_menu_items?: boolean;
  sync_staff?: boolean;
  sync_sales_data?: boolean;
  sync_food_costs?: boolean;
  webhook_enabled?: boolean;
  webhook_url?: string;
  webhook_secret?: string;
  auto_sync_direction?: 'prepflow_to_square' | 'bidirectional';
  auto_sync_staff?: boolean;
  auto_sync_dishes?: boolean;
  auto_sync_costs?: boolean;
  sync_debounce_ms?: number;
  sync_queue_batch_size?: number;
}

/**
 * Get Square configuration for a user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<SquareConfig | null>} Square configuration or null if not found
 */
export async function getSquareConfig(userId: string): Promise<SquareConfig | null> {
  if (!supabaseAdmin) {
    logger.error('[Square Config] Database connection not available');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('square_configurations')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.error('[square/config] Database error:', {
        error: error.message,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    if (error) {
      if (error.code === 'PGRST116') {
        // No configuration found
        return null;
      }

      logger.error('[Square Config] Error fetching configuration:', {
        error: error.message,
        code: (error as any).code,
        userId,
        context: { endpoint: 'getSquareConfig', operation: 'select' },
      });

      return null;
    }

    return data as SquareConfig;
  } catch (error: any) {
    logger.error('[Square Config] Unexpected error:', {
      error: error.message,
      userId,
      context: { endpoint: 'getSquareConfig', operation: 'select' },
    });
    return null;
  }
}

/**
 * Save Square configuration for a user.
 * Encrypts the access token before storage.
 *
 * @param {string} userId - User ID
 * @param {SquareConfigInput} configInput - Configuration input
 * @returns {Promise<SquareConfig>} Saved configuration
 */
export async function saveSquareConfig(
  userId: string,
  configInput: SquareConfigInput,
): Promise<SquareConfig> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    // Encrypt access token
    const encryptedToken = await encryptSquareToken(configInput.square_access_token);

    // Encrypt refresh token if provided (OAuth flow)
    let encryptedRefreshToken: string | null = null;
    if (configInput.refresh_token) {
      encryptedRefreshToken = await encryptSquareToken(configInput.refresh_token);
    }

    // Encrypt application secret if provided (OAuth flow - needed for token refresh)
    let encryptedAppSecret: string | null = null;
    if (configInput.square_application_secret) {
      encryptedAppSecret = await encryptSquareToken(configInput.square_application_secret);
    }

    // Prepare configuration data
    const configData: any = {
      user_id: userId,
      square_application_id: configInput.square_application_id,
      square_access_token_encrypted: encryptedToken,
      square_environment: configInput.square_environment || 'sandbox',
    };

    // Only set refresh_token_encrypted if provided (OAuth flow)
    if (encryptedRefreshToken !== null) {
      configData.refresh_token_encrypted = encryptedRefreshToken;
    }

    // Only set application_secret_encrypted if provided (OAuth flow)
    if (encryptedAppSecret !== null) {
      configData.square_application_secret_encrypted = encryptedAppSecret;
    }

    // Add other config fields
    Object.assign(configData, {
      default_location_id: configInput.default_location_id || null,
      auto_sync_enabled: configInput.auto_sync_enabled ?? true,
      sync_frequency_minutes: configInput.sync_frequency_minutes || 60,
      sync_menu_items: configInput.sync_menu_items ?? true,
      sync_staff: configInput.sync_staff ?? true,
      sync_sales_data: configInput.sync_sales_data ?? true,
      sync_food_costs: configInput.sync_food_costs ?? true,
      webhook_enabled: configInput.webhook_enabled ?? false,
      webhook_url: configInput.webhook_url || null,
      webhook_secret: configInput.webhook_secret || null,
      auto_sync_direction: configInput.auto_sync_direction || 'prepflow_to_square',
      auto_sync_staff: configInput.auto_sync_staff ?? true,
      auto_sync_dishes: configInput.auto_sync_dishes ?? true,
      auto_sync_costs: configInput.auto_sync_costs ?? true,
      sync_debounce_ms: configInput.sync_debounce_ms || 5000,
      sync_queue_batch_size: configInput.sync_queue_batch_size || 10,
      updated_at: new Date().toISOString(),
    });

    // Upsert configuration
    const { data, error } = await supabaseAdmin
      .from('square_configurations')
      .upsert(configData, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      logger.error('[square/config] Database error:', {
        error: error.message,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    if (error) {
      logger.error('[Square Config] Error saving configuration:', {
        error: error.message,
        code: (error as any).code,
        userId,
        context: { endpoint: 'saveSquareConfig', operation: 'upsert' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    return data as SquareConfig;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error saving configuration:', {
      error: error.message,
      userId,
      context: { endpoint: 'saveSquareConfig', operation: 'upsert' },
    });

    throw ApiErrorHandler.createError(
      'Failed to save Square configuration',
      'DATABASE_ERROR',
      500,
    );
  }
}

/**
 * Update Square configuration for a user.
 * Only updates provided fields, preserves existing values for others.
 *
 * @param {string} userId - User ID
 * @param {Partial<SquareConfigInput>} updates - Partial configuration updates
 * @returns {Promise<SquareConfig>} Updated configuration
 */
export async function updateSquareConfig(
  userId: string,
  updates: Partial<SquareConfigInput>,
): Promise<SquareConfig> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Encrypt access token if provided
    if (updates.square_access_token) {
      updateData.square_access_token_encrypted = await encryptSquareToken(
        updates.square_access_token,
      );
    }

    // Add other fields if provided
    if (updates.square_application_id !== undefined) {
      updateData.square_application_id = updates.square_application_id;
    }
    if (updates.square_environment !== undefined) {
      updateData.square_environment = updates.square_environment;
    }
    if (updates.default_location_id !== undefined) {
      updateData.default_location_id = updates.default_location_id;
    }
    if (updates.auto_sync_enabled !== undefined) {
      updateData.auto_sync_enabled = updates.auto_sync_enabled;
    }
    if (updates.sync_frequency_minutes !== undefined) {
      updateData.sync_frequency_minutes = updates.sync_frequency_minutes;
    }
    if (updates.sync_menu_items !== undefined) {
      updateData.sync_menu_items = updates.sync_menu_items;
    }
    if (updates.sync_staff !== undefined) {
      updateData.sync_staff = updates.sync_staff;
    }
    if (updates.sync_sales_data !== undefined) {
      updateData.sync_sales_data = updates.sync_sales_data;
    }
    if (updates.sync_food_costs !== undefined) {
      updateData.sync_food_costs = updates.sync_food_costs;
    }
    if (updates.webhook_enabled !== undefined) {
      updateData.webhook_enabled = updates.webhook_enabled;
    }
    if (updates.webhook_url !== undefined) {
      updateData.webhook_url = updates.webhook_url;
    }
    if (updates.webhook_secret !== undefined) {
      updateData.webhook_secret = updates.webhook_secret;
    }
    if (updates.auto_sync_direction !== undefined) {
      updateData.auto_sync_direction = updates.auto_sync_direction;
    }
    if (updates.auto_sync_staff !== undefined) {
      updateData.auto_sync_staff = updates.auto_sync_staff;
    }
    if (updates.auto_sync_dishes !== undefined) {
      updateData.auto_sync_dishes = updates.auto_sync_dishes;
    }
    if (updates.auto_sync_costs !== undefined) {
      updateData.auto_sync_costs = updates.auto_sync_costs;
    }
    if (updates.sync_debounce_ms !== undefined) {
      updateData.sync_debounce_ms = updates.sync_debounce_ms;
    }
    if (updates.sync_queue_batch_size !== undefined) {
      updateData.sync_queue_batch_size = updates.sync_queue_batch_size;
    }

    const { data, error } = await supabaseAdmin
      .from('square_configurations')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('[square/config] Database error:', {
        error: error.message,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    if (error) {
      logger.error('[Square Config] Error updating configuration:', {
        error: error.message,
        code: (error as any).code,
        userId,
        context: { endpoint: 'updateSquareConfig', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    return data as SquareConfig;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error updating configuration:', {
      error: error.message,
      userId,
      context: { endpoint: 'updateSquareConfig', operation: 'update' },
    });

    throw ApiErrorHandler.createError(
      'Failed to update Square configuration',
      'DATABASE_ERROR',
      500,
    );
  }
}

/**
 * Delete Square configuration for a user.
 * Also clears cached client instance.
 *
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function deleteSquareConfig(userId: string): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const { error } = await supabaseAdmin
      .from('square_configurations')
      .delete()
      .eq('user_id', userId);

    if (error) {
      logger.error('[Square Config] Error deleting configuration:', {
        error: error.message,
        code: (error as any).code,
        userId,
        context: { endpoint: 'deleteSquareConfig', operation: 'delete' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    // Clear cached client instance
    const { clearSquareClientCache } = await import('./client');
    clearSquareClientCache(userId);
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error deleting configuration:', {
      error: error.message,
      userId,
      context: { endpoint: 'deleteSquareConfig', operation: 'delete' },
    });

    throw ApiErrorHandler.createError(
      'Failed to delete Square configuration',
      'DATABASE_ERROR',
      500,
    );
  }
}

/**
 * Update initial sync status.
 *
 * @param {string} userId - User ID
 * @param {object} statusUpdate - Status update
 * @returns {Promise<void>}
 */
export async function updateInitialSyncStatus(
  userId: string,
  statusUpdate: {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    error?: string;
  },
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const updateData: any = {
      initial_sync_status: statusUpdate.status,
      updated_at: new Date().toISOString(),
    };

    if (statusUpdate.status === 'in_progress' && !updateData.initial_sync_started_at) {
      updateData.initial_sync_started_at = new Date().toISOString();
    }

    if (statusUpdate.status === 'completed') {
      updateData.initial_sync_completed = true;
      updateData.initial_sync_completed_at = new Date().toISOString();
      updateData.initial_sync_error = null;
    }

    if (statusUpdate.status === 'failed' && statusUpdate.error) {
      updateData.initial_sync_error = statusUpdate.error;
    }

    const { error } = await supabaseAdmin
      .from('square_configurations')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      logger.error('[Square Config] Error updating initial sync status:', {
        error: error.message,
        code: (error as any).code,
        userId,
        context: { endpoint: 'updateInitialSyncStatus', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error updating initial sync status:', {
      error: error.message,
      userId,
      context: { endpoint: 'updateInitialSyncStatus', operation: 'update' },
    });

    throw ApiErrorHandler.createError(
      'Failed to update initial sync status',
      'DATABASE_ERROR',
      500,
    );
  }
}

/**
 * Update last sync timestamp for a sync type.
 *
 * @param {string} userId - User ID
 * @param {'full' | 'menu' | 'staff' | 'sales'} syncType - Sync type
 * @returns {Promise<void>}
 */
export async function updateLastSyncTimestamp(
  userId: string,
  syncType: 'full' | 'menu' | 'staff' | 'sales',
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const timestamp = new Date().toISOString();
    const updateData: any = {
      updated_at: timestamp,
    };

    switch (syncType) {
      case 'full':
        updateData.last_full_sync_at = timestamp;
        break;
      case 'menu':
        updateData.last_menu_sync_at = timestamp;
        break;
      case 'staff':
        updateData.last_staff_sync_at = timestamp;
        break;
      case 'sales':
        updateData.last_sales_sync_at = timestamp;
        break;
    }

    const { error } = await supabaseAdmin
      .from('square_configurations')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      logger.error('[Square Config] Error updating sync timestamp:', {
        error: error.message,
        code: (error as any).code,
        userId,
        syncType,
        context: { endpoint: 'updateLastSyncTimestamp', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error updating sync timestamp:', {
      error: error.message,
      userId,
      syncType,
      context: { endpoint: 'updateLastSyncTimestamp', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to update sync timestamp', 'DATABASE_ERROR', 500);
  }
}
