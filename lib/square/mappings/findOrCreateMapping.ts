/**
 * Find or create a mapping.
 */
import { getMappingBySquareId } from './getBySquareId';
import { getMappingByPrepFlowId } from './getByPrepFlowId';
import { createAutoMapping } from './createAutoMapping';
import type { SquareMapping } from './types';

/**
 * Find or create a mapping.
 * Returns existing mapping if found, otherwise creates a new one.
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
