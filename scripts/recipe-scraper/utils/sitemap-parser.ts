/**
 * Sitemap Parser
 * Parses XML sitemaps to extract recipe URLs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { scraperLogger } from './logger';
import { SourceType, SOURCES, STORAGE_PATH } from '../config';
import { logger } from '@/lib/logger';

export class SitemapParser {
  private httpClient = axios.create({
    timeout: 30000,
    headers: {
      'User-Agent': 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
    },
  });

  /**
   * Check if stop flag exists
   */
  private checkStopFlag(): boolean {
    try {
      const storagePath = path.resolve(STORAGE_PATH);
      const stopFlagPath = path.join(storagePath, '.stop-flag');
      return fs.existsSync(stopFlagPath);
    } catch {
      return false;
    }
  }

  /**
   * Parse a sitemap XML file and extract URLs
   */
  async parseSitemap(sitemapUrl: string): Promise<string[]> {
    try {
      scraperLogger.info(`Parsing sitemap: ${sitemapUrl}`);
      const response = await this.httpClient.get(sitemapUrl, {
        responseType: 'text',
      });

      const urls: string[] = [];
      const $ = cheerio.load(response.data, { xmlMode: true });

      // Handle sitemap index (contains references to other sitemaps)
      const sitemapIndex = $('sitemapindex > sitemap');
      if (sitemapIndex.length > 0) {
        scraperLogger.info(`Found sitemap index with ${sitemapIndex.length} sitemaps`);
        const sitemapUrls: string[] = [];

        sitemapIndex.each((_, el) => {
          const loc = $(el).find('loc').text().trim();
          if (loc) {
            sitemapUrls.push(loc);
          }
        });

        // Parse each sitemap in the index
        for (const subSitemapUrl of sitemapUrls) {
          // Check stop flag before parsing each sub-sitemap
          if (this.checkStopFlag()) {
            scraperLogger.info(`🛑 Stop flag detected during sitemap parsing, stopping immediately`);
            throw new Error('Scraping stopped by user');
          }

          try {
            const subUrls = await this.parseSitemap(subSitemapUrl);
            urls.push(...subUrls);

            // Check stop flag after parsing each sub-sitemap
            if (this.checkStopFlag()) {
              scraperLogger.info(`🛑 Stop flag detected after parsing sub-sitemap, stopping immediately`);
              throw new Error('Scraping stopped by user');
            }

            // Small delay between sitemap requests
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            // If it's a stop error, re-throw it
            if (error instanceof Error && error.message === 'Scraping stopped by user') {
              throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.warn(`[Sitemap Parser] Failed to parse sub-sitemap ${subSitemapUrl}:`, {
              error: errorMessage,
            });
            scraperLogger.warn(`Failed to parse sub-sitemap ${subSitemapUrl}:`, error);
          }
        }

        return urls;
      }

      // Handle regular sitemap (contains URLs)
      const urlElements = $('urlset > url, sitemap > url');
      urlElements.each((_, el) => {
        const loc = $(el).find('loc').text().trim();
        if (loc) {
          urls.push(loc);
        }
      });

      scraperLogger.info(`Extracted ${urls.length} URLs from sitemap`);
      return urls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(`Error parsing sitemap ${sitemapUrl}:`, errorMessage);
      throw new Error(`Failed to parse sitemap: ${errorMessage}`);
    }
  }

  /**
   * Filter URLs to only include recipe URLs for a specific source
   */
  filterRecipeUrls(urls: string[], source: SourceType): string[] {
    const patterns: Partial<Record<SourceType, RegExp>> = {
      [SOURCES.ALLRECIPES]: /allrecipes\.com\/recipe\//i,
      // [SOURCES.BBC_GOOD_FOOD]: /bbcgoodfood\.com\/recipes\/[^/]+$/i, // DISABLED - Terms of Service violation
      [SOURCES.FOOD_NETWORK]: /foodnetwork\.com\/recipes\/[^/]+$/i,
      [SOURCES.RECIPE_NLG]: /recipe-nlg/i,
      [SOURCES.EPICURIOUS]: /epicurious\.com\/recipes\/food\/views\//i,
      [SOURCES.BON_APPETIT]: /bonappetit\.com\/recipe\//i,
      [SOURCES.TASTY]: /tasty\.co\/recipe\//i,
    };

    const pattern = patterns[source];
    if (!pattern) {
      if (source === SOURCES.BBC_GOOD_FOOD) {
        scraperLogger.warn(`BBC Good Food scraper is disabled due to Terms of Service violation`);
      } else {
        scraperLogger.warn(`No URL pattern defined for source: ${source}`);
      }
      return [];
    }

    const filtered = urls.filter(url => {
      // Must match the pattern
      if (!pattern.test(url)) {
        return false;
      }

      // Exclude category/collection pages
      const excludePatterns = [
        /\/collection\//i,
        /\/category\//i,
        /\/photos\//i,
        /\/search\//i,
        /\/tag\//i,
        /\/author\//i,
        /\/page\//i,
      ];

      return !excludePatterns.some(excludePattern => excludePattern.test(url));
    });

    scraperLogger.info(
      `Filtered ${urls.length} URLs to ${filtered.length} recipe URLs for ${source}`,
    );
    return filtered;
  }

  /**
   * Get sitemap URL for a source
   */
  getSitemapUrl(source: SourceType): string {
    const sitemapUrls: Partial<Record<SourceType, string>> = {
      [SOURCES.ALLRECIPES]: 'https://www.allrecipes.com/sitemap.xml',
      // [SOURCES.BBC_GOOD_FOOD]: 'https://www.bbcgoodfood.com/sitemap.xml', // REMOVED - Terms of Service violation
      [SOURCES.FOOD_NETWORK]: 'https://www.foodnetwork.com/sitemap.xml',
      [SOURCES.RECIPE_NLG]: '', // No sitemap for this source
      [SOURCES.EPICURIOUS]: 'https://www.epicurious.com/sitemap.xml',
      [SOURCES.BON_APPETIT]: 'https://www.bonappetit.com/sitemap.xml',
      [SOURCES.TASTY]: 'https://tasty.co/sitemaps/tasty/sitemap.xml',
    };

    return sitemapUrls[source] || '';
  }

  /**
   * Discover all recipe URLs from sitemap for a source
   */
  async discoverRecipeUrls(source: SourceType): Promise<string[]> {
    // Check stop flag before starting discovery
    if (this.checkStopFlag()) {
      scraperLogger.info(`🛑 Stop flag detected before URL discovery for ${source}, stopping immediately`);
      throw new Error('Scraping stopped by user');
    }

    const sitemapUrl = this.getSitemapUrl(source);
    if (!sitemapUrl) {
      scraperLogger.warn(`No sitemap URL configured for source: ${source}`);
      return [];
    }

    try {
      const allUrls = await this.parseSitemap(sitemapUrl);

      // Check stop flag after parsing
      if (this.checkStopFlag()) {
        scraperLogger.info(`🛑 Stop flag detected after URL discovery for ${source}, stopping immediately`);
        throw new Error('Scraping stopped by user');
      }

      const recipeUrls = this.filterRecipeUrls(allUrls, source);
      return recipeUrls;
    } catch (error) {
      // If it's a stop error, re-throw it
      if (error instanceof Error && error.message === 'Scraping stopped by user') {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(
        `Failed to discover recipe URLs from sitemap for ${source}:`,
        errorMessage,
      );
      return [];
    }
  }
}
