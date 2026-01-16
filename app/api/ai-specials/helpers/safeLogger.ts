import { logger } from '@/lib/logger';

/* eslint-disable no-console */
/**
 * Safe logger wrapper that never throws errors
 * Used as fallback when logger itself might fail
 * Intentionally uses console methods as last resort fallback
 */
export const safeLogger = {
  error: (message: string, data?: unknown): void => {
    try {
      logger.error(message, data);
    } catch {
      // Logger failed, use console.error as last resort
      // This is intentional - we need a fallback when logger itself fails
      console.error(`[SafeLogger] ${message}`, data);
    }
  },
  warn: (message: string, data?: unknown): void => {
    try {
      logger.warn(message, data);
    } catch {
      console.warn(`[SafeLogger] ${message}`, data);
    }
  },
  info: (message: string, data?: unknown): void => {
    try {
      logger.info(message, data);
    } catch {
      console.info(`[SafeLogger] ${message}`, data);
    }
  },
  debug: (message: string, data?: unknown): void => {
    try {
      logger.debug(message, data);
    } catch {
      console.debug(`[SafeLogger] ${message}`, data);
    }
  },
};
/* eslint-enable no-console */
