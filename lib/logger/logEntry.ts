/**
 * Log entry creation and formatting utilities.
 */

export interface ErrorContext {
  userId?: string;
  entityId?: string;
  entityType?: string;
  endpoint?: string;
  component?: string;
  hook?: string;
  operation?: string;
  table?: string;
  [key: string]: unknown;
}

interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug' | 'dev';
  message: string;
  timestamp: string;
  context?: ErrorContext;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
  data?: unknown;
}

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
 * Safely stringify an object, handling circular references and large objects.
 *
 * @param {unknown} obj - Object to stringify
 * @param {boolean} pretty - Whether to format with indentation
 * @returns {string} Stringified object
 */
export function safeStringify(obj: unknown, pretty = false): string {
  try {
    // Handle circular references and large objects
    const seen = new WeakSet();
    const replacer = (key: string, value: unknown) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);

        // Limit depth and size for very large objects
        if (key === 'stack' && typeof value === 'string') {
          const stackValue = value as string;
          if (stackValue.length > 1000) {
            return stackValue.substring(0, 1000) + '... [truncated]';
          }
        }
      }
      return value;
    };

    const json = pretty ? JSON.stringify(obj, replacer, 2) : JSON.stringify(obj, replacer);

    // Truncate if still too large (safety limit ~10MB)
    const MAX_LENGTH = 10 * 1024 * 1024;
    if (json.length > MAX_LENGTH) {
      return json.substring(0, MAX_LENGTH) + '... [truncated]';
    }

    return json;
  } catch (err) {
    return `[Error stringifying: ${err instanceof Error ? err.message : String(err)}]`;
  }
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
