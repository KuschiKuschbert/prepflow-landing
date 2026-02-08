import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import zlib from 'zlib';

const gunzip = promisify(zlib.gunzip);

// Load env vars from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

interface LocalRecipe {
  id?: string;
  source_url?: string;
  file_path: string;
  recipe_name: string;
  description?: string;
  instructions?: any[];
  ingredients?: any[];
  source?: string;
  image_url?: string;
  yield?: number | string;
  yield_unit?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  category?: string;
  cuisine?: string;
  scraped_at?: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncRecipes() {
  const indexPath = path.join(process.cwd(), 'data/recipe-database/index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('Index file not found');
    process.exit(1);
  }

  console.log('Loading local index...');
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const localRecipes: LocalRecipe[] = indexData.recipes;
  console.log(`Found ${localRecipes.length} recipes in local index.`);

  console.log('Fetching existing URLs from Supabase...');
  // Fetch all existing IDs using pagination
  const existingKeys = new Set<string>();
  const PAGE_SIZE = 1000;
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const { data: existingData, error: existingError } = await supabase
      .from('ai_specials')
      .select('source_url, external_id')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (existingError) {
      console.error('Error fetching existing recipes:', existingError);
      process.exit(1);
    }

    if (existingData && existingData.length > 0) {
      existingData.forEach((row: { source_url?: string; external_id?: string }) => {
        if (row.source_url) existingKeys.add(row.source_url);
        if (row.external_id) existingKeys.add(row.external_id);
      });
      console.log(
        `Fetched ${existingData.length} existing records (Total so far: ${existingKeys.size})...`,
      );
      if (existingData.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        page++;
      }
    } else {
      hasMore = false;
    }
  }

  console.log(`Found ${existingKeys.size} unique keys (URLs/IDs) in Supabase.`);

  const missingRecipes = localRecipes.filter(r => {
    // Check source_url
    if (r.source_url && existingKeys.has(r.source_url)) return false;
    // Check id (which maps to external_id)
    if (r.id && existingKeys.has(r.id)) return false;
    return true;
  });
  console.log(`Found ${missingRecipes.length} recipes missing from Supabase.`);

  if (missingRecipes.length === 0) {
    console.log('No recipes to sync.');
    return;
  }

  // Batch process
  const BATCH_SIZE = 50;
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < missingRecipes.length; i += BATCH_SIZE) {
    const batch = missingRecipes.slice(i, i + BATCH_SIZE);
    const recordsToInsert = [];

    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(missingRecipes.length / BATCH_SIZE)}...`,
    );

    for (const item of batch) {
      try {
        const filePath = path.join(process.cwd(), 'data/recipe-database', item.file_path);
        if (!fs.existsSync(filePath)) {
          console.warn(`File not found: ${filePath}`);
          continue;
        }

        const buffer = fs.readFileSync(filePath);
        let content;
        if (filePath.endsWith('.gz')) {
          content = (await gunzip(buffer)).toString('utf-8');
        } else {
          content = buffer.toString('utf-8');
        }

        const recipe: LocalRecipe = JSON.parse(content);

        // Map to ai_specials schema
        const instructions = recipe.instructions || [];
        const ingredients = recipe.ingredients || [];
        const ingredientsOld =
          recipe.ingredients?.map((ing: any) => ing.original_text || ing.name) || [];
        // Generate ingredient tags for search
        const ingredientTags = ingredients
          .map((ing: any) => ing.original_text || ing.name)
          .filter(Boolean);

        recordsToInsert.push({
          external_id: recipe.id || crypto.randomUUID(), // Map local ID or generate UUID
          name: recipe.recipe_name,
          description: recipe.description || '',
          instructions: instructions,
          ingredients: ingredients, // JSONB
          ingredients_old: ingredientsOld,
          ingredient_tags: ingredientTags, // Array of strings
          source: recipe.source,
          source_url: recipe.source_url,
          image_url: recipe.image_url,
          yield: typeof recipe.yield === 'number' ? recipe.yield : null,
          yield_unit: recipe.yield_unit,
          prep_time_minutes: recipe.prep_time_minutes,
          cook_time_minutes: recipe.cook_time_minutes,
          category: recipe.category,
          cuisine: recipe.cuisine,
          status: 'active',
          created_at: recipe.scraped_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`Error processing recipe ${item.source_url}:`, err);
        failureCount++;
      }
    }

    if (recordsToInsert.length > 0) {
      const { error } = await supabase
        .from('ai_specials')
        .upsert(recordsToInsert, { onConflict: 'external_id', ignoreDuplicates: true });
      if (error) {
        console.error('Error inserting batch:', error);
        failureCount += recordsToInsert.length;
      } else {
        successCount += recordsToInsert.length;
      }
    }
  }

  console.log(`Sync complete. Success: ${successCount}, Failed: ${failureCount}`);
}

syncRecipes().catch(console.error);
