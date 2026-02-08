/**
 * AllRecipes Scraper (Migrated from scripts)
 */

import * as cheerio from 'cheerio';
import {
  isJSONLDRecipe,
  JSONLDRecipe,
  RecipeIngredient,
  ScrapedRecipe,
  ScraperConfig,
} from '../types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';
import { BaseScraper } from './base-scraper';

export class AllRecipesScraper extends BaseScraper {
  constructor(config?: Partial<ScraperConfig>) {
    super('allrecipes', config);
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

      if (!recipeData) {
        scraperLogger.warn('No JSON-LD recipe data found, falling back to HTML parsing');
        return this.parseFromHTML($, url);
      }

      const cookingMethod = recipeData.cookingMethod;
      // @ts-ignore - temperature extraction logic
      const temperatureData =
        (typeof cookingMethod === 'object' && cookingMethod?.temperature) ||
        (recipeData as any).temperature;

      const recipe: Partial<ScrapedRecipe> = {
        id: recipeData.url || url,
        recipe_name: recipeData.name || recipeData.headline || 'Untitled Recipe',
        description: recipeData.description || '',
        // @ts-ignore - parseInstructions is protected in BaseScraper
        instructions: (this as any).parseInstructions(recipeData.recipeInstructions || []),
        ingredients: this.parseIngredients(recipeData.recipeIngredient || []),
        yield: this.parseYield(recipeData.recipeYield),
        yield_unit: 'servings',
        prep_time_minutes: this.parseDuration(recipeData.prepTime),
        cook_time_minutes: this.parseDuration(recipeData.cookTime),
        total_time_minutes: this.parseDuration(recipeData.totalTime),
        // @ts-ignore - parseTemperature is protected
        ...(this as any).parseTemperature(temperatureData),
        image_url: this.parseImage(recipeData.image),
        // @ts-ignore - parseAuthor is protected
        author: (this as any).parseAuthor(recipeData.author),
        // @ts-ignore - parseRating is protected
        rating: (this as any).parseRating(recipeData.aggregateRating?.ratingValue),
      };

      if (recipeData.recipeCategory) {
        recipe.category = Array.isArray(recipeData.recipeCategory)
          ? recipeData.recipeCategory[0]
          : recipeData.recipeCategory;
      }
      if (recipeData.recipeCuisine) {
        recipe.cuisine = Array.isArray(recipeData.recipeCuisine)
          ? recipeData.recipeCuisine[0]
          : recipeData.recipeCuisine;
      }

      return recipe;
    } catch (error) {
      scraperLogger.error('Error parsing AllRecipes recipe:', error);
      return null;
    }
  }

  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      const recipeName =
        $('h1.article-heading, h1.heading-content, h1').first().text().trim() || '';
      const description =
        $('.recipe-summary, .article-subheading, [data-testid="recipe-summary"]')
          .first()
          .text()
          .trim() || '';

      let instructions: string[] = [];
      const instructionSelectors = [
        '.mntl-sc-block-group--OL li',
        '.recipe-instructions li',
        '.directions--section__step',
      ];
      for (const selector of instructionSelectors) {
        const found = $(selector)
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0);
        if (found.length > 0) {
          instructions = found;
          break;
        }
      }

      let ingredients: RecipeIngredient[] = [];
      const ingredientSelectors = [
        '.mm-recipes-structured-ingredients__list-item',
        '.ingredients-item-name',
      ];
      for (const selector of ingredientSelectors) {
        const found = $(selector)
          .map((_, el) => {
            const text = $(el).text().trim();
            // @ts-ignore - parseIngredientName is protected
            const name = (this as any).parseIngredientName(text);
            return text.length > 0 ? { name: name || text, original_text: text } : null;
          })
          .get()
          .filter((ing): ing is RecipeIngredient => ing !== null);
        if (found.length > 0) {
          ingredients = found;
          break;
        }
      }

      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        recipe_name: recipeName,
        description,
        instructions,
        ingredients,
        image_url: $('meta[property="og:image"]').attr('content') || undefined,
      };

      const yieldSelectors = [
        '.recipe-adjust-servings__size-input',
        '[data-testid="recipe-servings"]',
      ];
      for (const selector of yieldSelectors) {
        const yieldText = $(selector).attr('value') || $(selector).text() || '';
        const yieldMatch = yieldText.match(/(\d+)/);
        if (yieldMatch) {
          recipe.yield = parseInt(yieldMatch[1], 10);
          recipe.yield_unit = 'servings';
          break;
        }
      }

      return recipe;
    } catch (error) {
      scraperLogger.error('Error in HTML fallback parsing:', error);
      return null;
    }
  }

  private parseIngredients(ingredients: string[] | undefined): RecipeIngredient[] {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.map(ing => {
      const originalText = String(ing);
      // @ts-ignore - extractIngredientName private in original, using parseIngredientName if possible or manual
      const cleaned = originalText
        .replace(/^\d+\s*/, '')
        .replace(/^\d+\/\d+\s*/, '')
        .replace(/\s*(cup|tbsp|tsp|oz|lb|g|kg|ml|l)s?\s*/gi, '')
        .trim();
      return { name: cleaned || originalText, original_text: originalText };
    });
  }

  private parseYield(yieldData: any): number | undefined {
    if (!yieldData) return undefined;
    if (typeof yieldData === 'number') return yieldData;
    const match = String(yieldData).match(/(\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }

  private parseDuration(duration: string | undefined): number | undefined {
    if (!duration) return undefined;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = parseInt(match[1] || '0', 10);
      const minutes = parseInt(match[2] || '0', 10);
      return hours * 60 + minutes;
    }
    return undefined;
  }

  private parseImage(image: any): string | undefined {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (Array.isArray(image) && image.length > 0) {
      const first = image[0];
      return typeof first === 'string' ? first : (first as any).url || (first as any).contentUrl;
    }
    return (image as any).url;
  }

  async getRecipeUrls(limit: number = 50): Promise<string[]> {
    const popularPages = ['https://www.allrecipes.com/recipes/'];
    const urls: string[] = [];
    for (const pageUrl of popularPages) {
      if (urls.length >= limit) break;
      try {
        const html = await this.fetchPage(pageUrl);
        const $ = cheerio.load(html);
        const links = $('a[href*="/recipe/"]')
          .map((_, el) => {
            const href = $(el).attr('href');
            return href?.startsWith('/') ? `https://www.allrecipes.com${href}` : href;
          })
          .get()
          .filter(u => u && u.includes('/recipe/'));
        urls.push(...links.slice(0, limit - urls.length));
      } catch {}
    }
    return urls;
  }

  async getAllRecipeUrls(): Promise<string[]> {
    const sitemapParser = new SitemapParser();
    return sitemapParser.discoverRecipeUrls('allrecipes');
  }
}
