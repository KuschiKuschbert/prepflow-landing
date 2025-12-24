/**
 * Square configuration service for user-specific config management.
 * Handles CRUD operations for Square configurations with encrypted token storage.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` for comprehensive Square API
 * configuration, setup, testing, and troubleshooting guide.
 *
 * @module lib/square/config
 */

// Export types
export type { SquareConfig, SquareConfigInput } from './config/types';

// Re-export functions
export { getSquareConfig } from './config/get';
export { saveSquareConfig } from './config/save';
export { updateSquareConfig } from './config/update';
export { deleteSquareConfig } from './config/delete';
export { updateInitialSyncStatus } from './config/updateInitialSyncStatus';
export { updateLastSyncTimestamp } from './config/updateLastSyncTimestamp';
