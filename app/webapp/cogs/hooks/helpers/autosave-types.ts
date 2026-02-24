/**
 * Shared types for recipe ingredients autosave.
 * Extracted to avoid circular dependencies.
 */

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';
