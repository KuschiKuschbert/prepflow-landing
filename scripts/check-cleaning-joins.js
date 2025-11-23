#!/usr/bin/env node

/**
 * Check if join tables exist and have correct columns
 */

const { createClient } = require('@supabase/supabase-js');
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
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJoins() {
  console.log('🔍 Checking join tables...\n');

  // Check cleaning_areas
  console.log('Checking cleaning_areas...');
  const { error: areasError } = await supabase
    .from('cleaning_areas')
    .select('id, area_name, description, cleaning_frequency')
    .limit(1);

  if (areasError) {
    console.log(`  ❌ Error: ${areasError.message}`);
    if (areasError.message.includes('cleaning_frequency')) {
      console.log(
        '  💡 The cleaning_areas table might have frequency_days instead of cleaning_frequency',
      );
    }
  } else {
    console.log('  ✅ cleaning_areas columns OK');
  }

  // Check temperature_equipment
  console.log('\nChecking temperature_equipment...');
  const { error: equipError } = await supabase
    .from('temperature_equipment')
    .select('id, name, equipment_type, location')
    .limit(1);

  if (equipError) {
    console.log(`  ❌ Error: ${equipError.message}`);
    if (equipError.code === '42P01') {
      console.log(
        '  💡 temperature_equipment table does not exist (this is OK if not using equipment)',
      );
    }
  } else {
    console.log('  ✅ temperature_equipment columns OK');
  }

  // Check kitchen_sections
  console.log('\nChecking kitchen_sections...');
  const { error: sectionsError } = await supabase
    .from('kitchen_sections')
    .select('id, section_name, description')
    .limit(1);

  if (sectionsError) {
    console.log(`  ❌ Error: ${sectionsError.message}`);
    if (sectionsError.code === '42P01') {
      console.log('  💡 kitchen_sections table does not exist (this is OK if not using sections)');
    }
  } else {
    console.log('  ✅ kitchen_sections columns OK');
  }

  // Test full SELECT query
  console.log('\n🔍 Testing full SELECT query...');
  const { data, error } = await supabase
    .from('cleaning_tasks')
    .select(
      `
      *,
      cleaning_areas (
        id,
        area_name,
        description,
        cleaning_frequency
      ),
      temperature_equipment:equipment_id (
        id,
        name,
        equipment_type,
        location
      ),
      kitchen_sections:section_id (
        id,
        section_name,
        description
      )
    `,
    )
    .limit(1);

  if (error) {
    console.log(`  ❌ SELECT query failed: ${error.message}`);
    console.log(`  Code: ${error.code || 'N/A'}`);
    console.log(`  Details: ${error.details || 'N/A'}`);
    console.log(`  Hint: ${error.hint || 'N/A'}`);
    process.exit(1);
  } else {
    console.log('  ✅ Full SELECT query works!');
  }
}

checkJoins().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
