/**
 * Recipe Scraper CLI Entry Point
 * Migrated from scripts/recipe-scraper/index.ts
 */

import { getComprehensiveScraperJob } from './jobs/comprehensive-scraper';
import { JSONStorage } from './storage/json-storage';

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
    // eslint-disable-next-line no-console
    console.log(`Total Recipes: ${recipes.length}`);
    return;
  }

  if (searchFlag && searchQuery) {
    // eslint-disable-next-line no-console
    console.log(`Searching for recipes matching: "${searchQuery}"...`);
    const storage = new JSONStorage();
    const recipes = storage.getAllRecipes();
    const results = recipes.filter(r =>
      r.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // eslint-disable-next-line no-console
    console.log(`Found ${results.length} matches:`);
    results.slice(0, 10).forEach(r => console.log(`- ${r.recipe_name} (${r.source_url})`));
    return;
  }

  if (sourceArg) {
    // eslint-disable-next-line no-console
    console.log(`Starting scraper for ${sourceArg}...`);
    const job = getComprehensiveScraperJob();
    // Simplified CLI interaction for now
    await job.start([sourceArg as any]);
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Starting comprehensive scrape...');
  const job = getComprehensiveScraperJob();
  await job.start();
}

// eslint-disable-next-line no-console
main().catch(console.error);
