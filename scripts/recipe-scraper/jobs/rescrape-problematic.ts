#!/usr/bin/env npx ts-node
/**
 * Re-scrape Problematic Recipes Script
 *
 * This script finds recipes in ai_specials that have:
 * - Truncated ingredient names (ending with "or", "and", etc.)
 * - All ingredients with quantity=1 (likely unparsed)
 *
 * It then re-scrapes those recipes from their source URLs and updates the database.
 *
 * Usage:
 *   npx ts-node scripts/recipe-scraper/jobs/rescrape-problematic.ts
 *   npx ts-node scripts/recipe-scraper/jobs/rescrape-problematic.ts --dry-run
 *   npx ts-node scripts/recipe-scraper/jobs/rescrape-problematic.ts --limit 10
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      // Remove quotes if present
      process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  });
}

import { AllRecipesScraper } from '../scrapers/allrecipes-scraper';
import { BonAppetitScraper } from '../scrapers/bon-appetit-scraper';
import { DelishScraper } from '../scrapers/delish-scraper';
import { EpicuriousScraper } from '../scrapers/epicurious-scraper';
import { FoodAndWineScraper } from '../scrapers/food-and-wine-scraper';
import { FoodNetworkScraper } from '../scrapers/food-network-scraper';
import { Food52Scraper } from '../scrapers/food52-scraper';
import { SeriousEatsScraper } from '../scrapers/serious-eats-scraper';
import { SimplyRecipesScraper } from '../scrapers/simply-recipes-scraper';
import { SmittenKitchenScraper } from '../scrapers/smitten-kitchen-scraper';
import { TastyScraper } from '../scrapers/tasty-scraper';
import { scraperLogger } from '../utils/logger';

// Parse CLI arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : 100;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Map source names to scraper instances
function getScraper(source: string) {
  switch (source.toLowerCase()) {
    case 'allrecipes': return new AllRecipesScraper();
    case 'bon-appetit':
    case 'bon appetit':
    case 'bonappetit': return new BonAppetitScraper();
    case 'delish': return new DelishScraper();
    case 'epicurious': return new EpicuriousScraper();
    case 'food-and-wine':
    case 'food and wine': return new FoodAndWineScraper();
    case 'food-network':
    case 'food network': return new FoodNetworkScraper();
    case 'food52': return new Food52Scraper();
    case 'serious-eats':
    case 'serious eats': return new SeriousEatsScraper();
    case 'simply-recipes':
    case 'simply recipes': return new SimplyRecipesScraper();
    case 'smitten-kitchen':
    case 'smitten kitchen': return new SmittenKitchenScraper();
    case 'tasty': return new TastyScraper();
    default: return null;
  }
}

interface ProblematicRecipe {
  id: string;
  name: string;
  source: string;
  source_url: string;
  ingredients: { name: string; quantity?: number; unit?: string; original_text?: string }[];
  issue: string;
}

// Detect problematic ingredients
function detectIssues(recipe: {
  id: string;
  name: string;
  source: string;
  source_url: string;
  ingredients: unknown;
}): ProblematicRecipe | null {
  const issues: string[] = [];

  // Check if ingredients exist
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
    return { ...recipe, ingredients: [], issue: 'No ingredients array' };
  }

  const ingredients = recipe.ingredients as { name: string; quantity?: number; unit?: string; original_text?: string }[];

  // Check for truncated names (ending with "or", "and", "freshly", etc.)
  const truncatedEndings = [' or', ' and', ' freshly', ' finely', ' roughly', ' thinly', ' to', ' for', ' plus'];
  const truncated = ingredients.filter(ing =>
    truncatedEndings.some(ending => ing.name?.toLowerCase().endsWith(ending))
  );
  if (truncated.length > 0) {
    issues.push(`${truncated.length} truncated ingredient names`);
  }

  // Check for missing quantities (all ingredients have quantity=1 or undefined)
  const withQuantities = ingredients.filter(ing => ing.quantity && ing.quantity !== 1);
  if (ingredients.length > 3 && withQuantities.length === 0) {
    issues.push('All ingredients missing quantities');
  }

  // Check for very short ingredient names (likely truncated)
  const shortNames = ingredients.filter(ing => ing.name && ing.name.length < 3);
  if (shortNames.length > 0) {
    issues.push(`${shortNames.length} very short ingredient names`);
  }

  if (issues.length > 0) {
    return {
      id: recipe.id,
      name: recipe.name,
      source: recipe.source,
      source_url: recipe.source_url,
      ingredients,
      issue: issues.join('; ')
    };
  }

  return null;
}

async function main() {
  scraperLogger.info(`=== Re-scrape Problematic Recipes ===`);
  scraperLogger.info(`Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'LIVE'}`);
  scraperLogger.info(`Limit: ${limit} recipes`);
  scraperLogger.info('');

  // Fetch ALL recipes from ai_specials using pagination
  scraperLogger.info('Fetching ALL recipes from ai_specials...');

  const allRecipes: { id: string; name: string; source: string; source_url: string; ingredients: unknown }[] = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data: batch, error } = await supabase
      .from('ai_specials')
      .select('id, name, source, source_url, ingredients')
      .not('source_url', 'is', null)
      .range(offset, offset + pageSize - 1);

    if (error) {
      scraperLogger.error('Failed to fetch recipes:', error.message);
      process.exit(1);
    }

    if (batch && batch.length > 0) {
      allRecipes.push(...batch);
      offset += pageSize;
      scraperLogger.info(`  Fetched ${allRecipes.length} recipes so far...`);
    }

    hasMore = batch && batch.length === pageSize;
  }

  scraperLogger.info(`Total recipes fetched: ${allRecipes.length}`);

  // Find problematic recipes
  const problematic: ProblematicRecipe[] = [];
  for (const recipe of allRecipes) {
    const issue = detectIssues(recipe);
    if (issue) {
      problematic.push(issue);
    }
  }

  scraperLogger.info(`Found ${problematic.length} problematic recipes`);
  scraperLogger.info('');

  // Show sample issues
  if (problematic.length > 0) {
    scraperLogger.info('Sample issues:');
    problematic.slice(0, 5).forEach((r, i) => {
      scraperLogger.info(`  ${i + 1}. "${r.name}" (${r.source}): ${r.issue}`);
      // Show first 3 truncated ingredients
      const truncated = r.ingredients.filter(ing =>
        [' or', ' and', ' freshly', ' finely'].some(e => ing.name?.toLowerCase().endsWith(e))
      ).slice(0, 3);
      truncated.forEach(ing => {
        scraperLogger.info(`      - "${ing.name}"`);
      });
    });
    scraperLogger.info('');
  }

  if (isDryRun) {
    scraperLogger.info('DRY RUN - No changes made. Remove --dry-run to re-scrape.');
    return;
  }

  // Re-scrape problematic recipes
  const toRescrape = problematic.slice(0, limit);
  scraperLogger.info(`Re-scraping ${toRescrape.length} recipes...`);

  let successCount = 0;
  let failCount = 0;

  for (const recipe of toRescrape) {
    try {
      const scraper = getScraper(recipe.source);
      if (!scraper) {
        scraperLogger.warn(`No scraper for source: ${recipe.source}`);
        failCount++;
        continue;
      }

      scraperLogger.info(`Re-scraping: "${recipe.name}" from ${recipe.source_url}`);
      const result = await scraper.scrapeRecipe(recipe.source_url);

      if (result.success && result.recipe) {
        // Update the recipe in the database
        const { error: updateError } = await supabase
          .from('ai_specials')
          .update({
            ingredients: result.recipe.ingredients,
            instructions: result.recipe.instructions,
            description: result.recipe.description,
            prep_time_minutes: result.recipe.prep_time_minutes,
            cook_time_minutes: result.recipe.cook_time_minutes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', recipe.id);

        if (updateError) {
          scraperLogger.error(`Failed to update ${recipe.name}:`, updateError.message);
          failCount++;
        } else {
          scraperLogger.info(`✅ Updated: "${recipe.name}" with ${result.recipe.ingredients.length} ingredients`);
          successCount++;
        }
      } else {
        scraperLogger.warn(`❌ Failed to scrape: ${result.error}`);
        failCount++;
      }

      // Small delay between requests
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      scraperLogger.error(`Error processing ${recipe.name}:`, msg);
      failCount++;
    }
  }

  scraperLogger.info('');
  scraperLogger.info('=== Summary ===');
  scraperLogger.info(`Total problematic: ${problematic.length}`);
  scraperLogger.info(`Attempted: ${toRescrape.length}`);
  scraperLogger.info(`Success: ${successCount}`);
  scraperLogger.info(`Failed: ${failCount}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
