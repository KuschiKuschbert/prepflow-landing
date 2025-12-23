/**
 * Square mappings service for ID mapping between Square and PrepFlow.
 * Handles mapping CRUD operations, conflict resolution, and automatic mapping creation.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Database Schema, Sync Operations sections) for
 * detailed mapping documentation and usage examples.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface SquareMapping {
  id: string;
  user_id: string;
  entity_type: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location';
  prepflow_id: string;
  square_id: string;
  square_location_id: string | null;
  sync_direction: 'bidirectional' | 'square_to_prepflow' | 'prepflow_to_square';
  last_synced_at: string | null;
  last_synced_from_square: string | null;
  last_synced_to_square: string | null;
  sync_metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface SquareMappingInput {
  user_id: string;
  entity_type: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location';
  prepflow_id: string;
  square_id: string;
  square_location_id?: string | null;
  sync_direction?: 'bidirectional' | 'square_to_prepflow' | 'prepflow_to_square';
  sync_metadata?: Record<string, any>;
}

/**
 * Create a new Square mapping.
 *
 * @param {SquareMappingInput} mapping - Mapping input
 * @returns {Promise<SquareMapping>} Created mapping
 */
export async function createMapping(mapping: SquareMappingInput): Promise<SquareMapping> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const mappingData = {
      user_id: mapping.user_id,
      entity_type: mapping.entity_type,
      prepflow_id: mapping.prepflow_id,
      square_id: mapping.square_id,
      square_location_id: mapping.square_location_id || null,
      sync_direction: mapping.sync_direction || 'bidirectional',
      sync_metadata: mapping.sync_metadata || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('square_mappings')
      .insert(mappingData)
      .select()
      .single();

    if (error) {
      logger.error('[Square Mappings] Error creating mapping:', {
        error: error.message,
        code: (error as any).code,
        mapping,
        context: { endpoint: 'createMapping', operation: 'insert' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    return data as SquareMapping;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error creating mapping:', {
      error: error.message,
      mapping,
      context: { endpoint: 'createMapping', operation: 'insert' },
    });

    throw ApiErrorHandler.createError('Failed to create mapping', 'DATABASE_ERROR', 500);
  }
}

/**
 * Get mapping by Square ID.
 *
 * @param {string} squareId - Square entity ID
 * @param {string} entityType - Entity type
 * @param {string} userId - User ID
 * @param {string} [squareLocationId] - Optional Square location ID
 * @returns {Promise<SquareMapping | null>} Mapping or null if not found
 */
export async function getMappingBySquareId(
  squareId: string,
  entityType: string,
  userId: string,
  squareLocationId?: string | null,
): Promise<SquareMapping | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    let query = supabaseAdmin
      .from('square_mappings')
      .select('*')
      .eq('square_id', squareId)
      .eq('entity_type', entityType)
      .eq('user_id', userId);

    if (squareLocationId) {
      query = query.eq('square_location_id', squareLocationId);
    } else {
      query = query.is('square_location_id', null);
    }

    const { data, error } = await query.maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.error('[Square Mappings] Error fetching mapping by Square ID:', {
        error: error.message,
        code: (error as any).code,
        squareId,
        entityType,
        userId,
        context: { endpoint: 'getMappingBySquareId', operation: 'select' },
      });
      return null;
    }

    return data as SquareMapping | null;
  } catch (error: any) {
    logger.error('[Square Mappings] Unexpected error fetching mapping by Square ID:', {
      error: error.message,
      squareId,
      entityType,
      userId,
      context: { endpoint: 'getMappingBySquareId', operation: 'select' },
    });
    return null;
  }
}

/**
 * Get mapping by PrepFlow ID.
 *
 * @param {string} prepflowId - PrepFlow entity ID
 * @param {string} entityType - Entity type
 * @param {string} userId - User ID
 * @returns {Promise<SquareMapping | null>} Mapping or null if not found
 */
export async function getMappingByPrepFlowId(
  prepflowId: string,
  entityType: string,
  userId: string,
): Promise<SquareMapping | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('square_mappings')
      .select('*')
      .eq('prepflow_id', prepflowId)
      .eq('entity_type', entityType)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.error('[Square Mappings] Error fetching mapping by PrepFlow ID:', {
        error: error.message,
        code: (error as any).code,
        prepflowId,
        entityType,
        userId,
        context: { endpoint: 'getMappingByPrepFlowId', operation: 'select' },
      });
      return null;
    }

    return data as SquareMapping | null;
  } catch (error: any) {
    logger.error('[Square Mappings] Unexpected error fetching mapping by PrepFlow ID:', {
      error: error.message,
      prepflowId,
      entityType,
      userId,
      context: { endpoint: 'getMappingByPrepFlowId', operation: 'select' },
    });
    return null;
  }
}

/**
 * Resolve a mapping conflict.
 *
 * @param {string} mappingId - Mapping ID
 * @param {'square' | 'prepflow' | 'manual'} resolution - Resolution strategy
 * @returns {Promise<void>}
 */
export async function resolveConflict(
  mappingId: string,
  resolution: 'square' | 'prepflow' | 'manual',
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Update sync direction based on resolution
    if (resolution === 'square') {
      updateData.sync_direction = 'square_to_prepflow';
    } else if (resolution === 'prepflow') {
      updateData.sync_direction = 'prepflow_to_square';
    } else {
      // Manual resolution - keep bidirectional but mark in metadata
      updateData.sync_direction = 'bidirectional';
      updateData.sync_metadata = {
        conflict_resolved: true,
        resolution: 'manual',
        resolved_at: new Date().toISOString(),
      };
    }

    const { error } = await supabaseAdmin
      .from('square_mappings')
      .update(updateData)
      .eq('id', mappingId);

    if (error) {
      logger.error('[Square Mappings] Error resolving conflict:', {
        error: error.message,
        code: (error as any).code,
        mappingId,
        resolution,
        context: { endpoint: 'resolveConflict', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error resolving conflict:', {
      error: error.message,
      mappingId,
      resolution,
      context: { endpoint: 'resolveConflict', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to resolve conflict', 'DATABASE_ERROR', 500);
  }
}

/**
 * Create automatic mapping for new entities.
 * Used when syncing new entities to Square.
 *
 * @param {string} prepflowId - PrepFlow entity ID
 * @param {string} squareId - Square entity ID
 * @param {string} entityType - Entity type
 * @param {string} userId - User ID
 * @param {string} [squareLocationId] - Optional Square location ID
 * @returns {Promise<SquareMapping>} Created mapping
 */
export async function createAutoMapping(
  prepflowId: string,
  squareId: string,
  entityType: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location',
  userId: string,
  squareLocationId?: string | null,
): Promise<SquareMapping> {
  return createMapping({
    user_id: userId,
    entity_type: entityType,
    prepflow_id: prepflowId,
    square_id: squareId,
    square_location_id: squareLocationId,
    sync_direction: 'prepflow_to_square', // Default for auto-created mappings
  });
}

/**
 * Find or create a mapping.
 * Returns existing mapping if found, otherwise creates a new one.
 *
 * @param {string} prepflowId - PrepFlow entity ID
 * @param {string} squareId - Square entity ID
 * @param {string} entityType - Entity type
 * @param {string} userId - User ID
 * @param {string} [squareLocationId] - Optional Square location ID
 * @returns {Promise<SquareMapping>} Mapping (existing or newly created)
 */
export async function findOrCreateMapping(
  prepflowId: string,
  squareId: string,
  entityType: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location',
  userId: string,
  squareLocationId?: string | null,
): Promise<SquareMapping> {
  // Try to find existing mapping by PrepFlow ID first
  const existingByPrepFlow = await getMappingByPrepFlowId(prepflowId, entityType, userId);
  if (existingByPrepFlow) {
    return existingByPrepFlow;
  }

  // Try to find existing mapping by Square ID
  const existingBySquare = await getMappingBySquareId(
    squareId,
    entityType,
    userId,
    squareLocationId,
  );
  if (existingBySquare) {
    return existingBySquare;
  }

  // Create new mapping
  return createAutoMapping(prepflowId, squareId, entityType, userId, squareLocationId);
}

/**
 * Update mapping sync timestamps.
 *
 * @param {string} mappingId - Mapping ID
 * @param {'from_square' | 'to_square' | 'both'} direction - Sync direction
 * @returns {Promise<void>}
 */
export async function updateMappingSyncTimestamp(
  mappingId: string,
  direction: 'from_square' | 'to_square' | 'both',
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const timestamp = new Date().toISOString();
    const updateData: any = {
      last_synced_at: timestamp,
      updated_at: timestamp,
    };

    if (direction === 'from_square' || direction === 'both') {
      updateData.last_synced_from_square = timestamp;
    }

    if (direction === 'to_square' || direction === 'both') {
      updateData.last_synced_to_square = timestamp;
    }

    const { error } = await supabaseAdmin
      .from('square_mappings')
      .update(updateData)
      .eq('id', mappingId);

    if (error) {
      logger.error('[Square Mappings] Error updating sync timestamp:', {
        error: error.message,
        code: (error as any).code,
        mappingId,
        direction,
        context: { endpoint: 'updateMappingSyncTimestamp', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error updating sync timestamp:', {
      error: error.message,
      mappingId,
      direction,
      context: { endpoint: 'updateMappingSyncTimestamp', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to update sync timestamp', 'DATABASE_ERROR', 500);
  }
}

/**
 * Get all mappings for a user and entity type.
 *
 * @param {string} userId - User ID
 * @param {string} [entityType] - Optional entity type filter
 * @returns {Promise<SquareMapping[]>} List of mappings
 */
export async function getUserMappings(
  userId: string,
  entityType?: string,
): Promise<SquareMapping[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    let query = supabaseAdmin
      .from('square_mappings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Square Mappings] Error fetching user mappings:', {
        error: error.message,
        code: (error as any).code,
        userId,
        entityType,
        context: { endpoint: 'getUserMappings', operation: 'select' },
      });
      return [];
    }

    return (data || []) as SquareMapping[];
  } catch (error: any) {
    logger.error('[Square Mappings] Unexpected error fetching user mappings:', {
      error: error.message,
      userId,
      entityType,
      context: { endpoint: 'getUserMappings', operation: 'select' },
    });
    return [];
  }
}

/**
 * Delete a mapping.
 *
 * @param {string} mappingId - Mapping ID
 * @returns {Promise<void>}
 */
export async function deleteMapping(mappingId: string): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const { error } = await supabaseAdmin.from('square_mappings').delete().eq('id', mappingId);

    if (error) {
      logger.error('[Square Mappings] Error deleting mapping:', {
        error: error.message,
        code: (error as any).code,
        mappingId,
        context: { endpoint: 'deleteMapping', operation: 'delete' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error deleting mapping:', {
      error: error.message,
      mappingId,
      context: { endpoint: 'deleteMapping', operation: 'delete' },
    });

    throw ApiErrorHandler.createError('Failed to delete mapping', 'DATABASE_ERROR', 500);
  }
}
