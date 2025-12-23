/**
 * Log entry creation and formatting utilities.
 */

import type { ErrorContext, LogEntry } from './logEntry/types';
import { safeStringify } from './logEntry/helpers/safeStringify';

export type { ErrorContext, LogEntry };

const isDev = process.env.NODE_ENV === 'development';

/**
 * Create a log entry object.
 *
 * @param {LogEntry['level']} level - Log level
 * @param {string} message - Log message
 * @param {ErrorContext | unknown} contextOrData - Context or data object
 * @param {Error} error - Optional error object
 * @returns {LogEntry} Log entry object
 */
export function createLogEntry(
  level: LogEntry['level'],
  message: string,
  contextOrData?: ErrorContext | unknown,
  error?: Error,
): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (contextOrData && typeof contextOrData === 'object' && !Array.isArray(contextOrData)) {
    const context = contextOrData as ErrorContext;
    if (
      context.userId ||
      context.entityId ||
      context.endpoint ||
      context.component ||
      context.hook
    ) {
      entry.context = context;
    } else {
      entry.data = contextOrData;
    }
  } else if (contextOrData !== undefined) {
    entry.data = contextOrData;
  }
  if (error) {
    entry.error = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }

  return entry;
}

/**
 * Format log entry for output.
 *
 * @param {LogEntry} entry - Log entry to format
 * @returns {string} Formatted log string
 */
export function formatLogEntry(entry: LogEntry): string {
  return isDev ? safeStringify(entry, true) : safeStringify(entry, false);
}

// Re-export safeStringify for convenience
export { safeStringify } from './logEntry/helpers/safeStringify';
