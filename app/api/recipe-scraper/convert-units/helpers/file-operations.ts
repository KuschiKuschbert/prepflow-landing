/**
 * File operations for recipe conversion
 */

import { ScrapedRecipe } from '@/lib/recipes/types';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as zlib from 'zlib';

const gzip = promisify(zlib.gzip);

/**
 * Update an existing recipe file (bypasses duplicate check)
 */
export async function updateRecipeFile(
  recipe: ScrapedRecipe,
  filePath: string,
  storagePath: string,
): Promise<void> {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(storagePath, filePath);

  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Save recipe JSON with compression
  const jsonString = JSON.stringify(recipe, null, 2);
  const compressed = await gzip(Buffer.from(jsonString, 'utf-8'));
  fs.writeFileSync(fullPath, compressed);
}
