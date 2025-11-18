/**
 * Reusable optimistic update utilities for common CRUD operations.
 * Provides generic functions for optimistic updates with automatic rollback on error.
 */

// Re-export all optimistic update functions from specialized modules
export * from './optimistic-updates/delete';
export * from './optimistic-updates/update';
export * from './optimistic-updates/create';
export * from './optimistic-updates/reorder';
