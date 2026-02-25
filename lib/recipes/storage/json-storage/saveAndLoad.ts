/**
 * Save and load helpers for JSONStorage. Extracted for filesize limit.
 */
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as zlib from 'zlib';
import type { RecipeIndex, RecipeIndexEntry } from './searchAndStats';
import type { ScrapedRecipe } from '../../types';
import { generateRecipeFilename } from './helpers';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export function createIndexEntry(
  recipe: ScrapedRecipe,
  filePath: string,
  storagePath: string,
): RecipeIndexEntry {
  return {
    id: recipe.id,
    recipe_name: recipe.recipe_name,
    source: recipe.source,
    source_url: recipe.source_url,
    file_path: path.relative(storagePath, filePath),
    scraped_at: recipe.scraped_at,
    updated_at: recipe.updated_at,
  };
}

export async function writeCompressedRecipe(
  filePath: string,
  recipe: ScrapedRecipe,
): Promise<void> {
  const jsonString = JSON.stringify(recipe, null, 2);
  const compressed = await gzip(Buffer.from(jsonString, 'utf-8'));
  fs.writeFileSync(filePath, compressed);
}

export async function readRecipeFile(
  fullPath: string,
  storagePath: string,
): Promise<ScrapedRecipe | null> {
  try {
    if (!fs.existsSync(storagePath)) return null;
    const resolvedPath = path.isAbsolute(fullPath) ? fullPath : path.join(storagePath, fullPath);
    if (!fs.existsSync(resolvedPath)) return null;

    const buffer = fs.readFileSync(resolvedPath);
    let content: string;
    if (resolvedPath.endsWith('.json.gz')) {
      const decompressed = await gunzip(buffer);
      content = decompressed.toString('utf-8');
    } else {
      content = buffer.toString('utf-8');
    }
    return JSON.parse(content) as ScrapedRecipe;
  } catch {
    return null;
  }
}

export async function saveRecipeWithIndex(
  recipe: ScrapedRecipe,
  storagePath: string,
  index: RecipeIndex,
  getSourceDir: (source: string) => string,
  existingEntry: RecipeIndexEntry | undefined,
): Promise<{ filePath: string; isUpdate: boolean; index: RecipeIndex }> {
  let filePath: string;
  let isUpdate = false;

  if (existingEntry) {
    isUpdate = true;
    filePath = path.isAbsolute(existingEntry.file_path)
      ? existingEntry.file_path
      : path.join(storagePath, existingEntry.file_path);
    const parentDir = path.dirname(filePath);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
  } else {
    const sourceDir = getSourceDir(recipe.source);
    const filename = generateRecipeFilename(recipe);
    filePath = path.join(sourceDir, filename);
    if (!fs.existsSync(path.dirname(filePath)))
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    index.recipes.push(createIndexEntry(recipe, filePath, storagePath));
  }

  await writeCompressedRecipe(filePath, recipe);

  if (isUpdate && existingEntry) {
    existingEntry.recipe_name = recipe.recipe_name;
    existingEntry.id = recipe.id;
    existingEntry.updated_at = recipe.updated_at;
  }

  return { filePath, isUpdate, index };
}
