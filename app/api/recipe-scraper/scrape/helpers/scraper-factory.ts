/**
 * Scraper factory for creating scraper instances
 */

import { AllRecipesScraper } from '../../../../../scripts/recipe-scraper/scrapers/allrecipes-scraper';
import { FoodNetworkScraper } from '../../../../../scripts/recipe-scraper/scrapers/food-network-scraper';
import { EpicuriousScraper } from '../../../../../scripts/recipe-scraper/scrapers/epicurious-scraper';
import { BonAppetitScraper } from '../../../../../scripts/recipe-scraper/scrapers/bon-appetit-scraper';
import { TastyScraper } from '../../../../../scripts/recipe-scraper/scrapers/tasty-scraper';
import { SeriousEatsScraper } from '../../../../../scripts/recipe-scraper/scrapers/serious-eats-scraper';
import { Food52Scraper } from '../../../../../scripts/recipe-scraper/scrapers/food52-scraper';
import { SimplyRecipesScraper } from '../../../../../scripts/recipe-scraper/scrapers/simply-recipes-scraper';
import { SmittenKitchenScraper } from '../../../../../scripts/recipe-scraper/scrapers/smitten-kitchen-scraper';
import { TheKitchnScraper } from '../../../../../scripts/recipe-scraper/scrapers/the-kitchn-scraper';
import { DelishScraper } from '../../../../../scripts/recipe-scraper/scrapers/delish-scraper';
import { SOURCES, SourceType } from '../../../../../scripts/recipe-scraper/config';

export type ScraperInstance =
  | AllRecipesScraper
  | FoodNetworkScraper
  | EpicuriousScraper
  | BonAppetitScraper
  | TastyScraper
  | SeriousEatsScraper
  | Food52Scraper
  | SimplyRecipesScraper
  | SmittenKitchenScraper
  | TheKitchnScraper
  | DelishScraper;

/**
 * Create scraper instance for source
 */
export function createScraper(source: SourceType): ScraperInstance {
  switch (source) {
    case SOURCES.ALLRECIPES:
      return new AllRecipesScraper();
    case SOURCES.BBC_GOOD_FOOD:
      throw new Error(
        'BBC Good Food scraper is disabled due to Terms of Service violation. See docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md',
      );
    case SOURCES.FOOD_NETWORK:
      return new FoodNetworkScraper();
    case SOURCES.EPICURIOUS:
      return new EpicuriousScraper();
    case SOURCES.BON_APPETIT:
      return new BonAppetitScraper();
    case SOURCES.TASTY:
      return new TastyScraper();
    case SOURCES.SERIOUS_EATS:
      return new SeriousEatsScraper();
    case SOURCES.FOOD52:
      return new Food52Scraper();
    case SOURCES.SIMPLY_RECIPES:
      return new SimplyRecipesScraper();
    case SOURCES.SMITTEN_KITCHEN:
      return new SmittenKitchenScraper();
    case SOURCES.THE_KITCHN:
      return new TheKitchnScraper();
    case SOURCES.DELISH:
      return new DelishScraper();
    default:
      throw new Error(`Unknown source: ${source}`);
  }
}
