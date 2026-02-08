/**
 * Sitemap Parser (Migrated from scripts)
 * Parses XML sitemaps to extract recipe URLs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { SOURCES, SourceType, STORAGE_PATH } from '../config';
import { scraperLogger } from './logger';

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

        // Parse sitemaps in parallel batches for better performance
        const BATCH_SIZE = 10;
        const totalSitemaps = sitemapUrls.length;
        scraperLogger.info(`Parsing ${totalSitemaps} sitemaps in batches of ${BATCH_SIZE}...`);

        for (let i = 0; i < sitemapUrls.length; i += BATCH_SIZE) {
          if (this.checkStopFlag()) {
            scraperLogger.info(
              `🛑 Stop flag detected during sitemap parsing, stopping immediately`,
            );
            throw new Error('Scraping stopped by user');
          }

          const batch = sitemapUrls.slice(i, i + BATCH_SIZE);
          const batchPromises = batch.map(async subSitemapUrl => {
            try {
              return await this.parseSitemap(subSitemapUrl);
            } catch (error) {
              if (error instanceof Error && error.message === 'Scraping stopped by user')
                throw error;
              return [];
            }
          });

          const batchResults = await Promise.all(batchPromises);
          for (const subUrls of batchResults) {
            urls.push(...subUrls);
          }

          if (this.checkStopFlag()) {
            throw new Error('Scraping stopped by user');
          }

          if (i + BATCH_SIZE < sitemapUrls.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
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
    const patterns: Partial<Record<string, RegExp>> = {
      [SOURCES.ALLRECIPES]: /allrecipes\.com\/recipe\//i,
      [SOURCES.FOOD_NETWORK]: /foodnetwork\.com\/recipes\/[^/]+$/i,
      [SOURCES.RECIPE_NLG]: /recipe-nlg/i,
      [SOURCES.EPICURIOUS]: /epicurious\.com\/recipes\/food\/views\//i,
      [SOURCES.BON_APPETIT]: /bonappetit\.com\/recipe\//i,
      [SOURCES.TASTY]: /tasty\.co\/recipe\//i,
      [SOURCES.FOOD_AND_WINE]: /foodandwine\.com\/recipe\//i,
    };

    const pattern = patterns[source as any];
    if (!pattern) return [];

    return urls.filter(url => {
      if (!pattern.test(url)) return false;
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
  }

  /**
   * Get sitemap URL for a source
   */
  getSitemapUrl(source: SourceType): string {
    const sitemapUrls: Partial<Record<string, string>> = {
      [SOURCES.ALLRECIPES]: 'https://www.allrecipes.com/sitemap.xml',
      [SOURCES.FOOD_NETWORK]: 'https://www.foodnetwork.com/sitemap.xml',
      [SOURCES.EPICURIOUS]: 'https://www.epicurious.com/sitemap.xml',
      [SOURCES.BON_APPETIT]: 'https://www.bonappetit.com/sitemap.xml',
      [SOURCES.TASTY]: 'https://tasty.co/sitemaps/tasty/sitemap.xml',
      [SOURCES.FOOD_AND_WINE]: 'https://www.foodandwine.com/sitemap.xml',
    };

    return sitemapUrls[source as any] || '';
  }

  /**
   * Discover all recipe URLs from sitemap for a source
   */
  async discoverRecipeUrls(source: SourceType): Promise<string[]> {
    if (this.checkStopFlag()) throw new Error('Scraping stopped by user');

    const sitemapUrl = this.getSitemapUrl(source);
    if (!sitemapUrl) return [];

    try {
      const allUrls = await this.parseSitemap(sitemapUrl);
      if (this.checkStopFlag()) throw new Error('Scraping stopped by user');
      return this.filterRecipeUrls(allUrls, source);
    } catch (error) {
      if (error instanceof Error && error.message === 'Scraping stopped by user') throw error;
      return [];
    }
  }
}
