#!/usr/bin/env node

/**
 * Check if the avatar column exists in the users table
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

async function checkColumn() {
  console.log('🔍 Checking users table for avatar column...\n');

  try {
    // Try to select the avatar column
    const { data, error } = await supabase.from('users').select('avatar').limit(1);

    if (error) {
      const errorMessage = error.message || '';
      const errorCode = error.code || '';

      if (
        errorMessage.includes('column') &&
        (errorMessage.includes('does not exist') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('unknown column'))
      ) {
        console.error('❌ Avatar column does not exist!\n');
        console.log('📋 SOLUTION:');
        console.log('   1. Open your Supabase SQL Editor');
        console.log('   2. Copy the contents of migrations/add-user-avatar.sql');
        console.log('   3. Run the SQL script');
        console.log('   4. Refresh the page\n');
        console.log('   Or visit: http://localhost:3000/api/setup-user-avatar\n');
        process.exit(1);
      } else {
        console.error('❌ Error checking column:');
        console.error(`   Code: ${errorCode}`);
        console.error(`   Message: ${errorMessage}\n`);
        process.exit(1);
      }
    } else {
      console.log('✅ Avatar column exists!\n');
      console.log('Sample data:', data);
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

checkColumn();




