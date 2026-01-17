#!/usr/bin/env node

/**
 * Test AI Extractor
 * Compare AI extraction vs. traditional parsing methods
 */

import { AllRecipesScraper } from './scrapers/allrecipes-scraper';
import { BaseScraper } from './scrapers/base-scraper';
import { EpicuriousScraper } from './scrapers/epicurious-scraper';
import { getAIExtractor } from './utils/ai-extractor';
import { scraperLogger } from './utils/logger';

interface TestResult {
  url: string;
  traditional: {
    success: boolean;
    recipeName?: string;
    ingredientCount?: number;
    instructionCount?: number;
    error?: string;
  };
  ai: {
    success: boolean;
    recipeName?: string;
    ingredientCount?: number;
    instructionCount?: number;
    error?: string;
  };
}

const testUrls = [
  {
    name: 'AllRecipes',
    url: 'https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/',
    scraper: new AllRecipesScraper(),
  },
  {
    name: 'Epicurious',
    url: 'https://www.epicurious.com/recipes/food/views/matcha-mango-smoothie',
    scraper: new EpicuriousScraper(),
  },
];

async function testTraditionalScraper(scraper: BaseScraper, url: string) {
  try {
    const result = await scraper.scrapeRecipe(url);
    if (result.success && result.recipe) {
      return {
        success: true,
        recipeName: result.recipe.recipe_name,
        ingredientCount: result.recipe.ingredients?.length || 0,
        instructionCount: result.recipe.instructions?.length || 0,
      };
    }
    return {
      success: false,
      error: result.error || 'Unknown error',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function testAIExtractor(html: string, url: string) {
  const aiExtractor = getAIExtractor();

  if (!aiExtractor.isEnabled()) {
    return {
      success: false,
      error: 'AI extraction is disabled (set ENABLE_AI_EXTRACTION=true)',
    };
  }

  try {
    const result = await aiExtractor.extractRecipe(html, url);
    if (result) {
      return {
        success: true,
        recipeName: result.recipe_name,
        ingredientCount: result.ingredients?.length || 0,
        instructionCount: result.instructions?.length || 0,
      };
    }
    return {
      success: false,
      error: 'No recipe data extracted',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runComparison() {
  scraperLogger.info('🧪 Starting AI Extractor Comparison Test\n');

  const results: TestResult[] = [];

  for (const testCase of testUrls) {
    scraperLogger.info(`\n📋 Testing: ${testCase.name}`);
    scraperLogger.info(`   URL: ${testCase.url}`);

    // Test traditional scraper
    scraperLogger.info('   Testing traditional scraper...');
    const traditionalResult = await testTraditionalScraper(testCase.scraper, testCase.url);

    // Fetch HTML for AI extractor
    let html = '';
    try {
      // Access protected fetchPage method for testing
      const response = await (
        testCase.scraper as unknown as { fetchPage: (url: string) => Promise<string> }
      ).fetchPage(testCase.url);
      html = response;
    } catch (error) {
      scraperLogger.error(`   Failed to fetch HTML: ${error}`);
    }

    // Test AI extractor
    scraperLogger.info('   Testing AI extractor...');
    const aiResult = await testAIExtractor(html, testCase.url);

    results.push({
      url: testCase.url,
      traditional: traditionalResult,
      ai: aiResult,
    });

    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Print comparison
  scraperLogger.info('\n📊 Comparison Results:');
  scraperLogger.info('='.repeat(80));

  for (const result of results) {
    scraperLogger.info(`\nURL: ${result.url}`);
    scraperLogger.info('Traditional Scraper:');
    if (result.traditional.success) {
      scraperLogger.info(`  ✅ Success`);
      scraperLogger.info(`  Recipe: ${result.traditional.recipeName}`);
      scraperLogger.info(`  Ingredients: ${result.traditional.ingredientCount}`);
      scraperLogger.info(`  Instructions: ${result.traditional.instructionCount}`);
    } else {
      scraperLogger.info(`  ❌ Failed: ${result.traditional.error}`);
    }

    scraperLogger.info('AI Extractor:');
    if (result.ai.success) {
      scraperLogger.info(`  ✅ Success`);
      scraperLogger.info(`  Recipe: ${result.ai.recipeName}`);
      scraperLogger.info(`  Ingredients: ${result.ai.ingredientCount}`);
      scraperLogger.info(`  Instructions: ${result.ai.instructionCount}`);
    } else {
      scraperLogger.info(`  ❌ Failed: ${result.ai.error}`);
    }
  }

  scraperLogger.info('\n' + '='.repeat(80));

  // Summary
  const traditionalSuccess = results.filter(r => r.traditional.success).length;
  const aiSuccess = results.filter(r => r.ai.success).length;

  scraperLogger.info(`\nSummary:`);
  scraperLogger.info(`Traditional: ${traditionalSuccess}/${results.length} successful`);
  scraperLogger.info(`AI: ${aiSuccess}/${results.length} successful`);
}

// Run comparison
runComparison().catch(error => {
  scraperLogger.error('Fatal error:', error);
  process.exit(1);
});
