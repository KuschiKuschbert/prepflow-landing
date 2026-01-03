#!/usr/bin/env node

/**
 * Recipe Scraper CLI
 * Main entry point for recipe scraping
 */

import { AllRecipesScraper } from './scrapers/allrecipes-scraper';
// import { BBCGoodFoodScraper } from './scrapers/bbc-good-food-scraper'; // REMOVED - Terms of Service violation
import { FoodNetworkScraper } from './scrapers/food-network-scraper';
import { EpicuriousScraper } from './scrapers/epicurious-scraper';
import { BonAppetitScraper } from './scrapers/bon-appetit-scraper';
import { TastyScraper } from './scrapers/tasty-scraper';
import { JSONStorage } from './storage/json-storage';
import { IndexManager } from './storage/index-manager';
import { SOURCES, SourceType } from './config';
import { scraperLogger } from './utils/logger';
import { logger } from '@/lib/logger';
import { shouldIncludeRecipe } from './utils/rating-filter';

interface ScrapeOptions {
  source?: SourceType;
  urls?: string[];
  limit?: number;
  dryRun?: boolean;
}

class RecipeScraperCLI {
  private storage: JSONStorage;
  private indexManager: IndexManager;

  constructor() {
    this.storage = new JSONStorage();
    this.indexManager = new IndexManager(this.storage);
  }

  /**
   * Get scraper instance for source
   */
  private getScraper(source: SourceType) {
    switch (source) {
      case SOURCES.ALLRECIPES:
        return new AllRecipesScraper();
      case SOURCES.BBC_GOOD_FOOD:
        throw new Error('BBC Good Food scraper is disabled due to Terms of Service violation. See docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md');
      case SOURCES.FOOD_NETWORK:
        return new FoodNetworkScraper();
      case SOURCES.EPICURIOUS:
        return new EpicuriousScraper();
      case SOURCES.BON_APPETIT:
        return new BonAppetitScraper();
      case SOURCES.TASTY:
        return new TastyScraper();
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }

  /**
   * Discover and scrape recipes automatically
   */
  async scrapeFromDiscovery(
    source: SourceType,
    limit: number = 50,
    dryRun: boolean = false,
  ): Promise<void> {
    const scraper = this.getScraper(source);

    scraperLogger.info(
      `Starting automatic discovery and scrape from ${source} (limit: ${limit}, dry-run: ${dryRun})`,
    );

    try {
      // Discover recipe URLs
      scraperLogger.info('Discovering recipe URLs...');
      const urls = await scraper.getRecipeUrls(limit);

      if (urls.length === 0) {
        scraperLogger.warn('No recipe URLs discovered');
        return;
      }

      scraperLogger.info(`Discovered ${urls.length} recipe URLs, starting scrape...`);

      // Scrape discovered URLs
      await this.scrapeFromUrls(urls, source, dryRun);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`[Recipe Scraper] Error in discovery scrape:`, { error: errorMessage, source });
      scraperLogger.error(`Error in discovery scrape:`, error);
    }
  }

  /**
   * Scrape recipes from URLs
   */
  async scrapeFromUrls(urls: string[], source: SourceType, dryRun: boolean = false): Promise<void> {
    const scraper = this.getScraper(source);
    let successCount = 0;
    let errorCount = 0;

    scraperLogger.info(
      `Starting scrape of ${urls.length} recipes from ${source} (dry-run: ${dryRun})`,
    );

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      scraperLogger.info(`[${i + 1}/${urls.length}] Scraping: ${url}`);

      if (dryRun) {
        scraperLogger.info('DRY RUN: Would scrape this URL');
        continue;
      }

      try {
        const result = await scraper.scrapeRecipe(url);
        if (result.success && result.recipe) {
          // Apply rating filter
          if (!shouldIncludeRecipe(result.recipe, source)) {
            const reason = result.recipe.rating
              ? `rating ${result.recipe.rating} below threshold`
              : 'no rating (unrated not allowed)';
            scraperLogger.warn(`⚠️  Skipped (rating filter): ${result.recipe.recipe_name} - ${reason}`);
            continue;
          }

          const saveResult = await this.storage.saveRecipe(result.recipe);
          if (saveResult.saved) {
            successCount++;
            scraperLogger.info(`✅ Saved: ${result.recipe.recipe_name}`);
          } else {
            scraperLogger.warn(`⚠️  Skipped (${saveResult.reason}): ${result.recipe.recipe_name}`);
          }
        } else {
          errorCount++;
          logger.error(`Failed to scrape recipe: ${url}`, { error: result.error });
          scraperLogger.error(`Failed: ${url} - ${result.error}`);
        }
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error scraping recipe: ${url}`, { error: errorMessage });
        scraperLogger.error(`Error: ${url} - ${errorMessage}`);
      }
    }

    scraperLogger.info(`\n📊 Summary: Success: ${successCount}, Errors: ${errorCount}`);
    logger.info('Recipe scraping completed', {
      successCount,
      errorCount,
      totalRecipes: this.storage.getStatistics().totalRecipes,
    });
  }

  /**
   * Show statistics
   */
  showStatistics(): void {
    const stats = this.indexManager.getStatistics();
    scraperLogger.info('\n📊 Recipe Database Statistics:');
    scraperLogger.info(`   Total Recipes: ${stats.totalRecipes}`);
    scraperLogger.info(`   Last Updated: ${stats.lastUpdated}`);
    scraperLogger.info('\n   By Source:');
    for (const [source, count] of Object.entries(stats.bySource)) {
      scraperLogger.info(`     ${source}: ${count}`);
    }
  }

  /**
   * Search recipes
   */
  async searchRecipes(ingredients: string[], limit: number = 10): Promise<void> {
    const results = await this.indexManager.findSimilarRecipes(ingredients, limit);
    scraperLogger.info(
      `\n🔍 Found ${results.length} recipes with ingredients: ${ingredients.join(', ')}`,
    );
    results.forEach((recipe, index) => {
      scraperLogger.info(`\n${index + 1}. ${recipe.recipe_name}`);
      scraperLogger.info(`   Source: ${recipe.source}`);
      scraperLogger.info(`   URL: ${recipe.source_url}`);
      scraperLogger.info(`   Ingredients: ${recipe.ingredients.length}`);
      if (recipe.category) scraperLogger.info(`   Category: ${recipe.category}`);
      if (recipe.cuisine) scraperLogger.info(`   Cuisine: ${recipe.cuisine}`);
    });
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): ScrapeOptions {
  const args = process.argv.slice(2);
  const options: ScrapeOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--source':
        options.source = args[++i] as SourceType;
        break;
      case '--urls':
        options.urls = args[++i].split(',').map(u => u.trim());
        break;
      case '--limit':
        options.limit = parseInt(args[++i], 10);
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--stats':
        const cli = new RecipeScraperCLI();
        cli.showStatistics();
        process.exit(0);
        break;
      case '--search':
        const searchIngredients = args[++i].split(',').map(i => i.trim());
        const searchLimit = args.includes('--limit')
          ? parseInt(args[args.indexOf('--limit') + 1], 10)
          : 10;
        const searchCli = new RecipeScraperCLI();
        searchCli.searchRecipes(searchIngredients, searchLimit).then(() => {
          process.exit(0);
        });
        break;
      case '--help':
        scraperLogger.info(`
Recipe Scraper CLI

Usage:
  npm run scrape:recipes -- --source <source> --urls <url1,url2,...> [options]

Options:
  --source <source>     Source to scrape (allrecipes, bbc-good-food, food-network)
  --urls <urls>         Comma-separated list of recipe URLs
  --limit <number>      Maximum number of recipes to scrape
  --dry-run             Don't save recipes, just test scraping
  --stats               Show database statistics
  --search <ingredients> Search recipes by ingredients (comma-separated)
  --help                Show this help message

Examples:
  npm run scrape:recipes -- --source allrecipes --urls "https://www.allrecipes.com/recipe/12345"
  npm run scrape:recipes -- --stats
  npm run scrape:recipes -- --search "tomato,onion,garlic"
        `);
        process.exit(0);
        break;
    }
  }

  return options;
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs();

  if (!options.urls || options.urls.length === 0) {
    logger.error('--urls is required');
    scraperLogger.error('❌ Error: --urls is required');
    scraperLogger.info('Use --help for usage information');
    process.exit(1);
  }

  if (!options.source) {
    logger.error('--source is required');
    scraperLogger.error('❌ Error: --source is required');
    scraperLogger.info('Use --help for usage information');
    process.exit(1);
  }

  const cli = new RecipeScraperCLI();
  await cli.scrapeFromUrls(options.urls, options.source, options.dryRun || false);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    logger.error('Fatal error in recipe scraper', {
      error: error instanceof Error ? error.message : String(error),
    });
    scraperLogger.error('Fatal error:', error);
    process.exit(1);
  });
}

export { RecipeScraperCLI };
