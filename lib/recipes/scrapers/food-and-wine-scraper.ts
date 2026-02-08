/**
 * Food and Wine Scraper (Migrated from scripts)
 */

import * as cheerio from 'cheerio';
import { isJSONLDRecipe, JSONLDRecipe, ScrapedRecipe, ScraperConfig } from '../types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';
import { BaseScraper } from './base-scraper';

export class FoodAndWineScraper extends BaseScraper {
  constructor(config?: Partial<ScraperConfig>) {
    super('foodandwine', config);
  }

  protected parseRecipe(html: string, url: string): Partial<ScrapedRecipe> | null {
    try {
      const $ = cheerio.load(html);
      const jsonLdScripts = $('script[type="application/ld+json"]');
      let recipeData: JSONLDRecipe | null = null;

      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const content = $(jsonLdScripts[i]).html();
          if (content) {
            const parsed = JSON.parse(content);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            recipeData = (items.find((item: any) => isJSONLDRecipe(item)) as JSONLDRecipe) || null;
            if (recipeData) break;
          }
        } catch {}
      }

      if (!recipeData) return null;

      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        recipe_name: recipeData.name || '',
        description: recipeData.description || '',
        // @ts-ignore
        instructions: (this as any).parseInstructions(recipeData.recipeInstructions || []),
        ingredients: (recipeData.recipeIngredient || []).map(ing => ({
          name: ing.replace(/^\d+\s*/, '').trim(),
          original_text: ing,
        })),
        image_url:
          typeof recipeData.image === 'string'
            ? recipeData.image
            : Array.isArray(recipeData.image)
              ? typeof recipeData.image[0] === 'string'
                ? recipeData.image[0]
                : (recipeData.image[0] as any).url
              : (recipeData.image as any)?.url,
      };

      return recipe;
    } catch (error) {
      scraperLogger.error('Error parsing Food and Wine recipe:', error);
      return null;
    }
  }

  async getRecipeUrls(limit: number = 50): Promise<string[]> {
    const sitemapParser = new SitemapParser();
    const urls = await sitemapParser.discoverRecipeUrls('foodandwine');
    return urls.slice(0, limit);
  }

  async getAllRecipeUrls(): Promise<string[]> {
    const sitemapParser = new SitemapParser();
    return sitemapParser.discoverRecipeUrls('foodandwine');
  }
}
