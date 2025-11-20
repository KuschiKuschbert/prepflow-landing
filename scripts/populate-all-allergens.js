/**
 * Populate All Allergens Script
 * Automatically detects and populates allergens for all ingredients that don't have manual allergens
 *
 * Usage: node scripts/populate-all-allergens.js [--dry-run] [--batch-size=50] [--force-ai]
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const forceAI = args.includes('--force-ai');
const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='));
const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1]) : 50;

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple keyword-based allergen detection (non-AI fallback)
function detectAllergensFromText(text) {
  const allergenKeywords = {
    gluten: ['wheat', 'barley', 'rye', 'oats', 'flour', 'bread', 'pasta', 'gluten'],
    shellfish: [
      'shrimp',
      'prawn',
      'crab',
      'lobster',
      'crayfish',
      'mussel',
      'oyster',
      'clam',
      'scallop',
      'squid',
      'octopus',
      'shellfish',
      'crustacea',
      'mollusc',
    ],
    eggs: ['egg', 'mayonnaise', 'mayo', 'custard', 'meringue'],
    fish: ['fish', 'salmon', 'tuna', 'cod', 'anchovy', 'sardine', 'mackerel', 'herring'],
    peanuts: ['peanut', 'groundnut'],
    tree_nuts: [
      'almond',
      'walnut',
      'cashew',
      'pistachio',
      'hazelnut',
      'pecan',
      'macadamia',
      'brazil nut',
      'nut',
    ],
    soy: ['soy', 'soya', 'tofu', 'tempeh', 'miso', 'edamame'],
    milk: ['milk', 'cream', 'butter', 'cheese', 'yogurt', 'yoghurt', 'dairy', 'lactose'],
    sesame: ['sesame', 'tahini', 'halva'],
    lupin: ['lupin', 'lupine'],
    sulphites: [
      'sulphite',
      'sulfite',
      'sulphur',
      'sulfur',
      'e220',
      'e221',
      'e222',
      'e223',
      'e224',
      'e225',
      'e226',
      'e227',
      'e228',
    ],
  };

  const detected = [];
  const lowerText = text.toLowerCase();

  // Map old allergen codes to consolidated codes
  const allergenMap = {
    crustacea: 'shellfish',
    molluscs: 'shellfish',
    peanuts: 'nuts',
    tree_nuts: 'nuts',
    wheat: 'gluten',
  };

  Object.entries(allergenKeywords).forEach(([code, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      const mappedCode = allergenMap[code] || code;
      if (!detected.includes(mappedCode)) {
        detected.push(mappedCode);
      }
    }
  });

  // Consolidate: map old codes to new ones
  return detected.map(code => allergenMap[code] || code).filter((v, i, a) => a.indexOf(v) === i);
}

// Consolidate allergens (map old codes to new ones)
function consolidateAllergens(allergens) {
  const allergenMap = {
    crustacea: 'shellfish',
    molluscs: 'shellfish',
    peanuts: 'nuts',
    tree_nuts: 'nuts',
    wheat: 'gluten',
  };

  const consolidated = allergens.map(code => allergenMap[code] || code);
  return [...new Set(consolidated)]; // Deduplicate
}

async function populateAllAllergens() {
  console.log('🔍 Fetching ingredients...\n');

  // Fetch all ingredients
  const { data: ingredients, error: fetchError } = await supabase
    .from('ingredients')
    .select('id, ingredient_name, brand, allergens, allergen_source')
    .order('ingredient_name', { ascending: true });

  if (fetchError) {
    console.error('❌ Failed to fetch ingredients:', fetchError.message);
    process.exit(1);
  }

  if (!ingredients || ingredients.length === 0) {
    console.log('ℹ️  No ingredients found.');
    return;
  }

  console.log(`📊 Found ${ingredients.length} total ingredients\n`);

  // Filter ingredients that need allergen detection
  const ingredientsToProcess = ingredients.filter(ingredient => {
    // Skip if has manual allergens
    const hasManualAllergens =
      ingredient.allergens &&
      Array.isArray(ingredient.allergens) &&
      ingredient.allergens.length > 0 &&
      ingredient.allergen_source &&
      typeof ingredient.allergen_source === 'object' &&
      ingredient.allergen_source.manual;

    return !hasManualAllergens;
  });

  console.log(`🎯 Ingredients to process: ${ingredientsToProcess.length}`);
  console.log(
    `⏭️  Will skip (has manual allergens): ${ingredients.length - ingredientsToProcess.length}\n`,
  );

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - Preview only (no changes will be made)\n');
    console.log('First 10 ingredients that would be processed:');
    ingredientsToProcess.slice(0, 10).forEach((ing, idx) => {
      const detected = consolidateAllergens([
        ...detectAllergensFromText(ing.ingredient_name),
        ...(ing.brand ? detectAllergensFromText(ing.brand) : []),
      ]);
      console.log(
        `  ${idx + 1}. ${ing.ingredient_name}${ing.brand ? ` (${ing.brand})` : ''} → ${detected.length > 0 ? detected.join(', ') : 'none detected'}`,
      );
    });
    if (ingredientsToProcess.length > 10) {
      console.log(`  ... and ${ingredientsToProcess.length - 10} more`);
    }
    return;
  }

  console.log('🚀 Starting allergen detection...\n');

  let successful = 0;
  let failed = 0;
  let skipped = 0;

  // Process ingredients in batches
  for (let i = 0; i < ingredientsToProcess.length; i += batchSize) {
    const batch = ingredientsToProcess.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(ingredientsToProcess.length / batchSize);

    console.log(`📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} ingredients)...`);

    for (const ingredient of batch) {
      try {
        // Detect allergens using keyword matching
        const nameAllergens = detectAllergensFromText(ingredient.ingredient_name);
        const brandAllergens = ingredient.brand ? detectAllergensFromText(ingredient.brand) : [];
        const detectedAllergens = consolidateAllergens([...nameAllergens, ...brandAllergens]);

        // Determine detection method
        const method = detectedAllergens.length > 0 ? 'non-ai' : 'none';
        const hasDetectedAllergens = detectedAllergens.length > 0;

        // Update allergen_source
        const allergenSource = {
          manual: false,
          ai: false,
          non_ai: hasDetectedAllergens,
          hybrid: false,
        };

        // Update ingredient in database
        const { error: updateError } = await supabase
          .from('ingredients')
          .update({
            allergens: detectedAllergens,
            allergen_source: allergenSource,
          })
          .eq('id', ingredient.id);

        if (updateError) {
          throw updateError;
        }

        successful++;
        if (detectedAllergens.length > 0) {
          console.log(`  ✓ ${ingredient.ingredient_name} → ${detectedAllergens.join(', ')}`);
        }
      } catch (err) {
        failed++;
        console.error(`  ✗ ${ingredient.ingredient_name}: ${err.message}`);
      }
    }

    // Small delay between batches
    if (i + batchSize < ingredientsToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  skipped = ingredients.length - ingredientsToProcess.length;

  console.log('\n✅ Allergen population complete!');
  console.log(`   Total: ${ingredients.length}`);
  console.log(`   Processed: ${ingredientsToProcess.length}`);
  console.log(`   ✓ Successful: ${successful}`);
  if (failed > 0) {
    console.log(`   ✗ Failed: ${failed}`);
  }
  console.log(`   ⏭️  Skipped (has manual allergens): ${skipped}`);
}

// Run the script
populateAllAllergens()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error:', err);
    process.exit(1);
  });
