/**
 * seed-five-years-catalog.ts
 *
 * Stress-seeds the recipes, dishes, ingredients, recipe_ingredients, and
 * compliance_records tables to simulate 5+ years of catalogue growth at a
 * busy restaurant / large venue.
 *
 * Scale (matches plan targets):
 *   - 3000 ingredients  (realistic after 5 years of menu development)
 *   - 2000 recipes      (entrees, mains, desserts, sides, drinks, etc.)
 *   - 1000 dishes       (grouped by course)
 *   - 10000 recipe_ingredients (~5 ingredients per recipe)
 *   - 5000 compliance records (licences, certificates, maintenance logs)
 *
 * This script is ADDITIVE – it does NOT delete existing data first.
 * It inserts in batches of 200 rows to avoid Supabase statement limits.
 *
 * Expected run time: 5–15 minutes (network-bound)
 *
 * Usage:
 *   npx tsx scripts/seed-five-years-catalog.ts
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(msg: string) {
  const now = new Date().toISOString();
  process.stdout.write(`[${now}] ${msg}\n`);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, dp = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

async function batchInsert(
  table: string,
  rows: Record<string, unknown>[],
  batchSize = 200,
): Promise<number> {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { data, error } = await supabase.from(table).insert(batch).select('id');
    if (error) {
      process.stderr.write(`  ⚠️  Batch insert error on ${table}: ${error.message}\n`);
    } else {
      inserted += data?.length ?? batch.length;
    }
    if (i > 0 && i % 2000 === 0) {
      log(`    ... ${i.toLocaleString()} rows processed`);
    }
  }
  return inserted;
}

// ---------------------------------------------------------------------------
// Resolve a user_id to seed data against
// ---------------------------------------------------------------------------

async function resolveUserId(): Promise<string | null> {
  const { data, error } = await supabase.from('users').select('id').limit(1);
  if (error || !data || data.length === 0) return null;
  return data[0].id as string;
}

// ---------------------------------------------------------------------------
// Data vocabulary
// ---------------------------------------------------------------------------

const INGREDIENT_CATEGORIES = [
  'Proteins',
  'Dairy',
  'Vegetables',
  'Herbs & Spices',
  'Grains & Starches',
  'Oils & Fats',
  'Condiments',
  'Alcohol',
  'Dry Goods',
  'Fresh Produce',
  'Seafood',
  'Bakery',
  'Frozen',
  'Beverages',
  'Cleaning Supplies',
];

const RECIPE_CATEGORIES = [
  'Entrée',
  'Main',
  'Dessert',
  'Side',
  'Sauce',
  'Salad',
  'Soup',
  'Breakfast',
  'Brunch',
  'Bar',
  'Kids Menu',
  'Vegetarian',
  'Vegan',
  'Gluten Free',
  'Snacks',
];

const DISH_CATEGORIES = [
  'Starter',
  'Main Course',
  'Dessert',
  'Set Menu',
  'Specials',
  'Vegetarian',
  'Vegan',
  'Gluten Free',
  'Sharing Plates',
  'Kids',
];

const UNITS = ['kg', 'g', 'L', 'mL', 'each', 'bunch', 'packet', 'case', 'bottle', 'can'];

const COMPLIANCE_TYPES_SEED = [
  'Food Safety Certificate',
  'Liquor Licence',
  'Fire Safety Certificate',
  'Health & Hygiene Inspection',
  'Equipment Maintenance',
  'Staff Training Record',
  'Building Safety Certificate',
  'Insurance',
  'Food Handler Permit',
  'Business Licence',
];

const COMPLIANCE_STATUSES = ['active', 'expiring_soon', 'expired', 'pending'];

// Generate unique-ish names by combining prefixes + indices
function ingredientName(i: number): string {
  const prefixes = [
    'Premium',
    'Organic',
    'Free Range',
    'Local',
    'Imported',
    'Fresh',
    'Frozen',
    'Smoked',
    'Cured',
    'Pickled',
    'Dried',
    'Roasted',
    'Wild',
    'Farmed',
    'Raw',
  ];
  const bases = [
    'Chicken',
    'Beef',
    'Pork',
    'Lamb',
    'Salmon',
    'Tuna',
    'Prawns',
    'Mushrooms',
    'Tomatoes',
    'Onions',
    'Garlic',
    'Butter',
    'Cream',
    'Olive Oil',
    'Flour',
    'Sugar',
    'Salt',
    'Pepper',
    'Basil',
    'Thyme',
    'Parsley',
    'Lemon',
    'Lime',
    'Cheese',
    'Eggs',
    'Milk',
    'Yoghurt',
    'Rice',
    'Pasta',
    'Bread',
    'Potatoes',
    'Capsicum',
    'Zucchini',
    'Eggplant',
    'Spinach',
    'Lettuce',
    'Cucumber',
    'Carrot',
    'Celery',
    'Leek',
    'Fennel',
    'Beets',
    'Corn',
    'Peas',
    'Beans',
    'Lentils',
  ];
  const prefix = pick(prefixes);
  const base = bases[i % bases.length];
  return `${prefix} ${base} #${i + 1}`;
}

function recipeName(i: number): string {
  const adjectives = [
    'Pan-Seared',
    'Slow-Roasted',
    'Grilled',
    'Braised',
    'Poached',
    'Fried',
    'Baked',
    'Steamed',
    'Smoked',
    'Cured',
    'Chilled',
    'Warm',
    'Crispy',
    'Tender',
  ];
  const proteins = [
    'Chicken',
    'Beef',
    'Salmon',
    'Barramundi',
    'Lamb Rack',
    'Pork Belly',
    'Duck',
    'Tuna',
    'Prawns',
    'Scallops',
    'Mushroom',
    'Cauliflower',
    'Eggplant',
  ];
  const sauces = [
    'with Jus',
    'with Beurre Blanc',
    'with Chimichurri',
    'with Salsa Verde',
    'with Romesco',
    'with Aioli',
    'with Demi-Glace',
    'with Herb Butter',
    'with Red Wine Sauce',
    'with Miso Glaze',
    'with Citrus Vinaigrette',
  ];
  return `${pick(adjectives)} ${proteins[i % proteins.length]} ${pick(sauces)} #${i + 1}`;
}

function dishName(i: number): string {
  const styles = [
    'Classic',
    'Modern',
    'Traditional',
    'Contemporary',
    "Chef's",
    'House',
    'Signature',
    'Seasonal',
    'Heritage',
    'Artisan',
  ];
  const bases = [
    'Platter',
    'Selection',
    'Board',
    'Course',
    'Tasting Plate',
    'Sharing Bowl',
    'Feast',
    'Set',
    'Experience',
    'Menu',
  ];
  return `${pick(styles)} ${bases[i % bases.length]} #${i + 1}`;
}

// ---------------------------------------------------------------------------
// Seed ingredients (3000)
// ---------------------------------------------------------------------------

async function seedIngredients(userId: string, count = 3000): Promise<string[]> {
  log(`\n📋 Seeding ${count} ingredients...`);
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < count; i++) {
    const unit = pick(UNITS);
    const packCost = randomFloat(2, 150);
    const packSize = randomFloat(0.5, 50);
    rows.push({
      user_id: userId,
      ingredient_name: ingredientName(i),
      category: pick(INGREDIENT_CATEGORIES),
      unit,
      standard_unit: unit,
      pack_cost: packCost,
      pack_size: packSize,
      cost_per_unit: parseFloat((packCost / packSize).toFixed(4)),
      wastage_percentage: randomBetween(0, 20),
      created_at: new Date(Date.now() - randomBetween(0, 5 * 365) * 86400000).toISOString(),
    });
  }
  const inserted = await batchInsert('ingredients', rows);
  log(`  ✅ Inserted ${inserted} ingredients`);

  // Fetch back the IDs we just created
  const { data, error } = await supabase
    .from('ingredients')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(count);
  if (error) {
    log(`  ⚠️  Could not fetch ingredient IDs: ${error.message}`);
    return [];
  }
  return (data || []).map((r: { id: string }) => r.id);
}

// ---------------------------------------------------------------------------
// Seed recipes (2000)
// ---------------------------------------------------------------------------

async function seedRecipes(userId: string, count = 2000): Promise<string[]> {
  log(`\n📋 Seeding ${count} recipes...`);
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      user_id: userId,
      recipe_name: recipeName(i),
      category: pick(RECIPE_CATEGORIES),
      yield: randomFloat(1, 20, 1),
      yield_unit: pick(['serves', 'portions', 'pieces', 'L', 'kg']),
      selling_price: randomFloat(8, 65),
      description: `House-made recipe developed over ${randomBetween(1, 5)} years.`,
      created_at: new Date(Date.now() - randomBetween(0, 5 * 365) * 86400000).toISOString(),
    });
  }
  const inserted = await batchInsert('recipes', rows);
  log(`  ✅ Inserted ${inserted} recipes`);

  const { data, error } = await supabase
    .from('recipes')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(count);
  if (error) {
    log(`  ⚠️  Could not fetch recipe IDs: ${error.message}`);
    return [];
  }
  return (data || []).map((r: { id: string }) => r.id);
}

// ---------------------------------------------------------------------------
// Seed dishes (1000)
// ---------------------------------------------------------------------------

async function seedDishes(userId: string, count = 1000): Promise<string[]> {
  log(`\n📋 Seeding ${count} dishes...`);
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      user_id: userId,
      dish_name: dishName(i),
      category: pick(DISH_CATEGORIES),
      selling_price: randomFloat(12, 120),
      description: `Curated dish featuring seasonal produce.`,
      created_at: new Date(Date.now() - randomBetween(0, 5 * 365) * 86400000).toISOString(),
    });
  }
  const inserted = await batchInsert('dishes', rows);
  log(`  ✅ Inserted ${inserted} dishes`);

  const { data, error } = await supabase
    .from('dishes')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(count);
  if (error) {
    log(`  ⚠️  Could not fetch dish IDs: ${error.message}`);
    return [];
  }
  return (data || []).map((r: { id: string }) => r.id);
}

// ---------------------------------------------------------------------------
// Seed recipe_ingredients (5 per recipe = 10000 rows)
// ---------------------------------------------------------------------------

async function seedRecipeIngredients(recipeIds: string[], ingredientIds: string[]): Promise<void> {
  log(`\n📋 Seeding recipe_ingredients (${recipeIds.length} recipes × 5 ingredients)...`);
  const rows: Record<string, unknown>[] = [];
  const shuffledIngredients = shuffle(ingredientIds);
  for (const recipeId of recipeIds) {
    const pickedIngredients = shuffledIngredients.slice(0, 5);
    // Rotate for variety
    shuffledIngredients.push(shuffledIngredients.shift()!);
    for (const ingredientId of pickedIngredients) {
      const qty = randomFloat(0.05, 2, 3);
      const unit = pick(['kg', 'g', 'L', 'mL', 'each']);
      rows.push({
        recipe_id: recipeId,
        ingredient_id: ingredientId,
        quantity: qty,
        unit,
        cost_per_unit: randomFloat(0.5, 30),
        total_cost: randomFloat(0.1, 60),
      });
    }
  }
  const inserted = await batchInsert('recipe_ingredients', rows);
  log(`  ✅ Inserted ${inserted} recipe_ingredients`);
}

// ---------------------------------------------------------------------------
// Seed compliance_records (5000)
// ---------------------------------------------------------------------------

async function seedComplianceRecords(userId: string, count = 5000): Promise<void> {
  log(`\n📋 Seeding ${count} compliance_records...`);

  // Ensure we have compliance_types to reference
  const { data: existingTypes, error: typesError } = await supabase
    .from('compliance_types')
    .select('id')
    .limit(20);
  if (typesError || !existingTypes || existingTypes.length === 0) {
    log('  ⚠️  No compliance_types found — skipping compliance_records seeding');
    log('     Run the populate-clean-test-data endpoint first to create types.');
    return;
  }
  const typeIds = existingTypes.map((t: { id: string }) => t.id);

  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < count; i++) {
    const issueDate = daysAgo(randomBetween(30, 5 * 365));
    const expiryDate = daysFromNow(randomBetween(-180, 730)); // -6 months to +2 years
    const status = pick(COMPLIANCE_STATUSES);
    rows.push({
      user_id: userId,
      compliance_type_id: pick(typeIds),
      document_name: `${pick(COMPLIANCE_TYPES_SEED)} - ${new Date(issueDate).getFullYear()}`,
      issue_date: issueDate,
      expiry_date: expiryDate,
      status,
      reminder_enabled: Math.random() > 0.3,
      reminder_days_before: randomBetween(7, 60),
      notes: `Auto-seeded compliance record #${i + 1}`,
      created_at: new Date(issueDate).toISOString(),
    });
  }
  const inserted = await batchInsert('compliance_records', rows);
  log(`  ✅ Inserted ${inserted} compliance_records`);
}

// ---------------------------------------------------------------------------
// Performance verification
// ---------------------------------------------------------------------------

async function verifyCatalogPerformance(userId: string): Promise<void> {
  log('\n⚡ Verifying catalog endpoint performance against large dataset...');

  const checks: Array<{ label: string; fn: () => Promise<void> }> = [
    {
      label: 'Recipe catalog query (all 2000 rows)',
      fn: async () => {
        const t0 = Date.now();
        const { data, error } = await supabase
          .from('recipes')
          .select('id, recipe_name, category, selling_price, yield, yield_unit')
          .eq('user_id', userId)
          .order('recipe_name');
        const ms = Date.now() - t0;
        if (error) throw new Error(error.message);
        log(`    📊 ${(data?.length ?? 0).toLocaleString()} recipes in ${ms}ms`);
        if (ms > 2000) log('    ⚠️  SLOW: exceeded 2s target');
        else log('    ✅ Within 2s target');
      },
    },
    {
      label: 'Ingredient catalog query (all 3000 rows)',
      fn: async () => {
        const t0 = Date.now();
        const { data, error } = await supabase
          .from('ingredients')
          .select(
            'id, ingredient_name, unit, pack_cost, pack_size, standard_unit, cost_per_unit, category, supplier_id, wastage_percentage',
          )
          .eq('user_id', userId)
          .order('ingredient_name');
        const ms = Date.now() - t0;
        if (error) throw new Error(error.message);
        log(`    📊 ${(data?.length ?? 0).toLocaleString()} ingredients in ${ms}ms`);
        if (ms > 1500) log('    ⚠️  SLOW: exceeded 1.5s target');
        else log('    ✅ Within 1.5s target');
      },
    },
    {
      label: 'Dish catalog query (all 1000 rows)',
      fn: async () => {
        const t0 = Date.now();
        const { data, error } = await supabase
          .from('dishes')
          .select('id, dish_name, category, selling_price')
          .eq('user_id', userId)
          .order('dish_name');
        const ms = Date.now() - t0;
        if (error) throw new Error(error.message);
        log(`    📊 ${(data?.length ?? 0).toLocaleString()} dishes in ${ms}ms`);
        if (ms > 1000) log('    ⚠️  SLOW: exceeded 1s target');
        else log('    ✅ Within 1s target');
      },
    },
    {
      label: 'Compliance records (first page, 50 rows)',
      fn: async () => {
        const t0 = Date.now();
        const { data, count, error } = await supabase
          .from('compliance_records')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .order('expiry_date', { ascending: true })
          .range(0, 49);
        const ms = Date.now() - t0;
        if (error) throw new Error(error.message);
        log(
          `    📊 ${data?.length ?? 0} rows (of ${count?.toLocaleString() ?? '?'} total) in ${ms}ms`,
        );
        if (ms > 500) log('    ⚠️  SLOW: exceeded 500ms target');
        else log('    ✅ Within 500ms target');
      },
    },
    {
      label: 'Recipe ingredients join (100 random recipes)',
      fn: async () => {
        const { data: sampleRecipes } = await supabase
          .from('recipes')
          .select('id')
          .eq('user_id', userId)
          .limit(100);
        if (!sampleRecipes || sampleRecipes.length === 0) {
          log('    ⚠️  No recipes found to test');
          return;
        }
        const ids = sampleRecipes.map((r: { id: string }) => r.id);
        const t0 = Date.now();
        const { data, error } = await supabase
          .from('recipe_ingredients')
          .select('recipe_id, ingredient_id, quantity, unit, cost_per_unit')
          .in('recipe_id', ids);
        const ms = Date.now() - t0;
        if (error) throw new Error(error.message);
        log(
          `    📊 ${(data?.length ?? 0).toLocaleString()} recipe_ingredients for 100 recipes in ${ms}ms`,
        );
        if (ms > 1000) log('    ⚠️  SLOW: exceeded 1s target');
        else log('    ✅ Within 1s target');
      },
    },
  ];

  for (const check of checks) {
    log(`\n  🔍 ${check.label}`);
    try {
      await check.fn();
    } catch (err) {
      log(`    ❌ Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log('🚀 seed-five-years-catalog.ts');
  log('   Seeding recipes, ingredients, dishes, recipe_ingredients, compliance_records');
  log('   This is ADDITIVE — existing data is NOT deleted.\n');

  // Validate Supabase connection
  const { error: pingError } = await supabase.from('recipes').select('id').limit(1);
  if (pingError && pingError.code !== '42P01') {
    log(`❌ Cannot connect to Supabase: ${pingError.message}`);
    log('   Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }
  log('✅ Supabase connection verified\n');

  const userId = await resolveUserId();
  if (!userId) {
    log('❌ No users found in the database.');
    log('   Log in to the app at least once to create a user record, then re-run this script.');
    process.exit(1);
  }
  log(`✅ Using user_id: ${userId}\n`);

  const startTime = Date.now();

  const ingredientIds = await seedIngredients(userId, 3000);
  const recipeIds = await seedRecipes(userId, 2000);
  await seedDishes(userId, 1000);

  if (recipeIds.length > 0 && ingredientIds.length > 0) {
    await seedRecipeIngredients(recipeIds, ingredientIds);
  } else {
    log('\n⚠️  Skipping recipe_ingredients — not enough IDs available');
  }

  await seedComplianceRecords(userId, 5000);

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  log(`\n✅ Seeding complete in ${elapsed}s`);
  log('   Summary:');
  log(`     - ${ingredientIds.length.toLocaleString()} ingredients`);
  log(`     - ${recipeIds.length.toLocaleString()} recipes`);
  log(`     - 1000 dishes`);
  log(`     - up to ${(recipeIds.length * 5).toLocaleString()} recipe_ingredients`);
  log(`     - up to 5000 compliance records`);

  await verifyCatalogPerformance(userId);

  log('\n📋 Next steps:');
  log('   1. Apply migrations/add-catalog-performance-indexes.sql via Supabase SQL Editor');
  log("   2. Re-run this script's performance checks to confirm index impact");
  log('   3. Open the app and navigate to Recipes, COGS, Menu Builder, Compliance');
  log('      — all should load within their respective performance targets');
}

main().catch(err => {
  process.stderr.write(`\n❌ Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
