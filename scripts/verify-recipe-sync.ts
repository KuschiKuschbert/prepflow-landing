import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Try service role key, fallback to anon key (anon key might not have permission to list all tables/rows though)
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables after checking .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySync() {
  const indexPath = path.join(process.cwd(), 'data/recipe-database/index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('Index file not found');
    process.exit(1);
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const sampleRecipes = indexData.recipes.slice(0, 5); // Check first 5

  console.log(`Checking ${sampleRecipes.length} recipes against Supabase...`);

  // Check 'ai_specials' table using source_url
  console.log("Checking 'ai_specials' table...");
  const { data: aiSpecialsData, error: aiSpecialsError } = await supabase
    .from('ai_specials')
    .select('source_url')
    .in(
      'source_url',
      sampleRecipes.map((r: any) => r.source_url),
    );

  if (aiSpecialsError) {
    console.log(`Error querying 'ai_specials' table: ${aiSpecialsError.message}`);
  } else {
    console.log(
      `Found ${aiSpecialsData?.length || 0} matches out of ${sampleRecipes.length} checked in 'ai_specials' table.`,
    );
    if (aiSpecialsData && aiSpecialsData.length > 0) {
      console.log(
        'Sample matched URLs:',
        aiSpecialsData.slice(0, 3).map((r: any) => r.source_url),
      );
    }
  }

  // Get count by source in 'ai_specials'
  console.log("Analyzing counts by source in 'ai_specials'...");
  const { data: sourceCounts, error: sourceCountsError } = await supabase
    .from('ai_specials')
    .select('source')
    .csv(); // CSV format to avoid large JSON payload, or we can just iterate if rpc/group by isn't available

  // Supabase JS doesn't support GROUP BY directly on client unless using .rpc or view
  // Let's trying fetching just sources and aggregation in memory since 22k isn't too huge for node memory
  const { data: allSources, error: allSourcesError } = await supabase
    .from('ai_specials')
    .select('source');

  if (allSourcesError) {
    console.log(`Error fetching sources: ${allSourcesError.message}`);
  } else if (allSources) {
    const supabaseCounts: Record<string, number> = {};
    allSources.forEach((r: any) => {
      const s = r.source || 'unknown';
      supabaseCounts[s] = (supabaseCounts[s] || 0) + 1;
    });

    console.log('\n--- Comparison by Source ---');
    const localCounts: Record<string, number> = {};
    indexData.recipes.forEach((r: any) => {
      localCounts[r.source] = (localCounts[r.source] || 0) + 1;
    });

    const allKeys = new Set([...Object.keys(supabaseCounts), ...Object.keys(localCounts)]);
    allKeys.forEach(source => {
      const sup = supabaseCounts[source] || 0;
      const loc = localCounts[source] || 0;
      const diff = loc - sup;
      console.log(`${source.padEnd(20)}: Local=${loc}, Supabase=${sup}, Diff=${diff}`);
    });
  }

  // Fetch a sample row to understand the data structure for syncing
  console.log("Fetching a sample row from 'ai_specials' for schema mapping...");
  const { data: sampleRow, error: sampleRowError } = await supabase
    .from('ai_specials')
    .select('*')
    .limit(1)
    .single();

  if (sampleRowError) {
    console.log(`Error fetching sample row: ${sampleRowError.message}`);
  } else {
    console.log('Sample row structure:', JSON.stringify(sampleRow, null, 2));
  }
}

verifySync();
