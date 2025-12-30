/**
 * Update Square configuration for a user.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { encryptSquareToken } from '../token-encryption';
import type { SquareConfig, SquareConfigInput } from './types';

/**
 * Update Square configuration for a user.
 * Only updates provided fields, preserves existing values for others.
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

    // Encrypt refresh token if provided
    if (updates.refresh_token) {
      updateData.refresh_token_encrypted = await encryptSquareToken(updates.refresh_token);
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




