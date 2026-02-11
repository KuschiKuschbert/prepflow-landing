import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local manually to avoid dependency issues
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('--- Checking Ingredients Table ---');

  // Total count
  const { count: totalCount, error: countError } = await supabase
    .from('ingredients')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error counting ingredients:', countError.message);
    return;
  }

  console.log(`Total Ingredients: ${totalCount}`);

  if (totalCount === 0) {
    console.log('No ingredients found in the database. It is empty.');
    return;
  }

  // Group by user_id
  // Note: specific query to simulate group by if rpc not available, fetching distinct user_ids
  const { data: ingredients, error: dataError } = await supabase
    .from('ingredients')
    .select('user_id, ingredient_name')
    .limit(100);

  if (dataError) {
    console.error('Error fetching data:', dataError.message);
    return;
  }

  const userCounts: Record<string, number> = {};
  ingredients.forEach(i => {
    const uid = i.user_id || 'null';
    userCounts[uid] = (userCounts[uid] || 0) + 1;
  });

  console.log('Sample ownership (from first 100 rows):');
  Object.entries(userCounts).forEach(([uid, count]) => {
    console.log(`User ID: ${uid} - Count: ${count}`);
    // Try to resolve email for this UID
    resolveUserEmail(uid);
  });
}

async function resolveUserEmail(userId: string) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.admin.getUserById(userId);
    if (error) {
      console.log(`Failed to resolve email for ${userId}: ${error.message}`);
    } else if (user) {
      console.log(`-> Email for ${userId}: ${user.email}`);
    }
  } catch (_e) {
    console.log(`Exception resolving email for ${userId}`);
  }
}

checkData();
