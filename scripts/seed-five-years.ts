/**
 * seed-five-years.ts
 *
 * Stress-seeds the temperature_logs table with ~5 years of realistic data to
 * verify the performance re-architecture handles large datasets efficiently.
 *
 * Scale estimate (matches plan targets):
 *   - 18 equipment pieces × 4 logs/day × 1,825 days = 131,400 temperature logs
 *   - If no equipment found, creates 6 placeholder pieces and logs against them
 *
 * This script is ADDITIVE – it does NOT delete existing logs first.
 * It inserts in batches of 500 rows to avoid hitting Supabase row limits.
 *
 * Expected run time: 3–8 minutes (network bound)
 *
 * Usage:
 *   npm run seed:five-years
 *   npx tsx scripts/seed-five-years.ts
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(msg: string) {
  const now = new Date().toISOString();
  process.stdout.write(`[${now}] ${msg}\n`);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function timeStr(hour: number, min = 0): string {
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
}

function randomBetween(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

function randomFloat(min: number, max: number, dp = 1): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(dp));
}

// Insert in batches of batchSize rows, returning total rows inserted
async function batchInsert(
  table: string,
  rows: object[],
  batchSize = 500,
  onConflict?: string,
): Promise<number> {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    let q = supabase.from(table).insert(batch);
    if (onConflict) {
      q = supabase.from(table).upsert(batch, { onConflict, ignoreDuplicates: true }) as typeof q;
    }
    const { data, error } = await q.select('id');
    if (error) {
      process.stderr.write(`  ⚠️  Batch insert error on ${table}: ${error.message}\n`);
    } else {
      inserted += data?.length ?? batch.length;
    }
    if (i % 5000 === 0 && i > 0) {
      log(`    ... ${i.toLocaleString()} rows processed`);
    }
  }
  return inserted;
}

// ---------------------------------------------------------------------------
// Equipment: ensure there are at least 6 pieces (create if fewer)
// ---------------------------------------------------------------------------

interface EquipmentRow {
  id: string;
  name: string;
  location: string;
  equipment_type: string;
  min_temp_celsius: number | null;
  max_temp_celsius: number | null;
}

const PLACEHOLDER_EQUIPMENT = [
  {
    name: 'Main Fridge',
    location: 'Main Fridge',
    equipment_type: 'refrigerator',
    min_temp_celsius: 0,
    max_temp_celsius: 5,
  },
  {
    name: 'Walk-in Cooler',
    location: 'Walk-in Cooler',
    equipment_type: 'refrigerator',
    min_temp_celsius: 0,
    max_temp_celsius: 5,
  },
  {
    name: 'Prep Fridge',
    location: 'Prep Fridge',
    equipment_type: 'refrigerator',
    min_temp_celsius: 0,
    max_temp_celsius: 5,
  },
  {
    name: 'Freezer 1',
    location: 'Freezer 1',
    equipment_type: 'freezer',
    min_temp_celsius: -24,
    max_temp_celsius: -18,
  },
  {
    name: 'Freezer 2',
    location: 'Freezer 2',
    equipment_type: 'freezer',
    min_temp_celsius: -24,
    max_temp_celsius: -18,
  },
  {
    name: 'Hot Holding Unit',
    location: 'Hot Holding Unit',
    equipment_type: 'hot_holding',
    min_temp_celsius: 60,
    max_temp_celsius: 80,
  },
];

async function ensureEquipment(): Promise<EquipmentRow[]> {
  const { data: existing, error } = await supabase
    .from('temperature_equipment')
    .select('id, name, location, equipment_type, min_temp_celsius, max_temp_celsius');

  if (error) {
    log(`  ⚠️  Could not fetch equipment: ${error.message}`);
    return [];
  }

  if (existing && existing.length >= 1) {
    log(`  ✅ Using ${existing.length} existing equipment piece(s)`);
    return existing as EquipmentRow[];
  }

  // Create placeholder equipment
  log('  ➕  No equipment found – creating 6 placeholder pieces');
  const toCreate = PLACEHOLDER_EQUIPMENT.map(e => ({
    ...e,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { data: created, error: createError } = await supabase
    .from('temperature_equipment')
    .insert(toCreate)
    .select('id, name, location, equipment_type, min_temp_celsius, max_temp_celsius');

  if (createError || !created) {
    log(`  ⚠️  Failed to create equipment: ${createError?.message}`);
    return [];
  }

  log(`  ✅ Created ${created.length} equipment pieces`);
  return created as EquipmentRow[];
}

// ---------------------------------------------------------------------------
// Temperature generation helpers
// ---------------------------------------------------------------------------

/**
 * Generate a realistic temperature reading for a piece of equipment.
 * Occasionally injects out-of-range values (5% chance) for realism.
 */
function generateTemp(equipment: EquipmentRow): number {
  const outOfRange = Math.random() < 0.05; // 5% chance of out-of-range reading

  const min = equipment.min_temp_celsius ?? 0;
  const max = equipment.max_temp_celsius ?? 8;
  const range = max - min;

  if (outOfRange) {
    // Out of range – slightly outside boundary
    return randomFloat(max + 1, max + range * 0.3);
  }

  // Normal reading within thresholds (95% of values)
  return randomFloat(min + range * 0.1, max - range * 0.1);
}

// Logging times through the day (4x per day as per plan target)
const LOG_TIMES = [
  { hour: 7, label: 'opening' },
  { hour: 11, label: 'pre-lunch' },
  { hour: 15, label: 'afternoon' },
  { hour: 22, label: 'closing' },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seedFiveYearsTemperatureLogs(
  equipment: EquipmentRow[],
  hasEquipmentIdColumn: boolean,
): Promise<number> {
  const YEARS = 5;
  const DAYS = YEARS * 365 + 1; // ~1,826 days

  log(`📊 Generating ${YEARS}-year temperature logs...`);
  log(`   Equipment: ${equipment.length}`);
  log(`   Days: ${DAYS}`);
  log(`   Readings/day per equipment: ${LOG_TIMES.length}`);
  log(`   equipment_id column available: ${hasEquipmentIdColumn}`);
  log(`   Target total: ~${(equipment.length * DAYS * LOG_TIMES.length).toLocaleString()} rows`);

  const rows: Record<string, unknown>[] = [];

  for (let day = DAYS; day >= 0; day--) {
    const date = daysAgo(day);
    const dateS = dateStr(date);

    for (const eq of equipment) {
      for (const logTime of LOG_TIMES) {
        // Add small random minute variation so times aren't perfectly uniform
        const minute = randomBetween(0, 15);
        const temp = generateTemp(eq);

        const row: Record<string, unknown> = {
          location: eq.location ?? eq.name,
          log_date: dateS,
          log_time: timeStr(logTime.hour, minute),
          temperature_celsius: temp,
          temperature_type: eq.equipment_type ?? 'refrigerator',
          logged_by: 'Stress-Seed Script',
          notes: `${logTime.label} check`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Only include equipment_id FK if the column exists (post-migration)
        if (hasEquipmentIdColumn) {
          row.equipment_id = eq.id;
        }

        rows.push(row);
      }
    }

    // Progress update every 6 months
    if (day % 180 === 0) {
      log(`   Day ${DAYS - day} / ${DAYS} (${rows.length.toLocaleString()} rows staged)`);
    }
  }

  log(`\n💾 Inserting ${rows.length.toLocaleString()} rows in batches of 500...`);
  const inserted = await batchInsert('temperature_logs', rows, 500);
  log(`\n✅ Temperature logs: ${inserted.toLocaleString()} inserted`);
  return inserted;
}

// ---------------------------------------------------------------------------
// Entrypoint
// ---------------------------------------------------------------------------

async function main() {
  log('🌡️  PrepFlow Temperature 5-Year Stress Seed');
  log('=============================================\n');

  log('🔌 Checking Supabase connection...');
  const { error: pingError } = await supabase.from('temperature_equipment').select('id').limit(1);
  if (pingError) {
    process.stderr.write(`\n❌ Supabase connection failed: ${pingError.message}\n`);
    process.exit(1);
  }
  log('  ✅ Connected\n');

  log('📋 Step 1 – Checking schema...');
  const { error: colCheckError } = await supabase
    .from('temperature_logs')
    .select('equipment_id')
    .limit(1);
  const hasEquipmentIdColumn = !colCheckError;
  if (hasEquipmentIdColumn) {
    log('  ✅ equipment_id column exists (post-migration)');
  } else {
    log('  ℹ️  equipment_id column not yet present – using location-only inserts');
    log(
      '     Apply migrations/add-temperature-performance-indexes.sql via Supabase SQL editor to add it',
    );
  }

  log('\n📋 Step 2 – Ensuring equipment exists...');
  const equipment = await ensureEquipment();

  if (equipment.length === 0) {
    process.stderr.write('\n❌ No equipment available. Cannot seed logs.\n');
    process.exit(1);
  }

  log('\n📋 Step 3 – Seeding 5 years of temperature logs...');
  const totalInserted = await seedFiveYearsTemperatureLogs(equipment, hasEquipmentIdColumn);

  log('\n=============================================');
  log(`🎉  Done! Total rows inserted: ${totalInserted.toLocaleString()}`);
  log('   Run the E2E simulation to verify performance targets:');
  log('   npm run test:simulation');
}

main().catch(err => {
  process.stderr.write(`\n❌ Fatal error: ${err.message || err}\n`);
  process.exit(1);
});
