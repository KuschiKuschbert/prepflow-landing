/**
 * Recipe Scraper CLI Entry Point
 * Migrated from scripts/recipe-scraper/index.ts
 */

import { JSONStorage } from './storage/json-storage';

import { logger } from '@/lib/logger';

async function main() {
  const args = process.argv.slice(2);
  const statsFlag = args.includes('--stats');
  const searchFlag = args.includes('--search');
  const searchQuery = searchFlag ? args[args.indexOf('--search') + 1] : undefined;

  const sourceArg =
    !statsFlag && !searchFlag
      ? args.find(arg => arg.startsWith('--source='))?.split('=')[1] ||
        args[args.indexOf('--source') + 1]
      : undefined;

  if (statsFlag) {
    const storage = new JSONStorage();
    const recipes = storage.getAllRecipes();

    logger.dev(`Total Recipes: ${recipes.length}`);
    return;
  }

  if (searchFlag && searchQuery) {
    logger.dev(`Searching for recipes matching: "${searchQuery}"...`);
    const storage = new JSONStorage();
    const recipes = storage.getAllRecipes();
    const results = recipes.filter(r =>
      r.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    logger.dev(`Found ${results.length} matches:`);
    results.slice(0, 10).forEach(r => logger.dev(`- ${r.recipe_name} (${r.source_url})`));
    return;
  }

  if (sourceArg) {
    logger.dev(`Scraping has been decommissioned.`);
    return;
  }

  logger.dev('Use --stats or --search to query the local database.');
}

main().catch(console.error);
