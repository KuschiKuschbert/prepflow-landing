/**
 * Migrated Scraper Logger Wrapper
 * Bridges legacy scraper logging to the core application logger.
 */

import { logger } from '@/lib/logger';

export const scraperLogger = {
  info: (message: string, context?: unknown) => logger.info(message, context),
  warn: (message: string, context?: unknown) => logger.warn(message, context),
  error: (message: string, context?: unknown) => logger.error(message, context),
  debug: (message: string, context?: unknown) => logger.debug(message, context),
};
