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

function formatLogEntry(entry: LogEntry): string {
  return isDev ? JSON.stringify(entry, null, 2) : JSON.stringify(entry);
}

export const logger = {
  dev: (message: string, data?: unknown): void => {
    if (isDev) {
      const entry = createLogEntry('dev', message, data);
      logger.dev(formatLogEntry(entry));
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
    logger.error(formatLogEntry(entry));
  },

  warn: (message: string, context?: ErrorContext): void => {
    const entry = createLogEntry('warn', message, context);
    logger.warn(formatLogEntry(entry));
  },

  info: (message: string, context?: ErrorContext): void => {
    if (isDev) {
      const entry = createLogEntry('info', message, context);
      logger.info(formatLogEntry(entry));
    }
  },

  debug: (message: string, data?: unknown): void => {
    if (isDev) {
      const entry = createLogEntry('debug', message, data);
      logger.debug(formatLogEntry(entry));
    }
  },
};

export const devLog = logger.dev;
export const devInfo = logger.info;
export const devDebug = logger.debug;
