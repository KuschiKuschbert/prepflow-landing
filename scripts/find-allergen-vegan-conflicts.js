/**
 * Find Allergen-Vegan Conflicts
 * Identifies recipes and dishes that are marked as vegan but contain milk or eggs allergens
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error(
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Consolidate allergens (map old codes to new)
 */
function consolidateAllergens(allergens) {
  if (!Array.isArray(allergens)) return [];

  const allergenMap = {
    crustacea: 'shellfish',
    molluscs: 'shellfish',
    peanuts: 'nuts',
    tree_nuts: 'nuts',
    wheat: 'gluten',
  };

  const mapped = allergens.map(code => allergenMap[code] || code);
  return [...new Set(mapped)];
}

/**
 * Check if allergens array contains milk or eggs
 */
function hasMilkOrEggs(allergens) {
  const consolidated = consolidateAllergens(allergens || []);
  return consolidated.includes('milk') || consolidated.includes('eggs');
}

/**
 * Find conflicts in recipes
 */
async function findRecipeConflicts() {
  console.log('\n🔍 Checking recipes...\n');

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, recipe_name, is_vegan, allergens')
    .eq('is_vegan', true);

  if (error) {
    console.error('❌ Error fetching recipes:', error.message);
    return [];
  }

  const conflicts = [];

  for (const recipe of recipes || []) {
    if (hasMilkOrEggs(recipe.allergens)) {
      conflicts.push({
        type: 'recipe',
        id: recipe.id,
        name: recipe.recipe_name,
        allergens: recipe.allergens,
        consolidated: consolidateAllergens(recipe.allergens),
      });
    }
  }

  return conflicts;
}

/**
 * Find conflicts in dishes
 */
async function findDishConflicts() {
  console.log('🔍 Checking dishes...\n');

  const { data: dishes, error } = await supabase
    .from('dishes')
    .select('id, dish_name, is_vegan, allergens')
    .eq('is_vegan', true);

  if (error) {
    // Dishes table might not exist
    if (error.code === '42P01') {
      console.log('ℹ️  Dishes table does not exist, skipping...\n');
      return [];
    }
    console.error('❌ Error fetching dishes:', error.message);
    return [];
  }

  const conflicts = [];

  for (const dish of dishes || []) {
    if (hasMilkOrEggs(dish.allergens)) {
      conflicts.push({
        type: 'dish',
        id: dish.id,
        name: dish.dish_name,
        allergens: dish.allergens,
        consolidated: consolidateAllergens(dish.allergens),
      });
    }
  }

  return conflicts;
}

/**
 * Main function
 */
async function main() {
  console.log('🚨 Allergen-Vegan Conflict Detection\n');
  console.log('Finding items marked as vegan but containing milk or eggs allergens...\n');

  const [recipeConflicts, dishConflicts] = await Promise.all([
    findRecipeConflicts(),
    findDishConflicts(),
  ]);

  const allConflicts = [...recipeConflicts, ...dishConflicts];

  if (allConflicts.length === 0) {
    console.log('✅ No conflicts found! All vegan items are correctly labeled.\n');
    return;
  }

  console.log(`⚠️  Found ${allConflicts.length} conflict(s):\n`);

  allConflicts.forEach((conflict, index) => {
    console.log(`${index + 1}. ${conflict.type.toUpperCase()}: ${conflict.name}`);
    console.log(`   ID: ${conflict.id}`);
    console.log(`   Allergens: ${conflict.consolidated.join(', ')}`);
    console.log(`   Raw allergens: ${JSON.stringify(conflict.allergens)}`);
    console.log('');
  });

  console.log('\n💡 To fix these conflicts, use the revalidation endpoints:');
  console.log('   POST /api/recipes/[id]/revalidate-dietary');
  console.log('   POST /api/dishes/[id]/revalidate-dietary\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
