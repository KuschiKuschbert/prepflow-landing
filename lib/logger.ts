/**
 * Production-safe logging utility
 * Prevents console.log from appearing in production builds
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Development-only logs
   * These are completely stripped from production builds
   */
  dev: (...args: unknown[]): void => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Error logs
   * Always shown in production for debugging
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  /**
   * Warning logs
   * Always shown in production for important warnings
   */
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  },

  /**
   * Info logs (for non-critical information)
   * Only shown in development
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * Debug logs (for detailed debugging)
   * Only shown in development
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.debug(...args);
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
