/**
 * Scraper factory for creating scraper instances (API Helper)
 * Now points to central lib/recipes/factory
 */

import { getScraper } from '@/lib/recipes/factory';
import { BaseScraper } from '@/lib/recipes/scrapers/base-scraper';
import { SourceType } from '@/lib/recipes/types';

export type ScraperInstance = BaseScraper;

/**
 * Create scraper instance for source
 */
export function createScraper(source: SourceType): ScraperInstance {
  return getScraper(source);
}
