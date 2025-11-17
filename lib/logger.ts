const isDev = process.env.NODE_ENV === 'development';

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
 * Safely stringify an object, handling circular references and large objects
 */
function safeStringify(obj: unknown, pretty = false): string {
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

function formatLogEntry(entry: LogEntry): string {
  return isDev ? safeStringify(entry, true) : safeStringify(entry, false);
}

export const logger = {
  dev: (message: string, data?: unknown): void => {
    if (isDev) {
      const entry = createLogEntry('dev', message, data);
      const formatted = formatLogEntry(entry);
      console.log(`[DEV] ${formatted}`);
    }
  },

  error: (
    message: string,
    contextOrError?: ErrorContext | Error | unknown,
    error?: Error,
  ): void => {
    let logError: Error | undefined;
    let context: ErrorContext | undefined;
    if (contextOrError instanceof Error) {
      logError = contextOrError;
    } else if (contextOrError && typeof contextOrError === 'object') {
      context = contextOrError as ErrorContext;
      if (error) {
        logError = error;
      }
    }

    const entry = createLogEntry('error', message, context, logError);
    const formatted = formatLogEntry(entry);
    console.error(`[ERROR] ${formatted}`);
  },

  warn: (message: string, context?: ErrorContext): void => {
    const entry = createLogEntry('warn', message, context);
    const formatted = formatLogEntry(entry);
    console.warn(`[WARN] ${formatted}`);
  },

  info: (message: string, context?: ErrorContext): void => {
    if (isDev) {
      const entry = createLogEntry('info', message, context);
      const formatted = formatLogEntry(entry);
      console.info(`[INFO] ${formatted}`);
    }
  },

  debug: (message: string, data?: unknown): void => {
    if (isDev) {
      const entry = createLogEntry('debug', message, data);
      const formatted = formatLogEntry(entry);
      console.debug(`[DEBUG] ${formatted}`);
    }
  },
};

export const devLog = logger.dev;
export const devInfo = logger.info;
export const devDebug = logger.debug;
