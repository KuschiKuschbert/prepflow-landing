/**
 * Initial Sync Service
 * Automatically syncs all existing PrepFlow data to Square when Square is first connected
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed initial sync documentation and usage examples.
 */

// Export types
export type { InitialSyncResult } from './initial-sync/types';

// Re-export functions
export { shouldPerformInitialSync } from './initial-sync/shouldPerformInitialSync';
export { performInitialSync } from './initial-sync/performInitialSync';
