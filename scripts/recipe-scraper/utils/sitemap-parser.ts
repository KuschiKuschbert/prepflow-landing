/**
 * Sitemap Parser
 * Parses XML sitemaps to extract recipe URLs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { scraperLogger } from './logger';
import { SourceType, SOURCES } from '../config';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export class SitemapParser {
  private httpClient = axios.create({
    timeout: 30000,
    headers: {
      'User-Agent': 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
    },
  });

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
          try {
            const subUrls = await this.parseSitemap(subSitemapUrl);
            urls.push(...subUrls);
            // Small delay between sitemap requests
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
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
    const patterns: Record<SourceType, RegExp> = {
      [SOURCES.ALLRECIPES]: /allrecipes\.com\/recipe\//i,
      [SOURCES.BBC_GOOD_FOOD]: /bbcgoodfood\.com\/recipes\/[^/]+$/i,
      [SOURCES.FOOD_NETWORK]: /foodnetwork\.com\/recipes\/[^/]+$/i,
      [SOURCES.RECIPE_NLG]: /recipe-nlg/i,
    };

    const pattern = patterns[source];
    if (!pattern) {
      scraperLogger.warn(`No URL pattern defined for source: ${source}`);
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
    const sitemapUrls: Record<SourceType, string> = {
      [SOURCES.ALLRECIPES]: 'https://www.allrecipes.com/sitemap.xml',
      [SOURCES.BBC_GOOD_FOOD]: 'https://www.bbcgoodfood.com/sitemap.xml',
      [SOURCES.FOOD_NETWORK]: 'https://www.foodnetwork.com/sitemap.xml',
      [SOURCES.RECIPE_NLG]: '', // No sitemap for this source
    };

    return sitemapUrls[source] || '';
  }

  /**
   * Discover all recipe URLs from sitemap for a source
   */
  async discoverRecipeUrls(source: SourceType): Promise<string[]> {
    const sitemapUrl = this.getSitemapUrl(source);
    if (!sitemapUrl) {
      scraperLogger.warn(`No sitemap URL configured for source: ${source}`);
      return [];
    }

    try {
      const allUrls = await this.parseSitemap(sitemapUrl);
      const recipeUrls = this.filterRecipeUrls(allUrls, source);
      return recipeUrls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(`Failed to discover recipe URLs from sitemap for ${source}:`, errorMessage);
      return [];
    }
  }
}

