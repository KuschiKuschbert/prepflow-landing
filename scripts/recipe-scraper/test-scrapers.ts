#!/usr/bin/env node

/**
 * Test All Scrapers
 * Quick test script to verify all scrapers extract data correctly
 */

import { AllRecipesScraper } from './scrapers/allrecipes-scraper';
// import { BBCGoodFoodScraper } from './scrapers/bbc-good-food-scraper'; // REMOVED - Terms of Service violation
import { FoodNetworkScraper } from './scrapers/food-network-scraper';
import { EpicuriousScraper } from './scrapers/epicurious-scraper';
import { BonAppetitScraper } from './scrapers/bon-appetit-scraper';
import { TastyScraper } from './scrapers/tasty-scraper';
import { scraperLogger } from './utils/logger';

interface TestCase {
  name: string;
  scraper: any;
  url: string;
  expectedFields: string[];
}

const testCases: TestCase[] = [
  {
    name: 'AllRecipes',
    scraper: new AllRecipesScraper(),
    url: 'https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/',
    expectedFields: ['recipe_name', 'ingredients', 'instructions', 'rating'],
  },
  // BBC Good Food removed - Terms of Service violation (see docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md)
  {
    name: 'Food Network',
    scraper: new FoodNetworkScraper(),
    url: 'https://www.foodnetwork.com/recipes/food-network-kitchen/3-ingredient-mac-and-cheese-18926685',
    expectedFields: ['recipe_name', 'ingredients', 'instructions', 'rating'],
  },
  {
    name: 'Epicurious',
    scraper: new EpicuriousScraper(),
    url: 'https://www.epicurious.com/recipes/food/views/matcha-mango-smoothie',
    expectedFields: ['recipe_name', 'ingredients', 'instructions', 'rating'],
  },
  {
    name: 'Bon Appétit',
    scraper: new BonAppetitScraper(),
    url: 'https://www.bonappetit.com/recipe/golden-mushroom-soup-with-orzo-and-a-pat-of-butter',
    expectedFields: ['recipe_name', 'ingredients', 'instructions'],
  },
  {
    name: 'Tasty',
    scraper: new TastyScraper(),
    url: 'https://tasty.co/recipe/champagne-jell-o-shots',
    expectedFields: ['recipe_name', 'ingredients', 'instructions', 'rating'],
  },
];

async function testScraper(testCase: TestCase): Promise<boolean> {
  try {
    scraperLogger.info(`\n🧪 Testing ${testCase.name} scraper...`);
    scraperLogger.info(`   URL: ${testCase.url}`);

    const result = await testCase.scraper.scrapeRecipe(testCase.url);

    if (!result.success) {
      scraperLogger.error(`   ❌ Failed: ${result.error}`);
      return false;
    }

    if (!result.recipe) {
      scraperLogger.error(`   ❌ No recipe data returned`);
      return false;
    }

    const recipe = result.recipe;
    const missingFields: string[] = [];

    // Check required fields
    for (const field of testCase.expectedFields) {
      if (!(field in recipe) || recipe[field as keyof typeof recipe] === undefined) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      scraperLogger.error(`   ❌ Missing fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Check that arrays have content
    if (recipe.ingredients && recipe.ingredients.length === 0) {
      scraperLogger.error(`   ❌ No ingredients extracted`);
      return false;
    }

    if (recipe.instructions && recipe.instructions.length === 0) {
      scraperLogger.error(`   ❌ No instructions extracted`);
      return false;
    }

    // Log success with details
    scraperLogger.info(`   ✅ Success!`);
    scraperLogger.info(`      Recipe: ${recipe.recipe_name}`);
    scraperLogger.info(`      Ingredients: ${recipe.ingredients?.length || 0}`);
    scraperLogger.info(`      Instructions: ${recipe.instructions?.length || 0}`);
    if (recipe.rating) {
      scraperLogger.info(`      Rating: ${recipe.rating}/5.0`);
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    scraperLogger.error(`   ❌ Exception: ${errorMessage}`);
    return false;
  }
}

async function runTests() {
  scraperLogger.info('🚀 Starting scraper tests...\n');

  const results: Array<{ name: string; passed: boolean }> = [];

  for (const testCase of testCases) {
    const passed = await testScraper(testCase);
    results.push({ name: testCase.name, passed });

    // Small delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  scraperLogger.info('\n📊 Test Summary:');
  scraperLogger.info('='.repeat(50));

  let passedCount = 0;
  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    scraperLogger.info(`${status} - ${result.name}`);
    if (result.passed) passedCount++;
  }

  scraperLogger.info('='.repeat(50));
  scraperLogger.info(`Total: ${passedCount}/${results.length} passed`);

  if (passedCount === results.length) {
    scraperLogger.info('\n🎉 All scrapers are working correctly!');
    process.exit(0);
  } else {
    scraperLogger.error('\n⚠️  Some scrapers failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  scraperLogger.error('Fatal error running tests:', error);
  process.exit(1);
});
