#!/usr/bin/env node

/**
 * Run cleaning tasks migration using Supabase CLI
 *
 * This script runs the cleaning tasks migration SQL file using Supabase CLI.
 * It requires Supabase CLI to be installed and the project to be linked.
 *
 * Usage:
 *   node scripts/run-cleaning-migration.js
 *   npm run supabase:migrate:cleaning
 */

const { execSync } = require('child_process');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const migrationFile = join(process.cwd(), 'migrations', 'fix-cleaning-tasks-schema.sql');
const supabaseMigrationsDir = join(process.cwd(), 'supabase', 'migrations');

console.log('🚀 Running cleaning tasks migration with Supabase CLI...\n');

try {
  // Check if migration file exists
  if (!existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const migrationSQL = readFileSync(migrationFile, 'utf-8');
  console.log('✅ Migration file found: migrations/fix-cleaning-tasks-schema.sql\n');

  // Ensure supabase/migrations directory exists
  if (!existsSync(supabaseMigrationsDir)) {
    mkdirSync(supabaseMigrationsDir, { recursive: true });
    console.log('✅ Created supabase/migrations directory\n');
  }

  // Check if migration already exists in supabase/migrations
  const existingMigrations = require('fs')
    .readdirSync(supabaseMigrationsDir)
    .filter(f => f.includes('fix_cleaning_tasks'));

  if (existingMigrations.length > 0) {
    console.log(`✅ Migration file already exists: ${existingMigrations[0]}\n`);
  } else {
    // Create migration file with timestamp
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
    const migrationFileName = `${timestamp}_fix_cleaning_tasks_schema.sql`;
    const tempMigrationFile = join(supabaseMigrationsDir, migrationFileName);

    writeFileSync(tempMigrationFile, migrationSQL);
    console.log(`✅ Created migration file: ${migrationFileName}\n`);
  }

  // Check if Supabase is linked
  try {
    execSync('npx supabase status', { stdio: 'pipe' });
    console.log('✅ Supabase project is linked\n');
  } catch (err) {
    console.error('❌ Supabase project is not linked.');
    console.error('   Please run: npm run supabase:link');
    console.error('   Or manually: npx supabase link --project-ref YOUR_PROJECT_REF\n');
    console.error('   Your project ref can be found in NEXT_PUBLIC_SUPABASE_URL');
    console.error('   Example: https://dulkrqgjfohsuxhsmofo.supabase.co → dulkrqgjfohsuxhsmofo\n');
    process.exit(1);
  }

  // Push migration to Supabase
  console.log('📤 Pushing migration to Supabase...\n');
  try {
    execSync('npx supabase db push', { stdio: 'inherit' });
    console.log('\n✅ Migration applied successfully!\n');
  } catch (err) {
    console.error('\n❌ Migration failed. Error:', err.message);
    console.error('\n   You can also run the migration manually:');
    console.error('   1. Visit http://localhost:3000/api/setup-cleaning-tasks');
    console.error('   2. Copy the SQL');
    console.error('   3. Run it in Supabase SQL Editor\n');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
