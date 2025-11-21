/**
 * Logger utilities - re-exported from specialized modules.
 */

import { createLogEntry, formatLogEntry, type ErrorContext } from './logger/logEntry';

const isDev = process.env.NODE_ENV === 'development';

// Re-export types
export type { ErrorContext } from './logger/logEntry';

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

  warn: (message: string, context?: ErrorContext | unknown): void => {
    const entry = createLogEntry('warn', message, context);
    const formatted = formatLogEntry(entry);
    console.warn(`[WARN] ${formatted}`);
  },

  info: (message: string, context?: ErrorContext | unknown): void => {
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
