/**
 * Save Square configuration for a user.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { encryptSquareToken } from '../token-encryption';
import type { SquareConfig, SquareConfigInput } from './types';

/**
 * Save Square configuration for a user.
 * Encrypts the access token before storage.
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
    const configData: Record<string, unknown> = {
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
      logger.error('[Square Config] Error saving configuration:', {
        error: error.message,
        code: error.code,
        userId,
        context: { endpoint: 'saveSquareConfig', operation: 'upsert' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    return data as SquareConfig;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error saving configuration:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      context: { endpoint: 'saveSquareConfig', operation: 'upsert' },
    });

    throw ApiErrorHandler.createError('Failed to save Square configuration', 'DATABASE_ERROR', 500);
  }
}
