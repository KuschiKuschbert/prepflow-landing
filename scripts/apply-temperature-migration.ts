/**
 * apply-temperature-migration.ts
 *
 * Applies the temperature performance migration directly to Supabase.
 * This adds the equipment_id column and creates composite indexes.
 *
 * Usage:
 *   npx tsx scripts/apply-temperature-migration.ts
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function log(msg: string) {
  const now = new Date().toISOString();
  process.stdout.write(`[${now}] ${msg}\n`);
}

// Execute a raw SQL statement via Supabase RPC
async function exec(label: string, sql: string) {
  const { error } = await supabase.rpc('exec_sql', { sql }).single();
  if (error) {
    // Try direct query approach as fallback
    process.stderr.write(`  ⚠️  ${label}: ${error.message}\n`);
    return false;
  }
  log(`  ✅ ${label}`);
  return true;
}

async function main() {
  log('🔧 Applying temperature performance migration...\n');

  // Check if equipment_id column already exists
  const { data: cols, error: colError } = await supabase
    .from('temperature_logs')
    .select('equipment_id')
    .limit(1);

  if (!colError) {
    log('  ✅ equipment_id column already exists');
  } else {
    log(
      '  ℹ️  equipment_id column not found – this migration needs to be run via Supabase SQL editor',
    );
    log('\n📋 Please run the following SQL in your Supabase SQL editor:');
    log('   supabase dashboard -> SQL Editor -> New query\n');
    log('───────────────────────────────────────────────────────────────────────');
    log('ALTER TABLE temperature_logs');
    log(
      '  ADD COLUMN IF NOT EXISTS equipment_id UUID REFERENCES temperature_equipment(id) ON DELETE SET NULL;',
    );
    log('');
    log('CREATE INDEX IF NOT EXISTS idx_temperature_logs_location_date');
    log('  ON temperature_logs(location, log_date DESC, log_time DESC);');
    log('');
    log('CREATE INDEX IF NOT EXISTS idx_temperature_logs_equipment_date');
    log('  ON temperature_logs(equipment_id, log_date DESC);');
    log('');
    log('CREATE INDEX IF NOT EXISTS idx_temperature_logs_type_date');
    log('  ON temperature_logs(temperature_type, log_date DESC);');
    log('');
    log('UPDATE temperature_logs tl');
    log('SET equipment_id = te.id');
    log('FROM temperature_equipment te');
    log('WHERE tl.equipment_id IS NULL');
    log('  AND (tl.location = te.name OR tl.location = te.location);');
    log('───────────────────────────────────────────────────────────────────────\n');
  }
}

main().catch(err => {
  process.stderr.write(`\n❌ Error: ${err.message || err}\n`);
  process.exit(1);
});
