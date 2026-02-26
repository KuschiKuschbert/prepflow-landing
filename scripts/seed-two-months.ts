/**
 * seed-two-months.ts
 *
 * Seeds the database with 2 months of realistic historical data on top of the
 * existing clean test data. Designed to be run ONCE after populate-clean-test-data,
 * before the 1-week E2E simulation, so the app is stress-tested against a populated DB.
 *
 * What it seeds (all backdated across 60 days):
 *  - Temperature logs      : 4x/day per equipment × 60 days
 *  - Sales data            : Daily sales per dish × 60 days
 *  - Compliance records    : Weekly records × 8 weeks
 *  - Shifts (roster)       : 3 shifts/day × 60 days
 *  - Time & attendance     : Clock-in/out for each past shift
 *  - Functions (events)    : 12 past events spread over 60 days
 *
 * Usage:
 *   npm run seed:two-months
 *   npm run seed:two-months:then-sim   (seed + immediately run 1-week simulation)
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

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function isoDateTime(date: Date, timeHHMM: string): string {
  // e.g. '2026-01-01T06:00:00'
  return `${dateStr(date)}T${timeHHMM}:00`;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function log(msg: string) {
  console.log(`[seed-two-months] ${msg}`);
}

// ---------------------------------------------------------------------------
// 1. Temperature logs – 60 days × 4 logs/day per active equipment
// ---------------------------------------------------------------------------
async function seedTemperatureLogs() {
  log('🌡️  Seeding temperature logs (60 days)...');

  const { data: equipment, error } = await supabase
    .from('temperature_equipment')
    .select('id, name, equipment_type, min_temp_celsius, max_temp_celsius')
    .eq('is_active', true);

  if (error || !equipment?.length) {
    log(`  ⚠️  No active equipment found, skipping. ${error?.message ?? ''}`);
    return 0;
  }

  const logTimes = ['07:00', '12:00', '17:00', '22:00'];
  const loggers = ['Chef Marco', 'Sarah K.', 'James T.', 'Emily R.', 'David L.'];
  const rows: object[] = [];

  for (let day = 60; day >= 1; day--) {
    const date = daysAgo(day);
    const dateS = dateStr(date);

    for (const eq of equipment) {
      const mid = ((eq.min_temp_celsius ?? 0) + (eq.max_temp_celsius ?? 5)) / 2;
      const range = ((eq.max_temp_celsius ?? 5) - (eq.min_temp_celsius ?? 0)) / 2;

      for (const t of logTimes) {
        const outOfRange = Math.random() < 0.05;
        const temp = outOfRange
          ? randomFloat((eq.max_temp_celsius ?? 5) + 0.5, (eq.max_temp_celsius ?? 5) + 3)
          : randomFloat(mid - range * 0.6, mid + range * 0.6);

        rows.push({
          log_date: dateS,
          log_time: t,
          temperature_type: eq.equipment_type ?? 'Fridge',
          temperature_celsius: temp,
          location: eq.name,
          notes: outOfRange ? 'Slightly high – checked door seal' : null,
          logged_by: pick(loggers),
        });
      }
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const { error: e } = await supabase.from('temperature_logs').insert(rows.slice(i, i + 200));
    if (e) {
      log(`  ⚠️  temperature_logs batch error: ${e.message}`);
      break;
    }
    inserted += Math.min(200, rows.length - i);
  }
  log(`  ✅ Inserted ${inserted} temperature log records`);
  return inserted;
}

// ---------------------------------------------------------------------------
// 2. Sales data – 60 days × each menu_dish × realistic daily counts
//    Schema: dish_id (FK → menu_dishes.id), number_sold, popularity_percentage, date
// ---------------------------------------------------------------------------
async function seedSalesData() {
  log('💰  Seeding sales data (60 days)...');

  // sales_data.dish_id references menu_dishes, not dishes
  const { data: dishes, error } = await supabase.from('menu_dishes').select('id');

  if (error || !dishes?.length) {
    log(`  ⚠️  No menu_dishes found, skipping. ${error?.message ?? ''}`);
    return 0;
  }

  const rows: object[] = [];

  for (let day = 60; day >= 1; day--) {
    const date = daysAgo(day);
    const dateS = dateStr(date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const totalSoldToday = dishes.length * randomBetween(isWeekend ? 8 : 3, isWeekend ? 20 : 12);

    for (const dish of dishes) {
      const count = isWeekend ? randomBetween(8, 35) : randomBetween(3, 20);
      const popularity = parseFloat(((count / totalSoldToday) * 100).toFixed(2));
      rows.push({
        dish_id: dish.id,
        number_sold: count,
        popularity_percentage: popularity,
        date: dateS,
      });
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const { data, error: e } = await supabase
      .from('sales_data')
      .upsert(batch, { onConflict: 'dish_id,date', ignoreDuplicates: true })
      .select('id');
    if (e) {
      for (const r of batch) {
        const { error: ie } = await supabase.from('sales_data').insert(r);
        if (!ie) inserted++;
      }
    } else {
      inserted += data?.length ?? batch.length;
    }
  }
  log(`  ✅ Inserted ~${inserted} sales data records (${rows.length} attempted)`);
  return inserted;
}

// ---------------------------------------------------------------------------
// 3. Compliance records – 1 per compliance type per week × 8 weeks
//    Schema: compliance_type_id, inspection_date, status, notes, inspector_name
// ---------------------------------------------------------------------------
async function seedComplianceRecords() {
  log('📋  Seeding compliance records (8 weeks)...');

  const { data: types, error } = await supabase.from('compliance_types').select('id, type_name'); // ← correct column name

  if (error || !types?.length) {
    log(`  ⚠️  No compliance types found, skipping. ${error?.message ?? ''}`);
    return 0;
  }

  const statuses = ['compliant', 'compliant', 'compliant', 'non_compliant', 'pending'];
  const inspectors = ['Health Inspector Davies', 'Food Safety Officer Wong', 'Manager Review'];
  const rows: object[] = [];

  for (let week = 8; week >= 1; week--) {
    const date = daysAgo(week * 7);
    const dateS = dateStr(date);

    for (const type of types) {
      const status = pick(statuses);
      // issue_date = the compliance check date; expiry_date = 1 year later
      const issueDate = new Date(date);
      const expiryDate = new Date(issueDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      rows.push({
        compliance_type_id: type.id,
        document_name: `${type.type_name} – ${dateS}`,
        issue_date: dateS,
        expiry_date: dateStr(expiryDate),
        status:
          status === 'non_compliant'
            ? 'renewal_required'
            : status === 'pending'
              ? 'pending'
              : 'active',
        notes:
          status === 'non_compliant'
            ? 'Minor issue identified – corrective action taken within 24h'
            : 'All requirements met',
      });
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const { error: e } = await supabase.from('compliance_records').insert(rows.slice(i, i + 100));
    if (e) {
      log(`  ⚠️  compliance_records batch error: ${e.message}`);
      break;
    }
    inserted += Math.min(100, rows.length - i);
  }
  log(`  ✅ Inserted ${inserted} compliance records`);
  return inserted;
}

// ---------------------------------------------------------------------------
// 4. Shifts – 3 shifts/day × 60 days (morning, afternoon, evening)
//    Schema: employee_id, shift_date, start_time (ISO), end_time (ISO), status
// ---------------------------------------------------------------------------
async function seedShifts() {
  log('📅  Seeding roster shifts (60 days)...');

  const { data: employees, error } = await supabase.from('employees').select('id').limit(10);

  if (error || !employees?.length) {
    log(`  ⚠️  No employees found, skipping. ${error?.message ?? ''}`);
    return 0;
  }

  const shiftTemplates = [
    { start: '06:00', end: '14:00' },
    { start: '10:00', end: '18:00' },
    { start: '16:00', end: '23:30' },
  ];

  const rows: object[] = [];

  for (let day = 60; day >= 1; day--) {
    const date = daysAgo(day);
    const dateS = dateStr(date);

    for (let i = 0; i < shiftTemplates.length; i++) {
      const tmpl = shiftTemplates[i];
      const emp = employees[i % employees.length];

      rows.push({
        employee_id: emp.id,
        shift_date: dateS,
        start_time: isoDateTime(date, tmpl.start),
        end_time: isoDateTime(date, tmpl.end),
        status: 'completed',
        notes: null,
      });
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const { error: e } = await supabase.from('shifts').insert(rows.slice(i, i + 200));
    if (e) {
      log(`  ⚠️  shifts batch error: ${e.message}`);
      break;
    }
    inserted += Math.min(200, rows.length - i);
  }
  log(`  ✅ Inserted ${inserted} shift records`);
  return inserted;
}

// ---------------------------------------------------------------------------
// 5. Time & Attendance – clock in/out for each seeded shift
// ---------------------------------------------------------------------------
async function seedTimeAttendance() {
  log('⏱️   Seeding time & attendance records (60 days)...');

  const cutoff = dateStr(daysAgo(61));
  const { data: shifts, error } = await supabase
    .from('shifts')
    .select('id, employee_id, shift_date, start_time, end_time')
    .eq('status', 'completed')
    .gte('shift_date', cutoff)
    .lt('shift_date', dateStr(new Date()));

  if (error || !shifts?.length) {
    log(`  ⚠️  No completed shifts found, skipping. ${error?.message ?? ''}`);
    return 0;
  }

  const rows: object[] = [];
  for (const shift of shifts) {
    // start_time is already a full ISO string, add ±10 min variance
    const startMs = new Date(shift.start_time).getTime() + randomBetween(-10, 5) * 60000;
    const endMs = new Date(shift.end_time).getTime() + randomBetween(-5, 15) * 60000;

    rows.push({
      employee_id: shift.employee_id,
      shift_id: shift.id,
      clock_in_time: new Date(startMs).toISOString(), // correct column name
      clock_out_time: new Date(endMs).toISOString(), // correct column name
      notes: null,
    });
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const { error: e } = await supabase.from('time_attendance').insert(rows.slice(i, i + 200));
    if (e) {
      log(`  ⚠️  time_attendance batch error: ${e.message}`);
      break;
    }
    inserted += Math.min(200, rows.length - i);
  }
  log(`  ✅ Inserted ${inserted} time & attendance records`);
  return inserted;
}

// ---------------------------------------------------------------------------
// 6. Past functions (events) – 12 completed events over last 60 days
//    Requires user_id – fetch from existing function record
// ---------------------------------------------------------------------------
async function seedPastFunctions() {
  log('🎉  Seeding past functions/events (60 days)...');

  // Fetch user_id from an existing function record (set during populate-clean-test-data)
  const { data: existingFn } = await supabase
    .from('functions')
    .select('user_id')
    .not('user_id', 'is', null)
    .limit(1);

  const userId = existingFn?.[0]?.user_id;
  if (!userId) {
    log('  ⚠️  No user_id found in existing functions, skipping.');
    return 0;
  }

  const { data: customers } = await supabase.from('customers').select('id').limit(8);
  const customerIds = customers?.map(c => c.id) ?? [];

  const eventNames = [
    'Team Building Lunch',
    'Board Meeting Catering',
    'Product Launch Dinner',
    'Staff Christmas Party',
    'Client Appreciation Evening',
    'Quarterly Awards Night',
    'New Year Celebration',
    'Conference Day 1 Catering',
    'Conference Day 2 Catering',
    'End of Financial Year Dinner',
    'Supplier Showcase Lunch',
    'Friday Night Market Pop-up',
  ];

  const eventTypes = ['Other', 'Other', 'Birthday', 'Wedding', 'Other'];
  let inserted = 0;

  for (let i = 0; i < eventNames.length; i++) {
    const daysBack = randomBetween(3, 58);
    const startDate = daysAgo(daysBack);

    const startH = randomBetween(10, 17);
    const endH = randomBetween(19, 22);

    const row = {
      user_id: userId,
      name: eventNames[i],
      type: pick(eventTypes),
      start_date: dateStr(startDate),
      start_time: `${startH.toString().padStart(2, '0')}:00`,
      end_date: dateStr(startDate),
      end_time: `${endH.toString().padStart(2, '0')}:00`,
      same_day: true,
      attendees: randomBetween(20, 180),
      customer_id: customerIds.length ? pick(customerIds) : null,
      notes: 'Past event – completed successfully.',
      status: 'Completed',
    };

    const { error: e } = await supabase.from('functions').insert(row);
    if (e) {
      log(`  ⚠️  functions insert error: ${e.message}`);
    } else {
      inserted++;
    }
  }
  log(`  ✅ Inserted ${inserted} past function records`);
  return inserted;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('\n🌱 PrepFlow 2-Month Historical Data Seeder');
  console.log('==========================================');
  console.log('Seeding 60 days of realistic data on top of clean test data.\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const start = Date.now();
  const results: Record<string, number> = {};

  results.temperatureLogs = await seedTemperatureLogs();
  results.salesData = await seedSalesData();
  results.complianceRecords = await seedComplianceRecords();
  results.shifts = await seedShifts();
  results.timeAttendance = await seedTimeAttendance();
  results.pastFunctions = await seedPastFunctions();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const total = Object.values(results).reduce((a, b) => a + b, 0);

  console.log('\n==========================================');
  console.log(`✅ Seeding complete in ${elapsed}s — ${total.toLocaleString()} total records`);
  console.log('\nBreakdown:');
  for (const [table, count] of Object.entries(results)) {
    const status = count > 0 ? '✅' : '⚠️ ';
    console.log(`  ${status} ${table.padEnd(22)}: ${count.toLocaleString()} records`);
  }
  console.log('\nReady for 1-week E2E simulation:');
  console.log('  npm run test:simulation\n');
}

main().catch(err => {
  console.error('[seed-two-months] Fatal error:', err);
  process.exit(1);
});
