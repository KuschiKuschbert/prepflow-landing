/**
 * Index Migration Utility
 * Migrates existing index entries to include updated_at field for fast format filtering
 * Backfills updated_at from recipe files for existing index entries
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as zlib from 'zlib';
import { STORAGE_PATH } from '../config';
import { ScrapedRecipe } from '../parsers/types';
import { scraperLogger } from './logger';

const gunzip = promisify(zlib.gunzip);

const INDEX_PATH = path.join(STORAGE_PATH, 'index.json');

interface RecipeIndexEntry {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  file_path: string;
  scraped_at: string;
  updated_at?: string;
}

interface RecipeIndex {
  recipes: RecipeIndexEntry[];
  lastUpdated: string;
  totalCount: number;
}

/**
 * Load recipe index
 */
function loadIndex(): RecipeIndex | null {
  if (!fs.existsSync(INDEX_PATH)) {
    scraperLogger.debug('Index file does not exist');
    return null;
  }

  try {
    const content = fs.readFileSync(INDEX_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    scraperLogger.error('Error loading index:', error);
    return null;
  }
}

/**
 * Save recipe index
 */
function saveIndex(index: RecipeIndex): void {
  try {
    // Ensure directory exists
    const indexDir = path.dirname(INDEX_PATH);
    if (!fs.existsSync(indexDir)) {
      fs.mkdirSync(indexDir, { recursive: true });
    }

    index.lastUpdated = new Date().toISOString();
    index.totalCount = index.recipes.length;
    fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), 'utf-8');
  } catch (error) {
    scraperLogger.error('Error saving index:', error);
    throw error;
  }
}

/**
 * Load a recipe from file (handles both compressed .json.gz and uncompressed .json files)
 */
async function loadRecipe(filePath: string): Promise<ScrapedRecipe | null> {
  try {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(STORAGE_PATH, filePath);

    if (!fs.existsSync(fullPath)) {
      scraperLogger.debug(`Recipe file not found: ${fullPath}`);
      return null;
    }

    const buffer = fs.readFileSync(fullPath);

    // Check if file is compressed (.json.gz) or uncompressed (.json)
    let content: string;
    if (fullPath.endsWith('.json.gz')) {
      // Decompress gzip file
      const decompressed = await gunzip(buffer);
      content = decompressed.toString('utf-8');
    } else {
      // Uncompressed JSON file (for backward compatibility)
      content = buffer.toString('utf-8');
    }

    return JSON.parse(content) as ScrapedRecipe;
  } catch (error) {
    scraperLogger.error(`Error loading recipe from ${filePath}:`, error);
    return null;
  }
}

/**
 * Migrate index to include updated_at field
 * Backfills updated_at from recipe files for existing index entries
 *
 * @param dryRun - If true, only logs what would be changed without actually modifying the index
 * @returns Migration summary
 */
export async function migrateIndexWithUpdatedAt(dryRun: boolean = false): Promise<{
  totalEntries: number;
  entriesNeedingUpdate: number;
  entriesUpdated: number;
  entriesSkipped: number;
  errors: number;
}> {
  const index = loadIndex();

  if (!index) {
    scraperLogger.warn('[Index Migration] No index found - nothing to migrate');
    return {
      totalEntries: 0,
      entriesNeedingUpdate: 0,
      entriesUpdated: 0,
      entriesSkipped: 0,
      errors: 0,
    };
  }

  const totalEntries = index.recipes.length;
  let entriesNeedingUpdate = 0;
  let entriesUpdated = 0;
  let entriesSkipped = 0;
  let errors = 0;

  scraperLogger.info(
    `[Index Migration] Starting migration for ${totalEntries} index entries (dryRun: ${dryRun})`,
  );

  for (const entry of index.recipes) {
    // Skip if already has updated_at
    if (entry.updated_at) {
      entriesSkipped++;
      continue;
    }

    entriesNeedingUpdate++;

    try {
      // Load recipe file to get updated_at
      const recipe = await loadRecipe(entry.file_path);

      if (!recipe) {
        scraperLogger.warn(`[Index Migration] Could not load recipe file: ${entry.file_path}`);
        errors++;
        continue;
      }

      // Update entry with updated_at from recipe file
      if (!dryRun) {
        entry.updated_at = recipe.updated_at;
      }

      entriesUpdated++;

      if (entriesUpdated % 100 === 0) {
        scraperLogger.info(
          `[Index Migration] Progress: ${entriesUpdated}/${entriesNeedingUpdate} entries processed`,
        );
      }
    } catch (error) {
      scraperLogger.error(`[Index Migration] Error processing entry ${entry.id}:`, error);
      errors++;
    }
  }

  // Save updated index
  if (!dryRun && entriesUpdated > 0) {
    saveIndex(index);
    scraperLogger.info(
      `[Index Migration] Migration complete - saved updated index with ${entriesUpdated} entries updated`,
    );
  } else if (dryRun) {
    scraperLogger.info(
      `[Index Migration] Dry run complete - would update ${entriesUpdated} entries (${entriesSkipped} already have updated_at, ${errors} errors)`,
    );
  }

  return {
    totalEntries,
    entriesNeedingUpdate,
    entriesUpdated,
    entriesSkipped,
    errors,
  };
}

/**
 * Run migration from command line
 */
if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run') || process.argv.includes('--dry');
  migrateIndexWithUpdatedAt(dryRun)
    .then(summary => {
      console.log('\n=== Migration Summary ===');
      console.log(`Total entries: ${summary.totalEntries}`);
      console.log(`Entries needing update: ${summary.entriesNeedingUpdate}`);
      console.log(`Entries updated: ${summary.entriesUpdated}`);
      console.log(`Entries skipped (already have updated_at): ${summary.entriesSkipped}`);
      console.log(`Errors: ${summary.errors}`);
      process.exit(summary.errors > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
