/**
 * Scraper Factory (Migrated from scripts/index.ts)
 */

import { AllRecipesScraper } from './scrapers/allrecipes-scraper';
import { BaseScraper } from './scrapers/base-scraper';
import { BBCGoodFoodScraper } from './scrapers/bbc-good-food-scraper';
import { BonAppetitScraper } from './scrapers/bon-appetit-scraper';
import { DelishScraper } from './scrapers/delish-scraper';
import { EpicuriousScraper } from './scrapers/epicurious-scraper';
import { FoodAndWineScraper } from './scrapers/food-and-wine-scraper';
import { FoodNetworkScraper } from './scrapers/food-network-scraper';
import { Food52Scraper } from './scrapers/food52-scraper';
import { SeriousEatsScraper } from './scrapers/serious-eats-scraper';
import { SimplyRecipesScraper } from './scrapers/simply-recipes-scraper';
import { SmittenKitchenScraper } from './scrapers/smitten-kitchen-scraper';
import { TastyScraper } from './scrapers/tasty-scraper';
import { TheKitchnScraper } from './scrapers/the-kitchn-scraper';
import { ScraperConfig, SourceType } from './types';

export function getScraper(source: SourceType, config?: Partial<ScraperConfig>): BaseScraper {
  switch (source) {
    case 'allrecipes':
      return new AllRecipesScraper(config);
    case 'food-network':
      return new FoodNetworkScraper(config);
    case 'tasty':
      return new TastyScraper(config);
    case 'epicurious':
      return new EpicuriousScraper(config);
    case 'bon-appetit':
      return new BonAppetitScraper(config);
    case 'delish':
      return new DelishScraper(config);
    case 'foodandwine': // Match the SOURCES config key
      return new FoodAndWineScraper(config);
    case 'food52':
      return new Food52Scraper(config);
    case 'serious-eats':
      return new SeriousEatsScraper(config);
    case 'simply-recipes':
      return new SimplyRecipesScraper(config);
    case 'smitten-kitchen':
      return new SmittenKitchenScraper(config);
    case 'the-kitchn':
      return new TheKitchnScraper(config);
    case 'bbc-good-food':
      return new BBCGoodFoodScraper(config);
    default:
      throw new Error(`Unsupported source: ${source}`);
  }
}

export const SUPPORTED_SOURCES: SourceType[] = [
  'allrecipes',
  'food-network',
  'tasty',
  'epicurious',
  'bon-appetit',
  'delish',
  'foodandwine',
  'food52',
  'serious-eats',
  'simply-recipes',
  'smitten-kitchen',
  'the-kitchn',
  'bbc-good-food',
];
