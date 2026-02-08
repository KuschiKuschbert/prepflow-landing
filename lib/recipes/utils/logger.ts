/**
 * Migrated Scraper Logger Wrapper
 * Bridges legacy scraper logging to the core application logger.
 */

import { logger } from '@/lib/logger';

export const scraperLogger = {
  info: (message: string, context?: any) => logger.info(message, context),
  warn: (message: string, context?: any) => logger.warn(message, context),
  error: (message: string, context?: any) => logger.error(message, context),
  debug: (message: string, context?: any) => logger.debug(message, context),
};
