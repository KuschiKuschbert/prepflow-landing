/**
 * Production-safe logging utility with structured logging support
 * Prevents console.log from appearing in production builds
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * Error context for structured logging
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

/**
 * Structured log entry
 */
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

/**
 * Create structured log entry
 */
function createLogEntry(
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

  // Handle context object
  if (contextOrData && typeof contextOrData === 'object' && !Array.isArray(contextOrData)) {
    const context = contextOrData as ErrorContext;
    // Check if it looks like a context object (has common context keys)
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

  // Add error details if provided
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
 * Format log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  if (isDev) {
    // Pretty format for development
    return JSON.stringify(entry, null, 2);
  }
  // Compact JSON for production (better for log aggregation)
  return JSON.stringify(entry);
}

export const logger = {
  /**
   * Development-only logs
   * These are completely stripped from production builds
   */
  dev: (message: string, data?: unknown): void => {
    if (isDev) {
      const entry = createLogEntry('dev', message, data);
      console.log(formatLogEntry(entry));
    }
  },

  /**
   * Error logs with structured logging support
   * Always shown in production for debugging
   *
   * @param message - Error message
   * @param contextOrError - Error context object or Error instance
   * @param error - Optional Error instance (if context is provided separately)
   *
   * @example
   * logger.error('[API] Failed to fetch', { endpoint: '/api/recipes', userId: '123' });
   * logger.error('[API] Failed to fetch', error);
   * logger.error('[API] Failed to fetch', { endpoint: '/api/recipes' }, error);
   */
  error: (
    message: string,
    contextOrError?: ErrorContext | Error | unknown,
    error?: Error,
  ): void => {
    let logError: Error | undefined;
    let context: ErrorContext | undefined;

    // Determine if first arg is Error or context
    if (contextOrError instanceof Error) {
      logError = contextOrError;
    } else if (contextOrError && typeof contextOrError === 'object') {
      context = contextOrError as ErrorContext;
      if (error) {
        logError = error;
      }
    }

    const entry = createLogEntry('error', message, context, logError);
    console.error(formatLogEntry(entry));
  },

  /**
   * Warning logs with structured logging support
   * Always shown in production for important warnings
   *
   * @param message - Warning message
   * @param context - Optional context object
   *
   * @example
   * logger.warn('[Recipe] Missing instructions', { recipeId: '123' });
   */
  warn: (message: string, context?: ErrorContext): void => {
    const entry = createLogEntry('warn', message, context);
    console.warn(formatLogEntry(entry));
  },

  /**
   * Info logs (for non-critical information)
   * Only shown in development
   *
   * @param message - Info message
   * @param context - Optional context object
   *
   * @example
   * logger.info('[API] Request started', { endpoint: '/api/recipes' });
   */
  info: (message: string, context?: ErrorContext): void => {
    if (isDev) {
      const entry = createLogEntry('info', message, context);
      console.info(formatLogEntry(entry));
    }
  },

  /**
   * Debug logs (for detailed debugging)
   * Only shown in development
   *
   * @param message - Debug message
   * @param data - Optional debug data
   *
   * @example
   * logger.debug('[Hook] State update', { state: currentState });
   */
  debug: (message: string, data?: unknown): void => {
    if (isDev) {
      const entry = createLogEntry('debug', message, data);
      console.debug(formatLogEntry(entry));
    }
  },
};

/**
 * Legacy console methods for files that haven't been migrated yet
 * These will be gradually replaced
 */
export const devLog = logger.dev;
export const devInfo = logger.info;
export const devDebug = logger.debug;
