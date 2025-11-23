#!/usr/bin/env node

/**
 * Check which columns exist in cleaning_tasks table
 * This helps diagnose missing column errors
 */

const { createClient } = require('@supabase/supabase-js');

// Read from .env.local manually
const fs = require('fs');
const path = require('path');

let supabaseUrl, supabaseKey;

try {
  const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      supabaseUrl = valueParts.join('=').trim();
    }
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      supabaseKey = valueParts.join('=').trim();
    }
  });
} catch (err) {
  // Try process.env as fallback
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('🔍 Checking cleaning_tasks table columns...\n');

  const requiredColumns = [
    'id',
    'task_name',
    'frequency_type',
    'area_id',
    'description',
    'equipment_id',
    'section_id',
    'is_standard_task',
    'standard_task_type',
    'status',
    'assigned_date',
    'completed_date',
    'notes',
    'photo_url',
    'created_at',
    'updated_at',
  ];

  const results = {};

  for (const column of requiredColumns) {
    try {
      const { error } = await supabase.from('cleaning_tasks').select(column).limit(1);

      if (error) {
        const errorMsg = error.message || '';
        if (errorMsg.includes('column') || errorMsg.includes('not found')) {
          results[column] = '❌ MISSING';
        } else {
          results[column] = `⚠️  ERROR: ${errorMsg}`;
        }
      } else {
        results[column] = '✅ EXISTS';
      }
    } catch (err) {
      results[column] = `❌ ERROR: ${err.message}`;
    }
  }

  console.log('Column Status:');
  console.log('==============\n');
  for (const [column, status] of Object.entries(results)) {
    console.log(`${column.padEnd(25)} ${status}`);
  }

  const missing = Object.entries(results).filter(([_, status]) => status.includes('MISSING'));
  if (missing.length > 0) {
    console.log(`\n❌ Found ${missing.length} missing columns:`);
    missing.forEach(([col]) => console.log(`   - ${col}`));
    console.log('\n💡 Run the migration: npm run supabase:migrate:cleaning');
    process.exit(1);
  } else {
    console.log('\n✅ All required columns exist!');
  }
}

checkColumns().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
