
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local manually (no dependencies)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function backfillTags() {
  console.log('🚀 Starting Ingredient Tags Backfill...');

  let processed = 0;
  const batchSize = 100; // Update 100 at a time

  while (true) {
    // Call the RPC
    const { data: count, error } = await supabase.rpc('backfill_ingredient_tags', { p_limit: batchSize });

    if (error) {
      console.error('❌ Error executing backfill RPC:', error);
      // Wait a bit before retrying or exit?
      // If it's a timeout, maybe retry? But RPC itself should be fast.
      // If RPC is missing, break.
      if (error.message.includes('function backfill_ingredient_tags') && error.message.includes('does not exist')) {
         console.error('RPC not found! Did you run the migration?');
      }
      break;
    }

    if (count === 0) {
      console.log('✅ All recipes updated! No more NULL ingredient_tags columns found.');
      break;
    }

    processed += (count as number);
    console.log(`✅ Processed ${processed} recipes so far...`);

    // Small pause to be nice to the DB
    await new Promise(r => setTimeout(r, 100));
  }
}

backfillTags();
