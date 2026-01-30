#!/usr/bin/env tsx
/**
 * Update AI Specials Ingredients
 *
 * This script reads recipes from the JSON storage (data/recipe-database/)
 * and updates the ai_specials table with properly structured ingredient data.
 *
 * The ingredients are stored as JSONB with the structure:
 * { name: string, quantity: number, unit: string, original_text: string }
 *
 * Usage: npx tsx scripts/update-ai-specials-ingredients.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as zlib from 'zlib';

// Load environment from .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

const gunzip = promisify(zlib.gunzip);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RecipeIngredient {
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  original_text?: string;
}

interface ScrapedRecipe {
  id: string;
  recipe_name: string;
  description?: string;
  instructions: string[];
  ingredients: (RecipeIngredient | string)[];
  image_url?: string;
  yield?: number;
  yield_unit?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  category?: string;
  cuisine?: string;
  source?: string;
  source_url?: string;
}

const STORAGE_PATH = 'data/recipe-database';

/**
 * Load a recipe from a compressed JSON file
 */
async function loadRecipe(filePath: string): Promise<ScrapedRecipe | null> {
  try {
    const buffer = fs.readFileSync(filePath);
    let content: string;

    if (filePath.endsWith('.json.gz')) {
      const decompressed = await gunzip(buffer);
      content = decompressed.toString('utf-8');
    } else {
      content = buffer.toString('utf-8');
    }

    return JSON.parse(content) as ScrapedRecipe;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all recipe files from storage
 */
function getAllRecipeFiles(): string[] {
  const files: string[] = [];

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.json.gz') || entry.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }

  walkDir(STORAGE_PATH);
  return files;
}

/**
 * Transform ingredients to proper format
 */
function transformIngredients(ingredients: (RecipeIngredient | string)[]): RecipeIngredient[] {
  return ingredients.map(ing => {
    if (typeof ing === 'string') {
      // Parse string ingredient - extract quantity/unit if possible
      const trimmed = ing.trim().replace(/^[\.\-\•\*]+\s*/, '');
      return {
        name: trimmed,
        quantity: 1,
        unit: 'pc',
        original_text: trimmed,
      };
    }

    // Ensure all fields are present
    return {
      name: ing.name || 'Unknown',
      quantity: ing.quantity ?? 1,
      unit: ing.unit || 'pc',
      notes: ing.notes,
      original_text:
        ing.original_text || `${ing.quantity || ''} ${ing.unit || ''} ${ing.name}`.trim(),
    };
  });
}

/**
 * Insert or update recipe in ai_specials table
 */
/**
 * Clean recipe title by removing common noise
 */
function cleanTitle(title: string): string {
  let newTitle = title;
  // Decode HTML
  newTitle = newTitle
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');

  // Remove Suffixes
  newTitle = newTitle
    .replace(/\s+Recipe by Tasty$/i, '')
    .replace(/\s+by Tasty$/i, '')
    .replace(/\s+With Step-by-Step Video$/i, '')
    .replace(/\s+Recipe$/i, '') // Remove trailing " Recipe"
    .replace(/\s+Recipe$/i, ''); // Double check in case of " ... Recipe Recipe" (rare but possible)

  return newTitle.trim();
}

async function upsertRecipe(recipe: ScrapedRecipe): Promise<boolean> {
  try {
    const ingredients = transformIngredients(recipe.ingredients);
    const cleanedName = cleanTitle(recipe.recipe_name);

    // Check if recipe exists (by source_url or name)
    const { data: existing } = await supabase
      .from('ai_specials')
      .select('id')
      .or(`source_url.eq.${recipe.source_url},name.eq.${recipe.recipe_name}`) // Check original name match too
      .limit(1)
      .single();

    const recipeData = {
      name: cleanedName,
      description: recipe.description,
      image_url: recipe.image_url,
      ingredients: ingredients, // JSONB array
      instructions: recipe.instructions,
      yield: recipe.yield,
      yield_unit: recipe.yield_unit,
      prep_time_minutes: recipe.prep_time_minutes,
      cook_time_minutes: recipe.cook_time_minutes,
      category: recipe.category,
      cuisine: recipe.cuisine,
      source: recipe.source,
      source_url: recipe.source_url,
      updated_at: new Date().toISOString(),
      meta: {
        prep_time_minutes: recipe.prep_time_minutes,
        cook_time_minutes: recipe.cook_time_minutes,
      },
    };

    if (existing?.id) {
      // Update existing
      const { error } = await supabase.from('ai_specials').update(recipeData).eq('id', existing.id);

      if (error) throw error;
      return true;
    } else {
      // Insert new
      const { error } = await supabase.from('ai_specials').insert({
        ...recipeData,
        created_at: new Date().toISOString(),
        status: 'active',
      });

      if (error) throw error;
      return true;
    }
  } catch (error) {
    console.error(`Error upserting recipe ${recipe.recipe_name}:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 Starting AI Specials ingredient update...\n');

  // Get all recipe files
  const files = getAllRecipeFiles();
  console.log(`📁 Found ${files.length} recipe files\n`);

  if (files.length === 0) {
    console.log('No recipe files found. Make sure data/recipe-database/ exists.');
    return;
  }

  let processed = 0;
  let updated = 0;
  let failed = 0;

  // Process in batches
  const BATCH_SIZE = 50;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async file => {
        const recipe = await loadRecipe(file);
        if (!recipe) return false;

        const success = await upsertRecipe(recipe);
        return success;
      }),
    );

    const batchSuccess = results.filter(Boolean).length;
    updated += batchSuccess;
    failed += results.length - batchSuccess;
    processed += batch.length;

    // Progress update
    const percent = Math.round((processed / files.length) * 100);
    process.stdout.write(
      `\r⏳ Progress: ${processed}/${files.length} (${percent}%) - Updated: ${updated}, Failed: ${failed}`,
    );
  }

  console.log('\n');
  console.log('✅ Migration complete!');
  console.log(`   📊 Total processed: ${processed}`);
  console.log(`   ✓ Updated: ${updated}`);
  console.log(`   ✗ Failed: ${failed}`);
}

main().catch(console.error);
