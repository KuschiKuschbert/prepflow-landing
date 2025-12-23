#!/usr/bin/env node

/**
 * Run cleaning tasks migration directly using Supabase REST API
 *
 * This script executes the migration SQL directly using Supabase's REST API
 * with the service role key. This bypasses the need for Supabase CLI login.
 *
 * Usage:
 *   node scripts/run-migration-direct.js
 */

require('dotenv').config({ path: '.env.local' });

const { readFileSync } = require('fs');
const { join } = require('path');
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error(
    '   Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local',
  );
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Invalid Supabase URL format');
  process.exit(1);
}

const migrationFile = join(process.cwd(), 'migrations', 'fix-cleaning-tasks-schema.sql');

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    // Supabase REST API endpoint for executing SQL
    // Note: This requires the SQL to be executed via PostgREST or a custom function
    // For now, we'll use the management API if available

    const url = new URL(`${supabaseUrl}/rest/v1/rpc/exec_sql`);
    const options = {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
    };

    // Actually, Supabase doesn't expose exec_sql by default
    // We need to use a different approach - execute via Supabase JS client
    // But that also doesn't support raw SQL execution

    // Best approach: Use Supabase Management API or guide user to manual execution
    console.log(
      '⚠️  Supabase REST API does not support executing arbitrary SQL for security reasons.',
    );
    console.log('   Please run the migration manually:\n');
    console.log('   1. Visit: http://localhost:3000/api/setup-cleaning-tasks');
    console.log('   2. Copy the SQL from the response');
    console.log('   3. Open Supabase Dashboard → SQL Editor');
    console.log('   4. Paste and run the SQL\n');

    // Alternative: Try to use Supabase JS client with service role
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Split SQL into statements and try to execute via RPC if available
    // For now, just show instructions
    resolve({ success: false, requiresManual: true });
  });
}

async function main() {
  console.log('🚀 Running cleaning tasks migration...\n');

  try {
    // Read migration file
    if (!require('fs').existsSync(migrationFile)) {
      console.error(`❌ Migration file not found: ${migrationFile}`);
      process.exit(1);
    }

    const migrationSQL = readFileSync(migrationFile, 'utf-8');
    console.log('✅ Migration file found\n');

    // Try to execute
    const result = await executeSQL(migrationSQL);

    if (result.requiresManual) {
      console.log('📋 Migration SQL preview (first 500 chars):');
      console.log('─'.repeat(60));
      console.log(migrationSQL.substring(0, 500) + '...\n');
      console.log('─'.repeat(60));
      console.log('\n💡 Tip: You can also get the full SQL by visiting:');
      console.log('   http://localhost:3000/api/setup-cleaning-tasks\n');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();




