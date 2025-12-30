/**
 * Create automatic mapping for new entities.
 */
import { createMapping } from './create';
import type { SquareMapping } from './types';

/**
 * Create automatic mapping for new entities.
 * Used when syncing new entities to Square.
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



