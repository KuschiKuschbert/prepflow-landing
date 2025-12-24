/**
 * Sync log service for operation logging and audit trail.
 * Tracks all sync operations, errors, and retry attempts.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Database Schema, Sync Operations sections) for
 * detailed sync logging documentation and usage examples.
 */

// Export types
export type { SyncLog, SyncOperation } from './sync-log/types';

// Re-export functions
export { logSyncOperation } from './sync-log/logSyncOperation';
export { getSyncHistory } from './sync-log/getSyncHistory';
export { getSyncErrors } from './sync-log/getSyncErrors';
export { getPendingRetries } from './sync-log/getPendingRetries';
export { updateSyncLogRetry } from './sync-log/updateSyncLogRetry';
