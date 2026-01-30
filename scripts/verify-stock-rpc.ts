import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts
        .slice(1)
        .join('=')
        .trim()
        .replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RPCResult {
  id: string;
  name: string;
  stock_match_percentage?: number;
}

async function verify() {
  console.log('🧪 Verifying Stock Matching RPCs...\n');

  // 1. Fetch a real recipe to test against
  const { data: recipe } = await supabase
    .from('ai_specials')
    .select('id, name, ingredient_tags')
    .not('ingredient_tags', 'is', null) // Ensure tags are backfilled
    .limit(1)
    .single();

  if (!recipe) {
    console.error('❌ No recipes found with ingredient_tags backfilled!');
    return;
  }

  console.log(`📋 Test Recipe: "${recipe.name}"`);
  console.log(`   Tags: ${JSON.stringify(recipe.ingredient_tags)}`);

  if (!recipe.ingredient_tags || recipe.ingredient_tags.length === 0) {
    console.log('   (Recipe has no tags, skipping 100% match test)');
  } else {
    // 2. Test 100% Match (V2)
    // We simulate stock as exactly the recipe's tags + one extra
    const exactStock = [...recipe.ingredient_tags, 'unicorn dust'];
    console.log('\n🔍 Testing match_recipes_by_stock_v2 (Expect 1 result)...');

    const { data: v2Results, error: v2Error } = await supabase.rpc('match_recipes_by_stock_v2', {
      p_stock_tags: exactStock,
      p_limit: 5,
    });

    if (v2Error) {
      console.error('❌ match_recipes_by_stock_v2 Failed:', v2Error);
    } else {
      const found = v2Results.find((r: RPCResult) => r.id === recipe.id);
      if (found) {
        console.log('✅ Found target recipe! (100% Subset Match works)');
      } else {
        console.error('❌ Target recipe NOT found in V2 results.');
        console.log(
          '   Results:',
          v2Results.map((r: RPCResult) => r.name),
        );
      }
    }
  }

  // 3. Test Partial Match
  // We simulate stock as having only the first ingredient of the recipe
  if (recipe.ingredient_tags.length > 0) {
    const partialStock = [recipe.ingredient_tags[0]];
    console.log(`\n🔍 Testing match_recipes_by_stock_partial with stock [${partialStock}]...`);

    const { data: partialResults, error: partialError } = await supabase.rpc(
      'match_recipes_by_stock_partial',
      {
        p_stock_tags: partialStock,
        p_limit: 5,
        p_min_match: 1, // Allow low match
      },
    );

    if (partialError) {
      console.error('❌ match_recipes_by_stock_partial Failed:', partialError);
    } else {
      const found = partialResults.find((r: RPCResult) => r.id === recipe.id);
      if (found) {
        console.log(`✅ Found target recipe! Match: ${found.stock_match_percentage}%`);
      } else {
        // It's possible it's ranked too low if limit is small, but filtering should find it via FTS?
        // The partial match uses FTS pre-filter.
        console.log('⚠️ Target recipe not in top 5 (expected if common ingredient).');
        console.log(
          '   Results:',
          partialResults.map((r: RPCResult) => `${r.name} (${r.stock_match_percentage}%)`),
        );
      }
    }
  }
}

verify();
