/**
 * Script to populate 5 test employees directly
 * Usage: node scripts/populate-employees.js
 */

const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envVars[key] = value;
    }
  });
}

// Set environment variables
Object.keys(envVars).forEach(key => {
  process.env[key] = envVars[key];
});

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const staffMembers = [
  {
    full_name: 'Sarah Chen',
    role: 'Head Chef',
    employment_start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: 'active',
    phone: '+61 400 123 456',
    email: 'sarah.chen@prepflow.test',
    emergency_contact: 'John Chen - +61 400 123 457',
    notes: 'Experienced chef with 10+ years in fine dining',
  },
  {
    full_name: 'Marcus Johnson',
    role: 'Sous Chef',
    employment_start_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: 'active',
    phone: '+61 400 123 458',
    email: 'marcus.johnson@prepflow.test',
    emergency_contact: 'Lisa Johnson - +61 400 123 459',
    notes: 'Specializes in pastry and desserts',
  },
  {
    full_name: 'Emma Williams',
    role: 'Line Cook',
    employment_start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: 'active',
    phone: '+61 400 123 460',
    emergency_contact: 'David Williams - +61 400 123 461',
    notes: 'Fast learner, great with grill station',
  },
  {
    full_name: 'James Taylor',
    role: 'Prep Cook',
    employment_start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: 'active',
    phone: '+61 400 123 462',
    notes: 'Reliable morning prep, excellent knife skills',
  },
  {
    full_name: 'Olivia Brown',
    role: 'Dishwasher',
    employment_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: 'active',
    phone: '+61 400 123 463',
    notes: 'Part-time evening shifts',
  },
];

async function populateEmployees() {
  try {
    console.log('👥 Checking for existing employees...');

    // Check for existing employees
    const { data: existingEmployees } = await supabase.from('employees').select('full_name');

    const existingNames = new Set(
      (existingEmployees || []).map(e => e.full_name?.toLowerCase().trim()).filter(Boolean),
    );

    // Filter out existing employees
    const staffToInsert = staffMembers.filter(
      s => !existingNames.has(s.full_name.toLowerCase().trim()),
    );

    if (staffToInsert.length === 0) {
      console.log('✅ All staff members already exist!');
      const { data: allStaff } = await supabase
        .from('employees')
        .select('id, full_name, role, status')
        .eq('status', 'active');
      console.log(`📋 Found ${allStaff?.length || 0} active employees`);
      return;
    }

    console.log(`📝 Inserting ${staffToInsert.length} new staff members...`);

    const { data, error } = await supabase.from('employees').insert(staffToInsert).select();

    if (error) {
      console.error('❌ Error inserting employees:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully populated ${data?.length || 0} staff members:`);
    data?.forEach(emp => {
      console.log(`   - ${emp.full_name} (${emp.role})`);
    });

    if (staffToInsert.length < staffMembers.length) {
      console.log(`⚠️  Skipped ${staffMembers.length - staffToInsert.length} duplicate employees`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

populateEmployees();

populateEmployees();
