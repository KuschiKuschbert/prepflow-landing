/**
 * Sitemap Parser (Migrated from scripts)
 * Parses XML sitemaps to extract recipe URLs
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { SourceType, STORAGE_PATH } from '../config';
import { scraperLogger } from './logger';
import { EXCLUDE_PATTERNS, RECIPE_URL_PATTERNS, SITEMAP_URLS } from './sitemap-parser/config';

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

  filterRecipeUrls(urls: string[], source: SourceType): string[] {
    const pattern = RECIPE_URL_PATTERNS[source];
    if (!pattern) return [];
    return urls.filter(url => pattern.test(url) && !EXCLUDE_PATTERNS.some(ex => ex.test(url)));
  }

  getSitemapUrl(source: SourceType): string {
    return SITEMAP_URLS[source] || '';
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
