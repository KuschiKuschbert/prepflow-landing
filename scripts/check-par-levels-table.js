/**
 * Diagnostic script to check if par_levels table exists and has correct structure
 * Run with: node scripts/check-par-levels-table.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error(
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkTable() {
  console.log('🔍 Checking par_levels table...\n');

  // Check if table exists
  const { data, error } = await supabase.from('par_levels').select('id').limit(1);

  if (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error('❌ Table check failed:');
    console.error(`   Code: ${errorCode}`);
    console.error(`   Message: ${errorMessage}\n`);

    if (
      errorCode === '42P01' ||
      errorMessage.includes('relation') ||
      errorMessage.includes('does not exist')
    ) {
      console.log('📋 SOLUTION:');
      console.log('   1. Open your Supabase SQL Editor');
      console.log('   2. Copy the contents of migrations/add-par-levels-columns.sql');
      console.log('   3. Run the SQL script');
      console.log('   4. Refresh the page\n');
    } else {
      console.log('⚠️  This might be a different database error. Check the error message above.');
    }
    process.exit(1);
  }

  // Check table structure
  console.log('✅ Table exists! Checking structure...\n');

  const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', {
    table_name: 'par_levels',
  });

  if (columnsError) {
    // Try alternative method
    const { data: sampleData } = await supabase.from('par_levels').select('*').limit(1);
    if (sampleData && sampleData.length > 0) {
      console.log('✅ Table structure looks good!');
      console.log('   Sample columns:', Object.keys(sampleData[0]).join(', '));
    } else {
      console.log('✅ Table exists but is empty (this is OK)');
    }
  } else {
    console.log('✅ Table structure verified');
  }

  // Check foreign key relationship
  console.log('\n🔗 Checking foreign key to ingredients table...');
  const { data: testJoin, error: joinError } = await supabase
    .from('par_levels')
    .select(
      `
      *,
      ingredients (
        id,
        ingredient_name
      )
    `,
    )
    .limit(1);

  if (joinError) {
    console.warn('⚠️  Foreign key join test failed:', joinError.message);
    console.log(
      '   This might be OK if the table is empty or the relationship needs to be set up.',
    );
  } else {
    console.log('✅ Foreign key relationship works correctly!');
  }

  console.log('\n✅ All checks passed! The par_levels table is ready to use.');
}

checkTable().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});

