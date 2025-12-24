/**
 * Square mappings service for ID mapping between Square and PrepFlow.
 * Handles mapping CRUD operations, conflict resolution, and automatic mapping creation.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Database Schema, Sync Operations sections) for
 * detailed mapping documentation and usage examples.
 */

// Export types
export type { SquareMapping, SquareMappingInput } from './mappings/types';

// Re-export functions
export { createMapping } from './mappings/create';
export { getMappingBySquareId } from './mappings/getBySquareId';
export { getMappingByPrepFlowId } from './mappings/getByPrepFlowId';
export { resolveConflict } from './mappings/resolveConflict';
export { createAutoMapping } from './mappings/createAutoMapping';
export { findOrCreateMapping } from './mappings/findOrCreateMapping';
export { updateMappingSyncTimestamp } from './mappings/updateSyncTimestamp';
export { getUserMappings } from './mappings/getUserMappings';
export { deleteMapping } from './mappings/delete';
